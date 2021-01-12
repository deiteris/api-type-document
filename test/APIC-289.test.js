import { fixture, assert, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../property-shape-document.js';

describe('<property-shape-document>', () => {
  async function basicFixture(amf, shape) {
    return (fixture(html`<property-shape-document
      .amf="${amf}"
      .shape="${shape}"
      ></property-shape-document>`));
  }

  describe('APIC-289', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let element;
        let amf;
        before(async () => {
          amf = await AmfLoader.load(compact, 'APIC-289');
        });

        beforeEach(async () => {
          const params = AmfLoader.lookupParameters(amf, '/organization', 'get');
          element = await basicFixture(amf, params[0]);
        });

        it('computes name from "paramName" property', () => {
          assert.equal(element.propertyName, 'foo');
        });
      });
    });
  });
});
