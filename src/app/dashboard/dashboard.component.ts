import { Component, OnInit, ElementRef, ViewChild, Renderer, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { DashboardModel} from '../../models';
import { MapsAPILoader, GoogleMapsAPIWrapper,
         NoOpMapsAPILoader,
         MouseEvent
       } from '@agm/core-src/src/core';
import { Response, Http } from '@angular/http';
import {DashboardService, PropertiesService} from '../../services';
import { SourceVectorComponent, LayerVectorComponent, MapComponent  } from 'angular2-openlayers';

import { CLOUD_TOOL, AWS_INVENTORY_PATH, AZURE_INVENTORY_PATH, GCE_INVENTORY_PATH} from '../app-config';
declare var jQuery:any;

declare const L: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  viewProviders: [DashboardService, SourceVectorComponent, LayerVectorComponent, MapComponent ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit  {
  clouds: any;
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

  @ViewChild('imageDiv') el:ElementRef;
  @ViewChild('pingImage') elImg:ElementRef;
      
  constructor(private mapsAPILoader : MapsAPILoader,
              private http: Http,
              private dashboardService: DashboardService,
              private elRef:ElementRef,
              private rd: Renderer,
              public properties: PropertiesService) {
      // console.log(this.el.nativeElement);  
      this.initLeftPanelHeader();
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
     this.bestBandwidthRegion = null;
     this.mapStyles = [
                          {
                              "elementType": "geometry",
                              "stylers": [{
                                "color": "#f5f5f5"
                              }]
                          },
                          {
                            "elementType": "labels",
                            "stylers": [
                              {
                                "visibility": "off"
                              }
                            ]
                          },
                          {
                            "elementType": "labels.icon",
                            "stylers": [
                              {
                                "visibility": "off"
                              }
                            ]
                          },
                          {
                            "elementType": "labels.text.fill",
                            "stylers": [
                              {
                                "color": "#616161"
                              }
                            ]
                          },
                          {
                            "elementType": "labels.text.stroke",
                            "stylers": [
                              {
                                "color": "#f5f5f5"
                              }
                            ]
                          },
                          {
                            "featureType": "administrative",
                            "elementType": "geometry",
                            "stylers": [{
                              "visibility": "off"
                            }]
                          },
                          {
                            "featureType": "administrative.land_parcel",
                            "stylers": [{
                              "visibility": "off"
                            }]
                          },
                          {
                            "featureType": "administrative.land_parcel",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                              "color": "#bdbdbd"
                            }]
                          },
                          {
                            "featureType": "administrative.neighborhood",
                            "stylers": [{
                              "visibility": "off"
                            }]
                          },
                          {
                            "featureType": "road",
                            "stylers": [{
                              "visibility": "off"
                            }]
                          },
                          {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [{
                              "color": "#ffffff"
                            }]
                          },
                          {
                            "featureType": "road",
                            "elementType": "labels.icon",
                            "stylers": [{
                              "visibility": "off"
                            }]
                          },
                          {
                            "featureType": "road.arterial",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                              "color": "#757575"
                            }]
                          },
                          {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [{
                              "color": "#dadada"
                            }]
                          },
                          {
                            "featureType": "road.highway",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                              "color": "#616161"
                            }]
                          },
                          {
                            "featureType": "road.local",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                              "color": "#9e9e9e"
                            }]
                            },
                            {
                              "featureType": "transit",
                              "stylers": [{
                                "visibility": "off"
                              }]
                            },
                            {
                              "featureType": "transit.line",
                              "elementType": "geometry",
                              "stylers": [{
                                "color": "#e5e5e5"
                              }]
                            },
                            {
                              "featureType": "transit.station",
                              "elementType": "geometry",
                              "stylers": [{
                                "color": "#eeeeee"
                              }]
                            },
                            {
                              "featureType": "water",
                              "elementType": "geometry",
                              "stylers": [{
                                "color": "#c9c9c9"
                              }]
                            },
                            {
                              "featureType": "water",
                              "elementType": "labels.text.fill",
                              "stylers": [{
                                "color": "#9e9e9e"
                              }]
                            },
                            {
                              "featureType": "poi",
                              "stylers": [{
                                "visibility": "off"
                              }]
                            },
                            {
                              "featureType": "poi",
                              "elementType": "geometry",
                              "stylers": [{
                                "color": "#eeeeee"
                              }]
                            },
                            {
                              "featureType": "poi",
                              "elementType": "labels.text.fill",
                              "stylers": [{
                                "color": "#757575"
                              }]
                            },
                            {
                              "featureType": "poi.park",
                              "elementType": "geometry",
                              "stylers": [{
                                "color": "#e5e5e5"
                              }]
                            },
                            {
                              "featureType": "poi.park",
                              "elementType": "labels.text.fill",
                              "stylers": [{
                                "color": "#9e9e9e"
                              }]
                            }
                         ];

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

     let self = this;

    
   
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){                                                              
        self.userLocation.latitude = position.coords.latitude;                    
        self.userLocation .longitude = position.coords.longitude;  
        self.userLocation.isOpen = false;
        self.userLocation.label = 'User Location'
        self.userLocation.iconUrl = '/assets/user_pin.png';
        console.log("Lat: " + self.userLocation.latitude + "Long " +  self.userLocation .longitude +  "Position: " + JSON.stringify(position));
        self.getInvetory();         
      });
    }
  }

  initLeftPanelHeader() {
    if(CLOUD_TOOL.toUpperCase() === 'AWS') {
     this.leftPanelHeader = this.properties.LEFT_PANEL_AWS_REGION;
     this.inventoryPath = AWS_INVENTORY_PATH;
     this.cloudPinPath = this.properties.AWS_CLOUD_PIN_PATH;
    } else if(CLOUD_TOOL.toUpperCase() === "AZURE") {
     this.leftPanelHeader = this.properties.LEFT_PANEL_AZURE_REGION;
     this.inventoryPath = AZURE_INVENTORY_PATH;
     this.cloudPinPath = this.properties.AZURE_CLOUD_PIN_PATH;
    } else  if(CLOUD_TOOL.toUpperCase() === 'GCE') {
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
   return this.http.get('http://ipinfo.io/json');
  };

  markerEntered(map, marker: any, event: any, isCloudPin: boolean) {
    // if (isCloudPin) {
      // marker.label = this.updateMarkerLabel(marker);
      // marker.isOpen = true;
      // this.updateChartOnMarker(marker, true);
    // } else {
      // marker.isOpen = true;
    // }
    this.text = 'test';
    // event.target.openPopup();

    var popup = L.popup()
   .setLatLng([18.5990891, 73.7722048]) 
   .setContent(this.text)
   .openOn(map);

    return marker.label;
  };

  markerOut(marker: any, event: any, isCloudPin: boolean) {
    // if (isCloudPin) {
    //   marker.isOpen = false;
    //   this.updateChartOnMarker(marker, false);
    // } else {
    //   marker.isOpen = false;
    // }
    event.target.closePopup();
  }
 
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
    // let responseTimeSeries: any = [];

    // Setting latency chart configuration
    let badwidthSeries: any = [];


    // Starting test for regions
    for(let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      object.latencyCompleted = false;
      object.latency = null;
      object.bandwidth = null;
      object.dashboardModel = new DashboardModel();
      object.pingStartTime = new Date();
      object.currentLatencyIndex = 0;
      object.currentResponseIndex = 0;
      object.currentBandwidthIndex = 0;
      object.throughputCallIndex = undefined;
      object.firstLatencyPass = false;
      object.firstBandwidthPass = false;
      
      // Setting up latency chart
      this.setDataPoint(object.dashboardModel.latency, object);
      latencySeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.latency)));
      setTimeout(()=>this.setLatency(index),10);

      // // Setting up rasponse time
      // this.setDataPoint(object.dashboardModel.responseTime, object);
      // responseTimeSeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.responseTime)));
      // setTimeout(()=>this.setResponseTime(index),10);

      // Setting up bandwidth
      this.setDataPoint(object.dashboardModel.bandwidth, object);
      badwidthSeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.bandwidth)));
      setTimeout(()=>this.setBandwith(index),10);
    }

    this.latencyOptions = this.getChartConfig('', this.properties.MILISECONDS, latencySeries, 'spline');
    // this.responseTimeOptions = this.getChartConfig('', 'Miliseconds', responseTimeSeries, 'spline');
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
     
        // jQuery("#imageDiv").empty();
        // jQuery("#imageDiv").html("<img id='pingImage' style='display: none'>");
        // var pingImage = jQuery("#pingImage");
        // console.log("PingImage: " + pingImage);
        // pingImage.on("error", function() {
        //   current.calculateLatency(obj, index, pingStart)
        // });
        
        // let pingStart = new Date();
        // var cacheBuster = "?nnn=" + pingStart;
        // pingImage.attr("src", 'http://dynamodb.us-west-1.amazonaws.com/' +'ping'+ cacheBuster);

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

        // this.dashboardService.getLatency(obj.url+ 'ping' + cacheBuster).subscribe((data: any ) => {
        //     // let pingEnd = new Date();
        //     // let ping: number = (pingEnd.getTime() - pingStart.getTime());
        //     // obj.dashboardModel.latency.push({'time': new Date(), 'value': Math.round(ping)});

        //     // this.latencyChart.series[index].addPoint(this.getChartPoint(new Date(), Math.round(ping)));
            
        // }, (error:any) => {
        //    let pingEnd = new Date();
        //     let ping: number = (pingEnd.getTime() - pingStart.getTime());
        //     obj.dashboardModel.latency.push({'time': new Date(), 'value': Math.round(ping)});

        //     this.latencyChart.series[index].addPoint(this.getChartPoint(new Date(), Math.round(ping)));
        // });
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

  setRegionComparison() {
    for (let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      if (this.bestRegion === null) {
        this.bestRegion = object;
      } else {
        if(object.responseTime < this.bestRegion.responseTime) {
          this.bestRegion = object;
        }
      }

      if (this.worstRegion === null) { 
        this.worstRegion = object;
      } else {
        if(object.responseTime > this.worstRegion.responseTime) {
          this.worstRegion = object;
        }
      }
    }
  }

  getBestLatencyAndBandwidth() {
    for (let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      if (this.bestLatencyRegion === null) {
        this.bestLatencyRegion = object;
      } else {
        if(object.latency < this.bestLatencyRegion.latency) {
          this.bestLatencyRegion = object;
        }
      }

      if (this.bestBandwidthRegion === null) {
        this.bestBandwidthRegion = object;
      } else {
        if(object.bandwidth > this.bestBandwidthRegion.bandwidth) {
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

    // if (processCompleted && this.bestRegion === null && this.worstRegion === null) {
    //   this.disabledStart = false;
    //   this.setRegionComparison();
    // } else {
    //   if (this.bestRegion === null && this.worstRegion === null) {
    //     setTimeout(() => this.isProcessCompleted(), 10);
    //   }
    // }
  }

  /**
   * [setThroughput description]
   * @param {[type]} bandwidth [description]
   * @param {[type]} time      [description]
   * @param {[type]} duration  [description]
   */
  // setThroughput(bandwidth, time, duration) {
  //   var seconds = ((time % 60000) / 1000)
  //   var _bandwidth = (bandwidth / seconds);
  //   let speedBps: any = (_bandwidth / duration).toFixed(2);
  //   let speedKbps: any = (speedBps / 1024).toFixed(2);
  //   let speedMbps = (speedKbps / 1024).toFixed(2);
  //   this.dashboardModel.throughput.push({'time': time, 'value': speedMbps});
  // }

  /**
   * [getThroughput description]
   */
  // getThroughput() {
  //   if (this.dashboardModel.throughput.length > 0) {
  //     let _throughput:number = 0;
  //     for (let index = 0 ; index < this.dashboardModel.throughput.length; index++) {
  //       _throughput = _throughput + parseFloat(this.dashboardModel.throughput[index].value);
  //     }

  //    this.throughput =  _throughput / this.dashboardModel.throughput.length;
  //   }
  // }

  getInvetory() {

    this.dashboardService.getInventory(this.inventoryPath).subscribe((inventory: any) => {
        this.inventory = JSON.parse(inventory);
        // this.getCurrentGeoLocation();
        for(let index = 0; index < this.inventory.data.length; index++) {
         let obj = this.inventory.data[index];
         obj.label = obj.region_name;
         obj.isOpen = false;
         console.log("Cloud Pin Path: " + this.cloudPinPath);
         
         obj.iconUrl= this.cloudPinPath;
         obj.color = this.chartColors[index];
         this.locations.push(obj);
        }

        this.generateMap();
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

    // if (marker.responseCompleted) {
    //   responseTime = marker.responseTime;
    // } else if(marker.dashboardModel && marker.dashboardModel.responseTime
    //           && marker.dashboardModel.responseTime.length > 0 && marker.currentResponseIndex > 0) {
    //   responseTime = marker.dashboardModel.responseTime[marker.currentResponseIndex - 1].value;
    // }

    if (marker.bandwidthCompleted && marker.bandwidth) {
      bandwith = marker.bandwidth;
    } else if(marker.dashboardModel && marker.dashboardModel.bandwidth
              && marker.dashboardModel.bandwidth.length > 0 && marker.currentBandwidthIndex > 0) {
      bandwith = marker.dashboardModel.bandwidth[marker.currentBandwidthIndex - 1].value;
    }

    let content = "";

    if(latency === "" && bandwith === "") {
      content = "<strong>" + marker.region_name +"</strong>";
    } else {
      content = '<table class="table table-striped">' +
                    '<thead>' + 
                      '<tr> <th style="text-align: center; border-top: none" colspan="2">'+ marker.region_name +'</th></tr>' +
                      '<tr> <th style="text-align: center">'+ this.properties.RIGHT_PANEL_LATENCY_COLUMN_HEADER+'</th> <th style="text-align: center">'+ this.properties.RIGHT_PANEL_THROUGHPUT_COLUMN_HEADER +'</th></tr>' +
                    '</thead>' +
                    '<tbody>' +
                      '<tr><td style="text-align: center;">'+(latency === "" ? this.properties.NA_TEXT : latency) +'</td> <td style="text-align: center;">' + (bandwith === "" ? this.properties.NA_TEXT : bandwith) +'</td></tr>' +
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

    return this.properties.NA_TEXT;
  }

  readLatestThroughput(obj) {
    if (obj.bandwidthCompleted && obj.bandwidth) {
      return obj.bandwidth;
    } else if(obj.dashboardModel && obj.dashboardModel.bandwidth
              && obj.dashboardModel.bandwidth.length > 0 && obj.currentBandwidthIndex > 0) {
      return obj.dashboardModel.bandwidth[obj.currentBandwidthIndex - 1].value;
    }

     return this.properties.NA_TEXT;
  }

  sortBy (property) {
    // console.log(property);
    this.sortableColumn = property;
    this.isDesc = !this.isDesc; //change the direction    
    let direction = this.isDesc ? 1 : -1;

    this.locations.sort(function(a, b) {
        if(a[property] < b[property]) {
            return -1 * direction;
        }
        else if( a[property] > b[property]) {
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
            });

            this.bandwidthChart.series[index].update({
              dataLabels: {
                  enabled: true
              }
            });
          } else {
            this.latencyChart.series[index].update({
              dataLabels: {
                  enabled: false
              }
            });

            this.bandwidthChart.series[index].update({
              dataLabels: {
                  enabled: false
              }
            });
          }
        }
      }
    }
  }

  generateMap() {
    let self = this;
    var map = L.map('map').setView([self.userLocation.latitude, self.userLocation.longitude], 1);
    map.options.minZoom = 1;

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    }).addTo(map);

    var userIcon = L.icon({
        iconUrl: self.userLocation.iconUrl,
        iconSize: [22, 39],
    });

    var userMarker = L.marker([self.userLocation.latitude, self.userLocation.longitude], {'icon': userIcon});

    userMarker.addTo(map)
        .bindPopup('User Location');
       
    userMarker.on('mouseover', function (e) {
      this.openPopup();
    });
    userMarker.on('mouseout', function (e) {
       this.closePopup();
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

      var polyline = L.polyline([[self.userLocation.latitude, self.userLocation.longitude], [object.lat, object.lng]], {color: object.color}).addTo(map);
      // zoom the map to the polyline
      polyline.addTo(map);

      // var path = L.curve(['M',[self.userLocation.latitude, self.userLocation.longitude],
      //     'V',[48.40003249610685],
      //     'L',[object.lat, object.lng],'Z'],
      //     {color:object.color,fill:true}).addTo(map);
      // L.Polyline.Arc([self.userLocation.latitude, self.userLocation.longitude], [object.lat, object.lng]).addTo(map);
    }

    // var pathOne = L.curve(['M',[50.14874640066278,14.106445312500002],
    //          'Q',[51.67255514839676,16.303710937500004],
    //            [50.14874640066278,18.676757812500004],
    //          'T',[49.866316729538674,25.0927734375]], {animate: 3000}).addTo(map);



  }

}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
