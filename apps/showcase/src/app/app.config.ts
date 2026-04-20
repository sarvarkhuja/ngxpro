import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { NxpPortalService } from '@nxp/cdk';
import { NxpPopupService } from '@nxp/cdk/components/root';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    { provide: NxpPortalService, useExisting: NxpPopupService },
  ],
};
