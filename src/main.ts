import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { createAuthConfig } from '@coder-pioneers/auth';
import { createSharedConfig } from '@coder-pioneers/shared';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
const CONFIG = {
  baseUrl: environment.apiUrls.baseUrl,
  secondaryBaseUrl: environment.apiUrls.secondaryBaseUrl,
  authApiUrl: environment.apiUrls.authApiUrl,
  primaryBaseUrl: environment.apiUrls.primaryBaseUrl,
  allowedDomains: [
    '192.168.1.232',
    '192.168.1.232:2025',
    '192.168.1.232:2025/',
    '10.14.7.111',
    '10.14.7.111:2025',
    '10.14.7.111:2025/',
    '192.168.1.232',
    '192.168.1.232:2024',
    '193.3.35.117',
    '193.3.35.117:443',
    '193.3.35.117:80',
    'hrefpro.kardelenyazilim.com',
    'hrefpro.kardelenyazilim.com/api',
    'hrefpro.kardelenyazilim.com/authapi',
    'localhost',
    'localhost:2029',
    'localhost/storeapi',
    'localhost/authapi',
    'localhost/GuidePlatform',
    'localhost:5263',
    'localhost:7007',
    'localhost:5263/api',
    'localhost:7007/authapi',
    'localhost:5263/GuidePlatform',
    'localhost',
    'localhost:3000',
    'localhost:3000/storeauth',
    'localhost:3000/storeapi',
    'localhost:3000/api',
    'localhost:2029',
    'localhost:2029/storeauth',
    'localhost:2029/storeapi',
    'localhost:2029/api',
    '72.60.33.111:3000',
    '72.60.33.111:3000/storeauth',
    '72.60.33.111:3000/storeapi',
    '72.60.33.111:3000/sharedapi',
  ],
};

const SPECIFIC_CONFIG = {
  ...CONFIG,
  authApiUrl: environment.apiUrls.authApiUrl,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    createSharedConfig(CONFIG),
    createAuthConfig(CONFIG),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    JwtHelperService,
    { provide: 'authApiUrl', useValue: SPECIFIC_CONFIG.authApiUrl },
    { provide: 'baseUrl', useValue: SPECIFIC_CONFIG.baseUrl },
    { provide: 'secondaryBaseUrl', useValue: SPECIFIC_CONFIG.secondaryBaseUrl },
    { provide: 'primaryBaseUrl', useValue: SPECIFIC_CONFIG.primaryBaseUrl },
  ],
};

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
