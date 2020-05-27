import { LitElement } from 'lit-element';
import { PropertyDocumentMixin } from '../property-document-mixin.js';

class TestDocumentMixin extends PropertyDocumentMixin(LitElement) {}
window.customElements.define('test-document-mixin', TestDocumentMixin);
