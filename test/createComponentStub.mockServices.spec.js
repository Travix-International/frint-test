import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { createComponent, mapToProps, h } from 'frint';

import createComponentStub from '../src/createComponentStub';
import resetStubs from '../src/resetStubs';

describe('createComponentStub :: services', function () {
  const TestComponent = createComponent({
    render() {
      const { foo } = this.props;
      return <button onClick={() => foo.doSomething()} />;
    },
  });

  const FakeComponent = mapToProps({
    services: {
      foo: 'bar',
    },
  })(TestComponent);

  const FooService = {
    doSomething() { },
  };

  let sandbox;

  beforeEach(() => {
    this.cleanup = require('jsdom-global'); // eslint-disable-line global-require
    sandbox = sinon.sandbox.create();
    sandbox.stub(FooService, 'doSomething');
  });

  afterEach(() => {
    resetStubs(FakeComponent);
    sandbox.restore();
    this.cleanup();
  });

  it('should be able to stub services', () => {
    const ComponentStub = createComponentStub(FakeComponent, {
      services: {
        bar: FooService,
      },
    });
    const wrapper = mount(<ComponentStub />);
    wrapper.find('button').simulate('click');
    expect(FooService.doSomething).to.have.been.calledOnce();
  });

  it('should error if stubs are not provided', () => {
    expect(() => {
      const ComponentStub = createComponentStub(FakeComponent, {
        services: {
          bar_is_missing: null,
        },
      });
      mount(<ComponentStub />);
    }).to.throw(Error);
  });
});
