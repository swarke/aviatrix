// import components
import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { DashboardModel} from '../../models';
import { Response, Http } from '@angular/http';
import { DashboardService, PropertiesService } from '../../services';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { ToastrService } from 'toastr-ng2';

import { CLOUD_TOOL, AWS_INVENTORY_PATH, AZURE_INVENTORY_PATH, GCE_INVENTORY_PATH} from '../app-config';
declare var jQuery:any;

declare const L: any;

declare const google: any;

declare const AmCharts: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  viewProviders: [DashboardService],
  encapsulation: ViewEncapsulation.None
})

// Dashboard Component
export class DashboardComponent implements OnInit, AfterViewInit  {
  locations: any[];
  inventory: any;  
  inventoryPath: any;
  beginTest: boolean = false;
  latency: any;
  responseTime: any;
  bandwidth: any;
  bestLatencyRegion: any;
  bestBandwidthRegion: any;
  isTestCompleted: any;
  throughput: any;

  dashboardModel: DashboardModel;
  pingStartTime: any =  null;


  TEST_MINUTES: number = 35;
  TEST_INTERVAL: number = 5000;

  constructor(private http: Http,
              private dashboardService: DashboardService,
              public properties: PropertiesService,
              public dialog: MdDialog,
              public toasterService: ToastrService) {    
     this.inventoryPath = AWS_INVENTORY_PATH;     
     this.locations = [];

    this.isTestCompleted = false;

    // Reseting statistics.
    this.latency = properties.NA_TEXT;
    this.bandwidth = properties.NA_TEXT;
    this.responseTime = properties.NA_TEXT;
    this.throughput = properties.NA_TEXT;

    this.responseTime = '';
    this.bandwidth = '';
    this.bestLatencyRegion = null;
    this.bestBandwidthRegion = null;
  }
  ngOnInit() {
  }

  /**
   * get the geo location of user
   * [ngAfterViewInit description]
   */
  ngAfterViewInit() {}

  /**
   * get the inventory from s3
   * [getInvetory description]
   */
  getInvetory() {
    this.dashboardService.getInventory(this.inventoryPath).subscribe((inventory: any) => {
        this.inventory = JSON.parse(inventory);
        for(let index = 0; index < this.inventory.data.length; index++) {
         let obj = this.inventory.data[index];
         obj.label = obj.region_name;
         obj.isOpen = false;         
         this.locations.push(obj);
        }
        let totalRegions = this.locations.length * 12;
      },
        (error: any) => {
          this.handleError(error)
          this.toasterService.error(this.properties.INVENTORY_GET_ERROR_MESSAGE)
        }
      );
  }

  startTest(){
    this.beginTest = true;
    this.isTestCompleted = false;

    // Reseting statistics.
    this.latency =  this.properties.NA_TEXT;
    this.responseTime = this.properties.NA_TEXT;
    this.bandwidth = this.properties.NA_TEXT;
    this.bestLatencyRegion = null;
    this.bestBandwidthRegion = null;

    // Setting latency chart configuration
    let latencySeries: any = [];

    // Setting latency chart configuration
    let badwidthSeries: any = [];


    // Starting test for regions
    for(let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      object.latencyCompleted = false;
      object.latency = null;
      object.bandwidth = null;
      object.dashboardModel = new DashboardModel();
      object.currentLatencyIndex = 0;
      object.currentResponseIndex = 0;
      object.currentBandwidthIndex = 0;
      object.throughputCallIndex = undefined;
      object.firstLatencyPass = false;
      object.firstBandwidthPass = false;
      object.pingStartTime = new Date();    
      setTimeout(()=>this.setLatency(index),10);
      setTimeout(()=>this.setBandwidth(index),10);
    }

    this.getInvetory();
  }



  /**
   * get the time diff
   * [getTimeDiff description]
   */
  getTimeDiff() {
    let endTime:any = new Date();
    let diff: any = endTime - this.pingStartTime;
    var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
    return diffMins;
  }


  /**
   * get time diff in seconds
   * [getTimeDiffInSeconds description]
   */
  getTimeDiffInSeconds(pingStartTime, index) {
    let endTime:any = new Date();
    let diff: any = endTime.getTime() - pingStartTime.getTime();
    var diffSec = diff/ 1000;
    return diffSec;
  }


  /**
   * set bandwidth
   * [setBandwith description]
   * @param {[type]} index [index of region]
   */
  setBandwidth(index) {
    let obj = this.locations[index];
    var downloadSize = 2621440; //bytes
    let dashboard = this;
    if (this.getTimeDiffInSeconds(obj.pingStartTime, index) < this.TEST_MINUTES) {
        obj.throughputCallIndex = obj.throughputCallIndex === undefined ? 0 : (obj.throughputCallIndex + 1);
      
        setTimeout(()=>this.setBandwidth(index),this.TEST_INTERVAL);
        let pingStart = new Date();
        var cacheBuster = "?nnn=" + pingStart;
        this.dashboardService.getBandwidth(obj.url + this.properties.BANDWIDTH_IMG + cacheBuster).subscribe((data:any ) =>{
            let pingEnd = new Date();
            let duration: number = ((pingEnd.getTime() - pingStart.getTime())/1000);
            let bitsLoaded = downloadSize * 8;
            let speedBps: any = (bitsLoaded / duration).toFixed(2);
            let speedKbps: any = (speedBps / 1024).toFixed(2);
            let speedMbps = (speedKbps / 1024).toFixed(2);
            if (obj.firstBandwidthPass) {
              obj.dashboardModel.bandwidth[obj.currentBandwidthIndex].value = parseFloat(speedMbps);              
              obj.currentBandwidthIndex++;
              // console.log("Region: " + obj.region_name + " Current index: " + obj.currentBandwidthIndex + " call index: " + obj.throughputCallIndex);
              if(obj.currentBandwidthIndex > 5) {
                this.getBandwidth(obj);
                obj.bandwidthCompleted = true;
                setTimeout(() => this.isProcessCompleted(), 5);
              }
            } else {
              obj.firstBandwidthPass = true;
            }
        });
      } else {
            this.getBandwidth(obj);
            obj.bandwidthCompleted = true;
            setTimeout(() => this.isProcessCompleted(), 5);
        }
  }

  /**
   * get bandwidth
   * [getBandwidth description]
   * @param {[type]} obj [dashboard model object]
   */
  getBandwidth(obj) {
    if (obj.dashboardModel.bandwidth.length > 0) {
      let _bandwidth:number = 0;
      for (let index = 0 ; index < obj.dashboardModel.bandwidth.length; index++) {
        if(null != obj.dashboardModel.bandwidth[index].value) {
          _bandwidth = _bandwidth + parseFloat(obj.dashboardModel.bandwidth[index].value);
        }
      }
     obj.bandwidth =  (_bandwidth / obj.dashboardModel.bandwidth.length).toFixed(2);
    }
  }

  /**
   * [setLatency description]
   */
  /**
   * set latency
   * [setLatency description]
   * @param {any} index [index of region]
   */
  setLatency(index: any) {
    let obj = this.locations[index];
    let current = this;
    if (this.getTimeDiffInSeconds(obj.pingStartTime, index) < this.TEST_MINUTES) {
       setTimeout(() => this.setLatency(index), this.TEST_INTERVAL);

        var download = new Image() ;
        let pingStart = new Date();
        var cacheBuster = "?nnn=" + pingStart;
        download.onerror = function() {
          if (obj.firstLatencyPass) {
              let pingEnd = new Date();
              let ping: number = (pingEnd.getTime() - pingStart.getTime());
              obj.dashboardModel.latency[obj.currentLatencyIndex].value = Math.round(ping);
              obj.currentLatencyIndex++;
              if (obj.currentLatencyIndex > 5) {
                obj.latencyCompleted = true;
              }
          } else {
              obj.firstLatencyPass = true;
          }
        }
        download.src = obj.url +'ping'+ cacheBuster ;

    } else {
       this.getLatency(obj);
       obj.latencyCompleted = true;      
        setTimeout(() => this.isProcessCompleted(), 5);
    }
  }

  /**
   * get latency
   * [getLatency description]
   * @param {[type]} obj [object of dashboard model]
   */
  getLatency(obj) {
    if (obj.dashboardModel.latency.length > 0) {
      let _latency:number = 0;
      for (let index = 0 ; index < obj.dashboardModel.latency.length; index++) {
        if(null != obj.dashboardModel.latency[index].value) {
          _latency = _latency + parseFloat(obj.dashboardModel.latency[index].value);
        }
      }

     obj.latency =  (_latency / obj.dashboardModel.latency.length).toFixed(2);
    }
  }

  /**
   * set responce time
   * [setResponseTime description]
   * @param {any} index [index of region]
   */
  setResponseTime(index: any) {
    let obj = this.locations[index];

    if (this.getTimeDiffInSeconds(obj.pingStartTime, index) < this.TEST_MINUTES) {
       setTimeout(() => this.setResponseTime(index), this.TEST_INTERVAL);
       let pingStart = new Date();
       var cacheBuster = "?nnn=" + pingStart;
       this.dashboardService.getResponseTime(obj.url + this.properties.RESPONSE_TIME_HTML + cacheBuster).subscribe((data:any ) =>{
          let pingEnd = new Date();
          let ping: number = (pingEnd.getTime() - pingStart.getTime());
          obj.dashboardModel.responseTime[obj.currentResponseIndex].value = Math.round(ping);          
          obj.currentResponseIndex++;
       });
    } else {
      this.getResponseTime(obj);
      obj.responseCompleted = true;
    }
  }

  /**
   * Get the responce time
   * [getResponseTime description]
   * @param {any} obj [object of dashboard model]
   */
  getResponseTime(obj: any) {
    if (obj.dashboardModel.responseTime.length > 0) {
      let _responseTime:number = 0;
      for (let index = 0 ; index < obj.dashboardModel.responseTime.length; index++) {
        if(null != obj.dashboardModel.responseTime[index].value) {
          _responseTime = _responseTime + parseFloat(obj.dashboardModel.responseTime[index].value);
        }
      }

     obj.responseTime =  (_responseTime / obj.dashboardModel.responseTime.length).toFixed(2);
    }
  }

  /**
   * get the best latency and throughput
   * [getBestLatencyAndBandwidth description]
   */
  getBestLatencyAndBandwidth() {
    for (let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      if (this.bestLatencyRegion === null) {
        this.bestLatencyRegion = object;
      } else {
        if(parseFloat(object.latency) < parseFloat(this.bestLatencyRegion.latency)) {
          this.bestLatencyRegion = object;
        }

      }
       
      if (this.bestBandwidthRegion === null) {
        this.bestBandwidthRegion = object;
      } else {
        if(parseFloat(object.bandwidth) > parseFloat(this.bestBandwidthRegion.bandwidth)) {
          this.bestBandwidthRegion = object;
        }
      }
    }
  }


  /**
   * return true if process is completed else return false
   * [isProcessCompleted description]
   */
  isProcessCompleted() {
    let processCompleted: boolean = false;
    for(let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      // console.log("Region: " + object.region_name + " Latency completed: " + object.latencyCompleted + " Th completed: " + object.bandwidthCompleted);
      if(object.latencyCompleted) {
        this.getLatency(object);
      }

      if(object.bandwidthCompleted) {
        this.getBandwidth(object);
      }

      if (object.latencyCompleted 
          && object.bandwidthCompleted) {
        processCompleted = true;
      } else {
        processCompleted = false;
        break;
      }
    }

    if (processCompleted && !this.isTestCompleted) {
      this.isTestCompleted = true;
      this.getBestLatencyAndBandwidth();
    } else {
        setTimeout(() => this.isProcessCompleted(), 10);
    }
  }
  handleError(error: any) { }
}