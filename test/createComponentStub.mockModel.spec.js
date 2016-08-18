import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { createComponent, mapToProps } from 'frint';
import createComponentStub from '../src/createComponentStub';

describe("createComponentStub :: models", function() {
  const TestComponent = createComponent({
    render() {
      const { foo } = this.props;
      return <span>{foo.getProperty()}</span>;
    },
  });

  const FakeComponent = mapToProps({
    models: {
      foo: 'foo',
    }
  })(TestComponent);

  const FooModel = {
    getProperty() { return 'fake property' },
  };

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(FooModel, 'getProperty');
    this.cleanup = require('jsdom-global');
  });

  afterEach(() => {
    FakeComponent.resetStubs();
    sandbox.restore();
    this.cleanup()
  });

  it("should be able to stub models", () => {
    const ComponentStub = createComponentStub(FakeComponent, {
      models: {
        foo: FooModel,
      },
    });
    const wrapper = mount(<ComponentStub />);
    expect(FooModel.getProperty).to.have.been.calledOnce();
  });

  it('should error if stubs are not provided', () => {
    expect(() => {
      const ComponentStub = createComponentStub(FakeComponent, {
        models: {
          foo: null,
        }
      });
      const wrapper = mount(<ComponentStub />);
      console.log(wrapper.debug());
    }).to.throw(Error);
  })
});
