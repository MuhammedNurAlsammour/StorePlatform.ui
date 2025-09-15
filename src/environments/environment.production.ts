export const environment = {
  productions: true,
  developments: false,
  bolus: false,
  apiUrls: {
    baseUrl: 'http://72.60.33.111:3000/storeapi/api',
    whUrl: 'http://72.60.33.111:3000/storeapi/api',
    authApiUrl: 'http://72.60.33.111:3000/storeauth/api',
    secondaryBaseUrl: 'http://72.60.33.111:3000/sharedapi/api',
    primaryBaseUrl: 'http://72.60.33.111:3000/sharedapi/api',
  },
  allowedDomains: [
    '72.60.33.111',
    '72.60.33.111:3000',
    '72.60.33.111/sharedapi',
    '72.60.33.111/authapi',
    '72.60.33.111/GuidePlatform',
  ],
};
