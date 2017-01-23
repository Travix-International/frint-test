import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { createComponent, mapToProps, h } from 'frint';

import createComponentStub from '../src/createComponentStub';
import resetStubs from '../src/resetStubs';

describe('createComponentStub :: models', function () {
  const TestComponent = createComponent({
    render() {
      const { foo } = this.props;
      return <span>{foo.getProperty()}</span>;
    },
  });

  const FakeComponent = mapToProps({
    models: {
      foo: 'foo',
    },
  })(TestComponent);

  const FooModel = {
    getProperty() { return 'fake property'; },
  };

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(FooModel, 'getProperty');
    this.cleanup = require('jsdom-global'); // eslint-disable-line global-require
  });

  afterEach(() => {
    resetStubs(FakeComponent);
    sandbox.restore();
    this.cleanup();
  });

  it('should be able to stub models', () => {
    const ComponentStub = createComponentStub(FakeComponent, {
      models: {
        foo: FooModel,
      },
    });
    mount(<ComponentStub />);
    expect(FooModel.getProperty).to.have.been.calledOnce();
  });

  it('should error if stubs are not provided', () => {
    expect(() => {
      const ComponentStub = createComponentStub(FakeComponent, {
        models: {
          foo_is_missing: null,
        },
      });
      mount(<ComponentStub />);
    }).to.throw(Error);
  });
});
