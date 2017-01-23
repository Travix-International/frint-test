import { expect } from 'chai';
import { mount } from 'enzyme';
import { createComponent, mapToProps, PropTypes } from 'frint';

import createComponentStub from '../src/createComponentStub';
import resetStubs from '../src/resetStubs';

describe('createComponentStub :: app', function () {
  const TestComponent = createComponent({
    propTypes: {
      componentBoolProp: PropTypes.bool.isRequired,
      componentStrProp: PropTypes.string.isRequired,
    },

    render() {
      return (
        <div>
          <span>{this.props.message}</span>
          <span className="counter">{this.props.counter}</span>
        </div>
      );
    },
  });

  const FakeComponent = mapToProps({
    app: (app) => {
      const message = app.getOption('message');
      return { message };
    },
    state: (state) => {
      const { counter } = state;
      return { counter };
    },
  })(TestComponent);

  let wrapper;

  before(() => {
    this.cleanup = require('jsdom-global'); // eslint-disable-line global-require
    const ComponentStub = createComponentStub(FakeComponent, {
      appOptions: {
        message: 'foo',
      },
      state: {
        counter: 1,
      },
    });
    wrapper = mount(<ComponentStub componentBoolProp componentStrProp="Hello world!" />);
  });

  afterEach(() => resetStubs(FakeComponent));

  after(() => {
    this.cleanup();
  });

  it('should be able to stub app options', () => {
    expect(wrapper.containsMatchingElement(<span>foo</span>)).to.be.true();
  });

  it('should be able to stub store state', () => {
    const counter = wrapper.find('.counter');
    expect(counter.text()).to.be.equal('1');
  });

  it('should be able to pass properties directly from wrapper (like prop="true")', () => {
    const component = wrapper.find(TestComponent);
    expect(component.props().componentBoolProp).to.equal(true);
    expect(component.props().componentStrProp).to.equal('Hello world!');
  });
});
