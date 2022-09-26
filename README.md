# KDWorker

##### v 1.1.1 | © justKD 2022 | MIT License

`KDWorker` creates web workers on the fly. Simply pass the web worker function and its parameter to `KDWorker`, and it will build the web worker script, add it to the DOM and run the web worker, and revoke the DOMString when finished.

Note:

- The worker function is unable to clone an object with values that are not primitive data types. This means the payload OR return value can not include an object or array with values that are also objects or arrays. The payload _can_ be a function or object with primitive values. Work arounds are being explored.
- `console` and `window` globals are not available in the body of the worker function. The worker lives outside of the DOM and must be provided those objects directly. But, as mentioned above, you won't be able to do that until a recursive cloning and parsing function is implemented.

TODO:

- Work around or resolve issues above.
- Export module with types.
- Migrate to NPM.

[Demo](https://kdworkerdemo.justkd.app/)

TODO

- export with types

## Install

`src/dist/KDWorker.bundle.js` can be added to your project in multiple ways:

```
// CommonJS / ES / Node module
// add to your module file

import { KDWorker } from "KDWorker.bundle.js";
console.log( KDWorker );
```

```
// AMD / Require module
// add to your module file

require(["KDWorker.bundle.js"], function(KDWorker) {
  console.log( KDWorker );
});
```

```
// Non-module / CDN
// add to your html file

<script src="KDWorker.bundle.js"></script>
<script>
  const KDWorker = window.kd.KDWorker;
  console.log( KDWorker );
</script>
```

## Basic Example

```
KDWorker((x) => {
  return `from worker - ${x}`;
})("hello")
  .then(console.log)
  .catch(console.log);
```

## Extended Example

```
const workerExample = () => {
  console.log('worker working - takes about 5 seconds');

  KDWorker((x) => {
    /**
      * Set this to true to test the `catch`
      * event when an error is thrown.
      */
    const doErrorTest = false;

    /**
      * So we can time how long this takes.
      */
    const start = Date.now();

    /**
      * Doing something that takes about 5 seconds.
      */
    const blockwith = (fn) => {
      return (loops) => {
        if (typeof fn !== 'function') return;
        const blockers = new Array(1000000).fill(fn);
        while (loops--) blockers.forEach((f) => f());
      };
    };

    if (doErrorTest) {
      blockwith(Math.random)(x);
      throw new Error();
    } else {
      blockwith(Date.now)(x);
    }

    return `worker done after ${Date.now() - start}ms`;
  })(50)
    .then(console.log)
    .catch(console.log);
};
```
