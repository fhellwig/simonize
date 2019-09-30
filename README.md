# simonize

Copies properties from one object into another using a super-simple template.

## Installation

```bash
$ npm install --save simonize
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

simonize(template, [1, 'x', 1 / 0, '4']);
```

Result:

```javascript
[1, NaN, Infinity, 4]
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

## Undefined and Null Template Values

An undefined template value (anywhere in the template structure), results in the input being returned as-is.

```javascript
const template = { person: { name: undefined } };

simonize(template, { person: { name: 12345 } });
simonize(template, { person: { name: 'Bob' } });
```

Results:

```javascript
{ person: { name: 12345; } }
{ person: { name: 'Bob'; } }
```

A `null` template value (anywhere in the tempate structure), results in the input value being returned as-is but only if defined. An undefined input value results in the `null` default value being applied.

```javascript
const template = { person: { name: null } };

simonize(template, { person: { name: 12345 } });
simonize(template, { person: { name: 'Bob' } });
simonize(template, { person: {} });
```

Results:

```javascript
{ person: { name: 12345; } }
{ person: { name: 'Bob'; } }
{ person: { name: null; } }
```

## Undefined and Null Input Values

A undefined input value results in the template default value being applied and returned. All of the following result in the same output.

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

However, when specifying a `null` value in the input, it is taken as-is (no template defaults or type conversions are applied):

```javascript
const template = { person: { name: 'Bob' } };

simonize(template, { person: null });
simonize(template, { person: { name: null } });
```

Results:

```javascript
{ person: null; }
{ person: { name: null; }
}
```

## Type Conversions

The primitive values of string, number, and boolean are converted according to the following rules:

### String Conversion

- If the input is a string, return the input.
- If the input is undefined, return the default value from the template.
- Otherwise, convert the input to a string using `toString()` and return the converted value.

### Number Conversion

- If the input is a number, return the input.
- If the input is undefined, return the default value from the template.
- Otherwise, parse the input using `parseFloat()` and return the parsed value.

### Boolean Conversion

- If the input is undefined, return the default value from the template.
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
