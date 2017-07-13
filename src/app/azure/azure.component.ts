// import components
import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Response, Http } from '@angular/http';
import {DashboardService, PropertiesService} from '../../services';
import { CLOUD_TOOL, AWS_INVENTORY_PATH, AZURE_INVENTORY_PATH, GCE_INVENTORY_PATH} from '../app-config';


@Component({
  selector: 'app-azure',
  templateUrl: './azure.component.html?v=${new Date().getTime()}',
  styleUrls: ['./azure.component.scss?v=${new Date().getTime()}'],
  viewProviders: [DashboardService ],
  encapsulation: ViewEncapsulation.None
})

// Azure Component
export class AzureComponent {

  /**
   * Contructor for Azure component
   */
  constructor(private http: Http,
              private dashboardService: DashboardService,
              public properties: PropertiesService) {
    properties.setcurrentTool(properties.AZURE_TOOL_NAME);
    properties.setcurrentToolName(properties.AZURE);
  }
}
