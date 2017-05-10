import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PropertiesService } from '../../services';
import { CLOUD_TOOL} from '../app-config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  toolName: string = '';
  constructor(public properties: PropertiesService,
  			  private titleService: Title) {
  	this.initToolName();
  }

  ngOnInit() {
  }

  initToolName() {
    if(CLOUD_TOOL.toUpperCase() === 'AWS') {
 		this.toolName = this.properties.AWS_TOOL_NAME;
    } else if(CLOUD_TOOL.toUpperCase() === "AZURE") {
		this.toolName = this.properties.AZURE_TOOL_NAME;
    } else  if(CLOUD_TOOL.toUpperCase() === 'GCE') {
	    this.toolName = this.properties.GCE_TOOL_NAME;
    }
  }

}
