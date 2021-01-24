import { KDWorker } from './dist/KDWorker.bundle.js';

(() => {
  const divider = () => {
    const div = document.createElement('div');
    div.style.width = '50px';
    div.style.height = '10px';
    document.body.appendChild(div);
  };

  /**
   * Run an example on a background thread using KDWorker.
   */
  const workerExample = () => {
    console.log();
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

  /**
   * Run a similar example that doesn't use a web worker
   * and blocks the main thread.
   */
  const blockExample = () => {
    console.log();
    console.log('blocking UI - about 5 seconds');

    const start = Date.now();

    const blockwith = (fn) => {
      if (typeof fn !== 'function') return;
      return (loops) => {
        const blockers = new Array(1000000).fill(fn);
        while (loops--) blockers.forEach((f) => f());
      };
    };

    setTimeout(() => {
      blockwith(Date.now)(50);
      console.log(`done after ${Date.now() - start}ms`);
    }, 100);
  };

  const workerButton = () => {
    const button = document.createElement('input');
    button.id = 'use-worker';
    button.type = 'button';
    button.value = 'use worker';
    button.onclick = () => workerExample();
    document.body.appendChild(button);
  };

  const blockButton = () => {
    const button = document.createElement('input');
    button.id = 'block-ui';
    button.type = 'button';
    button.value = 'block ui';
    button.onclick = () => blockExample();
    document.body.appendChild(button);
  };

  divider();
  blockButton();
  workerButton();
})();
