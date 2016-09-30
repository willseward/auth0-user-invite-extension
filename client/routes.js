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
        component: containers.ConfigurationContainer,
        onEnter: () => {
          return $('#modal-new-users').modal('hide'); // closes any open modals; else 'modal-open' css rule is still in place and scroll does not work
        }
      }
    ]
  } ]
};
