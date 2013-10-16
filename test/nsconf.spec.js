/* global describe: false */
/* global it: false */
/* global expect: false */
/* global beforeEach: false */
/* global jasmine: false */
/* jshint maxstatements: 30 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['src/nsconf'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('../src/nsconf'));
  } else {
    // Browser globals (root is window)
    root.specWrap = factory(root.NSConf);
  }
})(this, 
function (NSConf) {
  'use strict';

  var EMPTY = {};
  var FOO = {
    'value': 'foo'
  };
  var BAR = {
    'value': 'bar'
  };
  var BAZ = {
    'value': {
      'value':'baz'
    }
  };
  var ALL_SECTION = '';
  var PLASMA_SECTION = 'plasma';
  var COMPLEX_SECTION = 'complex.gene';
  var nsconf;

  describe('NSConf', function () {

    it('is a function', function () {
      expect(NSConf).toEqual(jasmine.any(Function));
    });

    describe('instance', function () {
      beforeEach(function () {
        nsconf = new NSConf();
      });

      itBehavesLike({});
    });

    describe('instance', function () {
      beforeEach(function () {
        nsconf = new NSConf({});
      });

      itBehavesLike({});

      describe('set plasma to {value: 5}', function () {
        beforeEach(function () {
          nsconf.set(PLASMA_SECTION, {'value': 5});
        });

        itBehavesLike({'plasma': { 'value': 5 } });
      });

      describe('set COMPLEX_SECTION to {value: 5}', function () {
        beforeEach(function () {
          nsconf.set(COMPLEX_SECTION, {'value': 5});
        });

        itBehavesLike({'complex': { 'gene': { 'value': 5 } }});
      });
    });

    describe('instance with plasma { value: 5 }', function () {
      beforeEach(function () {
        nsconf = new NSConf({'plasma': { value: 5 } });
      });

      itBehavesLike({'plasma': { value: 5 } });
      
      describe('setted COMPLEX_SECTION {value: 7}', function () {
        beforeEach(function () {
          nsconf.set(COMPLEX_SECTION, {'value': 7});
        });
        itBehavesLike({
          'plasma': { value: 5 },
          'complex': {
            'gene': {'value': 7}
          }
        });
      });

      describe('extended COMPLEX_SECTION {value: 7}', function () {
        beforeEach(function () {
          nsconf.extend(COMPLEX_SECTION, {'value': 7});
        });
        itBehavesLike({
          'plasma': { value: 5 },
          'complex': {
            'gene': {'value': 7}
          }
        });
      });

      describe('extended PLASMA_SECTION {foo: 7}', function () {
        beforeEach(function () {
          nsconf.extend(PLASMA_SECTION, {'foo': 7});
        });

        itBehavesLike({
          'plasma': {
            'value': 5,
            'foo': 7
          }
        });
      });

      describe('extended PLASMA_SECTION {value: 7} overwritting.', function () {
        beforeEach(function () {
          nsconf.extend(PLASMA_SECTION, {'value': 7});
        });

        itBehavesLike({
          'plasma': {
            'value': 7
          }
        });
      });

      describe('delete PLASMA_SECTION', function () {
        beforeEach(function () {
          nsconf.delete(PLASMA_SECTION);
        });

        itBehavesLike({});
      });

      describe('delete COMPLEX_SECTION', function () {
        beforeEach(function () {
          nsconf.delete(COMPLEX_SECTION);
        });

        itBehavesLike({'plasma': { value: 5 } });
      });
    });

    describe('instance with complex.gene', function () {
      beforeEach(function () {
        nsconf = new NSConf({'complex': { 'gene': { 'value': 5 } }});
      });

      itBehavesLike({'complex': { 'gene': { 'value': 5 } }});

      describe('delete PLASMA_SECTION', function () {
        beforeEach(function () {
          nsconf.delete(PLASMA_SECTION);
        });

        itBehavesLike({'complex': { 'gene': { 'value': 5 } }});
      });

      describe('delete COMPLEX_SECTION', function () {
        beforeEach(function () {
          nsconf.delete(COMPLEX_SECTION);
        });

        itBehavesLike({'complex': {}});
      });
    });

    describe('instance with very.very.long.name', function () {
      beforeEach(function () {
        nsconf = new NSConf({
          'very': { 
            'very': { 
              'long': {
                'name':{
                  'value':-1
                }
              }
            }
          }
        });
      });

      itBehavesLike({
        'very': { 
          'very': { 
            'long': {
              'name':{
                'value':-1
              }
            }
          }
        }
      });

      describe('delete very.very.long.name', function () {
        beforeEach(function () {
          nsconf.delete('very.very.long.name');
        });

        itBehavesLike({
          'very': { 
            'very': { 
              'long': {
              }
            }
          }
        });

      });

      describe('delete very', function () {
        beforeEach(function () {
          nsconf.delete('very');
        });

        itBehavesLike({});

      });

    });

    function itBehavesLike(state) {
      it('gets ALL_SECTION', function () {
        expect(nsconf.get(ALL_SECTION)).toEqual(state);
      });

      it('gets PLASMA_SECTION', function () {
        expect(nsconf.get(PLASMA_SECTION)).toEqual(state[PLASMA_SECTION]);
      });

      it('gets COMPLEX_SECTION', function () {
        expect(nsconf.get(COMPLEX_SECTION)).toEqual((state.complex || {}).gene);
      });

      it('sets gene to ALL_SECTION', function () {
        expect(function () {
          nsconf.set(ALL_SECTION, { value:5 });
        }).not.toThrow();
      });

      it('sets gene to PLASMA_SECTION', function () {
        expect(function () {
          nsconf.set(PLASMA_SECTION, { value:5 });
        }).not.toThrow();
      });

      it('sets gene to COMPLEX_SECTION', function () {
        expect(function () {
          nsconf.set(COMPLEX_SECTION, { value:5 });
        }).not.toThrow();
      });

      it('extends ALL_SECTION', function () {
        expect(function () {
          nsconf.extend(ALL_SECTION, { value:5 });
        }).not.toThrow();
      });

      it('extends PLASMA_SECTION', function () {
        expect(function () {
          nsconf.extend(PLASMA_SECTION, { value:5 });
        }).not.toThrow();
      });

      it('extends COMPLEX_SECTION', function () {
        expect(function () {
          nsconf.extend(COMPLEX_SECTION, { value:5 });
        }).not.toThrow();
      });

     it('deletes ALL_SECTION', function () {
        expect(function () {
          nsconf.delete(ALL_SECTION);
        }).not.toThrow();
      });

      it('deletes PLASMA_SECTION', function () {
        expect(function () {
          nsconf.delete(PLASMA_SECTION);
        }).not.toThrow();
      });

      it('deletes COMPLEX_SECTION', function () {
        expect(function () {
          nsconf.delete(COMPLEX_SECTION);
        }).not.toThrow();
      });
    }
  });

});