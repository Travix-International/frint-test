import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { createComponent, mapToProps } from 'frint';
import createComponentStub from '../src/createComponentStub';

describe("createComponentStub :: factories", function() {
  const TestComponent = createComponent({
    render() {
      const { foo } = this.props;
      return <button onClick={ () => foo.doSomething() } />;
    },
  });

  const FakeComponent = mapToProps({
    factories: {
      foo: 'bar',
    },
  })(TestComponent);

  const FooFactory = {
    doSomething() { },
  };

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(FooFactory, 'doSomething');
    this.cleanup = require('jsdom-global');
  });

  afterEach(() => {
    FakeComponent.resetStubs();
    sandbox.restore();
    this.cleanup()
  });

  it("should be able to stub factories", () => {
    const ComponentStub = createComponentStub(FakeComponent, {
      factories: {
        bar: FooFactory,
      }
    });
    const wrapper = mount(<ComponentStub />);
    wrapper.find('button').simulate('click');
    expect(FooFactory.doSomething).to.have.been.calledOnce();
  });

  it('should error if stubs are not provided', () => {
    expect(() => {
      const ComponentStub = createComponentStub(FakeComponent, {
        factories: {
          bar: null,
        }
      });
      mount(<ComponentStub />);
    }).to.throw(Error); 
  })
});
