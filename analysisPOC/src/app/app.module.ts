import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApiService } from '../services/api.service';
import { PropertiesService } from '../services/properties.service';
import {PopoverModule} from "ngx-popover";
import { StarRatingModule } from 'angular-star-rating';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import { AppRoutingModule, appRoutingProviders} from './app-routing.module';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { ToastrModule } from 'toastr-ng2';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    PopoverModule,
    StarRatingModule,
    ShareButtonsModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ToastrModule.forRoot({timeOut: 5000, closeButton: true}),
  ],
  entryComponents: [],
  providers: [
    ApiService,
    PropertiesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
