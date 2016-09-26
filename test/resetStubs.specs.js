import { expect } from 'chai';
import { stub } from 'sinon';
import { createComponent, mapToProps } from 'frint';

import resetStubs from '../src/resetStubs';

describe('resetStubs', function () { // eslint-disable-line prefer-arrow-callback
  const INVALID_COMPONENTS = [
    { invalidComponent: null, description: 'null' },
    { invalidComponent: undefined, description: 'undefined' },
    { invalidComponent: {}, description: 'plain object' },
    { invalidComponent: <div></div>, description: 'react element' },
  ];

  INVALID_COMPONENTS.forEach(({ invalidComponent, description }) => {
    it(`should error if Component is not a valid frint component: '${description}'`, () => {
      expect(() => {
        resetStubs(invalidComponent);
      }).to.throw('Invalid argument: "Component"');
    });
  });

  it('should error if Component is a pure react component', () => {
    const ReactComponent = React.createClass({
      render() { return undefined; },
    });
    expect(() => {
      resetStubs(ReactComponent);
    }).to.throw('Cannot reset stubs because component is not a stubbed component');
  });

  it('should reset stubs of valid stubbed frint component', () => {
    const FrintComponent = createComponent({
      render() {},
    });
    const ConnectedComponent = mapToProps({})(FrintComponent);
    stub(ConnectedComponent, 'resetStubs');
    resetStubs(ConnectedComponent);
    expect(ConnectedComponent.resetStubs).to.have.been.calledOnce();
  });
});
