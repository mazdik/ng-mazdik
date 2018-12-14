import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtTranslateService } from './dt-translate.service';
import { DtTranslatePipe } from './dt-translate.pipe';

export interface DtTranslateModuleConfig {
  service?: Provider;
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DtTranslatePipe],
  exports: [DtTranslatePipe]
})
export class DtTranslateModule {

  static forRoot(config: DtTranslateModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: DtTranslateModule,
      providers: [
        config.service || { provide: DtTranslateService, useClass: DtTranslateService }
      ]
    };
  }

  static forChild(config: DtTranslateModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: DtTranslateModule,
      providers: [
        config.service || { provide: DtTranslateService, useClass: DtTranslateService }
      ]
    };
  }

}
