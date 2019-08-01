import { LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

class TestHelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', TestHelperElement);

export const AmfLoader = {};
AmfLoader.load = async function(compact, modelFile) {
  modelFile = modelFile || 'demo-api';
  const file = '/' + modelFile + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      const data = JSON.parse(e.target.response);
      resolve(data);
    });
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.loadType = async function(name, compact, modelFile) {
  return AmfLoader.load(compact, modelFile)
  .then((amf) => {
    const data = amf;
    if (amf instanceof Array) {
      amf = amf[0];
    }
    const helper = new TestHelperElement();
    helper.amf = data;
    const ns = helper.ns;
    const decKey = helper._getAmfKey(ns.raml.vocabularies.document + 'declares');
    const nameKey = helper._getAmfKey(ns.w3.shacl.name + 'name');

    const defs = amf[decKey];
    for (let i = 0; i < defs.length; i++) {
      let type = defs[i];
      if (type instanceof Array) {
        type = type[0];
      }
      let nameData = type[nameKey];
      if (!nameData) {
        continue;
      }
      if (nameData instanceof Array) {
        nameData = nameData[0];
      }
      const typeName = nameData['@value'];
      if (typeName === name) {
        return [data, type];
      }
    }
  });
};
