import {PolymerElement} from '../../../@polymer/polymer/polymer-element.js';
import {AmfHelperMixin} from '../../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
import {PropertyDocumentMixin} from '../property-document-mixin.js';
class TestDocumentMixin extends AmfHelperMixin(PropertyDocumentMixin(PolymerElement)) {
  static get is() {
    return 'test-document-mixin';
  }
}
window.customElements.define(TestDocumentMixin.is, TestDocumentMixin);
