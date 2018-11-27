const AmfLoader = {};
AmfLoader.load = function(compact) {
  const file = '/demo-api' + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(data);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.loadType = function(name, compact) {
  return AmfLoader.load(compact)
  .then((amf) => {
    const data = amf;
    if (amf instanceof Array) {
      amf = amf[0];
    }
    const ns = ApiElements.Amf.ns;
    const key = compact ? 'doc:declares' : ns.raml.vocabularies.document + 'declares';
    const defs = amf[key];
    for (let i = 0; i < defs.length; i++) {
      let type = defs[i];
      if (type instanceof Array) {
        type = type[0];
      }
      const key = compact ? 'shacl:name' : ns.w3.shacl.name + 'name';
      let nameData = type[key];
      if (!nameData) {
        continue;
      }
      if (nameData instanceof Array) {
        nameData = nameData[0];
      }
      const typeName = nameData['@value'];
      if (typeName === name) {
        return [data, type];
      }
    }
  });
};
