
/**
 * dependencies
 */

var event = require('event');

/**
 * Grow the width of the given `el`.
 *
 * @param {Element} el
 * @return {Function}
 * @api public
 */

exports = module.exports = function(el){
  var span = document.createElement('span')
    , styl = window.getComputedStyle(el)
    , prev;

  // measure
  span.style.letterSpacing = styl.letterSpacing;
  span.style.textTransform = styl.textTransform;
  span.style.position = 'absolute';
  span.style.whiteSpace = 'nowrap';
  span.style.top = -1000 + 'px';
  span.style.font = styl.font;
  span.style.width = 'auto';
  span.style.padding = 0;

  // min / max
  var min = parseFloat(styl.minWidth, 10) || 4;
  var max = parseFloat(styl.maxWidth, 10);

  // resize to min
  el.style.width = min + 'px';

  // events
  event.bind(el, 'keyup', retreat);
  event.bind(el, 'keypress', grow);
  event.bind(el, 'focus', append);
  event.bind(el, 'blur', remove);

  // append
  function append(){
    document.body.appendChild(span);
  }

  // remove
  function remove(){
    if (!span.parentNode) return;
    document.body.removeChild(span);
  }

  // grow
  function grow(e){
    var c = String.fromCharCode(e.keyCode);
    if (e.shiftKey) c = c.toUpperCase();
    resize(el.value + c);
  }

  // retreat
  function retreat(e){
    if (8 != e.which) return;
    resize(el.value);
  }

  // resize
  function resize(val){
    span.textContent = val;
    var w = span.clientWidth;
    if (max < w) w = max;
    if (min > w) w = min;
    if (prev == w) return;
    el.style.width = w + 'px';
    prev = w;
  }

  // destroy
  return function(){
    event.unbind(el, 'keyup', retreat);
    event.unbind(el, 'keypress', grow);
    event.unbind(el, 'focus', append);
    event.unbind(el, 'blur', remove);
  };
};
