const path = require('path');

module.exports = function (plop) {
    const args = process.argv.slice(2);
    // tümü list create
    //npm run plop-bcall -- --name=product
    // list create
    //npm run plop-bc -- --name=employee-documentation
    // create
    //npm run plop-angular-create -- --child-name=list-scorecard-status
    // list
    //npm run plop-list -- --child-name=list-scorecard-status
    // list
    //npm run plop-service
    // dialog
    //npm run plop-dialog -- --name=secondment
    // list
    //npm run plop-exports
    //Angular
    let name = 'inventory-snapshot';
    let nameChildirinList = 'list';
    let nameChildirinCreate = 'create';
    let destPath = 'src/app/features/inventory-management/components';
    let destPathRequest = 'src/app/features/inventory-management/contracts/requests';
    let destPathResponse = 'src/app/features/inventory-management/contracts/responses';
    let destPathService = 'src/app/features/inventory-management/services';
    let destPathDialog = 'src/app/features/inventory-management/dialogs';
    let getPermission = 'GET.Reading.ÜrünstokanlıkgörüntüleritablosuListesiGetirir';
    let postPermission = 'POST.Writing.ÜrünstokanlıkgörüntüleritablosuEklemek';
    let updatePermission = 'PUT.Updating.ÜrünstokanlıkgörüntüleritablosuGüncelemek';
    let deletePermission = 'DELETE.Deleting.ÜrünstokanlıkgörüntüleritablosuSilme';
    let controllerName = 'InventorySnapshot';
    let getAction = 'GetAllInventorySnapshot';
    let getByIdAction = 'GetByIdInventorySnapshot';
    let getByUserIdAction = 'GetByUserIdInventorySnapshot';
    let postAction = 'CreateInventorySnapshot';
    let updateAction = 'UpdateInventorySnapshot';
    let deleteAction = 'DeleteInventorySnapshot';
    let authApiUrl = 'http://localhost:2029/stroreauth/api';
    let baseUrl = 'http://localhost:2029/storeapi/api';


      //Asp
      let application = 'StorePlatform';
      let folder = 'Cards';
      let tableDb = 'Card';
      let table = 't';

      //Asp Controller
      let nameController = 'card'; //{{nameController}}Controller
      let nameCon = 'müşteri';



    args.forEach(arg => {
      if (arg.startsWith('--name=')) {
        name = arg.split('=')[1];
      }
      if (arg.startsWith('--path=')) {
          destPath = arg.split('=')[1];
      }
      if (arg.startsWith('--path-request=')) {
          destPathRequest = arg.split('=')[1];
      }
      if (arg.startsWith('--path-response=')) {
          destPathResponse = arg.split('=')[1];
      }
      if (arg.startsWith('--path-service=')) {
          destPathService = arg.split('=')[1];
      }
      if (arg.startsWith('--path-dialog=')) {
          destPathDialog = arg.split('=')[1];
      }
      if (arg.startsWith('--child-name=')) {
          nameChildirinList = arg.split('=')[1];
      }
      if (arg.startsWith('--n-c=')) {
        nameController = arg.split('=')[1];
      }
    });


      const componentName = name.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
      const serviceName = name.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
      const featureName = destPath.split('/').find(part => part.includes('-')) || 'task-management';
      const childComponentName = nameChildirinList.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
      const childCreateName = nameChildirinCreate.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
      console.log('Captured name:', name);
      console.log('Destination path:', destPath);
      console.log('Destination path:', componentName);
      console.log('Child component name:', childComponentName);

      plop.setGenerator('component', {
        description: 'Yeni bir Angular bileşeni oluştur',
        prompts: [],
        actions: [
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${name}.component.ts`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/component.ts.hbs'),
                  data: { name ,componentName,
                    getPermission,postPermission,updatePermission,deletePermission
                   }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${name}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/component.html.hbs'),
                  data: { name ,componentName,nameChildirinList,
                    getPermission,postPermission,updatePermission,deletePermission
                   }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${name}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/component.scss.hbs'),
                  data: { name ,componentName }
              },
              //list
              {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.ts.hbs'),
                data: { name, componentName, nameChildirinList, childComponentName,
                  getPermission,postPermission,updatePermission,deletePermission
                 }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.html.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList, controllerName,
                    getPermission,postPermission,updatePermission,deletePermission
                   }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.scss.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList }
              },
              //Create
              {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${name}/${nameChildirinCreate}/${nameChildirinCreate}.component.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/create/component.ts.hbs'),
                data: { name: nameChildirinCreate, componentName: childCreateName, nameChildirinCreate, childCreateName,
                  getPermission,postPermission,updatePermission,deletePermission }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinCreate}/${nameChildirinCreate}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/create/component.html.hbs'),
                  data: { name, componentName, nameChildirinCreate, childCreateName,controllerName,getPermission,postPermission,updatePermission,deletePermission }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinCreate}/${nameChildirinCreate}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/create/component.scss.hbs'),
                  data: { name, componentName, nameChildirinCreate , childCreateName}
              },
        ]
      });


      plop.setGenerator('componentAll', {
        description: 'Yeni bir Angular bileşeni oluştur',
        prompts: [],
        actions: [
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${name}.component.ts`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/component.ts.hbs'),
                  data: { name ,componentName,
                    getPermission,postPermission,updatePermission,deletePermission
                   }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${name}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/component.html.hbs'),
                  data: { name ,componentName,nameChildirinList,
                    getPermission,postPermission,updatePermission,deletePermission
                   }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${name}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/component.scss.hbs'),
                  data: { name ,componentName }
              },
              //list
              {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.ts.hbs'),
                data: { name, componentName, nameChildirinList, childComponentName,
                  getPermission,postPermission,updatePermission,deletePermission
                 }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.html.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList, controllerName,
                    getPermission,postPermission,updatePermission,deletePermission
                   }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.scss.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList }
              },
              //Create
              {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${name}/${nameChildirinCreate}/${nameChildirinCreate}.component.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/create/component.ts.hbs'),
                data: { name: nameChildirinCreate, componentName: childCreateName, nameChildirinCreate, childCreateName,
                  getPermission,postPermission,updatePermission,deletePermission
                 }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinCreate}/${nameChildirinCreate}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/create/component.html.hbs'),
                  data: { name, componentName, nameChildirinCreate, childCreateName,controllerName,
                    getPermission,postPermission,updatePermission,deletePermission
                   }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinCreate}/${nameChildirinCreate}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/create/component.scss.hbs'),
                  data: { name, componentName, nameChildirinCreate , childCreateName}
              },
              // response class
              {
                type: 'add',
                path: path.resolve(__dirname, destPathResponse, `${name}-response.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/response/response.ts.hbs'),
                data: { name, componentName }
              },
              // request class
              {
                type: 'add',
                path: path.resolve(__dirname, destPathRequest, `request-${name}.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/request/request.ts.hbs'),
                data: { name, componentName }
              },
              // services
              {
                type: 'add',
                path: path.resolve(__dirname, destPathService, `${name}.service.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/service.ts.hbs'),
                data: { name, serviceName,controllerName,
                  getAction,getByIdAction,getByUserIdAction,postAction,updateAction,deleteAction
                 }
              },
              {
                type: 'add',
                path: path.resolve(__dirname, destPathService, `${name}.service.spec.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/service.spec.ts.hbs'),
                data: { name, serviceName,controllerName,
                  getAction,getByIdAction,getByUserIdAction,postAction,updateAction,deleteAction
                 }
              },
              // services export
              {
                type: 'add',
                path: path.resolve(__dirname, destPathService, `export-data-${name}.service.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/export-service.ts.hbs'),
                data: { name, serviceName,controllerName }
              },
              {
                type: 'add',
                path: path.resolve(__dirname, destPathService, `export-data-${name}.service.spec.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/export-service.spec.ts.hbs'),
                data: { name, serviceName,controllerName }
              }
        ]
      });

     // Generator for Api  component GetAll
     plop.setGenerator('list', {
      description: 'Yeni bir ASP create bileşeni oluştur',
      prompts: [],
      actions: [
            //list
            {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${nameChildirinList}/${nameChildirinList}.component.ts`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.ts.hbs'),
                  data: { name, componentName, nameChildirinList, childComponentName }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${nameChildirinList}/${nameChildirinList}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.html.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList, controllerName }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${nameChildirinList}/${nameChildirinList}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.scss.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList }
              },
      ]
     });







      // Generator for list component
      plop.setGenerator('lc', {
          description: 'Yeni bir Angular list bileşeni oluştur',
          prompts: [],
          actions: [
             {
              type: 'add',
              path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.ts`),
              templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.ts.hbs'),
              data: { name, componentName, nameChildirinList, childComponentName }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.html.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList, controllerName }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, destPath, `${name}/${nameChildirinList}/${nameChildirinList}.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/components/List/component.scss.hbs'),
                  data: { name: nameChildirinList, componentName: childComponentName, nameChildirinList }
              }
          ]
      });

      // servise oluşturmak  için  ekledim
      plop.setGenerator('sr', {
          description: 'Yeni bir Angular list bileşeni oluştur',
          prompts: [],
          actions: [
           // response class
           {
            type: 'add',
            path: path.resolve(__dirname, 'src/app/contracts/responses', `${name}-response.ts`),
            templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/response/response.ts.hbs'),
            data: { name, componentName }
          },
          // request class
          {
            type: 'add',
            path: path.resolve(__dirname, 'src/app/contracts/requests', `request-${name}.ts`),
            templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/request/request.ts.hbs'),
            data: { name, componentName }
          },
          // services
          {
            type: 'add',
            path: path.resolve(__dirname, destPathService, `${name}.service.ts`),
            templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/service.ts.hbs'),
            data: { name, serviceName,controllerName,
              getAction,getByIdAction,getByUserIdAction,postAction,updateAction,deleteAction
             }
          },
          {
            type: 'add',
            path: path.resolve(__dirname, destPathService, `${name}.service.spec.ts`),
            templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/service.spec.ts.hbs'),
            data: { name, serviceName,controllerName,
              getAction,getByIdAction,getByUserIdAction,postAction,updateAction,deleteAction
             }
          },
        ]
      });


      // servise
      plop.setGenerator('exports', {
          description: 'Yeni bir Angular export servise bileşeni oluştur',
          prompts: [],
          actions: [
            // services export
            {
              type: 'add',
              path: path.resolve(__dirname, destPathService, `export-data-${name}.service.ts`),
              templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/export-service.ts.hbs'),
              data: { name, serviceName,controllerName }
            },
            {
              type: 'add',
              path: path.resolve(__dirname, destPathService, `export-data-${name}.service.spec.ts`),
              templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/export-service.spec.ts.hbs'),
              data: { name, serviceName,controllerName }
            }
          ]
      });


      // Generator for service
      plop.setGenerator('service', {
        description: 'Yeni bir Angular service bileşeni oluştur',
        prompts: [],
        actions: [
               // response class
               {
                type: 'add',
                path: path.resolve(__dirname, destPathResponse, `${name}-response.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/response/response.ts.hbs'),
                data: { name, componentName }
              },
              // request class
              {
                type: 'add',
                path: path.resolve(__dirname, destPathRequest, `request-${name}.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/request/request.ts.hbs'),
                data: { name, componentName }
              },
              // services
              {
                type: 'add',
                path: path.resolve(__dirname, destPathService, `${name}.service.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/service.ts.hbs'),
                data: { name, serviceName,controllerName,
                  getAction,getByIdAction,getByUserIdAction,postAction,updateAction,deleteAction
                 }
              },
              {
                type: 'add',
                path: path.resolve(__dirname, destPathService, `${name}.service.spec.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/service.spec.ts.hbs'),
                data: { name, serviceName,controllerName,
                  getAction,getByIdAction,getByUserIdAction,postAction,updateAction,deleteAction
                 }
              },
        ]
    });


      // Generator for list component
      plop.setGenerator('class', {
        description: 'Yeni bir Angular list bileşeni oluştur',
        prompts: [],
        actions: [
               // response class
               {
                  type: 'add',
                  path: path.resolve(__dirname, 'src/app/contracts/responses', `${name}-response.ts`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/response/response.ts.hbs'),
                  data: { name, componentName }
                },
                // request class
                {
                  type: 'add',
                  path: path.resolve(__dirname, 'src/app/contracts/requests', `request-${name}.ts`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/contracts/request/request.ts.hbs'),
                  data: { name, componentName }
                },
          ]
      });


      // Generator for list component
      plop.setGenerator('di', {
            description: 'Yeni bir Angular list bileşeni oluştur',
            prompts: [],
            actions: [
              {
                type: 'add',
                path: path.resolve(__dirname, 'src/app/dialogs', `${name}-create-dialog/${name}-create-dialog.component.ts`),
                templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/dialogs/component.ts.hbs'),
                data: { name ,componentName }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, 'src/app/dialogs', `${name}-create-dialog/${name}-create-dialog.component.html`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/dialogs/component.html.hbs'),
                  data: { name ,componentName,nameChildirinList }
              },
              {
                  type: 'add',
                  path: path.resolve(__dirname, 'src/app/dialogs', `${name}-create-dialog/${name}-create-dialog.component.scss`),
                  templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/dialogs/component.scss.hbs'),
                  data: { name ,componentName }
              },
            ]
      });



      // Generator for dialog component
      plop.setGenerator('dialog', {
        description: 'Yeni bir Angular dialog bileşeni oluştur',
        prompts: [],
        actions: [
          {
            type: 'add',
            path: path.resolve(__dirname, destPathDialog, `${name}/${name}-create-dialog.component.ts`),
            templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/dialogs/component.ts.hbs'),
            data: { name, componentName, serviceName, featureName }
          },
          {
              type: 'add',
              path: path.resolve(__dirname, destPathDialog, `${name}/${name}-create-dialog.component.html`),
              templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/dialogs/component.html.hbs'),
              data: { name, componentName, serviceName, featureName, nameChildirinList }
          },
          {
              type: 'add',
              path: path.resolve(__dirname, destPathDialog, `${name}/${name}-create-dialog.component.scss`),
              templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/dialogs/component.scss.hbs'),
              data: { name, componentName, serviceName, featureName }
          },
          {
            type: 'add',
            path: path.resolve(__dirname, destPathDialog, `${name}/${name}-create-dialog.component.spec.ts`),
            templateFile: path.resolve(__dirname, 'plop-templates/Angular/templates/service/service.spec.ts.hbs'),
            data: { name, componentName, serviceName, featureName, baseUrl, authApiUrl }
        },
        ]
  });











      // Generator for Api  component controller
      plop.setGenerator('controller', {
      description: 'Yeni bir ASP controller bileşeni oluştur',
      prompts: [],
      actions: [
          {
              type: 'add',
              path: path.resolve(__dirname, `StorePlatform.API/Controllers/${nameController}Controller.cs`),
              templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/controller/controller.hbs'),
              data: { nameCon,nameController }
          },
      ]
      });

      // Generator for Api  component GetAll
      plop.setGenerator('getall', {
        description: 'Yeni bir ASP GetAll bileşeni oluştur',
        prompts: [],
        actions: [
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryHandler.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Queries/GetAll/queryHandler.hbs'),
                data: { name,folder,application,tableDb,table }
            },
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryRequest.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Queries/GetAll/queryRequest.hbs'),
                data: { name,folder,application,tableDb,table }
            },
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryResponse.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Queries/GetAll/queryResponse.hbs'),
                data: { name,folder,application,tableDb,table }
            },
        ]
      });


      // Generator for Api  component GetAll
      plop.setGenerator('getby', {
        description: 'Yeni bir ASP GetById bileşeni oluştur',
        prompts: [],
        actions: [
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryHandler.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Queries/GetById/queryHandler.hbs'),
                data: { name,folder,application,tableDb,table }
            },
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryRequest.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Queries/GetById/queryRequest.hbs'),
                data: { name,folder,application,tableDb,table }
            },
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryResponse.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Queries/GetById/queryResponse.hbs'),
                data: { name,folder,application,tableDb,table }
            },
        ]
      });

      // Generator for Api  component GetAll
      plop.setGenerator('create', {
      description: 'Yeni bir ASP create bileşeni oluştur',
      prompts: [],
      actions: [
          {
              type: 'add',
              path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryHandler.cs`),
              templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Create/queryHandler.hbs'),
              data: { name,folder,application,tableDb,table }
          },
          {
              type: 'add',
              path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryRequest.cs`),
              templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Create/queryRequest.hbs'),
              data: { name,folder,application,tableDb,table }
          },
          {
              type: 'add',
              path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryResponse.cs`),
              templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Create/queryResponse.hbs'),
              data: { name,folder,application,tableDb,table }
          },
      ]
      });

      // Generator for Api  component GetAll
      plop.setGenerator('delete', {
        description: 'Yeni bir ASP delete bileşeni oluştur',
        prompts: [],
        actions: [
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryHandler.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Delete/queryHandler.hbs'),
                data: { name,folder,application,tableDb,table }
            },
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryRequest.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Delete/queryRequest.hbs'),
                data: { name,folder,application,tableDb,table }
            },
            {
                type: 'add',
                path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryResponse.cs`),
                templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Delete/queryResponse.hbs'),
                data: { name,folder,application,tableDb,table }
            },
        ]
      });


      // Generator for Api  component GetAll
      plop.setGenerator('update', {
            description: 'Yeni bir ASP update bileşeni oluştur',
            prompts: [],
            actions: [
                {
                    type: 'add',
                    path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryHandler.cs`),
                    templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Update/queryHandler.hbs'),
                    data: { name,folder,application,tableDb,table }
                },
                {
                    type: 'add',
                    path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryRequest.cs`),
                    templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Update/queryRequest.hbs'),
                    data: { name,folder,application,tableDb,table }
                },
                {
                    type: 'add',
                    path: path.resolve(__dirname, destPath, `${folder}/${name}/${name}QueryResponse.cs`),
                    templateFile: path.resolve(__dirname, 'plop-templates/Asp/Features/Commands/Update/queryResponse.hbs'),
                    data: { name,folder,application,tableDb,table }
                },
            ]
      });

};
