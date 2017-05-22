import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApiService } from '../services/api.service';
import { PropertiesService } from '../services/properties.service';
import {PopoverModule} from "ngx-popover";
import { StarRatingModule } from 'angular-star-rating';
import { AngularOpenlayersModule } from 'angular2-openlayers';
// import { ngxLeafletModule } from 'ngx.leaflet.components/ngx.leaflet.module';
// import { CandTLeafletComponent } from 'ngx.leaflet.components';
// import { CandTLeafletService } from 'ngx.leaflet.components';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ShareButtonsModule} from 'ngx-sharebuttons';

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
    DashboardComponent,
    // CandTLeafletComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    ChartModule,
    PopoverModule,
    StarRatingModule,
    AngularOpenlayersModule,
    // BrowserAnimationsModule,
    // ngxLeafletModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDvSnAZNrXrmyEurdnijIl9BPYhaT706Ns'
    }),
    ShareButtonsModule.forRoot()

  ],
  providers: [
    ApiService,
    PropertiesService,
    // CandTLeafletService,
    {  
        provide: HighchartsStatic,
        useFactory: highchartsFactory
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
