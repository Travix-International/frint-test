# Getting Started

Now that you have already [set up frint-test](/docs/guides/Setup.md), you can start writing your first unit test using frint-test.

## Writing your first unit test

You can use frint-test to test any component created with frint's [createComponent](https://travix-international.github.io/frint/docs/api/createComponent.html), but it's specially helpful if you want to test connected components.  Connected components are components that receive _props_ using frint's [mapToProps](https://travix-international.github.io/frint/docs/api/mapToProps.html).


Suppose you have a component that looks like:

```
import { createComponent } from 'frint';

const MyComponent = createComponent({
  afterMount() {
    console.log('MyComponent has been mounted');
  },
  render() {
    return (
      <span>The name of your App is {this.props.appName}</span>;
    );
  },
});

export default mapToProps({
  app: (app) => {
    const appName = app.getOption('appName');
    return { appName };
  },
});

```

Since you are exporting a connected component in `MyComponent.js`, as the example above, there is no way you can tell which App your component belongs to and what its name is.  You would need to stub out its dependencies in order to test it appropriately.

Suppose that you want to test that your component correctly shows the name of your App, you would do:

```
import { createComponentStub } from 'frint-test';
import MyComponent from '../src/components/MyComponent';

describe('MyComponent tests', function() {

  // creates a testable component that map App options into MyComponent
  const ComponentStub = createComponentStub(MyComponent, {
    appOptions: {
      appName: 'My super cool Frint Application',
    },
  });

  let wrapper;
  let sandbox;

  before(() => {
    // we will use this later to clean up the js dom
    this.cleanup = require('jsdom-global');

    // we can create a sandbox and mock MyComponent hooks
    sandbox = sinon.sandbox.create();
    sandbox.stub(MyComponent.prototype, 'afterMount');

    // instead of mounting MyComponent directly, we need to mount ComponentStub
    wrapper = mount(<ComponentStub />);
  });

  after(() => {
    // restore the sandbox
    sandbox.restore();

    // reset any stubs injected by frint-test
    MyComponent.resetStubs();

    // and finally clean up the js dom
    this.cleanup();
  });

  it('is mounted correctly', () => {
    // we are using chai-dirty here...
    expect(MyComponent.prototype.afterMount).to.have.been.calledOnce();
  });

  it('receives the name of the app via props', () => {
    // since frint-test creates a wrapper around MyComponent, you first need to get a reference to MyComponent in the virtal dom
    const component = wrapper.find(MyComponent);
    expect(component.props().appName, 'My super cool Frint Application');
  });

  it('shows the name of my app', () => {
    // you can also use enzyme to match text that is rendered by your component
    expect(wrapper.find('span').text()).to.contain('My super cool Frint Application');
  });
});
```
