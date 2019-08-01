import { fixture, assert, nextFrame } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import './test-document-mixin.js';

describe('<property-shape-document>', function() {
  async function basicFixture() {
    return (await fixture(`<property-shape-document></property-shape-document>`));
  }

  function getPropertyShape(element, type, name) {
    const propKey = element._getAmfKey(element.ns.w3.shacl.name + 'property');
    const props = type[propKey];
    for (let i = 0, len = props.length; i < len; i++) {
      const item = props[i];
      const itemName = element._getValue(item, element.ns.w3.shacl.name + 'name');
      if (itemName === name) {
        return item;
      }
    }
  }

  describe('_shapeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('sets range', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.typeOf(element.range, 'object', 'range is an object');
          const key = element._getAmfKey(element.ns.raml.vocabularies.shapes + 'range');
          const range = element._ensureArray(shape[key]);
          assert.deepEqual(element.range, range[0], 'range value is set');
        });

        it('sets isRequired', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isTrue(element.isRequired);
        });
      });
    });
  });

  describe('_rangeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('sets propertyDescription', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.typeOf(element.propertyDescription, 'string', 'propertyDescription is a string');
          const key = element._getAmfKey(element.ns.raml.vocabularies.shapes + 'range');
          const range = element._ensureArray(shape[key]);
          const desc = element._getValue(range[0], element.ns.schema.desc);
          assert.deepEqual(element.propertyDescription, desc, 'value is set');
        });

        it('sets propertyDescription', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isTrue(element.hasPropertyDescription);
        });

        it('sets isEnum to true when is enum', async () => {
          const shape = getPropertyShape(element, type, 'gender');
          element.shape = shape;
          assert.isTrue(element.isEnum);
        });

        it('sets isEnum to false when is not enum', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isEnum);
        });

        it('sets isUnion to true when is union', async () => {
          const shape = getPropertyShape(element, type, 'nillable');
          element.shape = shape;
          assert.isTrue(element.isUnion);
        });

        it('sets isUnion to false when is not union', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isUnion);
        });

        it('sets isObject to true when is enum', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.isTrue(element.isObject);
        });

        it('sets isObject to false when is not enum', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isObject);
        });

        it('sets isArray to true when array property', async () => {
          const data = await AmfLoader.loadType('PropertyArray', item[1]);
          const shape = getPropertyShape(element, data[1], 'data');
          element.shape = shape;
          assert.isTrue(element.isArray);
        });

        it('sets isArray to false when is not array', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isArray);
        });

        it('sets isComplex to true when is object', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.isTrue(element.isComplex);
        });

        it('sets isComplex to true when is union', async () => {
          const shape = getPropertyShape(element, type, 'nillable');
          element.shape = shape;
          assert.isTrue(element.isComplex);
        });

        it('sets isComplex to true when array property', async () => {
          const data = await AmfLoader.loadType('PropertyArray', item[1]);
          const shape = getPropertyShape(element, data[1], 'data');
          element.shape = shape;
          assert.isTrue(element.isComplex);
        });

        it('sets isComplex to false otherwise', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isComplex);
        });
      });
    });
  });

  describe('_shapeRangeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('sets displayName', async () => {
          const shape = getPropertyShape(element, type, 'newsletter');
          element.shape = shape;
          assert.equal(element.displayName, 'Newsletter consent');
        });

        it('sets displayName to propertyName when no name', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.equal(element.displayName, element.propertyName);
        });

        it('sets propertyName', async () => {
          const shape = getPropertyShape(element, type, 'newsletter');
          element.shape = shape;
          assert.equal(element.propertyName, 'newsletter');
        });

        it('sets hasDisplayName when has name', async () => {
          const shape = getPropertyShape(element, type, 'newsletter');
          element.shape = shape;
          assert.isTrue(element.hasDisplayName);
        });

        it('sets hasDisplayName when has no name', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.isFalse(element.hasDisplayName);
        });

        [
          ['image', 'Object'],
          ['favouriteTime', 'Time'],
          ['favouriteNumber', 'Number'],
          ['newsletter', 'Boolean'],
          ['fietype', 'File'],
          ['etag', 'String'],
          ['age', 'Integer'],
          ['nillable', 'Union'],
          ['birthday', 'Date']
        ].forEach(([property, dataType]) => {
          it(`sets propertyDataType to ${dataType}`, () => {
            const shape = getPropertyShape(element, type, property);
            element.shape = shape;
            assert.equal(element.propertyDataType, dataType, `sets ${dataType}`);
          });
        });
      });
    });
  });

  describe('_computePropertyName()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        function getShapeRange(element, type, propName) {
          const shape = getPropertyShape(element, type, propName);
          const key = element._getAmfKey(element.ns.raml.vocabularies.shapes + 'range');
          const range = element._ensureArray(shape[key])[0];
          return [shape, range];
        }

        it('returns undefined when no shape and no range', async () => {
          const result = element._computePropertyName();
          assert.isUndefined(result);
        });

        it('computes name for PropertyShape', () => {
          const [shape, range] = getShapeRange(element, type, 'favouriteTime');
          const result = element._computePropertyName(range, shape);
          assert.equal(result, 'favouriteTime');
        });
      });
    });
  });

  describe('a11y', () => {
    let element;
    let amf;
    let type;
    before(async () => {
      const data = await AmfLoader.loadType('AppPerson', true);
      amf = data[0];
      type = data[1];
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
    });

    it('is accessible for trivial property', async () => {
      const shape = getPropertyShape(element, type, 'favouriteTime');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible for enum property', async () => {
      const shape = getPropertyShape(element, type, 'gender');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible for complex property', async () => {
      const shape = getPropertyShape(element, type, 'image');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible for union property', async () => {
      const shape = getPropertyShape(element, type, 'nillable');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible for a property with an example', async () => {
      const shape = getPropertyShape(element, type, 'name');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element);
    });
  });
});
