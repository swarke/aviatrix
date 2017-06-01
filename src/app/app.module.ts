import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AWSComponent } from './aws/aws.component';
import { AzureComponent } from './azure/azure.component';
import { ModalComponent } from './modal/modal.component';

import { ApiService } from '../services/api.service';
import { PropertiesService } from '../services/properties.service';
import {PopoverModule} from "ngx-popover";
import { StarRatingModule } from 'angular-star-rating';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import { AppRoutingModule, appRoutingProviders} from './app-routing.module';



declare var require: any;

export function highchartsFactory() {
    const hc = require('highcharts');
    const dd = require('highcharts/modules/drilldown');
    dd(hc);

    return hc;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    FooterComponent,
    DashboardComponent,
    AWSComponent,
    AzureComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    ChartModule,
    PopoverModule,
    StarRatingModule,
    ShareButtonsModule.forRoot()
  ],
  entryComponents: [ModalComponent],
  providers: [
    ApiService,
    PropertiesService,
    {  
        provide: HighchartsStatic,
        useFactory: highchartsFactory
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
