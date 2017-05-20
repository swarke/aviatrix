import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { APIRequest, APIUrls } from '../models';
import { APIMethod, ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';

declare const AWS: any;



@Injectable()
/**
 * @brief      Class for activities service.
 */
export class DashboardService {

  constructor(private _apiService: ApiService) {
    //this.createAWS();
    
  }

  getInventory(inventoryPath: any) {
    //'src/data/inventory.json'
    const apiRequest: APIRequest = new APIRequest('data/inventory.json', APIMethod.GET);
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

  createAWS() {
    AWS.config.credentials  = new AWS.Credentials({
      accessKeyId: 'AKIAJJJILAZL5ALJMD3A', secretAccessKey: '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'
    });

    AWS.config.region = 'us-west-2';

    var ses = new AWS.SES();

     var params = {
      Source:'sachin.warke@opcito.com',
      Destination:{
          'ToAddresses': [
              'chaitanya.deshpande@opcito.com',
          ],
      },
      Message:{
          'Subject': {
              'Data': 'Test Email',
          },
          'Body': {
              'Html': {
                  'Data': '<b> Success</b>',
              },
          }
      }
  
     };
 ses.sendEmail(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
   /*
   data = {
    MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
   }
   */
 });

    // console.log("Creds: " + JSON.stringify(creds));
  }

}
