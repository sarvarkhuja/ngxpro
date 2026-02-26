import { Injectable } from '@angular/core';
import { NxpPortalService } from '../portal.service';

/**
 * Portal service for popup overlays (tooltips, dropdowns, etc.).
 * Extends NxpPortalService with providedIn root for global access.
 */
@Injectable({ providedIn: 'root' })
export class NxpPopupService extends NxpPortalService {}
