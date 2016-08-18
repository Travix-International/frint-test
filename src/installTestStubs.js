import _ from 'lodash';
import React from 'react';

/**
 * Replaces frint exported functions with stubs.
 * This function needs to be called before all unit tests.
 */
export default function installTestStubs() {
  const frint = require('frint');

  // keeps a copy of the original mapToProps implementation
  const { mapToProps } = frint;

  frint.mapToProps = function mapToPropsStub(opts) {
    const defaultOptions = {
      app: () => {},
      dispatch: {},
    };

    const overrides = {
      options: {
        withRef: false, // needed in test context
      },
    };

    const options = Object.assign({}, defaultOptions, opts, overrides);
    const stubsCleanUp = [];

    return (Component) => React.createClass({
      displayName: `Fake${Component.name}`,
      statics: {
        stubMapDispatchToProps(key, fnStub) {
          const mapToDispatch = _.clone(options.dispatch);
          options.dispatch[key] = fnStub;
          stubsCleanUp.push(() => {
            options.dispatch = mapToDispatch;
          });
        },
        stubMapAppToProps(fnStub) {
          const { app } = options;
          options.app = () => fnStub(app);
          stubsCleanUp.push(() => {
            options.app = app;
          });
        },
        resetStubs() {
          while (stubsCleanUp.length) {
            const fn = stubsCleanUp.pop();
            fn();
          }
        },
      },
      render() {
        const WrappedComponent = mapToProps(options)(Component);
        return <WrappedComponent {...this.props} />;
      },
    });
  };
}
