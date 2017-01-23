import _ from 'lodash';
import { createApp } from 'frint';
import React from 'react';

import { ensureTestStubsInstalled } from './installTestStubs';

/**
 * Create a component stub for frint components so they can be mounted
 * and tested isolately from the App.
 * @param  {Component}  Component           the component under test
 * @param  {Object}     [opts]              options object
 * @param  {Object}     [opts.appOptions]   app options stubs
 * @param  {Object}     [opts.dispatch]     dispatch to action stubs
 * @param  {Object}     [opts.factories]    factories stubs
 * @param  {Object}     [opts.models]       models stubs
 * @param  {Object}     [opts.services]     services stubs
 * @param  {Object}     [opts.state]        state passed to mapStateToProps
 * @param  {Object}     [opts.app]          app stub
 * @param  {Object}     [opts.store]        store stub
 * @return {Component}  a testable component that uses only stubs
 */
export default function createComponentStub(Component, opts) {
  ensureTestStubsInstalled('createComponentStub');
  const options = {
    mapAppToProps: (app, fn) => fn(app),
    appOptions: {},
    dispatch: {},
    factories: {},
    modelAttributes: {},
    models: {},
    services: {},
    state: {},
    ...opts,
  };

  const createDefaultFakeApp = () => {
    const fakeAppOptions = {
      appId: 'fake_app',
      component: Component,
      enableLogger: false,
      ...options.appOptions,
      initialState: options.state,
      modelAttributes: options.modelAttributes,
      ...(['factories', 'models', 'services'].reduce((mergeOptions, key) => {
        return {
          ...mergeOptions,
          [key]: _.mapValues(options[key], (stub) => {
            return function FakeStubClass() { return stub; };
          }),
        };
      }, {})),
    };

    const FakeApp = createApp(fakeAppOptions);

    class TestApp extends FakeApp {
      getFactory(name) {
        if (!{}.hasOwnProperty.call(this.options.factories, name)) {
          throw new Error(
            `Attempt to use factory '${name}' in test context, but no stubs have been provided.`
          );
        }
        return super.getFactory(name);
      }

      getModel(name) {
        if (!{}.hasOwnProperty.call(this.options.models, name)) {
          throw new Error(
            `Attempt to use model '${name}' in test context, but no stubs have been provided.`
          );
        }
        return super.getModel(name);
      }

      getService(name) {
        if (!{}.hasOwnProperty.call(this.options.services, name)) {
          throw new Error(
            `Attempt to use factory '${name}' in test context, but no stubs have been provided.`
          );
        }
        return super.getService(name);
      }
    }

    return new TestApp({ name: 'TestApp' });
  };

  const {
    app = createDefaultFakeApp(),
    mapAppToProps,
  } = options;

  Component.stubMapAppToProps(appFn => mapAppToProps(app, appFn));
  _.each(options.dispatch, (value, key) => Component.stubMapDispatchToProps(key, value));

  const WrapperComponent = React.createClass({
    componentWillMount() {
      app.beforeMount();
    },

    componentDidMount() {
      app.afterMount();
    },

    componentWillUnmount() {
      app.beforeUnmount();
    },

    render() {
      const AppComponent = app.render(this.props);

      return <AppComponent />;
    },
  });

  return WrapperComponent;
}
