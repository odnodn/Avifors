'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getTypes = getTypes;
/**
 * Core types
 */
function getTypes(avifors) {
  var types = {
    list: function list(children) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$validators = _ref.validators,
          validators = _ref$validators === undefined ? [] : _ref$validators,
          _ref$builders = _ref.builders,
          builders = _ref$builders === undefined ? [] : _ref$builders;

      return {
        type: 'list',
        build: function build(value) {
          var result = value.map(function (i) {
            return children.build(i);
          });
          builders.forEach(function (builder) {
            return result = builder(result);
          });
          return result;
        },
        normalize: function normalize() {
          return [children.normalize()];
        },
        validate: function validate(i, path) {
          avifors.assert(Array.isArray(i), path + ' must be a list, ' + i + ' given');
          avifors.validate(validators, i, path);
          i.forEach(function (v, j) {
            return children.validate(v, path + '[' + j + ']');
          });
        }
      };
    },

    map: function map(keys) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$validators = _ref2.validators,
          validators = _ref2$validators === undefined ? [] : _ref2$validators,
          _ref2$builders = _ref2.builders,
          builders = _ref2$builders === undefined ? [] : _ref2$builders;

      return {
        type: 'map',
        build: function build(value) {
          var result = {};
          for (var i in keys) {
            result[i] = keys[i].build(value[i]);
          }
          builders.forEach(function (builder) {
            return result = builder(result);
          });
          return result;
        },
        normalize: function normalize() {
          var result = {};
          for (var i in keys) {
            result[i] = keys[i].normalize();
          }
          return result;
        },
        validate: function validate(i, path) {
          avifors.assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && !Array.isArray(i), path + ' must be a map, ' + i + ' given');
          avifors.validate(validators, i, path);
          for (var j in i) {
            avifors.assert(j in keys, 'Unexpected key "' + j + '" in ' + path);
          }for (var _j in keys) {
            keys[_j].validate(i[_j], path + '.' + _j);
          }
        }
      };
    },

    optional: {}
  };

  setBasicTypes(types, avifors);

  return types;
}

function setBasicTypes(types, avifors) {
  var basicTypes = ['string', 'number', 'boolean'];
  var buildBasicType = function buildBasicType(type, optional) {
    return function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$validators = _ref3.validators,
          validators = _ref3$validators === undefined ? [] : _ref3$validators,
          _ref3$builders = _ref3.builders,
          builders = _ref3$builders === undefined ? [] : _ref3$builders;

      if (!optional) {
        validators.push(avifors.validators.required());
      }

      return {
        type: type,
        build: function build(value) {
          var result = value;
          builders.forEach(function (builder) {
            return result = builder(result);
          });
          return result;
        },
        normalize: function normalize() {
          return type + (validators.length ? ' (' + validators.map(function (v) {
            return v.normalize();
          }).join(', ') + ')' : '');
        },
        validate: function validate(i, path) {
          avifors.assert((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === type || i == null, path + ' must be a ' + type + ', "' + i + '" given');
          avifors.validate(validators, i, path);
        }
      };
    };
  };

  basicTypes.forEach(function (type) {
    types[type] = buildBasicType(type, false);
    types.optional[type] = buildBasicType(type, true);
  });
}