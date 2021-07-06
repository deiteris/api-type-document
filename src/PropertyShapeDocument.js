import { LitElement, html } from 'lit-element';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import { PropertyDocumentMixin } from './PropertyDocumentMixin.js';
import shapeStyles from './ShapeStyles.js';

/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

/**
 * Renders a documentation for a shape property of AMF model.
 */
export class PropertyShapeDocument extends PropertyDocumentMixin(LitElement) {
  get styles() {
    return [markdownStyles, shapeStyles];
  }

  static get properties() {
    return {
      /**
       * Computed value of shape's http://raml.org/vocabularies/shapes#range
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
      isUnion: { type: Boolean, reflect: true, },
      /**
       * Computed value, true if current property is an object.
       */
      isObject: { type: Boolean, reflect: true, },
      /**
       * Computed value, true if current property is an array.
       */
      isArray: { type: Boolean, reflect: true, },
      /**
       * Computed value, true if current property is an array and the item
       * is a scalar.
       */
      isScalarArray: { type: Boolean, reflect: true },
      /**
       * Computed value, true if this property contains a complex
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
       * Computed value form the shape. True if the property is read only.
       */
      isReadOnly: { type: Boolean },
      /**
       * A description of the property to render.
       */
      propertyDescription: { type: String },
      /**
       * A description of the shape to render.
       */
      shapeDescription: { type: String },      
      /**
       * Computed value, true if description is set.
       */
      hasPropertyDescription: { type: Boolean },
      /**
       * Computed value, true if description is set.
       */
      hasShapeDescription: { type: Boolean },
      /**
       * A property to set when the component is rendered in the narrow
       * view. To be used with mobile rendering or when the
       * components occupies only small part of the screen.
       */
      narrow: { type: Boolean, reflect: true, },
      /**
       * When set it removes actions bar from the examples render.
       */
      noExamplesActions: { type: Boolean },

      _targetTypeId: { type: String },
      _targetTypeName: { type: String },
      /**
       * When `isComplex` is true this determines if the complex structure
       * is currently rendered.
       */
      opened: { type: Boolean },
      renderReadOnly: { type: Boolean },
      /**
       * Computed value from the shape. True if the property is an anyOf
       */
      isAnyOf: { type: Boolean },
      /**
       * Determines if shape's range is deprecated
       */
      deprecated: { type: Boolean, reflect: true },
    };
  }

  get shape() {
    return this._shape;
  }

  set shape(value) {
    const old = this._shape;
    if (old === value) {
      return;
    }
    this._shape = value;
    this._shapeChanged(value);
    this._shapeRangeChanged(value, this.range);
    this.requestUpdate('shape', old);
  }

  get range() {
    return this._range;
  }

  set range(value) {
    const old = this._range;
    if (old === value) {
      return;
    }
    this._range = value;
    this._rangeChanged(value);
    this._shapeRangeChanged(this._shape, value);
    this.requestUpdate('range', old);
  }

  get parentTypeName() {
    return this._parentTypeName;
  }

  set parentTypeName(value) {
    const old = this._parentTypeName;
    if (old === value) {
      return;
    }
    this._parentTypeName = value;
    this.hasParentTypeName = !!value;
    this.requestUpdate('hasParentTypeName', old);
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
      const dataKey = this._getAmfKey(this.ns.w3.shacl.datatype);
      let type = this._ensureArray(item[dataKey]);
      [type] = type;
      let typed = String(type['@id']);
      typed = typed.replace(this.ns.w3.xmlSchema.key, '');
      typed = typed.replace(this.ns.aml.vocabularies.shapes.toString(), '');
      const stLetter = typed[0].toUpperCase();
      return `${stLetter}${typed.substr(1)}`;
    } catch (_) {
      return 'Unknown';
    }
  }

  constructor() {
    super();
    this.hasDisplayName = false;
    this.hasParentTypeName = false;
    this.hasPropertyDescription = false;
    this.narrow = false;
    this.renderReadOnly = false;
    this.deprecated = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // @ts-ignore
    if (window.ShadyCSS) {
      // @ts-ignore
      window.ShadyCSS.styleElement(this);
    }
  }

  __amfChanged() {
    this._shapeChanged(this._shape);

    this._evaluateGraph();
  }

  _shapeChanged(shape) {
    if (!this.amf) {
      return;
    }
    this.range = this._computeRange(shape);
    this.isRequired = this._computeIsRequired(shape);
    this.shapeDescription = this._computeDescription(shape);
    this.hasShapeDescription = this._computeHasStringValue(
      this.shapeDescription
    );
  }

  _rangeChanged(range) {
    this.propertyDescription = this._computeDescription(range);
    this.hasPropertyDescription = this._computeHasStringValue(
      this.propertyDescription
    );
    this.isUnion = this._computeIsUnion(range);
    this.isObject = this._computeIsObject(range);
    this.isArray = this._computeIsArray(range);
    this.isEnum = this._computeIsEnum(range, this.isArray);
    this.isReadOnly = this._isReadOnly(range);
    this.isUniqueOnly = this._computeIsUniqueOnly(range, this.isArray);
    this.isAnyOf = this._computeIsAnyOf(range);
    this.isComplex = this._computeIsComplex(
      this.isUnion,
      this.isObject,
      this.isArray,
      this.isAnyOf
    );
    this.isScalarArray = this.isArray
      ? this._computeIsScalarArray(range)
      : false;
    this._evaluateGraph();
  }

  _shapeRangeChanged(shape, range) {
    this.displayName = this._computeDisplayName(range, shape);
    this.propertyName = this._computePropertyName(range, shape);
    this.hasDisplayName = this._computeHasDisplayName(
      this.displayName,
      this.propertyName
    );
    this.propertyDataType = this._computeObjectDataType(range, shape);
    const isDeprecated = Boolean(this._computeIsDeprecated(range));
    this.deprecated = isDeprecated;
  }

  _computeIsDeprecated(range) {
    return this._getValue(range, this._getAmfKey(this.ns.aml.vocabularies.shapes.deprecated))
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
   * @return {String|undefined} Display name of the property
   */
  _computePropertyName(range, shape) {
    if (!shape && !range) {
      return undefined;
    }
    if (shape) {
      shape = this._resolve(shape);
      if (
        this._hasType(shape, this.ns.aml.vocabularies.apiContract.Parameter)
      ) {
        // https://www.mulesoft.org/jira/browse/APIC-289
        let name = this._getValue(
          shape,
          this.ns.aml.vocabularies.apiContract.paramName
        );
        if (!name) {
          name = this._getValue(shape, this.ns.aml.vocabularies.core.name);
        }
        return String(name);
      }
      if (
        this._hasType(shape, this.ns.w3.shacl.PropertyShape) ||
        this._hasType(shape, this.ns.aml.vocabularies.shapes.NilShape) ||
        this._hasType(shape, this.ns.aml.vocabularies.shapes.AnyShape)
      ) {
        const name = /** @type string */ (this._getValue(
          shape,
          this.ns.w3.shacl.name
        ));
        if (name === undefined) {
          return undefined
        }
        if (name && name.indexOf('amf_inline_type') === 0) {
          return undefined;
        }
        return String(name);
      }
    }
    if (range) {
      range = this._resolve(range);
      const name = this._getValue(range, this.ns.w3.shacl.name);
      if (
        name === 'items' &&
        this._hasType(shape, this.ns.aml.vocabularies.shapes.ScalarShape)
      ) {
        return undefined;
      }
      return String(name);
    }
    return undefined;
  }

  /**
   * Computes value for `hasDisplayName` property.
   * Indicates that `displayName` has been defined in the API specification.
   *
   * @param {string} displayName
   * @param {string} propertyName
   * @return {boolean}
   */
  _computeHasDisplayName(displayName, propertyName) {
    return !!displayName && displayName !== propertyName;
  }

  /**
   * Computes value for `hasParentTypeName`.
   * @param {string=} parentTypeName
   * @return {boolean}
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
   * @return {boolean}
   */
  _computeIsRequired(shape) {
    if (!shape) {
      return false;
    }
    shape = this._resolve(shape);
    if (this._hasType(shape, this.ns.aml.vocabularies.apiContract.Parameter)) {
      return /** @type boolean */ (this._getValue(
        shape,
        this.ns.aml.vocabularies.apiContract.required
      ));
    }
    const data = this._getValue(shape, this.ns.w3.shacl.minCount);
    return data !== undefined && data !== 0;
  }

  /**
   * Computes value `isEnum` property.
   * @param {Object} range Current `range` object
   * @param {Boolean} isArray
   * @return {Boolean}
   */
  _computeIsEnum(range, isArray) {
    if (!range) {
      return false;
    }
    if (isArray) {
      return this._computeIsEnumArray(range);
    }

    const inKey = this._getAmfKey(this.ns.w3.shacl.in);
    return inKey in range;
  }

  /**
   * Computes value `isUnique` property.
   * @param {Object} range Current `range` object
   * @param {Boolean} isArray
   * @return {Boolean}
   */
  _computeIsUniqueOnly(range, isArray) {
    if (!range) {
      return false;
    }
    if (!isArray) {
      return false;
    }

    return 'raml-shapes:uniqueItems' in range && range['raml-shapes:uniqueItems'][0]['@value'];
  }

  /**
   * @param {Object} range Current `range` object
   * @return {Boolean}
   */
  _computeIsEnumArray(range) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
    const items = this._ensureArray(range[key]);
    if (!items) {
      return false;
    }
    const item = items[0];
    const inKey = this._getAmfKey(this.ns.w3.shacl.in);
    return inKey in item;
  }

  /**
   * Computes value for `propertyDescription`.
   * @param {Object} range Range model
   * @return {String|undefined} Description to render.
   */
  _computeDescription(range) {
    if (!range) {
      return undefined;
    }
    return /** @type string */ (this._getValue(
      range,
      this.ns.aml.vocabularies.core.description
    ));
  }

  /**
   * Computes value for `isComplex` property.
   * @param {boolean} isUnion
   * @param {boolean} isObject
   * @param {boolean} isArray
   * @return {boolean}
   */
  _computeIsComplex(isUnion, isObject, isArray, isAnyOf) {
    return isUnion || isObject || isArray || isAnyOf;
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
    const sKey = this._getAmfKey(
      this.ns.aml.vocabularies.docSourceMaps.sources
    );
    const maps = this._ensureArray(range[sKey]);
    if (!maps) {
      return;
    }
    const dKey = this._getAmfKey(
      this.ns.aml.vocabularies.docSourceMaps.declaredElement
    );
    const dElm = this._ensureArray(maps[0][dKey]);
    if (!dElm) {
      return;
    }
    const id = this._getValue(
      dElm[0],
      this.ns.aml.vocabularies.docSourceMaps.element
    );
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
        type: 'type',
      },
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
   * @return {boolean} True when the property type is Array and the items on the
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

  /**
   * @return {TemplateResult|string} Template for a complex shape (object/array/union)
   */
  _complexTemplate() {
    if (!this.isComplex || !this.opened || this.isScalarArray) {
      return '';
    }
    const range = this._resolve(this.range);
    const parentTypeName = this.isArray ? 'item' : this.displayName;
    return html`<api-type-document
      class="children complex"
      .amf="${this.amf}"
      ?renderReadOnly="${this.renderReadOnly}"
      .type="${range}"
      .parentTypeName="${parentTypeName}"
      ?narrow="${this.narrow}"
      ?compatibility="${this.compatibility}"
      ?noExamplesActions="${this.noExamplesActions}"
      noMainExample
      .mediaType="${this.mediaType}"
      ?graph="${this.graph}"
    ></api-type-document>`;
  }

  /**
   * @return {TemplateResult} Template for a type name label
   */
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
          @keydown="${this._linkKeydown}"
          >${label}</span
        >
        <span class="type-data-type">${dataType}</span>
      `;
    }
    if (isScalarArray) {
      const itemType = this.arrayScalarTypeName;
      dataType = `${dataType} of ${itemType}`;
    }
    return html`<span class="data-type">${dataType}</span>`;
  }

  /**
   * @return {TemplateResult|string} Template for the description
   */
  _descriptionTemplate() {
    if (!(this.hasPropertyDescription || this.hasShapeDescription)) {
      return '';
    }
    return html`
      <arc-marked .markdown="${this.propertyDescription || this.shapeDescription}" sanitize>
        <div slot="markdown-html" class="markdown-body"></div>
      </arc-marked>
    `;
  }

  /**
   * @return {TemplateResult} Template for type name header
   */
  _headerTemplate() {
    const { isComplex, _renderToggleButton } = this;
    return isComplex
      ? html`<div class="shape-header">
          <div class="name-area">
            ${this._headerNameTemplate()}
          </div>
          ${_renderToggleButton
            ? html`<anypoint-button
                class="complex-toggle"
                @click="${this.toggle}"
                ?compatibility="${this.compatibility}"
                title="Toggles complex property documentation"
                >${this.complexToggleLabel}</anypoint-button
              >`
            : ''}
        </div>`
      : this._headerNameTemplate();
  }

  /**
   * @return {TemplateResult} Template for a type name label
   */
  _headerNameTemplate() {
    const {
      hasDisplayName,
      displayName,
      propertyName,
      parentTypeName,
      hasParentTypeName,
    } = this;
    return html` ${hasDisplayName
      ? html`<div class="property-display-name">${displayName}</div>`
      : ''}
    ${propertyName
      ? html`<div class="property-title" ?secondary="${hasDisplayName}">
          <span class="parent-label" ?hidden="${!hasParentTypeName}"
            >${parentTypeName}.</span
          >
          <span class="property-name">${propertyName}</span>
        </div>`
      : ''}`;
  }

  _deprecatedWarningTemplate() {
    if (!this.deprecated) {
      return '';
    }
    return html`<div class="deprecated-warning">Warning: Deprecated</div>`
  }

  /**
   * @return {TemplateResult} Main render function.
   */
  render() {
    return html`<style>
        ${this.styles}
      </style>
      ${this._headerTemplate()}
      <div class="property-traits">
        ${this._getTypeNameTemplate()}
        ${this.isRequired
          ? html`<span
              class="required-type"
              title="This property is required by the API"
              >Required</span
            >`
          : ''}
        ${this.isEnum
          ? html`<span
              class="enum-type"
              title="This property represent enumerable value"
              >Enum</span
            >`
          : ''}
        ${this.isReadOnly
          ? html`<span
              class="readonly-type"
              title="This property represents a read only value"
              >Read only</span
            >`
          : ''}
        ${this.isUniqueOnly
          ? html`<span
                class="unique-only-type"
                title="This property allows only unique values"
                >Unique only</span
              >`
          : ''}
      </div>
      ${this._deprecatedWarningTemplate()}
      ${this._descriptionTemplate()}
      <property-range-document
        .amf="${this.amf}"
        .shape="${this.shape}"
        .range="${this.range}"
        ?compatibility="${this.compatibility}"
        ?noExamplesActions="${this.noExamplesActions}"
        .mediaType="${this.mediaType}"
        .propertyName="${this.propertyName}"
        ?graph="${this.graph}"
      ></property-range-document>
      ${this._complexTemplate()}`;
  }
}
