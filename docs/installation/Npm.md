# npm

To install:

```
$ npm install frint-test --save-dev
```

frint-test requires some minimal set up.  We assume that you are using [mocha](https://mochajs.org/) for running your unit tests.

Read more on how to [set up frint-test to work with mocha](/docs/guides/Setup.md#using-mocha).

After you follow the instructions on how to set up frint-test to work with your test framework of choice you should be able to import functions like:

```
import { createComponentStub } from 'frint-test';
```
