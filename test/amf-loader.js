import { LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

class HelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

export const AmfLoader = {};
AmfLoader.load = async function (compact, modelFile) {
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

AmfLoader.loadType = async function (name, compact, modelFile) {
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

AmfLoader.lookupEndpoint = function (model, endpoint) {
  helper.amf = model;
  const webApi = helper._computeWebApi(model);
  return helper._computeEndpointByPath(webApi, endpoint);
};

AmfLoader.lookupOperation = function (model, endpoint, operation) {
  const endPoint = AmfLoader.lookupEndpoint(model, endpoint, operation);
  const opKey = helper._getAmfKey(
    helper.ns.aml.vocabularies.apiContract.supportedOperation
  );
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find(
    (item) =>
      helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) ===
      operation
  );
};

AmfLoader.lookupParameters = function (model, endpoint, operation) {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  const expects = helper._computeExpects(op);
  return helper._ensureArray(helper._computeQueryParameters(expects));
};

AmfLoader.lookupPayload = function (model, endpoint, operation) {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  const expects = helper._computeExpects(op);
  return helper._ensureArray(helper._computePayload(expects));
};

AmfLoader.lookupPayloadProperty = function (model, payload, property) {
  helper.amf = model;
  const shape =
    payload[helper._getAmfKey(helper.ns.aml.vocabularies.shapes.schema)][0];
  const properties = shape[helper._getAmfKey(helper.ns.w3.shacl.property)];
  for (let i = 0; i < properties.length; i++) {
    const item = properties[i];
    const itemName = helper._getValue(item, helper.ns.w3.shacl.name);
    if (itemName === property) {
      return item;
    }
  }
};

AmfLoader.lookupArrayItemRange = function (model, array) {
  helper.amf = model;
  const range =
    array[helper._getAmfKey(helper.ns.aml.vocabularies.shapes.range)][0];
  helper._resolve(range);
  return range;
  // const key = helper._getAmfKey(helper.ns.aml.vocabularies.shapes.items);
  // const items = helper._ensureArray(range[key]);
  // const item = items[0];
  // console.log(range);
};

AmfLoader.lookupPropertyShape = function (model, type, property) {
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

AmfLoader.getResponseSchema = function (
  element,
  model,
  endpoint,
  method,
  statusCode
) {
  const rKey = element._getAmfKey(
    element.ns.aml.vocabularies.apiContract.returns
  );
  const operation = AmfLoader.lookupOperation(model, endpoint, method);
  const responses = operation[rKey];

  let status;
  for (let j = 0, jLen = responses.length; j < jLen; j++) {
    const s = responses[j];
    const value = element._getValue(
      s,
      element.ns.aml.vocabularies.apiContract.statusCode
    );
    if (value === statusCode) {
      status = s;
      break;
    }
  }

  const sKey = element._getAmfKey(
    element.ns.aml.vocabularies.apiContract.payload
  );
  const schemaKey = element._getAmfKey(
    element.ns.aml.vocabularies.shapes.schema
  );
  return status ? status[sKey][0][schemaKey] : status;
};
