import { css } from 'lit-element';

export default css`
  :host {
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  .property-attribute {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-align: start;
    align-items: flex-start;
    margin: 4px 0;
    padding: 0;
    color: var(--api-type-document-type-attribute-color, #616161);
  }

  .property-attribute:last-of-type {
    margin-bottom: 12px;
  }

  .attribute-label {
    font-weight: 500;
    margin-right: 12px;
  }

  .attribute-value {
    -ms-flex: 1 1 0.000000001px;
    flex: 1;
    flex-basis: 0.000000001px;
  }

  .attribute-value ul {
    margin: 0;
    padding-left: 18px;
  }

  .examples {
    padding: 1px;
  }

  api-annotation-document {
    margin-bottom: 12px;
  }

  .examples-section-title {
    font-size: var(--arc-font-body2-font-size);
    font-weight: var(--arc-font-body2-font-weight);
    line-height: var(--arc-font-body2-line-height);
    padding: 8px;
    margin: 0;
    color: var(--api-type-document-examples-title-color);
  }

  .example-title {
    font-weight: var(--arc-font-body1-font-weight);
    line-height: var(--arc-font-body1-line-height);
    font-size: 15px;
    margin: 0;
    padding: 0 8px;
  }
`;
