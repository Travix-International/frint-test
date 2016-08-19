# createComponentStub(Component, [options])

Creates a testable component that can be safely rendered using jsdom.  `createComponentStub` allows you to replace dependencies provided by your application with your own test stubs.

## Arguments

1. `Component` ([Component](https://travix-international.github.io/frint/docs/api/createComponent.html)): A frint component that you want to test

1. `[options]` (Object): stub options

1. `[options.app]` (Object|Function): application stub.  If you provide this options, you will have to create your own App stub and frint-test will ignore these options: `appOptions`, `factories`, `models` and `services`

1. `[options.appOptions]` (Object): application options stubs. frint-test will configure the App stub to return values from this object when requested via [getOption](https://travix-international.github.io/frint/docs/api/App.html#getoption-optionname) method, i.e. `app.getOption(name)`, whereas the name of the option must match a value contained in `options.appOptions`.  An attempt to call `app.getOption` in your unit tests passing a non-mapped `appOption` will result in an error thrown by the App stub.

1. `[options.factories]` (Object): factories stubs.  frint-test will configure the App stub to return factories stubs from this object when required via [getFactory](https://travix-international.github.io/frint/docs/api/App.html#getfactory-name) method, i.e. `app.getFactory(name)`, whereas the name of the factory must match a stub contained in `options.factories`.  An attempt to call `app.getFactory` in your unit tests passing a non-mapped `factory` will result in an error thrown by the App stub.

1. `[options.mapAppToProps]` (Function): a function that replaces `app` function provided to [mapToProps](https://travix-international.github.io/frint/docs/api/mapToProps.html#app).  This function receives two arguments: the App stub and a the original mapToProps function.  Like the original mapAppToProps, this function is expected to return an Object containing values that will be inject in your component via props. If you call the function provided as the last argument, the actual function is called.

1. `[options.models]` (Object): models stubs.  frint-test will configure the App stub to return model instances provided in this object when required via [getModel](https://travix-international.github.io/frint/docs/api/App.html#getmodel-name) method, i.e. `app.getModel(name)`, whereas the name of the model must match a model contained in `options.models`. An attempt to call `app.getModel` in your unit tests passing a non-mapped `model` will result in an error throw by the App stub.

1. `[options.services]` (Object): service stubs.  frint-test will configure the App stub to return services stubs from this object when required via [getService](https://travix-international.github.io/frint/docs/api/App.html#getservice-name) method, i.e. `app.getService(name)`, whereas the name of the service must match a stub contained in `options.services`.  An attempt to call `app.getService` in your unit tests passing a non-mapped `service` will result in an error thrown by the App stub.

1. `[options.state]` (any): state stub.  The state of your component before it is mounted.

1. `[options.store]` (Object|Function): store stub.  If you provide your own store stub, frint-test will ignore the parameter `options.state`.

## Returns

([Component](https://travix-international.github.io/frint/docs/api/createComponent.html)): A testable frint component

## Example

```js
import { createComponentStub } from 'frint-test';
import MyComponent from '../src/components/MyComponent';
import sinon from 'sinon';

const ComponentStub = createComponentStub(MyComponent, {
  appOptions: {
    appName: 'Fake app name',
  },
  factories: {
    myFactory: sinon.stub(),
  },
  mapAppToProps(app, invoke) {
    return {};
  },
  models: {
    configuration: sinon.stub(),
  },
  services: {
    shoppingCart: sinon.stub(),
  },
  state: {
    counter: 0,
  },
});

```

## Related functions

* [resetStubs](resetStubs.md)
