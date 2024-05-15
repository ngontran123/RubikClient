import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HandleService } from '../services/handle.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
             HandleService
  ]
};
