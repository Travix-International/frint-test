# resetStubs()

After you are done with a component stub, you need to reset it, so you can mount it again with new stubs.

## Example

```js
describe('MyComponent tests', function() {
  let ComponentStub;

  beforeEach(() => {
    ComponentStub = createComponentStub(MyComponent);
  });

  afterEach(() => {
    resetStubs(MyComponent);  
  });
});
```

## Related functions

* [createComponentStub](createComponentStub.md)
