import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import './test-document-mixin.js';

describe('<property-range-document>', function() {
  async function basicFixture() {
    return (await fixture(`<property-range-document></property-range-document>`));
  }

  function findTypePropertyRange(element, type, index) {
    index = index || 0;
    type = element._resolve(type);
    const props = element._computeObjectProperties(type);
    const key = element._getAmfKey(element.ns.aml.vocabularies.shapes.range);
    return element._ensureArray(props[0][key])[index];
  }

  async function getTypePropertyRange(element, typeName, compact, index) {
    const data = await AmfLoader.loadType(typeName, compact);
    element.amf = data[0];
    return findTypePropertyRange(element, data[1], index);
  }

  describe('_rangeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Calls _rangeChanged() for property set', () => {
          const spy = sinon.spy(element, '_rangeChanged');
          element.range = {};
          assert.isTrue(spy.called);
        });

        it('Sets "isUnion" property', async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isUnion, 'isUnion is set');
          await nextFrame();
          assert.isTrue(element.hasAttribute('isunion'), 'isunion attribute is set');
        });

        it('Sets "isEnum" property', async () => {
          const data = await AmfLoader.loadType('Feature', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isEnum, 'isEnum is set');
          await nextFrame();
          assert.isTrue(element.hasAttribute('isenum'), 'isenum attribute is set');
        });

        it('Sets "enumValues" property', async () => {
          const data = await AmfLoader.loadType('Feature', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.typeOf(element.enumValues, 'array', 'enumValues is an array');
          assert.lengthOf(element.enumValues, 3, 'enumValues has 3 elements');
          await nextFrame();
          const node = element.shadowRoot.querySelector('.enum-values');
          assert.ok(node, 'Enum values are rendered');
        });

        it('Sets "isObject" property', async () => {
          const data = await AmfLoader.loadType('Notification', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isObject, 'isObject is set');
          await nextFrame();
          assert.isTrue(element.hasAttribute('isobject'), 'isobject attribute is set');
        });

        it('Sets "isArray" property', async () => {
          const data = await AmfLoader.loadType('Arrable2', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isArray, 'isArray is set');
          await nextFrame();
          assert.isTrue(element.hasAttribute('isarray'), 'isarray attribute is set');
        });

        it('Sets "isFile" property', async () => {
          /* eslint require-atomic-updates: 0 */
          const range = await getTypePropertyRange(element, 'FieType', item[1], 0);
          element.range = range;
          assert.isTrue(element.isFile, 'isFile is set');
          await nextFrame();
        });
      });
    });
  });

  describe('_computeObjectProperties()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Returns list of properties', async () => {
          const data = await AmfLoader.loadType('Notification', item[1]);
          element.amf = data[0];
          const result = element._computeObjectProperties(data[1]);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 2);
        });

        it('Returns undefined when no argument', async () => {
          const result = element._computeObjectProperties();
          assert.isUndefined(result);
        });
      });
    });
  });

  describe('_computeEnumValues()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Returns undefined when no argument', async () => {
          const result = element._computeEnumValues();
          assert.isUndefined(result);
        });

        it('Returns undefined when no "in" property', async () => {
          const result = element._computeEnumValues({});
          assert.isUndefined(result);
        });

        it('Returns list of properties', async () => {
          const data = await AmfLoader.loadType('Feature', item[1]);
          element.amf = data[0];
          const range = element._resolve(data[1]);
          const result = element._computeEnumValues(range);
          assert.deepEqual(result, ['1', '2', '3']);
        });
      });
    });
  });

  describe('File data rendering', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        let amf;
        let type;

        before(async () => {
          const data = await AmfLoader.loadType('FieType', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          element.range = findTypePropertyRange(element, type, 0);
          await aTimeout();
        });

        it('Renders file properties section', async () => {
          const node = element.shadowRoot.querySelector('.file-properties');
          assert.ok(node);
        });

        it('Renders file types', async () => {
          const node = element.shadowRoot.querySelectorAll('.file-properties > .property-attribute')[0];
          const target = node.querySelector('.attribute-value');
          assert.equal(target.innerText.trim().toLowerCase(), 'image/png, image/jpeg');
        });

        it('Renders file minimum size', async () => {
          const node = element.shadowRoot.querySelectorAll('.file-properties > .property-attribute')[1];
          const target = node.querySelector('.attribute-value');
          assert.equal(target.innerText.trim().toLowerCase(), '100');
        });

        it('Renders file maximum size', async () => {
          const node = element.shadowRoot.querySelectorAll('.file-properties > .property-attribute')[2];
          const target = node.querySelector('.attribute-value');
          assert.equal(target.innerText.trim().toLowerCase(), '300');
        });
      });
    });
  });

  describe('a11y', () => {
    let element;

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('is accessible', async () => {
      const data = await AmfLoader.loadType('ComplexRecursive');
      element.amf = data[0];
      element.range = data[1];
      await aTimeout();
      await assert.isAccessible(element);
    });
  });
});
