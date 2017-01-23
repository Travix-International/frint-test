# installTestStubs()

Before you can create your component stubs, you need to make sure frint-test install its own test stubs.  You only need to call this method once during your test setup.

If you do not call this method, calling `createComponentStub` or `resetStubs` will fail with an Error.

If you call this method multiple times, `frint-test` will show a warning message in the `console`.

## Example

In your test setup:

```js
import { installTestStubs } from 'frint-test';
installTestStubs();
```

## Related functions

* [createComponentStub](createComponentStub.md)
* [resetStubs](resetStubs)  
