import _ from 'lodash';
import { PropTypes } from 'frint';
import React from 'react';

/**
 * Creates a component wrapper that implements `getChildContext` and `childContextTypes`.
 * @param  {Component} Component  a React component class
 * @param  {Object}    context    the context stub
 * @return {Component} a component wrapper that provides a context stub
 */
function stubContext(Component, context = {}) {
  const childContextTypes = _.mapValues(context, () => PropTypes.any);
  const childContextMixin = {
    childContextTypes,
    getChildContext: () => context,
  };

  const ContextWrapper = React.createClass({
    displayName: `${Component.displayName}Stub`,
    render() {
      return React.Children.only(this.props.children);
    },
    ...childContextMixin,
  });

  return React.createClass({
    displayName: `${Component.displayName}StubWrapper`,
    render() {
      return (
        <ContextWrapper>
          <Component {...this.props} />
        </ContextWrapper>
      );
    },
    ...childContextMixin,
  });
}

/**
 * Create a component stub for frint components so they can be mounted
 * and tested isolately from the App.
 * @param  {Component}  Component           the component under test
 * @param  {Object}     [opts]              options object
 * @param  {Object}     [opts.appOptions]   app options stubs
 * @param  {Object}     [opts.dispatch]     dispatch to action stubs
 * @param  {Object}     [opts.factories]    factories stubs
 * @param  {Object}     [opts.services]     services stubs
 * @param  {Object}     [opts.state]        state passed to mapStateToProps
 * @param  {Object}     [opts.app]          app stub
 * @param  {Object}     [opts.store]        store stub
 * @return {Component}  a testable component that uses only stubs
 */
export default function createComponentStub(Component, opts) {
  const options = {
    appOptions: {},
    dispatch: {},
    factories: {},
    services: {},
    state: {},
    ...opts,
  };

  const {
    app = {
      readableApps: [],
      getService: (name) => {
        const instance = options.services[name];
        if (!instance) {
          throw new Error(
            `Attempt to use service '${name}' in test context, but no stubs have been provided.`
          );
        }
        return instance;
      },
      getFactory: (name) => {
        const instance = options.factories[name];
        if (!instance) {
          throw new Error(
            `Attempt to use factory '${name}' in test context, but no stubs have been provided.`
          );
        }
        return instance;
      },  
      getOption: (key) => options.appOptions[key],
    },
    store = {
      getState() { return options.state; },
      dispatch: _.noop,
      subscribe() { return _.noop; }
    },
  } = options;

  _.each(options.dispatch, (value, key) => Component.stub(key, value));
  return stubContext(Component, { app, store });
}
