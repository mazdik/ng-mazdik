import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {YiiService} from './yii.service';
import {OrdsService} from './ords.service';
import {DemoService} from './demo.service';
import {RestlessService} from './restless.service';
import {ICrudService, Settings} from '../types/interfaces';


@Injectable()
export class MainService {

  public static getInstance(settings: Settings, http: Http): ICrudService {
    let instance: ICrudService

    if (settings.type === 'yii') {
      instance = new YiiService(http);
    } else if (settings.type === 'ords') {
      instance = new OrdsService(http);
    } else if (settings.type === 'restless') {
      instance = new RestlessService(http);
    } else if (settings.type === 'demo') {
      instance = new DemoService();
    } else {
      instance = new YiiService(http);
    }

    instance.url = settings.api;
    instance.primaryKey = settings.primaryKey;
    instance.settings = settings;

    return instance;
  }

  constructor() {
  }

}
