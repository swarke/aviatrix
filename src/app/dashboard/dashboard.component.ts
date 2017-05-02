import { Component, OnInit, } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { DashboardModel} from '../../models';
import { MapsAPILoader, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { Response, Http } from '@angular/http';
import {DashboardService} from '../../services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  viewProviders: [DashboardService]

})
export class DashboardComponent implements OnInit {
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

  TEST_MINUTES: number = 60;
  TEST_INTERVAL: number = 10000;

  latency: any = 'NA';
  bandwidth: any = 'NA';
  responseTime: any = 'NA';
  throughput: any = 'NA';

  latencyChart: any;

  disabledStart: any;

  responseTimeChart : any;
  bandwidthChart: any;
  selectedRegions: any;

  bestRegion: any;
  worstRegion: any;
      
  constructor(private mapsAPILoader : MapsAPILoader,
              private http: Http,
              private dashboardService: DashboardService) {
      this.disabledStart = false;
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
    this.getInvetory();
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

       for(let index = 0; index < this.inventory.aws.data.length; index++) {
         let obj = this.inventory.aws.data[index];
         current.locations.push(obj);
       }
       
    })
  }

 getGeolocation() {
   return this.http.get('http://ipinfo.io/json');
  };

  myclick(marker: any) {
    marker.label = this.updateMarkerLabel(marker);
  };
 
  getSeriesData(chartType: any, name: any, data: any) {
    return {
              type:   chartType,
              name:   name,
              data:   data,
    };
  }

  getChartConfig (title: any, unit: any, series: any, chartType: any) {
     const options = {
          chart:   { type:  chartType, zoomType:   'xy' },
          title :   { text :   title },
          global :   {
            useUTC :   false,
          },
          xAxis:   {
              type:   'datetime',
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
      if (jsonObj.value !== null) {
        const date: Date = new Date(jsonObj.time);
        let yVal = jsonObj.value;
  
        metricData.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()), yVal]);
      }
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
    this.latency =  'NA';
    this.responseTime = 'NA';
    this.bandwidth = 'NA';
    this.bestRegion = null;
    this.worstRegion = null;

    // Setting latency chart configuration
    let latencySeries: any = [];

    // Setting latency chart configuration
    let responseTimeSeries: any = [];

    // Setting latency chart configuration
    let badwidthSeries: any = [];


    // Starting test for regions
    for(let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      object.latencyCompleted = false;
      object.dashboardModel = new DashboardModel();
      object.pingStartTime = new Date();
      
      // Setting up latency chart
      latencySeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.latency)));
      setTimeout(()=>this.setLatency(index),10);

      // Setting up rasponse time
      responseTimeSeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.responseTime)));
      setTimeout(()=>this.setResponseTime(index),10);

      // Setting up bandwidth
      badwidthSeries.push(this.getSeriesData('spline', object.cloud_info.region, this.getChartData(object.dashboardModel.bandwidth)));
      setTimeout(()=>this.setBandwith(index),10);
    }

    this.latencyOptions = this.getChartConfig('', 'Miliseconds', latencySeries, 'spline');
    this.responseTimeOptions = this.getChartConfig('', 'Miliseconds', responseTimeSeries, 'spline');
    this.bandwidthOptions = this.getChartConfig('', 'MBPS', badwidthSeries, 'spline');
    
    // Setting ping start time
    // this.pingStartTime = new Date();

    // Setting latency chart configuration
    // let latencySeries: any = [];
    // this.latencyOptions = null;
    // this.dashboardModel.latency = [];

    // latencySeries.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.dashboardModel.latency)));
    // this.latencyOptions = this.getChartConfig('', 'Miliseconds', latencySeries, 'spline');

    // Calculating latency.
    // this.setLatency();

    // Calculating bandwidth.
    // this.setBandwith();

    // Setting chart configuration
    // let responseTimeSeries: any = [];
    // this.dashboardModel.responseTime = [];
    // this.responseTimeOptions = null;
    // responseTimeSeries.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.dashboardModel.responseTime)));
    // this.responseTimeOptions = this.getChartConfig('', 'Miliseconds', responseTimeSeries, 'spline');
 
    // Calculating resposne time.
    // this.setResponseTime();  
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

    // console.log("  Region: " + this.locations[index].cloud_info.region + " Start Time: " + pingStartTime + " End Start Time: " + endTime + " Time diff: " + diffSec);

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
        let pingStart = performance.now();
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

        this.dashboardService.getBandwidth(obj.url + 'clouds-01.jpeg' + cacheBuster).subscribe((data:any ) =>{
            let pingEnd: number = performance.now();
            let duration: number = ((pingEnd - pingStart)/1000);
            let bitsLoaded = downloadSize * 8;
            let speedBps: any = (bitsLoaded / duration).toFixed(2);
            let speedKbps: any = (speedBps / 1024).toFixed(2);
            let speedMbps = (speedKbps / 1024).toFixed(2);

            obj.dashboardModel.bandwidth.push({'time': pingEnd, 'value': speedMbps});
            this.bandwidthChart.series[index].addPoint(this.getChartPoint(new Date(), parseInt(speedMbps)));
            
            setTimeout(()=>this.setBandwith(index),this.TEST_INTERVAL);
        });
      } else {
        this.getBandwidth(obj);
        obj.bandwidthCompleted = true;
      }
  }

  /**
   * [getBandwidth description]
   */
  getBandwidth(obj) {
    if (obj.dashboardModel.bandwidth.length > 0) {
      let _bandwidth:number = 0;
      for (let index = 0 ; index < obj.dashboardModel.bandwidth.length; index++) {
        _bandwidth = _bandwidth + parseFloat(obj.dashboardModel.bandwidth[index].value);
      }
     obj.bandwidth =  (_bandwidth / obj.dashboardModel.bandwidth.length).toFixed(2);
    }
  }

  /**
   * [setLatency description]
   */
  setLatency(index: any) {
    let obj = this.locations[index];
    if (this.getTimeDiffInSeconds(obj.pingStartTime, index) < this.TEST_MINUTES 
        && this.disabledStart) {
       let pingStart = performance.now();
        // this.http.get(this.inventory.aws[0].url)
        //   .subscribe((data) => {
        //     let pingEnd: number = performance.now();
        //     let ping: number = (pingEnd - pingStart);
        //     this.dashboardModel.latency.push({'time': new Date(), 'value': Math.round(ping)});

        //     this.latencyChart.series[0].addPoint(this.getChartPoint(new Date(), Math.round(ping)));

        //     this.getLatency();
        //     this.setLatency();
        // });

        this.dashboardService.getLatency(obj.url).subscribe((data: any ) => {
            let pingEnd: number = performance.now();
            let ping: number = (pingEnd - pingStart);
            obj.dashboardModel.latency.push({'time': new Date(), 'value': Math.round(ping)});

            this.latencyChart.series[index].addPoint(this.getChartPoint(new Date(), Math.round(ping)));
            setTimeout(() => this.setLatency(index), this.TEST_INTERVAL);
        });
    } else {
      // console.log("Latency Calculated ==> " + JSON.stringify(obj.dashboardModel.latency));
      this.getLatency(obj);
      obj.latencyCompleted = true;
    }
  }

  /**
   * [getLatency description]
   */
  getLatency(obj) {
    if (obj.dashboardModel.latency.length > 0) {
      let _latency:number = 0;
      for (let index = 0 ; index < obj.dashboardModel.latency.length; index++) {
        _latency = _latency + parseFloat(obj.dashboardModel.latency[index].value);
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
       let pingStart = performance.now();
        // this.http.get(this.inventory.aws[0].url + 'test.html')
        //   .subscribe((data) => {
        //     let pingEnd: number = performance.now();
        //     let ping: number = pingEnd - pingStart;
        //     this.dashboardModel.responseTime.push({'time': new Date(), 'value': Math.round(ping)});

        //     // Adding points to charts
        //     this.responseTimeChart.series[index].addPoint(this.getChartPoint(new Date(), Math.round(ping)));

        //     // Getting response time
        //     this.getResponseTime();
        //     // calling set response time.
        //     this.setResponseTime(index);
        // });

        this.dashboardService.getResponseTime(obj.url).subscribe((data:any ) =>{
            let pingEnd: number = performance.now();
            let ping: number = (pingEnd - pingStart);
            obj.dashboardModel.responseTime.push({'time': new Date(), 'value': Math.round(ping)});

            this.responseTimeChart.series[index].addPoint(this.getChartPoint(new Date(), Math.round(ping)));
            setTimeout(() => this.setResponseTime(index), this.TEST_INTERVAL);
        });
    } else {
      // console.log("Response Time Calculated ==> " + JSON.stringify(obj.dashboardModel.responseTime));
      this.getResponseTime(obj);
      obj.responseCompleted = true;
      setTimeout(() => this.isProcessCompleted(), 10);
    }
  }

  /**
   * [getResponseTime description]
   */
  getResponseTime(obj: any) {
    if (obj.dashboardModel.responseTime.length > 0) {
      let _responseTime:number = 0;
      for (let index = 0 ; index < obj.dashboardModel.responseTime.length; index++) {
        _responseTime = _responseTime + parseFloat(obj.dashboardModel.responseTime[index].value);
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

    // console.log("Best Region: " + this.bestRegion.responseTime);
    // console.log("Worst Region: " + this.worstRegion.responseTime);
     
  }

  isProcessCompleted() {
    let processCompleted: boolean = false;
    for(let index = 0; index < this.locations.length; index++) {
      let object: any = this.locations[index];
      if (object.responseCompleted && object.latencyCompleted 
          && object.bandwidthCompleted) {
        processCompleted = true;
      } else {
        processCompleted = false;
      }
    }

    if (processCompleted && this.bestRegion === null && this.worstRegion === null) {
      this.disabledStart = false;
      this.setRegionComparison();
    } else {
      if (this.bestRegion === null && this.worstRegion === null) {
        setTimeout(() => this.isProcessCompleted(), 10);
      }
    }
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
    this.dashboardService.getInventory().subscribe((inventory: any) => {
        this.inventory = JSON.parse(inventory);
        // this.getCurrentGeoLocation();
        for(let index = 0; index < this.inventory.aws.data.length; index++) {
         let obj = this.inventory.aws.data[index];
         obj.label = obj.region_name;
         this.locations.push(obj);
        }
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

    if (marker.latencyCompleted) {
      latency = marker.latency;
    } else if(marker.dashboardModel && marker.dashboardModel.latency
              && marker.dashboardModel.latency.length > 0) {
      latency = marker.dashboardModel.latency[marker.dashboardModel.latency.length -1].value;
    }

    if (marker.responseCompleted) {
      responseTime = marker.responseTime;
    } else if(marker.dashboardModel && marker.dashboardModel.responseTime
              && marker.dashboardModel.responseTime.length > 0) {
      responseTime = marker.dashboardModel.responseTime[marker.dashboardModel.responseTime.length -1].value;
    }

    if (marker.bandwidthCompleted) {
      bandwith = marker.bandwidth;
    } else if(marker.dashboardModel && marker.dashboardModel.bandwidth
              && marker.dashboardModel.bandwidth.length > 0) {
      bandwith = marker.dashboardModel.bandwidth[marker.dashboardModel.bandwidth.length -1].value;
    }

    return marker.region_name + ((latency === "" ? latency : ",  Latency: " + latency + " ms") 
                              + (responseTime === "" ? responseTime : ",  Response Time: " + responseTime + " ms")
                              + (bandwith === "" ? bandwith : ",  Bandwith: " + bandwith + " mbps"));
  }

}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
