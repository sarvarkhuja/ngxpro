import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { NxpPortalService } from '@ngxpro/cdk';
import { NxpPopupService } from '@ngxpro/cdk/components/root';
import { NXP_DOC_PAGES, NXP_DOC_TITLE } from '@ngxpro/addon-doc-lib/tokens';
import { appRoutes } from './app.routes';
import { SHOWCASE_PAGES } from './showcase-pages';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    { provide: NxpPortalService, useExisting: NxpPopupService },
    { provide: NXP_DOC_PAGES, useValue: SHOWCASE_PAGES },
    { provide: NXP_DOC_TITLE, useValue: 'nxp showcase · ' },
  ],
};
