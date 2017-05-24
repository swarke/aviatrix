import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Response, Http } from '@angular/http';
import {DashboardService, PropertiesService} from '../../services';
import { CLOUD_TOOL, AWS_INVENTORY_PATH, AZURE_INVENTORY_PATH, GCE_INVENTORY_PATH} from '../app-config';


@Component({
  selector: 'app-azure1',
  templateUrl: './azure1.component.html',
  styleUrls: ['./azure1.component.scss'],
  viewProviders: [DashboardService ],
  encapsulation: ViewEncapsulation.None
})
export class Azure1Component {
  constructor(private http: Http,
              private dashboardService: DashboardService,
              public properties: PropertiesService) {
  }
}
