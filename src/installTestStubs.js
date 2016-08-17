import _ from 'lodash';
import React from 'react';

/**
 * Replaces frint exported functions with stubs.
 * This function needs to be called before all unit tests.
 */
export default function installTestStubs() {
  const frint = require('frint');

  // stores a copy of the original mapToProps implementation
  const { mapToProps } = frint;

  frint.mapToProps = function mapToPropsStub(opts) {
    const defaultOptions = {
      dispatch: {},
    };

    const overrides = {
      options: {
        withRef: false, // needed in test context
      },
    };

    const options = Object.assign({}, defaultOptions, opts, overrides);
    const mapToDispatch = _.clone(options.dispatch);

    return (Component) => React.createClass({
      displayName: `Fake${Component.name}`,
      statics: {
        stub(key, fnStub) {
          options.dispatch[key] = fnStub;
        },
        resetStubs() {
          options.dispatch = mapToDispatch; 
        }
      },
      render() {
        const WrappedComponent = mapToProps(options)(Component);
        return <WrappedComponent {...this.props} />;
      },
    });
  };
}
