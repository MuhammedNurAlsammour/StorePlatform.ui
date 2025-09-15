export const environment = {
  productions: false,
  developments: false,
  bolus: true,
  apiUrls: {
    baseUrl: 'http://localhost:2029/storeapi/api',
    whUrl: 'http://localhost:2029/storeapi/api',
    authApiUrl: 'http://localhost:2029/stroreauth/api',
    secondaryBaseUrl: 'http://localhost:2029/api/api',
    primaryBaseUrl: 'http://localhost:2029/api/api',
  },
  allowedDomains: [
    'localhost',
    'localhost:2029',
    'localhost/api',
    'localhost/authapi',
    'localhost/GuidePlatform',
  ],
};
