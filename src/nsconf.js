(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['extend'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('extend'));
  } else {
    // Browser globals (root is window)
    root.NSConf = factory(root.extend);
  }
})(this, 
function (extend) {
  'use strict';

  function NSConf(initialState) {
    this.data = initialState || {};
  }

  /**
   * returns the object represented by the dotted namespace or undefined if no such object
   * if namespace is an empty string the root is returned
   */
  NSConf.prototype.get = function (namespace) {
    validateNamespace(namespace);
    if(namespace === '') {
      return this.data;
    }
    var names = namespace.split('.');
    var curr = this.data;
    for (var i = 0; i < names.length; i++) {
      var key = names[i];
      curr = curr[key];
      if(typeof curr === 'undefined') {
        break;
      }
    }
    return curr;
  };

  NSConf.prototype.set = function (namespace, value) {
    validateNamespace(namespace);
    if(namespace === '') {
      this.data = value;
      return;
    }
    var names = namespace.split('.');
    var curr = this.data;
    for (var i = 0; i < names.length - 1; i++) {
      var key = names[i];
      var tmp = curr[key];
      if(typeof tmp === 'undefined') {
        tmp = {};
        curr[key] = tmp;
      }
      curr = tmp;
    }
    curr[names[names.length - 1]] = value;
  };


  NSConf.prototype.extend = function (namespace, value) {
    validateNamespace(namespace);
    var target = this.get(namespace);
    if (typeof target === 'undefined') {
      target = {};
      this.set(namespace, target);
    }

    extend(true, target, value);
  };

  NSConf.prototype.delete = function (namespace) {
    validateNamespace(namespace);
    if(namespace === '') {
      this.data = {};
      return;
    }
    var names = namespace.split('.');
    var parentNS = names.slice(0, names.length - 1).join('.');
    var selfName = names[names.length - 1];
    var parent = this.get(parentNS);
    if (typeof parent !== 'undefined') {
      delete parent[selfName];
    }
  };

  function validateNamespace(namespace) {
    if (typeof namespace !== 'string') {
      throw new Error('invalid namespace argument, expected string');
    }
  }

  return NSConf;
});
