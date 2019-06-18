import { LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { PropertyDocumentMixin } from '../property-document-mixin.js';

class TestDocumentMixin extends AmfHelperMixin(PropertyDocumentMixin(LitElement)) {
}
window.customElements.define('test-document-mixin', TestDocumentMixin);
