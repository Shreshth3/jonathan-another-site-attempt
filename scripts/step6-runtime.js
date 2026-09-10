/* Step 6 runs student JavaScript inside a worker in an opaque-origin iframe.
 * The iframe CSP denies network access; no app DOM or storage is shared.
 * Keep this file authoritative: build-visual-data.js embeds it in visual-data.js.
 */
(function (root) {
  'use strict';
  function workerProgram(code, functionName, args, token) {
    return '(' + workerHarness.toString() + ')(' + [code, functionName, args, token].map(value => JSON.stringify(value)).join(',') + ');';
  }
  function workerHarness(code, functionName, args, token) {
    "use strict";
    const post = self.postMessage.bind(self);
    const send = result => post({ token, result });
    const logs = [];
    function display(value) {
      if (value === undefined) return 'undefined';
      if (typeof value === 'number' && !Number.isFinite(value)) return String(value);
      if (typeof value === 'bigint') return String(value) + 'n';
      try { return JSON.stringify(value); } catch (_) { return '[Cannot display circular value]'; }
    }
    // Inspect logs separately from returned answers: JSON hides Set/Map entries
    // and calls student-defined getters/toJSON methods.
    function consoleText(items) {
      const limit = 1000;
      let text = '';
      let truncated = false;
      const ancestors = new Set();
      function append(part) {
        const room = limit - text.length;
        if (part.length > room) truncated = true;
        text += part.slice(0, Math.max(0, room));
      }
      function dataProperty(value, key) {
        for (let level = 0; value && level < 12; level++, value = Object.getPrototypeOf(value)) {
          const property = Object.getOwnPropertyDescriptor(value, key);
          if (property) return 'value' in property ? property.value : undefined;
        }
      }
      function inspect(value, depth, nested) {
        if (text.length >= limit) { truncated = true; return; }
        try {
          if (value === null) return append('null');
          switch (typeof value) {
            case 'undefined': return append('undefined');
            case 'string': {
              const short = value.slice(0, limit);
              if (value.length > limit) truncated = true;
              return append(nested ? JSON.stringify(short) : short);
            }
            case 'number': return append(Object.is(value, -0) ? '-0' : String(value));
            case 'bigint': return append(String(value) + 'n');
            case 'boolean': case 'symbol': return append(String(value));
            case 'function': {
              const name = Object.getOwnPropertyDescriptor(value, 'name');
              return append('[Function' + (name && typeof name.value === 'string' && name.value ? ': ' + name.value : '') + ']');
            }
          }
          if (ancestors.has(value)) return append('[Circular]');
          if (depth >= 8) return append('[Max depth]');
          ancestors.add(value);
          try {
            if (value instanceof Set || value instanceof Map) {
              const isMap = value instanceof Map;
              const proto = isMap ? Map.prototype : Set.prototype;
              const size = Object.getOwnPropertyDescriptor(proto, 'size').get.call(value);
              append((isMap ? 'Map' : 'Set') + '(' + size + ') {');
              const iterator = (isMap ? Map.prototype.entries : Set.prototype.values).call(value);
              let count = 0;
              for (const entry of iterator) {
                if (count) append(', ');
                if (count++ >= 50 || text.length >= limit) { append('…'); truncated = true; break; }
                if (isMap) { inspect(entry[0], depth + 1, true); append(' => '); inspect(entry[1], depth + 1, true); }
                else inspect(entry, depth + 1, true);
              }
              append('}');
            } else if (value instanceof RegExp) {
              const source = Object.getOwnPropertyDescriptor(RegExp.prototype, 'source').get.call(value);
              let flags = '';
              for (const [property, flag] of [['hasIndices', 'd'], ['global', 'g'], ['ignoreCase', 'i'], ['multiline', 'm'], ['dotAll', 's'], ['unicode', 'u'], ['unicodeSets', 'v'], ['sticky', 'y']]) {
                const descriptor = Object.getOwnPropertyDescriptor(RegExp.prototype, property);
                if (descriptor && descriptor.get.call(value)) flags += flag;
              }
              append('/' + source + '/' + flags);
            } else if (value instanceof Date) {
              const time = Date.prototype.getTime.call(value);
              append(Number.isNaN(time) ? 'Invalid Date' : Date.prototype.toISOString.call(value));
            } else if (value instanceof Error) {
              // Read data properties only; debugging must not invoke accessors.
              const message = Object.getOwnPropertyDescriptor(value, 'message');
              const name = dataProperty(value, 'name');
              append(typeof name === 'string' ? name : 'Error');
              if (message && typeof message.value === 'string') { append(': '); append(message.value); }
            } else {
              const array = Array.isArray(value);
              const typed = ArrayBuffer.isView(value) && !(value instanceof DataView);
              if (!array && !typed) {
                const tag = dataProperty(value, Symbol.toStringTag);
                if (typeof tag === 'string' && tag !== 'Object') return append('[' + tag + ']');
              }
              if (typed) {
                const constructor = dataProperty(Object.getPrototypeOf(value), 'constructor');
                const name = constructor && dataProperty(constructor, 'name');
                append((typeof name === 'string' ? name : 'TypedArray') + ' ');
              }
              append(array || typed ? '[' : '{');
              let count = 0;
              if (array || typed) {
                const length = value.length;
                for (let i = 0; i < Math.min(length, 50); i++) {
                  if (i) append(', ');
                  if (text.length >= limit) { truncated = true; break; }
                  const property = Object.getOwnPropertyDescriptor(value, String(i));
                  if (!property) append('<empty>');
                  else if ('value' in property) inspect(property.value, depth + 1, true);
                  else append('[Getter]');
                  count++;
                }
                if (length > count) append(', …');
              } else {
                for (const key of Reflect.ownKeys(value)) {
                  const property = Object.getOwnPropertyDescriptor(value, key);
                  if (!property || !property.enumerable) continue;
                  if (count) append(', ');
                  if (count++ >= 50 || text.length >= limit) { append('…'); truncated = true; break; }
                  append(typeof key === 'symbol' ? '[' + String(key) + ']' : JSON.stringify(key.slice(0, limit)));
                  append(': ');
                  if ('value' in property) inspect(property.value, depth + 1, true);
                  else append('[Getter/Setter]');
                }
              }
              append(array || typed ? ']' : '}');
            }
          } finally { ancestors.delete(value); }
        } catch (_) { append('[Cannot inspect value]'); }
      }
      let firstExtra = 0;
      if (typeof items[0] === 'string' && items.length > 1) {
        const format = items[0];
        let cursor = 0;
        firstExtra = 1;
        const pattern = /%[%sdifoOc]/g;
        for (let match; (match = pattern.exec(format)) && text.length < limit;) {
          append(format.slice(cursor, match.index));
          cursor = pattern.lastIndex;
          const kind = match[0][1];
          if (kind === '%') { append('%'); continue; }
          if (firstExtra >= items.length) { append(match[0]); continue; }
          const value = items[firstExtra++];
          if (kind === 'c') continue;
          if ('dif'.includes(kind)) {
            let number = NaN;
            if (value === null || ['string', 'number', 'boolean', 'bigint', 'undefined'].includes(typeof value)) {
              number = kind === 'i' ? parseInt(value, 10) : kind === 'f' ? parseFloat(value) : Number(value);
            }
            inspect(number, 0, false);
          } else inspect(value, 0, false);
        }
        append(format.slice(cursor));
      }
      for (let i = firstExtra; i < items.length; i++) {
        if (i) append(' ');
        inspect(items[i], 0, false);
        if (text.length >= limit) { if (i + 1 < items.length) truncated = true; break; }
      }
      return truncated ? text.slice(0, limit - 1) + '…' : text;
    }
    let consoleMessages = 0;
    function streamConsole(message) {
      // Repeated clear() calls must not flood the page with worker messages.
      // The final result still contains the latest complete bounded log list.
      if (consoleMessages < 300) post({ token, ...message });
      else if (consoleMessages === 300) post({ token, log: '[Live console updates paused after many messages. Run completion will show the latest logs.]' });
      consoleMessages++;
    }
    function recordLog(message) {
      logs.push(message);
      streamConsole({ log: message });
    }
    self.console = Object.fromEntries(['log', 'info', 'warn', 'error', 'debug', 'dir', 'table', 'trace'].map(key => [key, (...items) => {
      if (logs.length < 30) recordLog(consoleText(items));
      else if (logs.length === 30) recordLog('[Console limit reached: showing the first 30 messages.]');
    }]));
    self.console.assert = (condition, ...items) => {
      if (!condition) self.console.error('Assertion failed:', ...items);
    };
    const timers = new Map();
    const counters = new Map();
    self.console.time = (label = 'default') => { timers.set(String(label), performance.now()); };
    self.console.timeLog = (label = 'default', ...items) => {
      label = String(label);
      self.console.log(timers.has(label) ? label + ': ' + (performance.now() - timers.get(label)).toFixed(3) + ' ms' : 'No timer named ' + label, ...items);
    };
    self.console.timeEnd = (label = 'default') => { self.console.timeLog(label); timers.delete(String(label)); };
    self.console.count = (label = 'default') => {
      label = String(label);
      counters.set(label, (counters.get(label) || 0) + 1);
      self.console.log(label + ': ' + counters.get(label));
    };
    self.console.countReset = (label = 'default') => { counters.delete(String(label)); };
    self.console.group = self.console.groupCollapsed = (...items) => self.console.log(...items);
    self.console.groupEnd = () => {};
    // Profiling and performance markers have no separate panel in this editor.
    self.console.profile = self.console.profileEnd = self.console.timeStamp = () => {};
    self.console.clear = () => { logs.length = 0; streamConsole({ clearLogs: true }); };
    function errorData(error) {
      function read(key) { try { return error == null ? undefined : error[key]; } catch (_) { return undefined; } }
      function text(value, fallback) { try { return value === undefined ? fallback : String(value); } catch (_) { return fallback; } }
      const stack = text(read('stack'), '');
      const match = stack.match(/step6-student\.js:(\d+):(\d+)/);
      const sourceLine = match ? Number(match[1]) - 2 : null;
      const codeLines = code.split(/\r\n|\r|\n/).length;
      const hasLocation = sourceLine >= 1 && sourceLine <= codeLines;
      return { name: text(read('name'), 'Error').slice(0, 100), message: text(read('message'), text(error, error === undefined ? 'undefined' : 'Your code threw an error.')).slice(0, 2000), line: hasLocation ? sourceLine : null, column: hasLocation ? Number(match[2]) : null };
    }
    // Build one plain snapshot for both grading and display. Do not run getters
    // or toJSON while handling a student's returned answer.
    let outputEntries = 0;
    function validate(value, visited, depth = 0) {
      if (++outputEntries > 50000 || depth > 100) throw new Error('Your output is too large or deeply nested to display.');
      if (value === undefined) throw new Error('Your function returned undefined. Add a return statement with the answer.');
      if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('Your function returned ' + String(value) + '. Return a finite number.');
      if (typeof value === 'bigint') throw new Error('Your function returned a BigInt. Return ordinary numbers instead.');
      if (typeof value === 'function' || typeof value === 'symbol') throw new Error('Return a number, string, boolean, array, object, or null.');
      if (!value || typeof value !== 'object') return value;
      if (visited.has(value)) throw new Error('Your function returned a circular value. Return an answer without circular references.');
      const array = Array.isArray(value);
      if (!array && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) throw new Error('Return plain objects or arrays, not Map, Set, Date, or other special objects.');
      if (array && value.length > 50000) throw new Error('Your output is too large to display.');
      visited.add(value);
      const result = array ? [] : {};
      const keys = array ? Array.from({ length: value.length }, (_, i) => String(i)) : Object.keys(value);
      for (const key of keys) {
        const property = Object.getOwnPropertyDescriptor(value, key);
        if (!property) throw new Error('Your returned array has empty slots. Fill each slot with an answer value.');
        if (!('value' in property)) throw new Error('Return plain answer values, without getters or setters.');
        Object.defineProperty(result, key, { value: validate(property.value, visited, depth + 1), enumerable: true, configurable: true, writable: true });
      }
      visited.delete(value);
      return result;
    }
    self.addEventListener('unhandledrejection', event => {
      event.preventDefault();
      send({ ok: false, error: errorData(event.reason), logs });
    });
    (async () => {
      let output;
      try {
        const studentSolution = new Function(code + '\n;return typeof ' + functionName + ' === "function" ? ' + functionName + ' : null;\n//# sourceURL=step6-student.js');
        const solution = studentSolution();
        if (!solution) throw new Error('Keep the required function name from the starter code.');
        output = await solution(...args);
        output = validate(output, new Set());
        const rendered = display(output);
        if (rendered.length > 100000) throw new Error('Your output is too large to display (limit: 100,000 characters).');
        send({ ok: true, value: output, display: rendered, logs });
      } catch (error) {
        send({ ok: false, error: errorData(error), logs });
      }
    })();
  }
  function bridge() {
    window.addEventListener('message', event => {
      if (event.source !== parent || !event.data || event.data.type !== 'step6-start') return;
      const { token, source, codeLines } = event.data;
      const url = URL.createObjectURL(new Blob([source], { type: 'application/javascript' }));
      const worker = new Worker(url);
      const logs = [];
      const finish = result => {
        parent.postMessage({ type: 'step6-result', token, result }, '*');
        worker.terminate();
        URL.revokeObjectURL(url);
      };
      worker.onmessage = event => {
        if (!event.data || event.data.token !== token) return;
        if (event.data.clearLogs) {
          logs.length = 0;
          parent.postMessage({ type: 'step6-log', token, clearLogs: true }, '*');
        } else if (typeof event.data.log === 'string') {
          logs.push(event.data.log);
          parent.postMessage({ type: 'step6-log', token, log: event.data.log }, '*');
        } else if (event.data.result) finish(event.data.result);
      };
      worker.onerror = event => {
        event.preventDefault();
        // A Function constructor adds two lines before the student's source.
        // Worker/harness failures have no trustworthy editor location.
        const line = /(?:^|\/)step6-student\.js$/.test(event.filename || '') ? event.lineno - 2 : null;
        const hasLocation = line >= 1 && line <= codeLines;
        finish({ ok: false, logs, error: { name: 'JavaScript error', message: event.message || 'The code could not run.', line: hasLocation ? line : null, column: hasLocation ? event.colno || null : null } });
      };
    }, { once: true });
    parent.postMessage({ type: 'step6-ready' }, '*');
  }
  function createRunner() {
    let stop = null;
    function cancel() { if (stop) stop(); }
    async function run(options) {
      cancel();
      const { code, functionName, args } = options;
      if (typeof code !== 'string' || !/^[A-Za-z_$][\w$]*$/.test(functionName) || !Array.isArray(args)) {
        return { ok: false, logs: [], error: { name: 'Input error', message: 'The function name and input arguments are required.', line: null, column: null } };
      }
      if (code.length > 100000) return { ok: false, logs: [], error: { name: 'Code too large', message: 'Please keep your solution below 100,000 characters.', line: null, column: null } };
      try {
        // Function constructors do not inherit the harness's strict mode. Parse
        // the student's own directives so parsing and execution use the same mode.
        root.acorn.parse(code, { ecmaVersion: 'latest', locations: true });
      } catch (error) {
        return { ok: false, logs: [], error: { name: error.name || 'SyntaxError', message: String(error.message).replace(/ \(\d+:\d+\)$/, ''), line: error.loc ? error.loc.line : null, column: error.loc ? error.loc.column + 1 : null } };
      }
      const timeoutMs = Math.min(10000, Math.max(100, Number(options.timeoutMs) || 1500));
      const token = Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');
      return new Promise(resolve => {
        const iframe = document.createElement('iframe');
        iframe.hidden = true;
        iframe.setAttribute('sandbox', 'allow-scripts');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.srcdoc = '<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\' \'unsafe-eval\' blob:; worker-src blob:; connect-src \'none\'"><script>(' + bridge.toString() + ')()<\/script>';
        const logs = [];
        let timer;
        let finished = false;
        function finish(result) {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          window.removeEventListener('message', receive);
          iframe.remove();
          stop = null;
          resolve(result);
        }
        stop = () => finish({ ok: false, cancelled: true, logs: [], error: { name: 'Cancelled', message: 'The code changed. Run it again.', line: null, column: null } });
        function receive(event) {
          if (event.source !== iframe.contentWindow || !event.data) return;
          if (event.data.type === 'step6-ready') {
            clearTimeout(timer);
            timer = setTimeout(() => finish({ ok: false, logs, error: { name: 'Time limit', message: 'Your code took too long. Check for an endless loop or recursion.', line: null, column: null } }), timeoutMs);
            iframe.contentWindow.postMessage({ type: 'step6-start', token, source: workerProgram(code, functionName, args, token), codeLines: code.split(/\r\n|\r|\n/).length }, '*');
          } else if (event.data.type === 'step6-log' && event.data.token === token) {
            if (event.data.clearLogs) logs.length = 0;
            else if (typeof event.data.log === 'string' && logs.length < 31) logs.push(event.data.log);
          } else if (event.data.type === 'step6-result' && event.data.token === token) finish(event.data.result);
        }
        window.addEventListener('message', receive);
        timer = setTimeout(() => finish({ ok: false, logs: [], error: { name: 'Runner error', message: 'The code runner could not start. Please reload and try again.', line: null, column: null } }), 10000);
        document.body.appendChild(iframe);
      });
    }
    return { run, cancel, destroy: cancel };
  }
  root.Step6Runtime = { createRunner };
})(typeof window !== 'undefined' ? window : globalThis);
