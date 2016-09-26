import _ from 'lodash';

import { ensureTestStubsInstalled } from './installTestStubs';

/**
 * Reset component stubs
 * @param {Component} Component   a component stubbed using `createComponentStub`
 */
export default function resetStubs(Component) {
  ensureTestStubsInstalled('resetStubs');
  if (!_.isFunction(Component)) {
    throw new Error('Invalid argument: "Component"');
  }
  if (!_.isFunction(Component.resetStubs)) {
    throw new Error('Cannot reset stubs because component is not a stubbed component');
  }
  Component.resetStubs();
}
