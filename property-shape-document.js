import { LitElement, html, css } from 'lit-element';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import { PropertyDocumentMixin } from './property-document-mixin.js';
import './api-type-document.js';
import './property-range-document.js';
/**
 * `property-shape-document`
 *
 * Renders a documentation for a shape property of AMF model.
 *
 * ## Styling
 *
 * `<property-shape-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--property-shape-document` | Mixin applied to this elment | `{}`
 * `--property-shape-document-array-color` | Property border color when type is an array | `#8BC34A`
 * `--property-shape-document-object-color` | Property border color when type is an object | `#FF9800`
 * `--property-shape-document-union-color` | Property border color when type is an union | `#FFEB3B`
 * `--arc-font-subhead` | Theme mixin, applied to the property title | `{}`
 * `--property-shape-document-title` | Mixin applied to the property title | `{}`
 * `--api-type-document-property-parent-color` | Color of the parent property label | `#757575`
 * `--api-type-document-property-color` | Color of the property name label when display name is used | `#757575`
 * `--api-type-document-child-docs-margin-left` | Margin left of item's description | `0px`
 * `--api-type-document-type-color` | Color of the "type" trait | `white`
 * `--api-type-document-type-background-color` | Background color of the "type" trait | `#1473bf`
 * `--api-type-document-trait-background-color` | Background color to main range trait (type name) | `#EEEEEE`,
 * `--api-type-document-trait-border-radius` | Border radious of a main property traits | `3px`
 * `--api-type-document-property-name-width` | Width of the left hand side column with property name | `240px`
 *
 * @customElement
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin PropertyDocumentMixin
 */
class PropertyShapeDocument extends PropertyDocumentMixin(LitElement) {
  get styles() {
    return [
      markdownStyles,
      css`:host {
        display: block;
        border-bottom-width: 1px;
        border-bottom-color: var(--property-shape-document-border-bottom-color, #CFD8DC);
        border-bottom-style: var(--property-shape-document-border-bottom-style, dashed);
        padding: var(--property-shape-document-padding);
      }

      :host(:last-of-type) {
        border-bottom: none;
      }

      [hidden] {
        display: none !important;
      }

      .property-title {
        font-size: var(--property-shape-document-title-font-size, var(--arc-font-subhead-font-size));
        font-weight: var(--property-shape-document-title-font-weight, var(--arc-font-subhead-font-weight));
        line-height: var(--property-shape-document-title-line-height, var(--arc-font-subhead-line-height));

        margin: 4px 0 4px 0;
        font-size: 1rem;
        font-weight: var(--api-type-document-property-title-font-weight, 500);
        word-break: break-word;
        color: var(--api-type-document-property-title-color);
      }

      .property-title[secondary] {
        font-weight: var(--api-type-document-property-title-secondary-font-weight, 400);
        color: var(--api-type-document-property-title-secondary-color, #616161);
      }

      .parent-label {
        color: var(--api-type-document-property-parent-color, #757575);
      }

      .property-display-name {
        font-weight: var(--api-type-document-property-name-font-weight, 500);
        color: var(--api-type-document-property-name-color, var(--api-type-document-property-color, #212121));
        margin: 4px 0 4px 0;
        font-size: var(--api-type-document-property-name-font-size, 16px);
      }

      api-type-document,
      property-range-document {
        transition: background-color 0.4s linear;
      }

      :host([isobject]) api-type-document.complex,
      :host([isunion]) api-type-document.complex,
      :host([isarray]) api-type-document.complex {
        padding-left: var(--api-type-document-child-docs-padding-left, 20px);
        margin-left: var(--api-type-document-child-docs-margin-left, 0px);
        padding-right: var(--api-type-document-child-docs-padding-right, initial);
      }

      :host([isobject]) api-type-document,
      :host([isobject]) property-range-document {
        border-left-color: var(--property-shape-document-object-color, #FF9800);
        border-left-width: 2px;
        border-left-style: solid;
        padding-left: 12px;
      }

      :host([isarray]) api-type-document,
      :host([isarray]):not([isscalararray]) property-range-document {
        border-left: 2px var(--property-shape-document-array-color, #8BC34A) solid;
        padding-left: 12px;
      }

      :host([isunion]) api-type-document,
      :host([isunion]) property-range-document {
        border-left: 2px var(--property-shape-document-union-color, #FFEB3B) solid;
        padding-left: 12px;
      }

      .property-traits {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }

      .property-traits > span {
        display: inline-block;
        margin-right: 8px;
        padding: var(--api-type-document-trait-padding, 2px 4px);
        background-color: var(--api-type-document-trait-background-color, #EEEEEE);
        color: var(--api-type-document-trait-color, #616161);
        border-radius: var(--api-type-document-trait-border-radius, 3px);
        font-size: var(--api-type-document-trait-font-size, 13px);
      }

      .property-traits > span.data-type {
        background-color: var(--api-type-document-type-background-color, #1473bf);
        color: var(--api-type-document-type-color, white);
        padding: var(--api-type-document-trait-data-type-padding, 2px 4px);
        font-weight: var(--api-type-document-trait-data-type-font-weight, normal);
      }

      arc-marked {
        background-color: transparent;
        padding: 0;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .link-label {
        text-decoration: underline;
        cursor: pointer;
      }

      .shape-header {
        display: flex;
        flex-direction: row;
        align-items: start;
      }

      .name-area {
        flex: 1;
      }`
    ];
  }

  static get properties() {
    return {
      /**
       * Computed value of shape's http://raml.org/vocabularies/shapes#range
       * @type {Object}
       */
      range: { type: Object },
      /**
       * Computed value of "display name" of the property
       */
      displayName: { type: String },
      /**
       * A type property name.
       * This may be different from `displayName` property if
       * `displayName` was specified in the API spec for this property.
       */
      propertyName: { type: String },
      /**
       * Computed value, true if `displayName` has been defined for this
       * property.
       */
      hasDisplayName: { type: Boolean },
      /**
       * Computed value, true if current property is an union.
       */
      isUnion: {
        type: Boolean,
        reflect: true
      },
      /**
       * Computed value, true if current property is an object.
       */
      isObject: {
        type: Boolean,
        reflect: true
      },
      /**
       * Computed value, true if current property is an array.
       */
      isArray: {
        type: Boolean,
        reflect: true
      },
      /**
       * Computed value, true if current property is an array and the item
       * is a scalar.
       */
      isScalarArray: { type: Boolean, reflect: true },
      /**
       * Computed value, true if this propery contains a complex
       * structure. It is computed when the property is and array,
       * object, or union.
       */
      isComplex: { type: Boolean },
      /**
       * Should be set if described properties has a parent type.
       * This is used when recursively iterating over properties.
       */
      parentTypeName: { type: String },
      /**
       * Computed value, true if `parentTypeName` has a value.
       */
      hasParentTypeName: { type: Boolean },
      /**
       * Computed value of shape data type
       * @type {Object}
       */
      propertyDataType: { type: String },
      /**
       * Computed value form the shape. True if the property is required.
       */
      isRequired: { type: Boolean },
      /**
       * Computed value form the shape. True if the property is ENUM.
       */
      isEnum: { type: Boolean },
      /**
       * A description of the property to render.
       */
      propertyDescription: { type: String },
      /**
       * Computed value, true if desceription is set.
       */
      hasPropertyDescription: { type: Boolean },
      /**
       * A property to set when the component is rendered in the narrow
       * view. To be used with mobile rendering or when the
       * components occupies only small part of the screen.
       */
      narrow: {
        type: Boolean,
        reflect: true
      },
      /**
       * When set it removes actions bar from the examples render.
       */
      noExamplesActions: { type: Boolean },

      _targetTypeId: { type: String },
      _targetTypeName: { type: String },
      /**
       * When `isComplex` is true this determines if ther complex structure
       * is currently rendered.
       */
      opened: { type: Boolean }
    };
  }

  get shape() {
    return this._shape;
  }

  set shape(value) {
    if (this._setObservableProperty('shape', value)) {
      this._shapeChanged(value);
      this._shapeRangeChanged(value, this._range);
    }
  }

  get range() {
    return this._range;
  }

  set range(value) {
    if (this._setObservableProperty('range', value)) {
      this._rangeChanged(value);
      this._shapeRangeChanged(this._shape, value);
    }
  }

  get parentTypeName() {
    return this._parentTypeName;
  }

  set parentTypeName(value) {
    if (this._setObservableProperty('parentTypeName', value)) {
      this.hasParentTypeName = !!value;
    }
  }

  get complexToggleLabel() {
    return this.opened ? 'Hide' : 'Show';
  }

  get _renderToggleButton() {
    const { isComplex, isScalarArray } = this;
    return isComplex && !isScalarArray;
  }

  get arrayScalarTypeName() {
    const { range } = this;
    try {
      const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
      const items = this._ensureArray(range[key]);
      const item = items[0];
      const dkey = this._getAmfKey(this.ns.w3.shacl.datatype);
      let type = this._ensureArray(item[dkey]);
      type = type[0]['@id'];
      type = type.replace(this.ns.w3.xmlSchema.key, '');
      const stLetter = type[0].toUpperCase();
      return `${stLetter}${type.substr(1)}`;
    } catch (_) {
      return 'Unknown';
    }
  }

  constructor() {
    super();
    this.hasDisplayName = false;
    this.hasParentTypeName = false;
    this.hasPropertyDescription = false;
  }

  __amfChanged() {
    this._shapeChanged(this._shape);

    this._evaluateGraph();
  }

  _shapeChanged(shape) {
    if (!this._amf) {
      return;
    }
    this.range = this._computeRange(shape);
    this.isRequired = this._computeIsRequired(shape);
  }

  _rangeChanged(range) {
    this.propertyDescription = this._computeDescription(range);
    this.hasPropertyDescription = this._computeHasStringValue(this.propertyDescription);
    this.isEnum = this._computeIsEnum(range);
    this.isUnion = this._computeIsUnion(range);
    this.isObject = this._computeIsObject(range);
    const isArray = this.isArray = this._computeIsArray(range);
    this.isComplex = this._computeIsComplex(this.isUnion, this.isObject, this.isArray);
    this.isScalarArray = isArray ? this._computeIsScalarArray(range) : false;
    this._evaluateGraph();
  }

  _shapeRangeChanged(shape, range) {
    this.displayName = this._computeDisplayName(range, shape);
    this.propertyName = this._computePropertyName(range, shape);
    this.hasDisplayName = this._computeHasDisplayName(this.displayName, this.propertyName);
    this.propertyDataType = this._computeObjectDataType(range, shape);
  }

  _computeObjectDataType(range, shape) {
    let type = range && this._computeRangeDataType(this._resolve(range));
    if (!type) {
      type = shape && this._computeRangeDataType(this._resolve(shape));
    }
    return type;
  }
  /**
   * Computes name of the property. This may be different from the
   * `displayName` if `displayName` is set in API spec.
   *
   * @param {Object} range Range object of current shape.
   * @param {Object} shape The shape object
   * @return {String} Display name of the property
   */
  _computePropertyName(range, shape) {
    if (!shape && !range) {
      return;
    }
    if (shape) {
      shape = this._resolve(shape);
      if (this._hasType(shape, this.ns.aml.vocabularies.apiContract.Parameter)) {
        // https://www.mulesoft.org/jira/browse/APIC-289
        let name = this._getValue(shape, this.ns.aml.vocabularies.apiContract.paramName);
        if (!name) {
          name = this._getValue(shape, this.ns.aml.vocabularies.core.name);
        }
        return name;
      }
      if (this._hasType(shape, this.ns.w3.shacl.PropertyShape) ||
        this._hasType(shape, this.ns.aml.vocabularies.shapes.NilShape) ||
        this._hasType(shape, this.ns.aml.vocabularies.shapes.AnyShape)) {
        const name = this._getValue(shape, this.ns.w3.shacl.name);
        if (name && name.indexOf('amf_inline_type') === 0) {
          return;
        }
        return name;
      }
    }
    if (range) {
      range = this._resolve(range);
      const name = this._getValue(range, this.ns.w3.shacl.name);
      if (name === 'items' &&
      this._hasType(shape, this.ns.aml.vocabularies.shapes.ScalarShape)) {
        return;
      }
      return name;
    }
  }
  /**
   * Computes value for `hasDisplayName` property.
   * Indicates that `displayName` has been defined in the API specification.
   *
   * @param {String} displayName
   * @param {String} propertyName
   * @return {Boolean}
   */
  _computeHasDisplayName(displayName, propertyName) {
    return !!(displayName) && displayName !== propertyName;
  }
  /**
   * Computes value for `hasParentTypeName`.
   * @param {String?} parentTypeName
   * @return {Boolean}
   */
  _computeHasParentTypeName(parentTypeName) {
    return !!parentTypeName;
  }
  /**
   * Computes value for `isRequired` property.
   * In AMF model a property is required when `http://www.w3.org/ns/shacl#minCount`
   * does not equal `0`.
   *
   * @param {Object} shape Current shape object
   * @return {Boolean}
   */
  _computeIsRequired(shape) {
    if (!shape) {
      return false;
    }
    shape = this._resolve(shape);
    if (this._hasType(shape, this.ns.aml.vocabularies.http.Parameter)) {
      return this._getValue(shape, this.ns.aml.vocabularies.apiContract.required);
    }
    const data = this._getValue(shape, this.ns.w3.shacl.minCount);
    return data !== undefined && data !== 0;
  }
  /**
   * Computes value `isEnum` property.
   * @param {Object} range Current `range` object.
   * @return {Boolean} Curently it always returns `false`
   */
  _computeIsEnum(range) {
    const ikey = this._getAmfKey(this.ns.w3.shacl.in);
    return !!(range && (ikey in range));
  }
  /**
   * Computes value for `propertyDescription`.
   * @param {Object} range Range model
   * @return {String} Description to render.
   */
  _computeDescription(range) {
    if (!range) {
      return;
    }
    return this._getValue(range, this.ns.aml.vocabularies.core.description);
  }
  /**
   * Computes value for `isComplex` property.
   * @param {Boolean} isUnion
   * @param {Boolean} isObject
   * @param {Boolean} isArray
   * @return {Boolean}
   */
  _computeIsComplex(isUnion, isObject, isArray) {
    return isUnion || isObject || isArray;
  }

  _evaluateGraph() {
    this._targetTypeId = undefined;
    this._targetTypeName = undefined;
    if (!this.graph) {
      return;
    }
    const { amf, range } = this;
    if (!amf || !range) {
      return;
    }
    const sKey = this._getAmfKey(this.ns.aml.vocabularies.docSourceMaps.sources);
    const maps = this._ensureArray(range[sKey]);
    if (!maps) {
      return;
    }
    const dKey = this._getAmfKey(this.ns.aml.vocabularies.docSourceMaps.declaredElement);
    const dElm = this._ensureArray(maps[0][dKey]);
    if (!dElm) {
      return;
    }
    const id = this._getValue(dElm[0], this.ns.aml.vocabularies.docSourceMaps.element);
    this._targetTypeId = id;
    const type = this._getType(amf, id);
    if (!type) {
      return;
    }

    this._targetTypeName = this._getValue(type, this.ns.w3.shacl.name);
  }

  _getType(amf, id) {
    const dcs = this._computeDeclares(amf);
    let refs; // this._computeReferences(amf);
    return this._computeType(dcs, refs, id);
  }

  _navigateType() {
    const e = new CustomEvent('api-navigation-selection-changed', {
      bubbles: true,
      composed: true,
      detail: {
        selected: this._targetTypeId,
        type: 'type'
      }
    });
    this.dispatchEvent(e);
  }

  _linkKeydown(e) {
    if (e.key === 'Enter') {
      this._navigateType();
    }
  }

  toggle() {
    this.opened = !this.opened;
  }
  /**
   * @param {Object} range The range definition.
   * @return {Boolean} True when the proeprty type is Array and the items on the
   * array are scalars only.
   */
  _computeIsScalarArray(range) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
    const items = this._ensureArray(range[key]);
    if (!items) {
      return false;
    }
    const item = items[0];
    return this._hasType(item, this.ns.aml.vocabularies.shapes.ScalarShape);
  }

  _complexTemplate() {
    if (!this.isComplex || !this.opened || this.isScalarArray) {
      return;
    }
    const range = this._resolve(this.range);
    const parentTypeName = this.isArray ? 'item' : this.displayName;
    return html`<api-type-document
      class="children complex"
      .amf="${this.amf}"
      .type="${range}"
      .parentTypeName="${parentTypeName}"
      ?narrow="${this.narrow}"
      ?compatibility="${this.compatibility}"
      ?noexamplesactions="${this.noExamplesActions}"
      nomainexample
      .mediaType="${this.mediaType}"
      ?graph="${this.graph}"
    ></api-type-document>`;
  }

  _getTypeNameTemplate() {
    let dataType = this.propertyDataType;
    const id = this._targetTypeId;
    const { isScalarArray } = this;
    if (id) {
      const label = this._targetTypeName;
      return html`
        <span
          class="data-type link-label"
          role="link"
          tabindex="0"
          @click="${this._navigateType}"
          @keydown="${this._linkKeydown}">${label}</span>
        <span class="type-data-type">${dataType}</span>
      `;
    }
    if (isScalarArray) {
      const itemType = this.arrayScalarTypeName;
      dataType = `${dataType} of ${itemType}`
    }
    return html`<span class="data-type">${dataType}</span>`;
  }

  _descriptionTemplate() {
    if (!this.hasPropertyDescription) {
      return '';
    }
    return html`
    <arc-marked .markdown="${this.propertyDescription}" sanitize>
      <div slot="markdown-html" class="markdown-body"></div>
    </arc-marked>
    `;
  }

  _headerTemplate() {
    const {
      isComplex,
      _renderToggleButton
    } = this;
    return isComplex ? html`<div class="shape-header">
      <div class="name-area">
        ${this._headerNameTemplate()}
      </div>
      ${_renderToggleButton ? html`<anypoint-button
        class="complex-toggle"
        @click="${this.toggle}"
        ?compatibility="${this.compatibility}"
        title="Toggles complex propery documentation"
      >${this.complexToggleLabel}</anypoint-button>` : ''}
    </div>` : this._headerNameTemplate();
  }

  _headerNameTemplate() {
    const {
      hasDisplayName,
      displayName,
      propertyName,
      parentTypeName,
      hasParentTypeName
    } = this;
    return html`
    ${hasDisplayName ? html`<div class="property-display-name">${displayName}</div>` : ''}
    ${propertyName ? html`<div class="property-title" ?secondary="${hasDisplayName}">
      <span class="parent-label" ?hidden="${!hasParentTypeName}">${parentTypeName}.</span>
      <span class="property-name">${propertyName}</span>
    </div>` : undefined}`;
  }

  render() {
    return html`<style>${this.styles}</style>
    ${this._headerTemplate()}
    <div class="property-traits">
      ${this._getTypeNameTemplate()}
      ${this.isRequired ?
        html`<span class="required-type" title="This property is required by the API">Required</span>` : undefined}
      ${this.isEnum ?
        html`<span class="enum-type" title="This property represent enumerable value">Enum</span>` : undefined}
    </div>
    ${this._descriptionTemplate()}
    <property-range-document
      .amf="${this.amf}"
      .shape="${this.shape}"
      .range="${this.range}"
      ?compatibility="${this.compatibility}"
      ?noexamplesactions="${this.noExamplesActions}"
      .mediaType="${this.mediaType}"
      .propertyName="${this.propertyName}"
      ?graph="${this.graph}"
    ></property-range-document>
    ${this._complexTemplate()}`;
  }
}
window.customElements.define('property-shape-document', PropertyShapeDocument);
