# npm

To install:

```bash
$ npm install frint-test --save-dev
```

frint-test requires some minimal setup.  We assume that you are using [mocha](https://mochajs.org/) for running your unit tests.

Read more on how to [set up frint-test to work with mocha](../guides/Setup.md#using-mocha).

After you follow the instructions on how to set up frint-test to work with your test framework of choice you should be able to import functions like:

```js
import { createComponentStub } from 'frint-test';
```
