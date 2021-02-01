# KDWorker

##### v 1.1.0 | © justKD 2020 | MIT License

`KDWorker` creates web workers on the fly. Simply pass the web worker function and its parameter to `KDWorker`, and it will build the web worker script, add it to the DOM and run the web worker, and revoke the DOMString when finished.

[Demo](https://kdworkerdemo.justkd.app/)

## Install

`src/dist/KDChain.bundle.js` can be added to your project in multiple ways:

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
