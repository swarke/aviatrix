// import components
import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { DashboardModel} from '../../models';
import { Response, Http } from '@angular/http';
import { DashboardService, PropertiesService } from '../../services';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { ToastrService } from 'toastr-ng2';
import * as $ from 'jquery';

import { CLOUD_TOOL, AWS_INVENTORY_PATH, AZURE_INVENTORY_PATH, GCE_INVENTORY_PATH} from '../app-config';
declare var jQuery:any;

declare const L: any;

declare const google: any;

declare const AmCharts: any;

declare const Ping: any

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
  ngAfterViewInit() {    
    this.getInvetory();
  }

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
      object.systemPingLatency = null;
      object.dynamodbLatency = null;
      object.headerLatency = null;
      object.headerBandwidth = null
      object.pingLatency = null
      object.pingBandwidth = null
      object.dashboardModel = new DashboardModel();
      object.currentLatencyIndex = 0;
      object.currentResponseIndex = 0;
      object.currentBandwidthIndex = 0;
      object.throughputCallIndex = undefined;
      object.firstLatencyPass = false;
      object.firstBandwidthPass = false;
      object.pingStartTime = new Date();
      this.setLatency(index);
      this.setBandwidth(index);
      this.setHeaderLatency(index);
      this.setHeaderBandwidth(index);
      this.setPingLatency(index);
      this.setDynamodbLatency(index);
    }

  }

  /**
   * set bandwidth
   * [setBandwith description]
   * @param {[type]} index [index of region]
   */
  setBandwidth(index) {
    let obj = this.locations[index];
    var downloadSize = 2621440; //bytes
    let pingStart = new Date();
    var cacheBuster = "?nnn=" + pingStart;
    this.dashboardService.getBandwidth(obj.url + this.properties.BANDWIDTH_IMG + cacheBuster).subscribe((data:any ) =>{
        let pingEnd = new Date();
        let duration: number = ((pingEnd.getTime() - pingStart.getTime())/1000);
        let bitsLoaded = downloadSize * 8;
        let speedBps: any = (bitsLoaded / duration).toFixed(2);
        let speedKbps: any = (speedBps / 1024).toFixed(2);
        let speedMbps = (speedKbps / 1024).toFixed(2);
        obj.bandwidth = parseFloat(speedMbps);
      });
              
  }

  /**
   * [setLatency description]
   */
  setDataPoint(data, obj) {
    for (var index = 0; index < 2; index++) {
        data.push({'time': new Date(), 'value': null}); }
  }  
  /**
   * set latency
   * [setLatency description]
   * @param {any} index [index of region]
   */
  setLatency(index: any) {
    let obj = this.locations[index];
    var download = new Image() ;
    let pingStart = new Date();
    var cacheBuster = "?nnn=" + pingStart;
    download.onerror = function() {
        let pingEnd = new Date();
        let ping: number = (pingEnd.getTime() - pingStart.getTime());
        obj.latency = Math.round(ping);
    }
    download.src = obj.url +'ping'+ cacheBuster ;
  }

  handleError(error: any) { }

  /**
   * [setHeaderLatency description]
   * @param {[type]} index [description]
   */
    setHeaderLatency(index){
      let obj = this.locations[index];

        var pingStart = new Date();
        var cacheBuster = "?nnn=" + pingStart;
        var url = obj['url'] + 'ping' + cacheBuster;
        var ajaxSizeRequest = $.ajax({
            type: "HEAD",
            async: true,
            url: url,
            crossDomain : true,
            error: function(message){
                            
            }
        });

        var pingStart = new Date();
        var cacheBuster = "?nnn=" + pingStart;
        url = obj['url'] + 'ping' + cacheBuster;
        ajaxSizeRequest = $.ajax({
            type: "HEAD",
            async: true,
            crossDomain : true,
            url: url,
            error: function(message){
            var e = new Date();
            var diff = (e.getTime() - pingStart.getTime());
            obj.headerLatency = Math.round(diff);
            console.log(obj['region_name'] + ': ' + Math.round(diff));
                    
            }
        });
    
    }

    /**
     * [setHeaderBandwidth description]
     * @param {[type]} index [description]
     */
    setHeaderBandwidth(index){
      let obj = this.locations[index];
      var downloadSize = 2621440; //bytes
        var pingStart = new Date();
        var cacheBuster = "?nnn=" + pingStart;
        var url = obj.url + this.properties.BANDWIDTH_IMG + cacheBuster;
        var ajaxSizeRequest = $.ajax({
            type: "HEAD",
            async: true,
            crossDomain : true,
            url: url,
            success: function(message){
            let pingEnd = new Date();
            let duration: number = ((pingEnd.getTime() - pingStart.getTime())/1000);
            let bitsLoaded = downloadSize * 8;
            let speedBps: any = (bitsLoaded / duration).toFixed(2);
            let speedKbps: any = (speedBps / 1024).toFixed(2);
            let speedMbps = (speedKbps / 1024).toFixed(2);
            obj.headerBandwidth = parseFloat(speedMbps);
            }
        });
    }

    /**
     * [setPingLatency description]
     * @param {[type]} index [description]
     */
    setPingLatency(index){
      let obj = this.locations[index];
      let ping = new Ping();
      ping.ping(obj.url, function(error, delta) {
        obj.pingLatency = delta;
        });
    }

    /**
     * [setDynamodbLatency description]
     * @param {[type]} index [description]
     */
    setDynamodbLatency(index){
      let obj = this.locations[index];
      var download = new Image() ;
      let pingStart = new Date();
      var cacheBuster = "?nnn=" + pingStart;
      download.onerror = function() {
          let pingEnd = new Date();
          let ping: number = (pingEnd.getTime() - pingStart.getTime());
          obj.dynamodbLatency = Math.round(ping);
          
      }
      download.src = obj.dynamo_url +'ping'+ cacheBuster ;
    }

    /**
     * [setSystemPingBandwidth description]
     * @param {[type]} index [description]
     */
    setSystemPingBandwidth(index){
      let obj = this.locations[index];
      // obj.dashboardModel.systemPingBandwidth[obj.currentLatencyIndex].value = Math.round(435); 
    }
}