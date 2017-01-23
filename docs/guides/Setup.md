# Set up frint-test

Once you have [frint-test installed](../installation/README.md), you are required to do some minimal set up to get frint-test to work with Mocha.

The only supported test framework at this moment is [Mocha](https://mochajs.org/), so we assume you are using Mocha already.

## Using Mocha

If you still don't have Mocha installed, this is the right time to do it.  We recommend that you install Mocha locally in your project, instead of relying on it being installed globally.  If you already have mocha installed, you can skip to [Installing Test Stubs](#installing-test-stubs).

```bash
$ npm install mocha --save-dev
```

If you want to install Mocha globally:

```bash
$ npm install -g mocha
```

### Installing Test Stubs

In order to use frint-test in your project, you need to make sure you invoke `installTestStubs` before all unit tests are executed.  You only need to that once and frint-test will fail if you call `installTestStubs` multiple times.

It is necessary that frint-test loads before frint, so it can replace frint functions with appropriate stubs.  By stubbing frint, in the first place, we can guarantee that your tests will be executed without the interference of third-party dependencies such as *React* or *Redux*.

If you're using mocha, you can do it by simply loading frint-test register hook, for instance:

```
--colors
--compilers js:babel-register
--require jsdom-global/register frint-test/register
--recursive
```

Alternatively, you can also invoke `installTestStub` yourself. If you don't already have a setup file that you use with mocha, create it now on `./test/setup.js`:

Assuming your `mocha.opts` file look somehow like that:

```
--colors
--compilers js:babel-register
--require ./test/setup.js
--recursive
```

Just make sure you have these lines in your `./test/setup.js` file.

```js
import { installTestStubs } from 'frint';
installTestStubs();
```

We suggest you have test script to use with npm.  Add the following line to your `package.json` file, in the scripts session:

```json
"scripts": {
  ...
  "test": "mocha --opts ./test/mocha.opts test"
}
```

### Using jsdom and jsdom-global

We assume that you are already using jsdom for testing your view components.  If not, we recommend you install them now:

```bash
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

```bash
$ npm install enzyme react-addons-test-utils react-dom --save-dev
$ npm install chai-enzyme --save-dev
```

### Using chai, sinon and sinon-chai

We recommend you use [chai](http://chaijs.com/) as your BDD/TDD assertion library.

```bash
$ npm install chai --save-dev
```

In order to test the interaction of your view components with other components, such as frint [services](https://travix-international.github.io/frint/docs/api/createService.html), [factories](https://travix-international.github.io/frint/docs/api/createFactory.html) and [models](https://travix-international.github.io/frint/docs/api/Model.html), you will need to replace them with appropriate stubs in your unit tests.  We recommend that you use sinon and sinon-chai too.

```bash
$ npm install sinon sinon-chai --save-dev
```

Once you have installed sinon-chai you will have to chai to use sinon-chai plugin:

```js
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
```
