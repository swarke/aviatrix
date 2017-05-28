import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PropertiesService } from '../../services';
import { CLOUD_TOOL} from '../app-config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  tool: string;
  isLanding: boolean;
  constructor(public properties: PropertiesService,
  			  private titleService: Title,
          private router: Router,
          private route:ActivatedRoute
          ) {
    this.tool = properties.getCurerntTool();
    console.log(this.route);
  	this.initToolName();
  }

  ngOnInit() {
    if(this.tool) {
      this.isLanding = false;
    } else {
       this.isLanding  = true;
    }
  }

  initToolName() {
    this.titleService.setTitle('Cloud Network Tools (powered by Aviatrix)');
  }

}
