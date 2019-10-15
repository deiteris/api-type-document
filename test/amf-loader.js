import { LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

class HelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

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
  let amf = await AmfLoader.load(compact, modelFile);
  if (amf instanceof Array) {
    amf = amf[0];
  }
  helper.amf = amf;
  const ns = helper.ns;
  const decKey = helper._getAmfKey(ns.aml.vocabularies.document.declares);
  const nameKey = helper._getAmfKey(ns.w3.shacl.name);

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
      return [amf, type];
    }
  }
};

AmfLoader.lookupEndpoint = function(model, endpoint) {
  helper.amf = model;
  const webApi = helper._computeWebApi(model);
  return helper._computeEndpointByPath(webApi, endpoint);
};

AmfLoader.lookupOperation = function(model, endpoint, operation) {
  const endPoint = AmfLoader.lookupEndpoint(model, endpoint, operation);
  const opKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.supportedOperation);
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find((item) => helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) === operation);
};

AmfLoader.lookupParameters = function(model, endpoint, operation) {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  const expects = helper._computeExpects(op);
  return helper._ensureArray(helper._computeQueryParameters(expects));
};

AmfLoader.lookupPropertyShape = function(model, type, property) {
  helper.amf = model;
  const propKey = helper._getAmfKey(helper.ns.w3.shacl.property);
  const props = type[propKey];
  for (let i = 0, len = props.length; i < len; i++) {
    const item = props[i];
    const itemName = helper._getValue(item, helper.ns.w3.shacl.name);
    if (itemName === property) {
      return item;
    }
  }
};
