const simonize = require('../simonize');
const assert = require('assert');

const template = {
  array: [5, 2],
  object: { a: 1, b: 2 },
  string: 'test',
  number: 10,
  boolean: true
};

describe('simonize', function() {
  describe('input conversions', function() {
    describe('for object', function() {
      it('should return a converted object', function() {
        assert.deepStrictEqual(simonize(template.object, { a: true, b: '8', c: 'no' }), {
          a: 1,
          b: 8
        });
      });
    });
    describe('for array', function() {
      it('should return a converted array', function() {
        assert.deepStrictEqual(simonize(template.array, [false, true, 2, '3']), [
          0,
          1,
          2,
          3
        ]);
      });
    });
    describe('for string', function() {
      it('should return a converted string', function() {
        assert.deepStrictEqual(simonize(template.string, '  a test  '), 'a test');
      });
    });
    describe('for number', function() {
      it('should return a converted number', function() {
        assert.deepStrictEqual(simonize(template.number, '5'), 5);
      });
    });
    describe('for boolean', function() {
      it('should return a converted boolean', function() {
        assert.deepStrictEqual(simonize(template.boolean, 0), false);
      });
    });
  });
  describe('template default values (undefined input)', function() {
    describe('for object', function() {
      it('should return template object when value is undefined', function() {
        assert.deepStrictEqual(simonize(template.object, undefined), template.object);
      });
    });
    describe('for array', function() {
      it('should return template array when value is undefined', function() {
        assert.deepStrictEqual(simonize(template.array, undefined), [5, 5]);
      });
    });
    describe('for string', function() {
      it('should return template string when value is undefined', function() {
        assert.deepStrictEqual(simonize(template.string, undefined), template.string);
      });
    });
    describe('for number', function() {
      it('should return template number when value is undefined', function() {
        assert.deepStrictEqual(simonize(template.number, undefined), template.number);
      });
    });
    describe('for boolean', function() {
      it('should return template boolean when value is undefined', function() {
        assert.deepStrictEqual(simonize(template.boolean, undefined), template.boolean);
      });
    });
  });
  describe('built-in default values (null input)', function() {
    describe('for object', function() {
      it('should return empty object when value is null', function() {
        assert.deepStrictEqual(simonize(template.object, null), {});
      });
      it('should return empty object when value is not an object', function() {
        assert.deepStrictEqual(simonize(template.object, 'x'), {});
      });
    });
    describe('for array', function() {
      it('should return empty array when value is null', function() {
        assert.deepStrictEqual(simonize(template.array, null), []);
      });
      it('should return empty array when value is not an array', function() {
        assert.deepStrictEqual(simonize(template.array, 'x'), []);
      });
    });
    describe('for string', function() {
      it('should return empty string when value is null', function() {
        assert.deepStrictEqual(simonize(template.string, null), '');
      });
    });
    describe('for number', function() {
      it('should return zero when value is null', function() {
        assert.deepStrictEqual(simonize(template.number, null), 0);
      });
    });
    describe('for boolean', function() {
      it('should return false when value is null', function() {
        assert.deepStrictEqual(simonize(template.boolean, null), false);
      });
    });
  });
  describe('null template values', function() {
    it('should return null regardless of the input', function() {
      assert.deepStrictEqual(simonize(null, 'anything'), null);
    });
  });
  describe('undefined template values', function() {
    it('should return the input', function() {
      assert.deepStrictEqual(simonize(undefined, 'anything'), 'anything');
    });
  });
  describe('template object with no input', function() {
    it('should create a complete output object based on the template', function() {
      assert.deepStrictEqual(simonize(template), {
        array: [5, 5],
        object: { a: 1, b: 2 },
        string: 'test',
        number: 10,
        boolean: true
      });
    });
  });
});
