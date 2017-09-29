import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {YiiService} from './yii.service';
import {OrdsService} from './ords.service';
import {DemoService} from './demo.service';
import {RestlessService} from './restless.service';
import {ICrudService, Settings} from '../types/interfaces';


@Injectable()
export class MainService {
  private static instance: ICrudService = null;

  // Return the instance of the service
  public static getInstance(settings: Settings, http: Http): ICrudService {
    if (MainService.instance === null) {

      if (settings.type === 'yii') {
        MainService.instance = new YiiService(http);
      } else if (settings.type === 'ords') {
        MainService.instance = new OrdsService(http);
      } else if (settings.type === 'restless') {
        MainService.instance = new RestlessService(http);
      } else if (settings.type === 'demo') {
        MainService.instance = new DemoService();
      } else {
        MainService.instance = new YiiService(http);
      }
      MainService.instance.url = settings.api;
      MainService.instance.primaryKey = settings.primaryKey;
      MainService.instance.settings = settings;
    }
    return MainService.instance;
  }

  constructor() {
  }

}
