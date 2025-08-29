export const environment = {
  productions: false,
  developments: true,
  bolus: false,
  // apiUrls: {
  //   baseUrl: 'http://localhost:2029/storeapi/api',
  //   whUrl: 'http://localhost:2029/storeapi/api',
  //   authApiUrl: 'http://localhost:2029/stroreauth/api',
  //   secondaryBaseUrl: 'http://localhost:2029/api/api',
  //   primaryBaseUrl: 'http://localhost:2029/api/api'
  // },
  // // apiUrls: {
  // //   baseUrl: 'http://localhost:5263/api',
  // //   whUrl: 'http://localhost:5263/api',
  // //   authApiUrl: 'http://localhost:7007/api',
  // //   secondaryBaseUrl: 'http://localhost:5263/api',
  // //   primaryBaseUrl: 'http://localhost:5263/api',
  // // },
  // allowedDomains: [
  //   'localhost',
  //   'localhost:2029',
  //   'localhost:5263',
  //   'localhost:7007',
  //   'localhost/api',
  //   'localhost/authapi',
  //   'localhost/storeplatform',
  // ],
  apiUrls: {
    baseUrl: 'http://localhost:3000/storeapi/api',
    whUrl: 'http://localhost:3000/storeapi/api',
    authApiUrl: 'http://localhost:3000/storeauth/api',
    secondaryBaseUrl: 'http://localhost:3000/sharedapi/api',
    primaryBaseUrl: 'http://localhost:3000/sharedapi/api',
  },
  allowedDomains: [
    'localhost',
    'localhost:3000',
    'localhost:3000/storeauth',
    'localhost:3000/storeapi',
    'localhost:3000/sharedapi',
  ],
};
