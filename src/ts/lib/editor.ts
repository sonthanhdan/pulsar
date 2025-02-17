// ----- Constants ----- //

import { calculateGrid } from './calculate';
import { decodeCode } from './url';
import { state } from './state';
import { randomExample } from './examples';
import { log } from './debug';

const forbiddenWords = [
  'fetch',
  'import',
  'export',
  'eval',
  'Function',
  'window',
  'self',
  'top',
  'location',
  'document',
  'alert',
  'prompt',
  'confirm',
  'XMLHttpRequest',
  'setTimeout',
  'setInterval',
  'clearTimeout',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'addEventListener',
  'removeEventListener',
  'dispatchEvent',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'Geolocation',
  'await',
  'async',
  'WebSocket',
  'Worker',
  'postMessage',
  'importScripts',
  'URL',
  'console',
  'debugger',
  'constructor',
];

const CODE_MAX_LENGTH = 300;

// Highlighting code is taken from this Stack Overflow answer:
// https://stackoverflow.com/a/41885674
const tokens = {
  quotes: /((&#39;.*?&#39;)|(&#34;.*?&#34;)|(".*?(?<!\\)")|('.*?(?<!\\)')|`)/g,
  comments: /((\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*))/g,
  logic:
    /(%=|%|\-|\+|\*|&amp;{1,2}|\|{1,2}|&lt;=|&gt;=|&lt;|&gt;|!={1,2}|={2,3})/g,
  fn: /(?<=^|\s*)(abs|acos|asin|atan|atan2|ceil|cos|floor|log|max|min|pow|random|round|sin|sqrt|tan|noise|async|await|window|fetch|console|alert|Math|Object|Array|String|class(?!\s*\=)|function)(?=\b)/g,
  number: /(\d+(\.\d+)?(e\d+)?)/g,
  declaration: /(?<=^|\s*)(var|let|const)/g,
  parenthesis: /(\(|\))/g,
  squared: /(\[|\])/g,
  curly: /(\{|\})/g,
  equals: /(\b\s?=\s?\b)/g,
};

export const $editor = document.querySelector(
  '.editor__textarea'
) as HTMLTextAreaElement;
export const $error = document.querySelector(
  '.editor__error'
) as HTMLDivElement;
const $pre = document.querySelector('.editor__pre') as HTMLPreElement;

const DUMMY_GRID = [
  {
    x: 0,
    y: 0,
  },
];

export class Editor {
  timeout: number = 0;

  constructor() {
    $editor.addEventListener('input', this.validate);
    $editor.addEventListener('change', this.validate);

    this.updateFromURL();

    $editor.addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        e.preventDefault();
      }
    });

    state.onChange('code', (value: string) => this.updateValue(value));
  }

  // Only updates the value of the textarea, doesn't update the global state
  // It is triggered when the global state is updated from outside
  private updateValue(code: string) {
    if ($editor.value !== code) {
      $editor.value = code;
      this.highlightCode();
      log('Editor, code updated');

      // Validate only if there was an error before
      // Otherwise, when loading an example, the previous error will be kept
      // and animation won't be played
      if (state.error) {
        this.validate();
      }
    }
  }

  // Updates the value of the textarea and the global state
  update(code: string) {
    if ($editor.value !== code) {
      $editor.value = code;
      log('Editor, code updated and validated');
    }

    this.validate();
  }

  updateFromURL() {
    const URLParams = new URLSearchParams(window.location.search);
    const value = URLParams.get('code') || '';

    const code = decodeCode(value) || randomExample.code;

    if (code.length > CODE_MAX_LENGTH) {
      this.update('Code in the URL is too long.');
    } else {
      this.update(code);
    }
  }

  validate = async () => {
    clearTimeout(this.timeout);

    const value = $editor.value;

    this.highlightCode();

    if (value === '') {
      this.showError('Type some code to get started.');
      return;
    }

    for (const word of forbiddenWords) {
      if (value.includes(word)) {
        this.showError(`Let's play nice, no usage of "${word}" allowed.`);
        return;
      }
    }

    const data = await calculateGrid(DUMMY_GRID, 0, value);

    if (data.error) {
      this.showError(data.error);
      return;
    }

    log(state.error);

    this.hideError();
    state.updateCode(value);
  };

  highlightCode() {
    let code = $editor.value;

    for (const [key, token] of Object.entries(tokens)) {
      code = code.replace(token, `<i class="${key}">$1</i>`);
    }

    $pre.innerHTML = code;
  }

  showError(error: string) {
    log(`Error: %c${error}`, 'color: red', 'code:', $editor.value);
    state.error = error;
    $error.innerHTML = error;
  }

  hideError() {
    log('Clear error');
    state.error = '';
    $error.innerHTML = '';
  }
}
