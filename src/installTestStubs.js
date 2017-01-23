import _ from 'lodash';
import { createComponent, h } from 'frint';

let testStubsAlreadyInstalled = false;

export function ensureTestStubsInstalled(calledFunctionName) {
  if (!testStubsAlreadyInstalled) {
    throw new Error(
      `Attempt to call '${calledFunctionName}' before invoking 'installTestStubs' in test set up.`
    );
  }
}

/**
 * Replaces frint exported functions with stubs.
 * This function needs to be called before all unit tests.
 */
export default function installTestStubs() {
  if (testStubsAlreadyInstalled) {
    // eslint-disable-next-line no-console, max-len
    console.error('The test stubs are already installed, you do not have to call `installTestStubs` function again!');
    return;
  }

  const frint = require('frint'); // eslint-disable-line global-require

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

    return Component => createComponent({
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

  testStubsAlreadyInstalled = true;
}
