# simonize

Copies properties from one object into another using a super-simple template.

## Installation

```bash
$ npm install --save simonize
```

## Test

Run `npm install` to install `mocha` (a dev dependency) and then run the tests.

```bash
$ npm install
$ npm test
```

## Usage

The template defines both the shape of the output, the property datatypes, and default values.

```javascript
const simonize = require('simonize');

const template = {
  id: 'new',
  name: '',
  email: '',
  admin: false
};

simonize(template);
```

Result:

```javascript
{ id: 'new', name: '', email: '', admin: false }
```

The template provides the default values in the absence of an input object. The second parameter to `simonize` is an input object. In the following example, the input has _some_ of the template fields and the values are numbers instead of a string for the `id` and a boolean for the `admin` flag. Calling `simonize` with this input converts the values into the correct datatypes and merges them with the default values.

```javascript
const input = { id: 12345, admin: 1 };

simonize(template, input);
```

Result:

```javascript
{ id: '12345', name: '', email: '', admin: true }
```

The template is a very simple schema providing both the **datatype** _and_ the **default value** for each property. Templates can be arbitrarily complex including nested objects and array specifications. Nested objects are handled as expected. Arrays are slightly more involved and are discussed next.

## Arrays

Arrays are specified in the template using a one- or two-element array where the zero-index element is the template for the expected contents of each element in the input array. A second element can be optionally specified indicating a repeate value for the template in case no array is present in the input (useful for defaults). This is made clearer with the following examples:

In this example, only one of the elements in the template is overridden by the input.

```javascript
const template = [{ name: 'default name', value: 'default value' }];

simonize(template, [{ name: 'my name' }]);
```

Result:

```javascript
[{ name: 'my name', value: 'default value' }]
```

If, however, the input is undefined, then we get an empty array.

```javascript
const template = [{ name: 'default name', value: 'default value' }];

simonize(template);
```

Result:

```javascript
[]
```

The optional second array element specifies a count to use for a default repeat value (one in this case).

```javascript
const template = [{ name: 'default name', value: 'default value' }, 1];

simonize(template);
```

Result:

```javascript
[{ name: 'default name', value: 'default value' }]
```

These concepts also apply to primitive values:

```javascript
const template = [10, 5];

simonize(template, [1, null, 'x', 1 / 0, '4']);
```

Result:

```javascript
[1, 0, 10, 10, 4]
```

(This example also highlights number conversions, discussed below.)

But not specifying an input means that the second element (the repeat value) is used.

```javascript
const template = [10, 5];

simonize(template);
```

Result:

```javascript
[10, 10, 10, 10, 10]
```

## Null Template Values

A `null` template value will force the output value to null and the input is ignored.

```javascript
const template = { security: { token: null } };

simonize(template, { security: { token: 12345 } });
```

Result:

```javascript
{ security: { token: null } }
```

## Undefined Template Values

An `undefined` template value will return the input as-is. Note that this bypasses the inherent cloning behavior of `simonize`. *Use this feature with care or don't use it at all.*

```javascript
const template = { data: { any: undefined } };

simonize(template, { data: { any: 1 / 0 } });
```

Result:

```javascript
{ data: { any: Infinity } }
```

## Null Input Values

A `null` input value forces a built-in default value to be returned and the default value from the template is ignored.

```javascript
simonize(5, null)             // returns 0
simonize('hello', null)       // returns ''
simonize(true, null)          // returns false
simonize({a: 1, b: 2}, null)  // returns {}
simonize(['test'], null)      // returns []
```

For template objects and arrays, input values that are not objects or arrays are also considered to be `null`.

```javascript
simonize({a: 1, b: 2}, 'not an object') // returns {}
simonize(['test'], 'not an array')      // returns []
```

## Undefined Input Values

An `undefined` input value results in the template default value being applied and returned. All of the following result in the same output.

```javascript
const template = { person: { name: 'Bob' } };

simonize(template);
simonize(template, {});
simonize(template, { person: undefined });
```

Results:

```javascript
{ person: { name: 'Bob'; } }
{ person: { name: 'Bob'; } }
{ person: { name: 'Bob'; } }
```

## Type Conversions

Object, array, string, number, and boolean values are converted according to the following rules:

### Object Conversion

- If the input is `undefined`, replace the input with an empty object (`{}`).
- If the input is `null` or the input is not an object, return an empty object (`{}`).
- Recursively apply the template to each property of the input object.

### Array Conversion

- If the input is `undefined`, replace the input with an array of *`n`* undefined elements where *`n`* is the second element (default of `0`) from the template array.
- If the input is `null` or the input is not an array, return an empty array (`[]`).
- Recursively apply the template to each element of the input array.

### String Conversion

- If the input is `undefined`, return the default value from the template.
- If the input is `null`, return the empty string (`''`).
- Convert the input to a string by calling `String(input).trim()` and return the result.

### Number Conversion

- Convert the input to a number by calling `Number(input)`.
- Check the number by calling `isFinite(num)`.
- If true, return the number. Otherwise, return the default value from the template.

### Boolean Conversion

- If the input is `undefined`, return the default value from the template.
- Otherwise, return the result of applying the `!!` operator pair to the input.

## Additional Notes

1. Any input properties that do not have a corresponding template property are **not** returned by `simonize`.

2. Since the template and input are recursively traversed until primitive properties are discovered, this utility performs a deep clone of both the template and the input.

## Motivation

I developed this while working on a React project using the Formik form utilities and the yup validation library. While great for validation, I was also using yup to cast back and forth between data and values from the form. There were many unpredictable aspects to using a fantastic validation libary to also do object casting. It was great at the former but less so at the latter. Therefore, I developed this little utility to help me out.

To be sure, there are many object mapping utilities available but most focus on mapping between different property names between the source and the target. I was looking for more of a _filter-and-conversion_ utiltity that also respects the target datatypes. JSON schema (and associated libraries) could work but it seemed a bit too heavy-weight for my purposes.

The idea of using the template to specify the default values and then deriving the desired target property type from the default value type makes for a very compact _mini-schema_. I called it a _template_ so that I wouldn't get confused between the yup terminology of _schema_, which I am still using.

## About the Name

Originally, I wanted to call it "copyprops" but that name was too similar to an existing package. The name "simonize" reminded me of the automotive cleaning process and, since objects are effectively cleaned and polished, the name seemed appropriate!

## License

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
