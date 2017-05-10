import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { APIRequest, APIUrls } from '../models';
import { APIMethod, ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
/**
 * @brief      Class for activities service.
 */
export class DashboardService {

  constructor(private _apiService: ApiService) {
  }

  getInventory(inventoryPath: any) {
    //'src/data/inventory.json'
    const apiRequest: APIRequest = new APIRequest(inventoryPath, APIMethod.GET);
    return this._apiService.executeAPI(apiRequest);
  }


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
  
}