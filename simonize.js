/*
MIT License

Copyright (c) 2019 Frank Hellwig

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function simonize(template, input) {
  if (isUndefined(template)) return input;
  if (isNull(template)) return isUndefined(input) ? null : input;
  if (isNull(input)) return null;
  if (isArray(template)) return convertArray(template, input);
  if (isObject(template)) return convertObject(template, input);
  if (isString(template)) return convertString(template, input);
  if (isNumber(template)) return convertNumber(template, input);
  if (isBoolean(template)) return convertBoolean(template, input);
  throw new Error('Unsupported template type: ' + typeof template);
}

function convertArray(template, input) {
  const retval = [];
  if (isArray(input)) {
    input.forEach(item => {
      retval.push(simonize(template[0], item));
    });
  } else {
    const count = parseInt(template[1]);
    if (!isNaN(count)) {
      for (let i = 0; i < count; i++) {
        retval.push(template[0]);
      }
    }
  }
  return retval;
}

function convertObject(template, input) {
  const retval = {};
  if (!isObject(input)) {
    input = {};
  }
  Object.keys(template).forEach(prop => {
    retval[prop] = simonize(template[prop], input[prop]);
  });
  return retval;
}

function convertString(template, input) {
  if (isString(input)) return input;
  if (isUndefined(input)) return template;
  return input.toString();
}

function convertNumber(template, input) {
  if (isNumber(input)) return input;
  if (isUndefined(input)) return template;
  const num = parseFloat(input);
  if (isNaN(num)) {
    return !input ? 0 : 1;
  } else {
    return num;
  }
}

function convertBoolean(template, input) {
  if (isUndefined(input)) return template;
  return !!input;
}

function isArray(arg) {
  return Array.isArray(arg);
}

function isObject(arg) {
  return arg !== null && typeof arg === 'object' && !Array.isArray(arg);
}

function isString(arg) {
  return typeof arg === 'string';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isUndefined(arg) {
  return typeof arg === 'undefined';
}

function isNull(arg) {
  return arg === null;
}

module.exports = simonize;
