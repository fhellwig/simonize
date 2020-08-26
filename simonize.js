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

var UNSUPPORTED = 'Unsupported template type: ';

function simonize(template, input) {
  if (template === null) return null;
  if (typeof template === 'undefined') return input;
  if (isArray(template)) return convertArray(template, input);
  if (isObject(template)) return convertObject(template, input);
  if (isString(template)) return convertString(template, input);
  if (isNumber(template)) return convertNumber(template, input);
  if (isBoolean(template)) return convertBoolean(template, input);
  throw new Error(UNSUPPORTED + typeof template);
}

function convertArray(template, input) {
  if (typeof input === 'undefined') {
    input = isArray(template[1]) ? template[1] : [];
  }
  if (!isArray(input)) {
    return [];
  }
  var retval = [];
  var i;
  var n = input.length;
  for (i = 0; i < n; i++) {
    retval.push(simonize(template[0], input[i]));
  }
  return retval;
}

function convertObject(template, input) {
  if (typeof input === 'undefined') {
    input = {};
  }
  if (!isObject(input)) {
    return {};
  }
  var retval = {};
  var keys = Object.keys(template);
  var i;
  var n = keys.length;
  var key;
  for (i = 0; i < n; i++) {
    key = keys[i];
    retval[key] = simonize(template[key], input[key]);
  }
  return retval;
}

function convertString(template, input) {
  if (typeof input === 'undefined') {
    return template;
  }
  if (input === null) {
    return '';
  }
  return String(input).trim();
}

function convertNumber(template, input) {
  var num = Number(input);
  return isFinite(num) ? num : template;
}

function convertBoolean(template, input) {
  if (typeof input === 'undefined') {
    return template;
  }
  return !!input;
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

function isObject(arg) {
  return arg !== null && typeof arg === 'object' && !isArray(arg);
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

module.exports = simonize;
