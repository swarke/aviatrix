import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';

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

  inventory: any;
  constructor() {
  	  this.clouds = [
  	    {value: '0', viewValue: 'All Cloud'},
  	    {value: '1', viewValue: 'Google Cloud'},
  	    {value: '2', viewValue: 'Azure'}
  	  ];
     this.lat = 37.646152;
     this.lng = -77.511429;
     this.options = [];
     this.renderAllCharts();
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
          'url': 'url',
          'lat': '41.283142',
          'lng': '-72.872870',
        }]
      };
  }

  ngOnInit() {
    //this.renderAllCharts();
  }

    public zoom: number = 15;
  public opacity: number = 1.0;

  increaseZoom(){
    this.zoom  = Math.min(this.zoom + 1, 18);
    console.log('zoom: ', this.zoom);
  }
  decreaseZoom(){
    this.zoom  = Math.max(this.zoom - 1, 1);
    console.log('zoom: ', this.zoom);
  }

  increaseOpacity(){
    this.opacity  = Math.min(this.opacity + 0.1, 1);
    console.log('opacity: ', this.opacity);
  }
  decreaseOpacity(){
    this.opacity  = Math.max(this.opacity - 0.1, 0);
    console.log('opacity: ', this.opacity);
  }

    markers: marker[] = [
    {
      lat: 37.646152,
      lng: -77.511429,
      label: 'Richmond',
      draggable: false
    },
    {
      lat: 41.283142,
      lng: -72.872870,
      label: 'US East (N. Virginia)',
      draggable: false
    },
    {
      lat: 41.468801,
      lng: -81.921060,
      label: 'US West (Oregon)',
      draggable: true
    }
  ];

  myclick(marker: any){
      console.log("mouse over event ", marker);
  };
  renderAllCharts () {
    this.generateChart('latency');
    this.generateChart('responseTime');
    // this.generateChart(this.getChartData(this.getResponsetime2()), 'responseTime');
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

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
