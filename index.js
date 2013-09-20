
/**
 * dependencies
 */

var measure = require('measure-string')
  , event = require('event');

/**
 * Grow the width of the given `el`.
 *
 * @param {Element} el
 * @api public
 */

exports = module.exports = function(el){
  var prev;

  // grow
  event.bind(el, 'keypress', function(e){
    var c = String.fromCharCode(e.keyCode);
    var w = measure(el, el.value + c)
    if (prev == w) return;
    el.style.width = w + 'px';
    prev = w;
  });

  // retreat
  event.bind(el, 'keyup', function(e){
    if (8 != e.which) return;
    var w = measure(el, el.value);
    if (prev == w) return;
    el.style.width = w + 'px';
    prev = w;
  });
};
