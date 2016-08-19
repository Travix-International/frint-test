import { expect } from 'chai';
import { createComponent, mapToProps } from 'frint';
import sinon from 'sinon';

import createComponentStub from '../src/createComponentStub';
import resetStubs from '../src/resetStubs';

describe('resetStubs', function() {
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
      }).to.throw(`Invalid argument: 'Component'`);
    });
  });

  it('should error if Component is a pure react component', () => {
    const ReactComponent = React.createClass({
      render() {},
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
    sinon.stub(ConnectedComponent, 'resetStubs');
    resetStubs(ConnectedComponent);
    expect(ConnectedComponent.resetStubs).to.have.been.calledOnce();
  });
});
