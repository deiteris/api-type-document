import { LitElement, CSSResult, TemplateResult } from 'lit-element';
import { PropertyDocumentMixin } from './PropertyDocumentMixin';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

/* eslint-disable class-methods-use-this */

/**
 * Renders a documentation for a shape property of AMF model.
 */
export class PropertyRangeDocument {
  readonly styles: CSSResult;
  /**
   * Name of the property that is being described by this definition.
   */
  propertyName: string;
  /**
   * Computed value form the shape. True if the property is ENUM.
   */
  isEnum: boolean;
  /**
   * Computed value, true if current property is an union.
   */
  isUnion: boolean;
  /**
   * Computed value, true if current property is an object.
   */
  isObject: boolean;
  /**
   * Computed value, true if current property is an array.
   */
  isArray: boolean;
  /**
   * Computed value, true if current property is a File.
   */
  isFile: boolean;
  /**
   * Computed values for list of enums.
   * Enums are list of types names.
   */
  enumValues: string[];
  /**
   * When set it removes actions bar from the examples render.
   */
  noExamplesActions: boolean;
  _hasExamples: boolean;
  exampleSectionTitle: string;

  range: object;

  connectedCallback(): void;

  _rangeChanged(range: object): void;

  /**
   * Computes value `isEnum` property.
   * @param range Current `range` object
   * @param isArray Whether the `range` represent an array.
   * @returns True when the `range` represents an enum.
   */
  _computeIsEnum(range: Object, isArray: boolean): boolean;

  /**
   * @param range Current `range` object
   * @returns True when the `range` represents an enum in array values.
   */
  _computeIsEnumArray(range: object): boolean;

  /**
   * Computes value for `isFile` property
   *
   * @param range Range object of current shape.
   */
  _computeIsFile(range: Object): boolean;

  _computeObjectProperties(range: object): object[]|undefined;

  /**
   * Computes value for `enumValues` property.
   *
   * @param range Range object of current shape.
   * @param isArray Whether the range represents an array shape.
   * @returns List of enum types.
   */
  _computeEnumValues(range: Object, isArray: boolean): string[]|undefined;

  _examplesChanged(e: CustomEvent): void;

  _hasExamplesHandler(e: CustomEvent): void;

  _listItemTemplate(label: string, title: string, key: string, isArray: boolean): TemplateResult;

  _nonFilePropertisTemplate(): TemplateResult;

  /**
   * @return {TemplateResult|string} Template for enum values.
   */
  _enumTemplate(): TemplateResult|string;

  /**
   * @return {TemplateResult|string} Template for the element.
   */
  render(): TemplateResult;
}

export interface PropertyRangeDocument extends PropertyDocumentMixin, AmfHelperMixin, LitElement {
}
