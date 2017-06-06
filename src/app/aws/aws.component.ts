import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Response, Http } from '@angular/http';
import {DashboardService, PropertiesService} from '../../services';
import { CLOUD_TOOL, AWS_INVENTORY_PATH, AZURE_INVENTORY_PATH, GCE_INVENTORY_PATH} from '../app-config';


@Component({
  selector: 'app-aws',
  templateUrl: './aws.component.html?v=${new Date().getTime()}',
  styleUrls: ['./aws.component.scss?v=${new Date().getTime()}'],
  viewProviders: [DashboardService ],
  encapsulation: ViewEncapsulation.None
})
export class AWSComponent {
  constructor(private http: Http,
              private dashboardService: DashboardService,
              public properties: PropertiesService) {
    properties.setcurrentTool(properties.AWS_TOOL_NAME);
    properties.setcurrentToolName(properties.AWS);
  }


}
