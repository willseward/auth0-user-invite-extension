import * as containers from './containers';

export default {
  childRoutes: [ {
    path: '/',
    component: containers.Root,
    indexRoute: {
      component: containers.App
    },
    childRoutes: [
      {
        path: 'configuration',
        component: containers.ConfigurationContainer
      }
    ]
  } ]
};
