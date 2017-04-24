import { Component, OnInit, NgZone } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
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
  constructor(private mapsAPILoader : MapsAPILoader,
              private ngZone: NgZone,
              private http: Http) {
  	  this.clouds = [
                	    {value: '0', viewValue: 'All Cloud'},
                	    {value: '1', viewValue: 'Google Cloud'},
                	    {value: '2', viewValue: 'Azure'}
                	  ];
     this.options = [];
     this.errorMessage = "";
     this.renderAllCharts();
     this.locations = [];
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
      console.log("mouse over event ", marker);
  };
  renderAllCharts () {
    this.generateChart('latency');
    this.generateChart('responseTime');
    this.generateChart('packetLoss');
    this.generateChart('throughput');
    console.log(this.latencyOptions);
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
     if(chartFor === 'latency'){
       let series: any = [];
         series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.getLatencyData())));
         series.push(this.getSeriesData('spline', "us-west-2", this.getChartData(this.getLatencyData2())));
         const chartConfig = this.getChartConfig('', '', series, 'spline');
         this.latencyOptions = chartConfig;    
     } else if (chartFor === 'responseTime'){
         let series: any = [];
         series.push(this.getSeriesData('spline', "us-east-1", this.getChartData(this.getResponsetime1())));
         series.push(this.getSeriesData('spline', "us-west-2", this.getChartData(this.getResponsetime2())));
         const chartConfig = this.getChartConfig('', '', series, 'spline');
         this.responseTimeOptions = chartConfig; 
     } else if (chartFor === 'packetLoss'){
         let series: any = [];
         series.push(this.getSeriesData('column', "us-east-1", this.getChartData(this.getPacketLossData())));
         series.push(this.getSeriesData('column', "us-west-2", this.getChartData(this.getPacketLossData2())));
         const chartConfig = this.getChartConfig('', '', series, 'column');
         this.packetLossOptions = chartConfig; 
     } else if (chartFor === 'throughput'){
       let series: any = [];
         series.push(this.getSeriesData('column', "us-east-1", this.getChartData(this.getThroughputData())));
         series.push(this.getSeriesData('column', "us-west-2", this.getChartData(this.getThroughputData2())));
         const chartConfig = this.getChartConfig('', '', series, 'column');
         this.throughputOptions = chartConfig; 
     }

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
}
