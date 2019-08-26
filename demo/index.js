import { html } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/raml-aware/raml-aware.js';
import '@api-components/api-navigation/api-navigation.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../api-type-document.js';

import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
class DemoElement extends AmfHelperMixin(LitElement) {}

window.customElements.define('demo-element', DemoElement);
class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this.endpointsOpened = false;
    this.typesOpened = true;
    this.hasType = false;

    // this._optionChanged = this._optionChanged.bind(this);
  }

  get narrow() {
    return this._narrow;
  }

  set narrow(value) {
    this._setObservableProperty('narrow', value);
  }

  get noActions() {
    return this._noActions;
  }

  set noActions(value) {
    this._setObservableProperty('noActions', value);
  }

  get dataProperties() {
    return this._dataProperties;
  }

  set dataProperties(value) {
    this._setObservableProperty('dataProperties', value);
  }

  get mediaType() {
    return this._mediaType;
  }

  set mediaType(value) {
    this._setObservableProperty('mediaType', value);
  }

  get mediaTypes() {
    return this._mediaTypes;
  }

  set mediaTypes(value) {
    this._setObservableProperty('mediaTypes', value);
  }

  get helper() {
    return document.getElementById('helper');
  }

  // _optionChanged(e) {
  //   const prop = e.target.id;
  //   const value = e.detail.value;
  //   setTimeout(() => {
  //     this[prop] = value;
  //   });
  // }

  _navChanged(e) {
    const { selected, type } = e.detail;
    this.hasType = false;
    this.mediaType = undefined;
    this.mediaTypes = undefined;

    if (type === 'type') {
      this.setTypeData(selected);
    } else if (type === 'method') {
      this.setBodyData(selected);
    }
  }

  setBodyData(id) {
    const helper = this.helper;
    const webApi = helper._computeWebApi(this.amf);
    const method = helper._computeMethodModel(webApi, id);
    const expects = helper._computeExpects(method);
    const payload = helper._computePayload(expects)[0];
    const mt = helper._getValue(payload, helper.ns.raml.vocabularies.http + 'mediaType');
    const key = helper._getAmfKey(helper.ns.raml.vocabularies.http + 'schema');
    let schema = payload && payload[key];
    if (!schema) {
      return;
    }
    schema = schema instanceof Array ? schema[0] : schema;
    this.dataProperties = schema;
    this.mediaType = mt;
    this.hasType = true;
  }

  setTypeData(id) {
    const helper = this.helper;
    const declares = helper._computeDeclares(this.amf);
    let type = declares.find((item) => item['@id'] === id);
    if (!type) {
      const refs = helper._computeReferences(this.amf);
      if (refs) {
        for (let i = 0; i < refs.length; i++) {
          const rd = helper._computeDeclares(refs[i]);
          if (!rd) {
            continue;
          }
          for (let j = 0; j < rd.length; j++) {
            if (rd[j]['@id'] === id) {
              type = rd[j];
              break;
            }
          }
          if (type) {
            break;
          }
        }
      }
    }
    if (!type) {
      console.error('Type not found');
      return;
    }
    this.dataProperties = type;
    this.hasType = true;

    let webApi = helper._computeWebApi(this.amf);
    if (webApi instanceof Array) {
      webApi = webApi[0];
    }
    const key = helper._getAmfKey(helper.ns.raml.vocabularies.http + 'accepts');
    const value = helper._ensureArray(webApi[key]);
    if (value) {
      this.mediaTypes = value.map((item) => item['@value']);
    }
  }

  // _headerTemplate() {
  //   return html`
  //   <header>
  //     <paper-dropdown-menu label="Select demo API">
  //       <paper-listbox slot="dropdown-content" id="apiList" @selected-changed="${this._apiChanged}">
  //       ${this._apiListTemplate()}
  //       </paper-listbox>
  //     </paper-dropdown-menu>
  //     <div class="spacer"></div>
  //     <div class="options">
  //       <paper-toggle-button @checked-changed="${this._optionChanged}"
  //         id="narrow">Render narrow view</paper-toggle-button>
  //       <paper-toggle-button @checked-changed="${this._optionChanged}"
  //         id="noActions">Remove actions from examples</paper-toggle-button>
  //     </div>
  //   </header>`;
  // }

  _apiListTemplate() {
    return html`
    <paper-item data-src="demo-api.json">Demo API</paper-item>
    <paper-item data-src="demo-api-compact.json">Demo API - compact</paper-item>
    <paper-item data-src="examples-api.json">Examples render demo api</paper-item>
    <paper-item data-src="examples-api-compact.json">Examples render demo - compact model</paper-item>
    <paper-item data-src="apic-83.json">APIC-83 (issue)</paper-item>
    <paper-item data-src="apic-83-compact.json">APIC-83 - compact model (issue)</paper-item>
    <paper-item data-src="Petstore.json">Petstore</paper-item>
    <paper-item data-src="Petstore-compact.json">Petstore - compact model (issue)</paper-item>
    <paper-item data-src="SE-10469.json">SE-10469 (issue)</paper-item>
    <paper-item data-src="SE-10469-compact.json">SE-10469 - compact model (issue)</paper-item>
    <paper-item data-src="SE-11155.json">SE-11155 (issue)</paper-item>
    <paper-item data-src="SE-11155-compact.json">SE-11155 - compact model (issue)</paper-item>`;
  }

  contentTemplate() {
    return html`
    <demo-element id="helper" .amf="${this.amf}"></demo-element>
    <raml-aware .api="${this.amf}" scope="model"></raml-aware>
    ${this.hasType ?
      html`<api-type-document
        ?narrow="${this.narrow}"
        aware="model"
        .type="${this.dataProperties}"
        .mediaType="${this.mediaType}"
        .mediaTypes="${this.mediaTypes}"
        ?noexamplesactions="${this.noActions}"></api-type-document>` :
      html`<p>Select type in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
