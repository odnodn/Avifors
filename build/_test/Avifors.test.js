'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _Avifors = require('../Avifors');

var _Avifors2 = _interopRequireDefault(_Avifors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# Avifors', function () {
  describe('types', function () {
    var avifors = new _Avifors2.default();
    var generator = {
      list: "tests",
      key: "name",
      arguments: {
        name: avifors.type.string(),
        properties: avifors.type.list(avifors.type.map({
          "name": avifors.type.string(),
          "type": avifors.type.string(),
          "description": avifors.type.string()
        }))
      },
      outputs: [{
        path: "example/output/Entity/{{ name | pascalcase }}.php",
        template: "example/generators/entity/entity.template.php"
      }]
    };

    it("should be able to be normalized", function () {
      var av = new _Avifors2.default();
      av.setGenerator('test', generator);
      _assert2.default.deepEqual({
        name: 'string',
        properties: [{
          name: 'string',
          type: 'string',
          description: 'string'
        }]
      }, av.getGenerator('test')[0].arguments.normalize());
    });
  });
});