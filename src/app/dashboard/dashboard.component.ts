import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { DashboardModel} from '../../models';
import { Response, Http } from '@angular/http';
import {DashboardService, PropertiesService} from '../../services';

import { CLOUD_TOOL, AWS_INVENTORY_PATH, AZURE_INVENTORY_PATH, GCE_INVENTORY_PATH} from '../app-config';
declare var jQuery:any;

declare const L: any;

declare const google: any;

declare const AmCharts: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html?v=${new Date().getTime()}',
  styleUrls: ['./dashboard.component.scss?v=${new Date().getTime()}'],
  viewProviders: [DashboardService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit  {
  clouds: any;
  @Input() tool: string;
  options: any;
  latencyOptions: any;
  responseTimeOptions: any;
  bandwidthOptions: any;
  packetLossOptions: any;
  throughputOptions: any;
  lat: number;
  lng: number;
  geoLocation: any;
  errorMessage: any;

  locations: any[];

  inventory: any;

  dashboardModel: DashboardModel;
  pingStartTime: any =  null;

  TEST_MINUTES: number = 35;
  TEST_INTERVAL: number = 5000;

  latency: any;
  bandwidth: any;
  responseTime: any;
  throughput: any;

  latencyChart: any;

  disabledStart: any;

  responseTimeChart : any;
  bandwidthChart: any;
  selectedRegions: any;

  bestRegion: any;
  worstRegion: any;

  bestLatencyRegion: any;
  bestBandwidthRegion: any;

  mapStyles: any;
  isDesc: boolean;
  sortableColumn: any;
  leftPanelHeader:any;
  inventoryPath: any;
  cloudPinPath: any;
  chartColors: any;
  userLocation: any;

  public zoom = 15;
  public opacity = 1.0;
  public width = 5;
  text = '';
  hoveredObject = null;

  constructor(private http: Http,
              private dashboardService: DashboardService,
              public properties: PropertiesService) {
      
      this.chartColors = ['#2196F3', '#F44336', '#FF609E', '#14936C', '#00FF4F', '#A99000',
                          '#E8C21A', '#673AB7', '#3D495A', '#536DFE', '#C3429B', '#C33A38', 
                          '#02BCA1', '#25DB67', '#6F9900', '#E69500', '#D792F1', '#83A1CD', 
                          '#0E7BBC', '#81D4FA'];
      this.userLocation = {};
      this.latency = properties.NA_TEXT;
      this.bandwidth = properties.NA_TEXT;
      this.responseTime = properties.NA_TEXT;
      this.throughput = properties.NA_TEXT;

      this.lat = properties.NA_LATITUDE;
      this.lng = properties.NA_LONGITUDE;    
      
      this.disabledStart = false;
      this.isDesc = false;
      this.sortableColumn = "";
      this.latencyOptions = null;
      this.responseTimeOptions = null;
      this.bandwidthOptions = null;
      this.latencyChart = null;
      this.responseTimeChart = null;
      this.bandwidthChart = null;
      this.dashboardModel = new DashboardModel();
  	  this.clouds = [
                	    {value: '0', viewValue: 'All Cloud'},
                	    {value: '1', viewValue: 'Google Cloud'},
                	    {value: '2', viewValue: 'Azure'}
                	  ];
     this.options = [];

     this.inventory = {};
     this.errorMessage = "";
     this.locations = [];
     this.selectedRegions = [];
     this.bestRegion = null;
     this.worstRegion = null;
     this.bestLatencyRegion = null;
   
  }

  latencyInstance(chartInstance) {
    this.latencyChart = chartInstance;
  }

  responseTimeInstance(chartInstance) {
    this.responseTimeChart = chartInstance;
  }

  bandwidthInstance(chartInstance) {
    this.bandwidthChart = chartInstance;
  }

  ngOnInit() {
    // this.userLocation.latitude = 18.5990891;                    
    // this.userLocation .longitude = 73.7722048;  
    // this.userLocation.isOpen = false;
    // this.userLocation.label = 'User Location'
    // this.userLocation.iconUrl = '/assets/user_pin.png';

  }

  ngAfterViewInit() {
    this.initLeftPanelHeader();
    let self = this;
   
    this.getGeolocation().subscribe((success: any) => {
      try {
        let geoLocations =  JSON.parse(success._body);

        self.userLocation.latitude = geoLocations.location.lat;
        self.userLocation.longitude = geoLocations.location.lng;

        self.userLocation.isOpen = false;
        // self.userLocation.label = 'User Location';
        self.userLocation.iconUrl = '/assets/updated_user_pin.png';
        // console.log("Lat: " + self.userLocation.latitude + " Long " +  self.userLocation .longitude);

        // self.userLocation.address = geoLocations.region_name + ', ' + geoLocations.country_name;
        var geocoder = geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(self.userLocation.latitude, self.userLocation.longitude);
          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  if (results[1]) {
                      self.userLocation.address = results[1].formatted_address;
                  }
              }
        });
        // console.log(geoLocations);
      } catch(ex) {
      }

      self.getInvetory();

    });

    // if (navigator.geolocation){
    //   navigator.geolocation.getCurrentPosition(function(position){                                                              
    //     self.userLocation.latitude = position.coords.latitude;                    
    //     self.userLocation.longitude = position.coords.longitude;  
    //     self.userLocation.isOpen = false;
    //     self.userLocation.label = 'User Location'
    //     self.userLocation.iconUrl = '/assets/user_pin.png';
    //     console.log("Lat: " + self.userLocation.latitude + " Long " +  self.userLocation .longitude);
        
    //     var geocoder = geocoder = new google.maps.Geocoder();
    //       var latlng = new google.maps.LatLng(self.userLocation.latitude, self.userLocation.longitude);
    //       geocoder.geocode({ 'latLng': latlng }, function (results, status) {
    //           if (status == google.maps.GeocoderStatus.OK) {
    //               if (results[1]) {
    //                   self.userLocation.address = results[1].formatted_address;
    //               }
    //           }            
    //     });

    //     self.getInvetory();
      
    //   });
    // }
  }

  initLeftPanelHeader() {
    if(this.tool.toUpperCase() === this.properties.AWS) {
     this.leftPanelHeader = this.properties.LEFT_PANEL_AWS_REGION;
     this.inventoryPath = AWS_INVENTORY_PATH;
     this.cloudPinPath = this.properties.AWS_CLOUD_PIN_PATH;
    } else if(this.tool.toUpperCase() === this.properties.AZURE) {
     this.leftPanelHeader = this.properties.LEFT_PANEL_AZURE_REGION;
     this.inventoryPath = AZURE_INVENTORY_PATH;
     this.cloudPinPath = this.properties.AZURE_CLOUD_PIN_PATH;
    } else  if(this.tool.toUpperCase() === this.properties.GCE) {
     this.leftPanelHeader = this.properties.LEFT_PANEL_GCE_REGION;
     this.inventoryPath = GCE_INVENTORY_PATH;
     this.cloudPinPath = this.properties.GCE_CLOUD_PIN_PATH;
    }
  }

  getCurrentGeoLocation() {
     let current = this;
      this.getGeolocation().subscribe((geoLocation:   any) => {
      current.geoLocation = JSON.parse(geoLocation._body);
       let locs: any[] = current.geoLocation.loc.split(',');
       current.lat = parseFloat(locs[0]);
       current.lng = parseFloat(locs[1]);
       current.locations.push({
                              lat: parseFloat(locs[0]),
                              lng: parseFloat(locs[1]),
                              label: 'User location : ' + current.geoLocation.city,
                              draggable: false
                            });

       for(let index = 0; index < this.inventory.data.length; index++) {
         let obj = this.inventory.data[index];
         current.locations.push(obj);
       }
       
    })
  }

  getGeolocation() {
   return this.http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=' + this.properties.GOOGLE_API_KEY, {});
   // return this.http.get("https://freegeoip.net/json/");
  };

  getSeriesData(chartType: any, name: any, data: any) {
    return {
              type:   chartType,
              name:   name,
              data:   data,
              dataLabels : {
                    enabled : false
              },
              shadow: {
                width: 3,
                offsetX: 0,
                offsetY: 0,
                opacity: 0.06
            }
    };
  }

  getChartConfig (title: any, unit: any, series: any, chartType: any) {
     const options = {
          chart:   { type:  chartType, zoomType:   'xy',
                      style: {
                        fontFamily: 'Roboto, sans-serif'
                      }
           },
          title :   { text :   title },
          colors: this.chartColors,
          global :   {
            useUTC :   false,
          },
          xAxis:   {
              type:   'datetime',
              tickInterval: 5000,
              dateTimeLabelFormats: {
                second: '%H:%M:%S'
              },
              startOnTick: true
          },
          yAxis:   {
                  labels:   {
                    format: '{value}'
                  },
                  title:   {
                    text: unit
                  }
          },
          series: series
      };
      return options;
    }


  /**
   * [getChartData description]
   * @param {[type]} chartData [description]
   */
  getChartData(chartData) {
    const metricData: any = [];
    for (let index = 0; index < chartData.length; index++) {
      const jsonObj = chartData[index];
      // if (jsonObj.value !== null) {
        const date: Date = new Date(jsonObj.time);
        let yVal = jsonObj.value;
  
        metricData.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()), yVal]);
      // }
    }

    return metricData;
  }

  /**
   * [getChartPoint description]
   * @param {[type]} date  [description]
   * @param {[type]} value [description]
   */
  getChartPoint(date, value) {
    return [Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()), value];
  }

  /**
   * Starts test for calculating the statistics.
   */
  startTest() {
    // Disabling start button
    this.disabledStart = true;

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
      // Setting up latency chart
      this.setDataPoint(object.dashboardModel.latency, object);
      latencySeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.latency)));
      setTimeout(()=>this.setLatency(index),10);

      // Setting up bandwidth(throughput)
      this.setDataPoint(object.dashboardModel.bandwidth, object);
      badwidthSeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.bandwidth)));
      setTimeout(()=>this.setBandwith(index),10);
    }

    this.latencyOptions = this.getChartConfig('', this.properties.MILISECONDS, latencySeries, 'spline');
    this.bandwidthOptions = this.getChartConfig('', this.properties.MBPS, badwidthSeries, 'spline');
  }

  setDataPoint(data, obj) {
    for (var index = 0; index < 6; index++) {
      if (index == 0) {
        data.push({'time': new Date(), 'value': null});
      } else {
        let date = new Date()
        date.setSeconds(obj.pingStartTime.getSeconds() + (index * 5));
        data.push({'time': date, 'value': null});
      }
    }
  }  

  /**
   * [getTimeDiff description]
   */
  getTimeDiff() {
    let endTime:any = new Date();
    let diff: any = endTime - this.pingStartTime;

    var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
    return diffMins;
  }


  /**
   * [getTimeDiffInSeconds description]
   */
  getTimeDiffInSeconds(pingStartTime, index) {
    let endTime:any = new Date();
    let diff: any = endTime.getTime() - pingStartTime.getTime();

    var diffSec = diff/ 1000;
    return diffSec;
  }

  /**
   * [setBandwith description]
   */
  setBandwith(index) {
    let obj = this.locations[index];
    var downloadSize = 2621440; //bytes
    let dashboard = this;
    if (this.getTimeDiffInSeconds(obj.pingStartTime, index) < this.TEST_MINUTES 
        && this.disabledStart) {
        obj.throughputCallIndex = obj.throughputCallIndex === undefined ? 0 : (obj.throughputCallIndex + 1);
      
        setTimeout(()=>this.setBandwith(index),this.TEST_INTERVAL);
        let pingStart = new Date();
        var cacheBuster = "?nnn=" + pingStart;
        // this.http.get(this.inventory.aws[0].url + 'clouds-01.jpeg' + cacheBuster)
        //   .subscribe((data) => {
        //     let pingEnd: number = performance.now();
        //     let duration: number = ((pingEnd - pingStart)/1000);
        //     let bitsLoaded = downloadSize * 8;
        //     let speedBps: any = (bitsLoaded / duration).toFixed(2);
        //     let speedKbps: any = (speedBps / 1024).toFixed(2);
        //     let speedMbps = (speedKbps / 1024).toFixed(2);

        //     dashboard.dashboardModel.bandwidth.push({'time': pingEnd, 'value': speedMbps});
        //     dashboard.getBandwidth();
        //     dashboard.setBandwith();
        // });

        this.dashboardService.getBandwidth(obj.url + this.properties.BANDWIDTH_IMG + cacheBuster).subscribe((data:any ) =>{
            let pingEnd = new Date();
            let duration: number = ((pingEnd.getTime() - pingStart.getTime())/1000);
            let bitsLoaded = downloadSize * 8;
            let speedBps: any = (bitsLoaded / duration).toFixed(2);
            let speedKbps: any = (speedBps / 1024).toFixed(2);
            let speedMbps = (speedKbps / 1024).toFixed(2);

            if (obj.firstBandwidthPass) {
              obj.dashboardModel.bandwidth[obj.currentBandwidthIndex].value = parseFloat(speedMbps);
              this.bandwidthChart.series[index].data[obj.currentBandwidthIndex].update({"y": parseFloat(speedMbps)});
              obj.currentBandwidthIndex++;
            

              // console.log("Region: " + obj.region_name + " Current index: " + obj.currentBandwidthIndex + " call index: " + obj.throughputCallIndex);
              if(obj.currentBandwidthIndex > 5) {
                this.getBandwidth(obj);
                obj.bandwidthCompleted = true;
                setTimeout(() => this.isProcessCompleted(), 10);
              }
            } else {
              obj.firstBandwidthPass = true;
            }
        });
      } else {
          if (!this.disabledStart) {
            this.getBandwidth(obj);
            obj.bandwidthCompleted = true;
            setTimeout(() => this.isProcessCompleted(), 5);
          }
        }
  }

  /**
   * [getBandwidth description]
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
  setLatency(index: any) {
    let obj = this.locations[index];
    let current = this;
    if (this.getTimeDiffInSeconds(obj.pingStartTime, index) < this.TEST_MINUTES 
        && this.disabledStart) {
       setTimeout(() => this.setLatency(index), this.TEST_INTERVAL);

        var download = new Image() ;
        let pingStart = new Date();
        var cacheBuster = "?nnn=" + pingStart;
        download.onerror = function() {
          if (obj.firstLatencyPass) {
              let pingEnd = new Date();
              let ping: number = (pingEnd.getTime() - pingStart.getTime());
              obj.dashboardModel.latency[obj.currentLatencyIndex].value = Math.round(ping);
              current.latencyChart.series[index].data[obj.currentLatencyIndex].update({"y": Math.round(ping)});
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
      if(!this.disabledStart) {
        setTimeout(() => this.isProcessCompleted(), 5);
      }
    }
  }

  /**
   * [getLatency description]
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
   * [setResponseTime description]
   */
  setResponseTime(index: any) {
    let obj = this.locations[index];

    if (this.getTimeDiffInSeconds(obj.pingStartTime, index) < this.TEST_MINUTES 
        && this.disabledStart) {
       setTimeout(() => this.setResponseTime(index), this.TEST_INTERVAL);
       let pingStart = new Date();
       var cacheBuster = "?nnn=" + pingStart;
       this.dashboardService.getResponseTime(obj.url + this.properties.RESPONSE_TIME_HTML + cacheBuster).subscribe((data:any ) =>{
          let pingEnd = new Date();
          let ping: number = (pingEnd.getTime() - pingStart.getTime());
          obj.dashboardModel.responseTime[obj.currentResponseIndex].value = Math.round(ping);
          this.responseTimeChart.series[index].data[obj.currentResponseIndex].update({"y": Math.round(ping)});
          obj.currentResponseIndex++;
       });
    } else {
      this.getResponseTime(obj);
      obj.responseCompleted = true;
    }
  }

  /**
   * [getResponseTime description]
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

    if (processCompleted) {
      this.getBestLatencyAndBandwidth();
      this.disabledStart = false;
    } else {
        setTimeout(() => this.isProcessCompleted(), 10);
    }
  }

  getInvetory() {
    this.dashboardService.getInventory(this.inventoryPath).subscribe((inventory: any) => {
        this.inventory = JSON.parse(inventory);
        for(let index = 0; index < this.inventory.data.length; index++) {
         let obj = this.inventory.data[index];
         obj.label = obj.region_name;
         obj.isOpen = false;
         
         obj.iconUrl= this.cloudPinPath;
         obj.color = this.chartColors[index];
         this.locations.push(obj);
        }

        // this.generateMap();
        this.generateAmMap();
      },
        (error: any) => this.handleError(error)
      );
  }

  handleError(error: any) {

  }

  stopTest() {
    this.disabledStart = false;
  }

  updateMarkerLabel(marker) {
    let latency = "";
    let responseTime = "";
    let bandwith = "";

    if (marker.latencyCompleted && marker.latency) {
      latency = marker.latency;
    } else if(marker.dashboardModel && marker.dashboardModel.latency
              && marker.dashboardModel.latency.length > 0 && marker.currentLatencyIndex > 0) {
      latency = marker.dashboardModel.latency[marker.currentLatencyIndex - 1].value;
    }


    if (marker.bandwidthCompleted && marker.bandwidth) {
      bandwith = marker.bandwidth;
    } else if(marker.dashboardModel && marker.dashboardModel.bandwidth
              && marker.dashboardModel.bandwidth.length > 0 && marker.currentBandwidthIndex > 0) {
      bandwith = marker.dashboardModel.bandwidth[marker.currentBandwidthIndex - 1].value;
    }

    let content = "";

    if(latency == "" && bandwith == "") {
      content = "<strong>" + marker.region_name +"</strong>";
    } else {
      content = '<table class="table table-bordered" width="100%">' +
                    '<thead>' + 
                      '<tr> <th style="text-align: center; border-top: none" colspan="2">'+ marker.region_name +'</th></tr>' +
                      '<tr> <th style="text-align: center">'+ "Latency <br> (msec)"+'</th> <th style="text-align: center">'+ 'Throughput <br> (mbps)' +'</th></tr>' +
                    '</thead>' +
                    '<tbody>' +
                      '<tr><td style="text-align: center;">'+(latency == "" ? this.properties.NA_TEXT : latency) +'</td> <td style="text-align: center;">' + (bandwith == "" ? this.properties.NA_TEXT : bandwith) +'</td></tr>' +
                    '</tbody>' +
                  '</table>';
    }
    
    return content;
  }

  /**
   * [readLatestLatency description]
   * @param {[type]} obj [description]
   */
  readLatestLatency(obj) {
    if (obj.latencyCompleted && obj.latency) {
      return  obj.latency;
    } else if(obj.dashboardModel && obj.dashboardModel.latency
              && obj.dashboardModel.latency.length > 0 && obj.currentLatencyIndex > 0) {
      return obj.dashboardModel.latency[obj.currentLatencyIndex - 1].value;
    }

    return this.properties.CALCULATING_TEXT;
  }

  readLatestThroughput(obj) {
    if (obj.bandwidthCompleted && obj.bandwidth) {
      return obj.bandwidth;
    } else if(obj.dashboardModel && obj.dashboardModel.bandwidth
              && obj.dashboardModel.bandwidth.length > 0 && obj.currentBandwidthIndex > 0) {
      return obj.dashboardModel.bandwidth[obj.currentBandwidthIndex - 1].value;
    }

     return this.properties.CALCULATING_TEXT;
  }

  sortBy (property) {
    this.sortableColumn = property;
    this.isDesc = !this.isDesc; //change the direction    
    let direction = this.isDesc ? 1 : -1;

    this.locations.sort(function(a, b) {
       let aProp = null;
       let bProp = null;
       if(property != 'region_name') {
         aProp = parseFloat(a[property]);
         bProp = parseFloat(b[property]);
       } else {
         aProp = a[property];
         bProp = b[property];
       }

        if(aProp < bProp) {
            return -1 * direction;
        }
        else if( aProp > bProp) {
            return 1 * direction;
        }
        else{
            return 0;
        }
    });
  }

  updateChartOnMarker(marker: any, hide: boolean) {
    if (this.latencyChart && this.latencyChart.series) {
      for(let index = 0; index < this.latencyChart.series.length; index++) {
        if(this.latencyChart.series[index].name !== marker.cloud_info.region && hide) {
          this.latencyChart.series[index].hide();

          if (this.bandwidthChart && this.bandwidthChart.series) {
            this.bandwidthChart.series[index].hide();
          }
        } else {
          this.latencyChart.series[index].show();
          this.bandwidthChart.series[index].show();
          if(hide) {
            this.latencyChart.series[index].update({
              dataLabels: {
                  enabled: true
              }
            }, false);

            this.bandwidthChart.series[index].update({
              dataLabels: {
                  enabled: true
              }
            }, false);
          } else {
            this.latencyChart.series[index].update({
              dataLabels: {
                  enabled: false
              }
            }, false);

            this.bandwidthChart.series[index].update({
              dataLabels: {
                  enabled: false
              }
            }, false);
          }
        }
      }
      this.latencyChart.redraw();
      this.bandwidthChart.redraw();    
    }
  }

  generateMap() {
    let self = this;
    var map = L.map('map', { zoomControl:false }).setView([self.userLocation.latitude, self.userLocation.longitude], 1);
    map.options.minZoom = 1;

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    }).addTo(map);

    var userIcon = L.icon({
        iconUrl: self.userLocation.iconUrl,
        iconSize: [22, 39],
    });

    var userMarker = L.marker([self.userLocation.latitude, self.userLocation.longitude], {'icon': userIcon});

    userMarker.addTo(map);

    var userPopup = null;
    
    userMarker.on('mouseover', function (e) {
      userPopup = L.popup()
           .setLatLng([self.userLocation.latitude, self.userLocation.longitude])
           .setContent(self.userLocation.address ? self.userLocation.address : "NA")
            .openOn(map);
    });

    userMarker.on('mouseout', function (e) {
      if(userPopup) {
          map.closePopup(userPopup);
        }
    });

    for(let index = 0; index < this.locations.length; index++ ) {
      let object = this.locations[index];

      var markerIcon = L.icon({
        iconUrl: object.iconUrl,
        iconSize: [22, 39],
      });

      var marker = L.marker([object.lat, object.lng], {'icon': markerIcon});

      marker.addTo(map);
      var layerPopup = null;
      marker.on('mouseover', function (e) {
        var content = self.updateMarkerLabel(object);
        self.updateChartOnMarker(object, true);
        layerPopup = L.popup()
           .setLatLng([object.lat, object.lng])
           .setContent(content)
            .openOn(map);

      });
      marker.on('mouseout', function (e) {
        if(layerPopup) {
          self.updateChartOnMarker(object, false);
          map.closePopup(layerPopup);
        }
      });

      var polyline = L.polyline([[self.userLocation.latitude, self.userLocation.longitude], [object.lat, object.lng]], {color: object.color, weight: 1}).addTo(map);
      polyline.addTo(map);


      // L.Polyline.Arc([self.userLocation.latitude, self.userLocation.longitude], [object.lat, object.lng], {color: object.color,  weight: 1,
      // vertices: 50}).addTo(map);
    }
  }

  generateAmMap() {
    let self = this;

    var lines = [];
    var images = [];
    var planeSVG = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";


    var userImg= {
          "id": "user",
          "imageURL": self.userLocation.iconUrl,
          "width": 22,
          "height": 22,
          "title": function() {
           return self.userLocation.address ? '<b>You are here</b><br>' + self.userLocation.address : "NA";
         },

          "latitude": self.userLocation.latitude,
          "longitude": self.userLocation.longitude,
          "scale": 1
    }

    images.push(userImg);

    for(let index = 0; index < this.locations.length; index++) {
      let object = this.locations[index];

      // Creating lines
      var line = {
          "id": "line" + index,
          "latitudes": [ self.userLocation.latitude, object.lat ],
          "longitudes": [ self.userLocation.longitude, object.lng ],
          "color": object.color,
          "arc": -0.85,
          "thickness" : 2
      };
      
      lines.push(line);

      var regionImg= {
          "id": object.cloud_info.region,
          "imageURL": object.iconUrl,
          "width": 22,
          "height": 39,
          "title": function() {
            if(!self.hoveredObject || self.hoveredObject.id != object.cloud_info.region) {
              self.hoveredObject = object;
              self.hoveredObject.content = self.updateMarkerLabel(object);
            } 
            
            return self.hoveredObject.content;
          },
          "latitude": object.lat,
          "longitude": object.lng,
          "scale": 1
      }

      images.push(regionImg);

      // images.push({
      //   "imageURL": 'assets/E24725.svg',
      //   "positionOnLine": 0,
      //   "color": "#585869",
      //   "animateAlongLine": true,
      //   "lineId": "line" + index,
      //   // "flipDirection": true,
      //   "loop": true,
      //   "scale": 0.03,
      //   "positionScale": 1.8
      // });
    }

    

    var map = AmCharts.makeChart( "map", {
      "type": "map",
      "theme": "light",
      "dataProvider": {
        "map": "worldLow",
        "zoomLevel": 1.4,
        "lines": lines,
        "images": images
      },

      "areasSettings": {
        alpha: 0.5,
        unlistedAreasColor: '#BBBBBB'
      },

      "imagesSettings": {
        color: '#585869',
        rollOverColor: '#585869',
        selectedColor: '#585869',
        "pauseDuration": 0.2,
        "animationDuration": 2.5,
        "adjustAnimationSpeed": false
      },

      "linesSettings": {
        "arc": -0.7, // this makes lines curved. Use value from -1 to 1
        // "arrow": "middle",
        // "arrowSize": 6,
        color: '#585869',
        thickness: 2,
        alpha: 0.7,
        balloonText: '',
        bringForwardOnHover: false,
      },

      "backgroundZoomsToTop": true,
      "linesAboveImages": true,
      
    } );
   
   map.balloon.textAlign = 'left';
 
   map.addListener("rollOverMapObject", function (event) {
     if(event && event.mapObject) {
       if(event.mapObject.objectType == "MapImage") {
         let region  = self.getRegionForImage(event.mapObject.id);
         if(region) {
           self.updateChartOnMarker(region, true);
         }
       }
     }
   });

   map.addListener("rollOutMapObject", function (event) {
       if(event && event.mapObject) {
         if(event.mapObject.objectType == "MapImage") {
           let region  = self.getRegionForImage(event.mapObject.id);
           if(region) {
             self.updateChartOnMarker(region, false);
           }
         }
       }
    });
  }

  getRegionForImage(regionId) {
    for(let index = 0; index < this.locations.length; index++) {
      let location = this.locations[index];
      if(location.cloud_info.region === regionId) {
        return location;
      }
    }
    return null;
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
