import { Component, OnInit, } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { DashboardModel} from '../../models';
import { MapsAPILoader, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { Response,Http } from '@angular/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  clouds: any;
  options: any;
  latencyOptions: any;
  responseTimeOptions: any;
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

  TEST_MINUTES: number = 5;

  latency: any = 'NA';
  bandwidth: any = 'NA';
  responseTime: any = 'NA';
  throughput: any = 'NA';

  latencyChart: any;

  disabledStart: any;

  chart : Object;
      
  constructor(private mapsAPILoader : MapsAPILoader,
              private http: Http) {
      this.disabledStart = false;
      this.dashboardModel = new DashboardModel();
  	  this.clouds = [
                	    {value: '0', viewValue: 'All Cloud'},
                	    {value: '1', viewValue: 'Google Cloud'},
                	    {value: '2', viewValue: 'Azure'}
                	  ];
     this.options = [];

     this.inventory = {
        'aws': [{
          'name': 'aviatrix-us-east-1-test1',
          'id': 'i-04eccf81f71a331c4',
          'dns_name': 'ec2-107-22-156-82.compute-1.amazonaws.com',
          'public_ip': '107.22.156.82',
          'cloud_info': {
            'region': 'us-east-1',
            'availability_zone': 'us-east-1c',
          },
          'url': 'http://107.22.156.82/',
          'lat': '41.283142',
          'lng': '-72.872870',
        }]
      };

     this.errorMessage = "";
     this.locations = [];
  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }
  
  ngOnInit() {
    this.getCurrentGeoLocation();
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
       current.locations.push({
                            lat: 41.283142,
                            lng: -72.872870,
                            label: 'US East (N. Virginia)',
                            draggable: false
                          });
    })
  }

 getGeolocation() {
   return this.http.get('http://ipinfo.io/json');
  };

  myclick(marker: any){
  };
  renderAllCharts () {
    this.generateChart('latency');
    this.generateChart('responseTime');
    this.generateChart('packetLoss');
    this.generateChart('throughput');
  }

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
          // events: {
          //       load: function () {
          //           // set up the updating of the chart each second
          //           var series = this.series[0];
          //           setInterval(function () {
          //               var x = new Date(), // current time
          //                   y = Math.random();
          //               series.addPoint([x, y], true, true);
          //           }, 1000);
          //       }
          // }, 
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

   generateChart (chartFor: any) { 
     // if(chartFor === 'latency') {
     //   let series: any = [];
     //     series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.getLatencyData())));
     //     // series.push(this.getSeriesData('spline', "us-west-2", this.getChartData(this.getLatencyData2())));
     //     const chartConfig = this.getChartConfig('', '', series, 'spline');
     //     this.latencyOptions = chartConfig;    
     // } else if (chartFor === 'responseTime') {
     //     let series: any = [];
     //     series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.getResponsetime1())));
     //     series.push(this.getSeriesData('spline', "us-west-2", this.getChartData(this.getResponsetime2())));
     //     const chartConfig = this.getChartConfig('', '', series, 'spline');
     //     this.responseTimeOptions = chartConfig; 
     // } else if (chartFor === 'packetLoss') {
     //     let series: any = [];
     //     series.push(this.getSeriesData('column', "us-east-1", this.getChartData(this.getPacketLossData())));
     //     series.push(this.getSeriesData('column', "us-west-2", this.getChartData(this.getPacketLossData2())));
     //     const chartConfig = this.getChartConfig('', '', series, 'column');
     //     this.packetLossOptions = chartConfig; 
     // } else if (chartFor === 'throughput') {
     //   let series: any = [];
     //     series.push(this.getSeriesData('column', "us-east-1", this.getChartData(this.getThroughputData())));
     //     series.push(this.getSeriesData('column', "us-west-2", this.getChartData(this.getThroughputData2())));
     //     const chartConfig = this.getChartConfig('', '', series, 'column');
     //     this.throughputOptions = chartConfig; 
     // }

  }

  getLatencyData () {
    return [
            {
              "value": 0.16,
              "time": "2017-04-07 05:50:00"
            },
            {
                "value": 0.15,
                "time": "2017-04-07 05:50:30"
            },
            {
                "value": 0.17,
                "time": "2017-04-07 05:51:00"
            },
            {
                "value": 0.18,
                "time": "2017-04-07 05:51:30"
            },
            {
                "value": 0.25,
                "time": "2017-04-07 05:52:00"
            },
            {
              "value": 0.34,
              "time": "2017-04-07 05:52:30"
            },
            {
                "value": 0.40,
                "time": "2017-04-07 05:53:00"
            },
            {
                "value": 0.43,
                "time": "2017-04-07 05:53:30"
            },
            {
                "value": 0.48,
                "time": "2017-04-07 05:54:00"
            },
            {
                "value": 0.56,
                "time": "2017-04-07 05:54:30"
            }
           ]
  };

  getLatencyData2 () {
    return [
            {
              "value": 0.18,
              "time": "2017-04-07 05:50:00"
            },
            {
                "value": 0.10,
                "time": "2017-04-07 05:50:30"
            },
            {
                "value": 0.15,
                "time": "2017-04-07 05:51:00"
            },
            {
                "value": 0.12,
                "time": "2017-04-07 05:51:30"
            },
            {
                "value": 0.30,
                "time": "2017-04-07 05:52:00"
            },
            {
              "value": 0.20,
              "time": "2017-04-07 05:52:30"
            },
            {
                "value": 0.40,
                "time": "2017-04-07 05:53:00"
            },
            {
                "value": 0.67,
                "time": "2017-04-07 05:53:30"
            },
            {
                "value": 0.10,
                "time": "2017-04-07 05:54:00"
            },
            {
                "value": 0.56,
                "time": "2017-04-07 05:54:30"
            }
           ]
  };

  getResponsetime1 () {
    return [{
              "value": 0.11,
              "time": "2017-04-07 05:50:00"
             },
             {
                "value": 0.15,
                "time": "2017-04-07 05:50:30"
            },
            {
                "value": 0.10,
                "time": "2017-04-07 05:51:00"
            },
            {
                "value": 1.20,
                "time": "2017-04-07 05:51:30"
            },
            {
                "value": 0.14,
                "time": "2017-04-07 05:52:00"
            },
            {
              "value": 0.11,
              "time": "2017-04-07 05:52:30"
             },
             {
                "value": 0.15,
                "time": "2017-04-07 05:53:00"
            },
            {
                "value": 0.10,
                "time": "2017-04-07 05:53:30"
            },
            {
                "value": 1.20,
                "time": "2017-04-07 05:54:00"
            },
            {
                "value": 0.14,
                "time": "2017-04-07 05:54:30"
            }
        ]
  }

   getResponsetime2 () {
    return [{
              "value": 0.10,
              "time": "2017-04-07 05:50:00"
             },
             {
                "value": 0.11,
                "time": "2017-04-07 05:50:30"
            },
            {
                "value": 0.15,
                "time": "2017-04-07 05:51:00"
            },
            {
                "value": 1.20,
                "time": "2017-04-07 05:51:30"
            },
            {
                "value": 0.13,
                "time": "2017-04-07 05:52:00"
            },
            {
              "value": 0.17,
              "time": "2017-04-07 05:52:30"
             },
             {
                "value": 0.20,
                "time": "2017-04-07 05:53:00"
            },
            {
                "value": 0.10,
                "time": "2017-04-07 05:53:30"
            },
            {
                "value": 0.20,
                "time": "2017-04-07 05:54:00"
            },
            {
                "value": 0.14,
                "time": "2017-04-07 05:54:30"
            }
        ]
  }

  getPacketLossData () {
    return [{
                "value": 5,
                "time": "2017-04-07 05:50:00"
            },
            {
                "value": 7,
                "time": "2017-04-07 05:50:30"
            },
            {
                "value": 10,
                "time": "2017-04-07 05:51:00"
            },
            {
                "value": 12,
                "time": "2017-04-07 05:51:30"
            },
            {
                "value": 25,
                "time": "2017-04-07 05:52:00"
            },
            {
                "value": 30,
                "time": "2017-04-07 05:52:30"
            },
            {
                "value": 37,
                "time": "2017-04-07 05:53:00"
            },
            {
                "value": 42,
                "time": "2017-04-07 05:53:30"
            },
            {
                "value": 48,
                "time": "2017-04-07 05:54:00"
            },
            {
                "value": 53,
                "time": "2017-04-07 05:54:30"
            }
          ]
  };

  getPacketLossData2 () {
    return [{
                "value": 10,
                "time": "2017-04-07 05:50:00"
            },
            {
                "value": 6,
                "time": "2017-04-07 05:50:30"
            },
            {
                "value": 20,
                "time": "2017-04-07 05:51:00"
            },
            {
                "value": 5,
                "time": "2017-04-07 05:51:30"
            },
            {
                "value": 25,
                "time": "2017-04-07 05:52:00"
            },
            {
                "value": 10,
                "time": "2017-04-07 05:52:30"
            },
            {
                "value": 40,
                "time": "2017-04-07 05:53:00"
            },
            {
                "value": 24,
                "time": "2017-04-07 05:53:30"
            },
            {
                "value": 67,
                "time": "2017-04-07 05:54:00"
            },
            {
                "value": 53,
                "time": "2017-04-07 05:54:30"
            }
          ]
  };

  getThroughputData () {
    return [{
             "value": 60,
             "time": "2017-04-07 05:50:00"
            },
            {
              "value": 20,
              "time": "2017-04-07 05:50:30"
            },
            {
              "value": 40,
              "time": "2017-04-07 05:51:00"
            },
            {
              "value": 30,
              "time": "2017-04-07 05:51:30"
            },
            {
              "value": 50,
              "time": "2017-04-07 05:52:00"
            },
            {
              "value": 30,
              "time": "2017-04-07 05:52:30"
            },
            {
              "value": 40,
              "time": "2017-04-07 05:53:00"
            },
            {
              "value": 70,
              "time": "2017-04-07 05:53:30"
            },
            {
              "value": 50,
              "time": "2017-04-07 05:54:00"
            },
            {
              "value": 20,
              "time": "2017-04-07 05:54:30"
            }
            ]
  };

   getThroughputData2 () {
    return [{
             "value": 30,
             "time": "2017-04-07 05:50:00"
            },
            {
              "value": 50,
              "time": "2017-04-07 05:50:30"
            },
            {
              "value": 40,
              "time": "2017-04-07 05:51:00"
            },
            {
              "value": 60,
              "time": "2017-04-07 05:51:30"
            },
            {
              "value": 30,
              "time": "2017-04-07 05:52:00"
            },
            {
              "value": 50,
              "time": "2017-04-07 05:52:30"
            },
            {
              "value": 20,
              "time": "2017-04-07 05:53:00"
            },
            {
              "value": 60,
              "time": "2017-04-07 05:53:30"
            },
            {
              "value": 70,
              "time": "2017-04-07 05:54:00"
            },
            {
              "value": 40,
              "time": "2017-04-07 05:54:30"
            }
            ]
  };

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
   * Starts test for calculating the statistics.
   */
  startTest() {
    this.disabledStart = true;
    this.pingStartTime = new Date();
    this.latency =  'NA';
    this.responseTime = 'NA';
    this.bandwidth = 'NA';
    this.setLatency();
    this.setBandwith();
    this.setResponseTime();
   
    // setInterval(() => this.latencyOptions.series[0].addPoint(Math.random() * 10), 1000);
     // let series: any = [];
     // series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.dashboardModel.latency)));
     // this.latencyOptions = this.getChartConfig('', 'Miliseconds', series, 'spline');
  }

  getTimeDiff() {
    let endTime:any = new Date();
    let diff: any = endTime - this.pingStartTime;

    var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);

    return diffMins;
  }

  getTimeDiffInSeconds() {
    let endTime:any = new Date();
    let diff: any = endTime.getTime() - this.pingStartTime.getTime();

    var diffSec = diff/ 1000;

    return diffSec;
  }

  setBandwith() {
    var downloadSize = 2621440; //bytes
    let dashboard = this;
    if (this.getTimeDiff() < this.TEST_MINUTES) {
        let pingStart = performance.now();
        var cacheBuster = "?nnn=" + pingStart;
        this.http.get(this.inventory.aws[0].url + 'clouds-01.jpeg' + cacheBuster)
          .subscribe((data) => {
            let pingEnd: number = performance.now();
            let duration: number = ((pingEnd - pingStart)/1000);
            let bitsLoaded = downloadSize * 8;
            let speedBps: any = (bitsLoaded / duration).toFixed(2);
            let speedKbps: any = (speedBps / 1024).toFixed(2);
            let speedMbps = (speedKbps / 1024).toFixed(2);

            dashboard.dashboardModel.bandwidth.push({'time': pingEnd, 'value': speedMbps});
              // dashboard.setThroughput(bitsLoaded,pingEnd, duration);
            dashboard.getBandwidth();
              // dashboard.getThroughput();
            dashboard.setBandwith();
        });
          // var download = new Image();
          // download.onload = function () {
          //     let pingEnd: number = performance.now();
          //     let duration: number = ((pingEnd - pingStart)/1000);
          //     let bitsLoaded = downloadSize * 8;
          //     let speedBps: any = (bitsLoaded / duration).toFixed(2);
          //     let speedKbps: any = (speedBps / 1024).toFixed(2);
          //     let speedMbps = (speedKbps / 1024).toFixed(2);
        
          //     dashboard.dashboardModel.bandwidth.push({'time': pingEnd, 'value': speedMbps});
          //     dashboard.setThroughput(bitsLoaded,pingEnd, duration);
          //     dashboard.getBandwidth();
          //     dashboard.getThroughput();
          //     dashboard.setBandwith();
          // } 

          // let pingStart = performance.now();
          // var cacheBuster = "?nnn=" + pingStart;
          // download.src = this.inventory.aws[0].url + 'clouds-01.jpeg' + cacheBuster;
      } else {
        this.disabledStart = false;
      }
  }

  getBandwidth() {
    if (this.dashboardModel.bandwidth.length > 0) {
      let _bandwidth:number = 0;
      for (let index = 0 ; index < this.dashboardModel.bandwidth.length; index++) {
        _bandwidth = _bandwidth + parseFloat(this.dashboardModel.bandwidth[index].value);
      }
     this.bandwidth =  _bandwidth / this.dashboardModel.bandwidth.length;
    }
  }

  setLatency() {
    if (this.getTimeDiff() < this.TEST_MINUTES) {
       let pingStart = performance.now();
        this.http.get(this.inventory.aws[0].url)
          .subscribe((data) => {
            let pingEnd: number = performance.now();
            let ping: number = (pingEnd - pingStart);
            this.dashboardModel.latency.push({'time': new Date(), 'value': Math.round(ping)});

            let series: any = [];
            series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.dashboardModel.latency)));
            this.latencyOptions = this.getChartConfig('', 'Miliseconds', series, 'spline');
            
            this.getLatency();
            this.setLatency();
        });
    } else {
      this.disabledStart = false;
      let series: any = [];
      this.latencyOptions = [];
      series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.dashboardModel.latency)));
      this.latencyOptions = this.getChartConfig('', 'Miliseconds', series, 'spline');
    }
  }

  getLatency() {
    if (this.dashboardModel.latency.length > 0) {
      let _latency:number = 0;
      for (let index = 0 ; index < this.dashboardModel.latency.length; index++) {
        _latency = _latency + parseFloat(this.dashboardModel.latency[index].value);
      }

     this.latency =  _latency / this.dashboardModel.latency.length;
    }
  }

  setResponseTime() {
    if (this.getTimeDiff() < this.TEST_MINUTES) {
       let pingStart = performance.now();
        this.http.get(this.inventory.aws[0].url + 'test.html')
          .subscribe((data) => {
            let pingEnd: number = performance.now();
            let ping: number = pingEnd - pingStart;
            this.dashboardModel.responseTime.push({'time': new Date(), 'value': Math.round(ping)});

            let series: any = [];
            this.responseTimeOptions = [];
            series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.dashboardModel.responseTime)));
            this.responseTimeOptions = this.getChartConfig('', 'Miliseconds', series, 'spline');

            this.getResponseTime();
            this.setResponseTime();
        });
    } else {
        this.disabledStart = false;
        let series: any = [];
        this.responseTimeOptions = [];
        series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.dashboardModel.responseTime)));
        this.responseTimeOptions = this.getChartConfig('', 'Miliseconds', series, 'spline');
    }
  }

  getResponseTime() {
    if (this.dashboardModel.responseTime.length > 0) {
      let _responseTime:number = 0;
      for (let index = 0 ; index < this.dashboardModel.responseTime.length; index++) {
        _responseTime = _responseTime + parseFloat(this.dashboardModel.responseTime[index].value);
      }

     this.responseTime =  _responseTime / this.dashboardModel.responseTime.length;
    }
  }

  setThroughput(bandwidth, time, duration) {
    var seconds = ((time % 60000) / 1000)
    var _bandwidth = (bandwidth / seconds);
    let speedBps: any = (_bandwidth / duration).toFixed(2);
    let speedKbps: any = (speedBps / 1024).toFixed(2);
    let speedMbps = (speedKbps / 1024).toFixed(2);
    this.dashboardModel.throughput.push({'time': time, 'value': speedMbps});
  }

  getThroughput() {
    if (this.dashboardModel.throughput.length > 0) {
      let _throughput:number = 0;
      for (let index = 0 ; index < this.dashboardModel.throughput.length; index++) {
        _throughput = _throughput + parseFloat(this.dashboardModel.throughput[index].value);
      }
 
     this.throughput =  _throughput / this.dashboardModel.throughput.length;
    }
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
