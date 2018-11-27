const generator = require('@api-components/api-model-generator');

const files = new Map();
files.set('demo-api/demo-api.raml', 'RAML 1.0');
files.set('apic-83/apic-83.raml', 'RAML 1.0');
files.set('oas-api/Petstore.yaml', 'OAS 2.0');

generator(files)
.then(() => console.log('Finito'));
