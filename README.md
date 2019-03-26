[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-type-document.svg)](https://www.npmjs.com/package/@api-components/api-type-document)

[![Build Status](https://travis-ci.org/api-components/api-type-document.svg?branch=stage)](https://travis-ci.org/api-components/api-type-document)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/api-components/api-type-document)

## &lt;api-type-document&gt;

A documentation table for type (resource) properties. Works with AMF data model.

```html
<api-type-document></api-type-document>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @api-components/api-type-document
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-type-document/api-type-document.js';
    </script>
  </head>
  <body>
    <api-type-document></api-type-document>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@api-components/api-type-document/api-type-document.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <api-type-document></api-type-document>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/api-components/api-type-document
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
