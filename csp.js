/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
function buildHeader() {
  const headers = [
    'DEFAULT_SRC',
    'BASE_URI',
    'SCRIPT_SRC',
    'CONNECT_SRC',
    'IMG_SRC',
    'OBJECT_SRC',
    'MEDIA_SRC',
    'FRAME_SRC',
    'STYLE_SRC',
    'FONT_SRC',
    'REPORT_URI',
  ];
  let cspPolicy = '';
  headers.forEach((header) => {
    if (process.env[header] !== undefined) {
      cspPolicy += `${header.replace('_', '-').toLowerCase()} ${process.env[header]} ; `;
    }
  });
  return cspPolicy;
}

// This function is to emit headers.
module.exports.csp = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;
  const headerNameSrc = 'X-Amz-Meta-Last-Modified';
  const headerNameDst = 'Last-Modified';
  const headerHSTS = 'Strict-Transport-Security';
  const headerCSP = 'Content-Security-Policy';
  const headerXFO = 'X-Frame-Options';
  const headerCTO = 'X-Content-Type-Options';
  const headerRP = 'Referrer-Policy';
  if (headers[headerNameSrc.toLowerCase()]) {
    headers[headerNameDst.toLowerCase()] = [{
      key: headerNameDst,
      value: headers[headerNameSrc.toLowerCase()][0].value,
    }];
  }
  headers[headerHSTS.toLowerCase()] = [{
    key: headerHSTS,
    value: 'max-age=31536000',
  }];
  headers[headerCSP.toLowerCase()] = [{
    key: headerCSP,
    value: buildHeader(),
  }];
  headers[headerXFO.toLowerCase()] = [{
    key: headerXFO,
    value: 'DENY',
  }];
  headers[headerCTO.toLowerCase()] = [{
    key: headerCTO,
    value: 'nosniff',
  }];
  headers[headerRP.toLowerCase()] = [{
    key: headerRP,
    value: 'no-referrer',
  }];
  callback(null, response);
};

// This function is to log CSP violations.
module.exports.report = (e, ctx, cb) => {
  console.log(JSON.stringify(JSON.parse(e.body), null, 2));
  cb(null, { statusCode: 200 });
};
