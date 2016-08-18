# Set up frint-test

Once you have [frint-test installed](/docs/installation/README.md), you are required to do some minimal set up to get frint-test to work with your test framework of choice.

The only supported test framework at this moment is [Mocha](https://mochajs.org/), so we assume you are using Mocha already.

## Using Mocha

If you still don't have Mocha installed, this is the right time to do it.  We recommend that you install Mocha locally in your project, instead of relying on it being installed globally.  If you already have mocha installed, you can skip to [Installing Test Stubs](/docs/guides/Setup.md#installing-test-stubs).

```
$ npm install mocha --save-dev
```

If you want to install Mocha globally:

```
$ npm install -g mocha
```

### Installing Test Stubs

In order to use frint-test in your project, you need to make sure you invoke `installTestStubs` before all unit tests are executed.  You only need to that once and frint-test will fail if you call `installTestStubs` multiple times.

It is necessary that frint-test loads before frint, so it can replace frint functions with appropriate stubs.  By stubbing frint, in the first place, we can guarantee that your tests will be executed without the interference of third-party dependencies such as *React* or *Redux*.

If you don't already have a setup file that you use with mocha, create it now on `./test/setup.js`:

```
import { installTestStubs } from 'frint';
import { React } from 'react';

global.React = React;

installTestStubs();
```

In your test setup, you need to make sure that React is put in the global scope, because internally frint uses the version of React that is on the global scope and do not bring its own version of React.

Alternatively, if you already have a set up file, you only need to make sure you import and call the `installTestStubs` from 'frint-test'.

Now you need to make sure you have a `mocha.opts` file.  In case you are starting from scratch, create it now.  Your mocha.opts file may look like this:

```
--colors
--compilers js:babel-register
--require ./test/setup.js
--recursive
```

We suggest you have test script to use with npm.  Add the following line to your `package.json` file, in the scripts session:

```
"scripts": {
  ...
  "test": "mocha --opts ./test/mocha.opts test"
}

```

### Using jsdom and jsdom-global

We assume that you are already using jsdom for testing your view components.  If not, we recommend you install them now:

```
$ npm install jsdom jsdom-global --save-dev
```

Additionally you can add `jsdom-global/register` to your `mocha.opts` so jsdom-global is loaded automatically.  Your modified `mocha.opts` file should look like this:

```
--colors
--compilers js:babel-register
--require jsdom-global/register ./test/setup.js
--recursive
```

### Using Enzyme

We recommend you use airbnb's awesome [Enzyme](airbnb.io/enzyme/) framework in combination with frint-test to test your Frint components.

To install it:

```
$ npm install enzyme react-addons-test-utils react-dom --save-dev
$ npm install chai-enzyme --save-dev
```

### Using chai, sinon and sinon-chai

We recommend you use [chai](http://chaijs.com/) as your BDD/TDD assertion library.

```
$ npm install chai --save-dev
```

In order to test the interaction of your view components with other components, such as frint [services](https://travix-international.github.io/frint/docs/api/createService.html), [factories](https://travix-international.github.io/frint/docs/api/createFactory.html) and [models](https://travix-international.github.io/frint/docs/api/Model.html), you will need to replace them with appropriate stubs in your unit tests.  We recommend that you use sinon and sinon-chai too.

```
$ npm install sinon sinon-chai --save-dev
```

Once you have installed sinon-chai you will have to chai to use sinon-chai plugin:

```
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
```
