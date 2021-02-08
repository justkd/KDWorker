/**
 * @file /src/module/dev/KDWorker.ts
 * @version 1.1.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2020
 * @license MIT
 * @fileoverview
 * `KDWorker` creates web workers on the fly. Simply pass the web worker function and its parameter to
 * `KDWorker`, and it will build the web worker script, add it to the DOM and run the web worker,
 * and revoke the DOMString when finished.
 */

type GenericFunc<T extends any[], R = any> = (...args: T) => R | void;
type UnknownFunc = GenericFunc<unknown[], unknown>;

/**
 * `KDWorker` creates web workers on the fly. Simply pass the web worker function and its parameter to
 * `KDWorker`, and it will build the web worker script, add it to the DOM and run the web worker,
 * and revoke the DOMString when finished.
 * @param fn - This should be a web worker friendly function intended to be run on the web worker.
 * @example
 * ```
 *  KDWorker((x) => {
 *    return `from worker - ${x}`;
 *  })("hello")
 *    .then(console.log)
 *    .catch(console.log);
 * ```
 */
export const KDWorker = (fn: UnknownFunc) => {
  /**
   * `KDWorker` returns an async function which in turn returns a promise that resolves on worker completion.
   * @param params - This should be the parameters that would be passed to the web worker function.
   */
  return async (params?: any) => {
    const isFn = (fn: any) => {
      if (fn === undefined || fn === null) return;
      return Object.prototype.toString.call(fn) === '[object Function]';
    };

    if (!isFn(fn)) return fn;

    const work = () => {
      const parseClone = (str: string) => {
        return JSON.parse(str, function (_, fnstr: string) {
          if (typeof fnstr !== 'string') return fnstr;
          if (fnstr.length < 8) return fnstr;

          const prefix = fnstr.substring(0, 8);
          /* eslint-disable-next-line no-eval */
          if (prefix === 'function') return eval('(' + fnstr + ')');
          /* eslint-disable-next-line no-eval */
          if (prefix === 'arrowfun') return eval(fnstr.slice(8));

          return fnstr;
        });
      };
      onmessage = function (e) {
        const res = parseClone(e.data.fn)(e.data.params);
        postMessage(res, null);
      };
    };

    const makeWebWorker = (() => {
      let script = work.toString();
      script = script.substring(
        script.indexOf('{') + 1,
        script.lastIndexOf('}')
      );
      const blob = new Blob([script], { type: 'application/javascript' });
      return URL.createObjectURL(blob);
    })();

    const w = new Worker(makeWebWorker);

    const cloneFn = function (obj: any) {
      return JSON.stringify(obj, function (_, fn) {
        if (!isFn(fn)) return fn;
        const fnstr = fn.toString();
        return fnstr.substring(0, 8) !== 'function'
          ? `arrowfun${fnstr}`
          : fnstr;
      });
    };

    w.postMessage({
      fn: cloneFn(fn),
      params: params,
    });

    return await new Promise((resolve, reject) => {
      w.onmessage = (e) => resolve(e.data);
      w.onerror = (err) => reject(err);
      URL.revokeObjectURL(makeWebWorker);
    });
  };
};

/**
 * Example
 */
/*
(() => {
  const divider = () => {
    const div = document.createElement('div');
    div.style.width = '50px';
    div.style.height = '10px';
    document.body.appendChild(div);
  };

  const workerExample = () => {
    console.log();
    console.log('worker working - takes about 5 seconds');
    KDWorker((x: any) => {
      const doErrorTest = false;
      const start = Date.now();

      const blockwith = (fn: any) => {
        return (loops: number) => {
          if (typeof fn !== 'function') return;
          const blockers = new Array(1000000).fill(fn);
          while (loops--) blockers.forEach((f) => f());
        };
      };

      if (doErrorTest) {
        blockwith(Math.random)(x);
        throw new Error();
      }

      blockwith(Date.now)(x);

      return `worker done after ${Date.now() - start}ms`;
    })(50)
      .then(console.log)
      .catch(console.log);
  };

  const blockExample = () => {
    console.log();
    console.log('blocking UI - about 5 seconds');

    const start = Date.now();

    const blockwith = (fn: any) => {
      if (typeof fn !== 'function') return;
      return (loops: number) => {
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
*/
