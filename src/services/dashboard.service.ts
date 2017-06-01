import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Response } from '@angular/http';
import { APIRequest, APIUrls } from '../models';
import { APIMethod, ApiService } from './api.service';
import { PropertiesService } from './properties.service';
import { Observable } from 'rxjs/Observable';

declare const AWS: any;



@Injectable()
/**
 * @brief      Class for activities service.
 */
export class DashboardService {

  public bestLatencyRegion: any;
  // dataString$ = this.bestLatencyRegion.asObservable();
  public bestBandwidthRegion: any;
  bestRegions: EventEmitter<any> = new EventEmitter<any>();
  constructor(private _apiService: ApiService,
              private properties: PropertiesService) {
    //this.createAWS();
    this.bestBandwidthRegion = null;
    this.bestLatencyRegion = null;
    
  }

  getInventory(inventoryPath: any) {
    //'data/inventory.json'
    const apiRequest: APIRequest = new APIRequest(inventoryPath, APIMethod.GET);
    return this._apiService.executeAPI(apiRequest);
  }


  getGeolocation() { 
   const apiRequest: APIRequest = new APIRequest('https://www.googleapis.com/geolocation/v1/geolocate?key=' + this.properties.GOOGLE_API_KEY, APIMethod.POST);
    return this._apiService.executeAPI(apiRequest);
   // return this.http.post(, {});
  };

  getLatency(url) {
    const apiRequest: APIRequest = new APIRequest(url, APIMethod.GET);
    return this._apiService.executeAPI(apiRequest);
  }

  getResponseTime(url) {
    const apiRequest: APIRequest = new APIRequest(url, APIMethod.GET);
    return this._apiService.executeAPI(apiRequest);
  }

  getBandwidth(url) {
    const apiRequest: APIRequest = new APIRequest(url, APIMethod.GET);
    return this._apiService.executeAPI(apiRequest);
  }

  emitBestLatencyRegion(bestLatencyRegion: any) {
    // this.bestLatencyRegion = bestLatencyRegion;
    this.bestRegions.emit(bestLatencyRegion);
  }
  getBestLatencyRegion() {
    return this.bestRegions;
     // return this.navchange;
   }

   emitBestBandwidthRegion(bestBandwidthRegion: any) {
    this.bestBandwidthRegion = bestBandwidthRegion;
  }
  getBestBandwidthRegion() {
     return this.bestBandwidthRegion;
   }

   

}
