import _ from 'lodash';
import { mount } from 'enzyme';
import { mock } from 'sinon';
import { createComponent, mapToProps, h } from 'frint';

import createComponentStub from '../src/createComponentStub';
import resetStubs from '../src/resetStubs';

describe('createComponentStub :: dispatch', function () {
  const TestComponent = createComponent({
    render() {
      return <button onClick={this.props.handleButtonClicked} />;
    },
  });

  const FakeComponent = mapToProps({
    dispatch: {
      handleButtonClicked: _.noop,
    },
  })(TestComponent);

  let ComponentStub;
  let handleButtonClicked;

  before(() => {
    this.cleanup = require('jsdom-global'); // eslint-disable-line global-require
    handleButtonClicked = mock().once().returns({ type: 'DOES_NOT_MATTER' });

    ComponentStub = createComponentStub(FakeComponent, {
      dispatch: {
        handleButtonClicked,
      },
    });
  });

  after(() => this.cleanup());

  afterEach(() => resetStubs(FakeComponent));

  it('should be able to stub dispatch to action', () => {
    const wrapper = mount(<ComponentStub />);
    wrapper.find('button').simulate('click');
    handleButtonClicked.verify();
  });
});
