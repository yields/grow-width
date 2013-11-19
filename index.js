
/**
 * dependencies
 */

var events = require('events');

/**
 * Export `Grow`
 */

module.exports = Grow;

/**
 * Initialize `Grow` with `input`.
 *
 * @param {Element} input
 * @api public
 */

function Grow(input){
  if (!(this instanceof Grow)) return new Grow(input);
  this.label = input.placeholder || '';
  input.placeholder = '';
  this.events = events(input, this);
  this.el = input;
  this.shadow();
  this.update();
  this.bind();
}

/**
 * Bind internal events.
 *
 * @return {Grow}
 * @api public
 */

Grow.prototype.bind = function(){
  this.events.bind('blur');
  this.events.bind('focus', 'add');
  this.events.bind('keypress');
  this.events.bind('keyup');
  return this;
};

/**
 * Destroy.
 *
 * @return {Grow}
 * @api public
 */

Grow.prototype.destroy = function(){
  this.events.unbind();
  this.remove();
  return this;
};

/**
 * Set the input width to the placeholder width.
 *
 * @return {Grow}
 * @api public
 */

Grow.prototype.placeholder = function(){
  if ('' == this.label) return this;
  this.add();
  this.el.placeholder = this.label;
  this.update(this.label);
  this.remove();
  return this;
};

/**
 * Create the shadow element.
 *
 * @return {Grow}
 * @api public
 */

Grow.prototype.shadow = function(){
  var el = this.shadow = document.createElement('span');
  var styl = window.getComputedStyle(this.el);
  this.min = parseFloat(styl.minWidth, 10) || 4;
  this.max = parseFloat(styl.maxWidth, 10);
  el.style.letterSpacing = styl.letterSpacing;
  el.style.textTransform = styl.textTransform;
  el.style.position = 'absolute';
  el.style.top = -1000 + 'px';
  el.style.font = styl.font;
  el.style.width = 'auto';
  el.style.padding = 0;
  return this;
};

/**
 * Update to `str` or `el.value`.
 *
 * @param {String} str
 * @return {Grow}
 * @api public
 */

Grow.prototype.update = function(str){
  str = str || this.el.value;
  this.shadow.textContent = str.replace(/ /g, '\xA0'); // non breaking space
  var w = this.shadow.clientWidth;
  if (this.max < w) w = this.max;
  if (this.min > w) w = this.min;
  if (this.prev == w) return this;
  this.el.style.width = w + 'px';
  this.prev = w;
  return this;
};

/**
 * Add the shadow.
 *
 * @param {Event} e
 * @api private
 */

Grow.prototype.add = function(){
  if (this.shadow.parentNode) return;
  this.el.placeholder = '';
  document.body.appendChild(this.shadow);
};

/**
 * Remove the shadow.
 *
 * @param {Event} e
 * @api private
 */

Grow.prototype.remove = function(){
  if (!this.shadow.parentNode) return;
  document.body.removeChild(this.shadow);
};

/**
 * on-blur.
 *
 * @api private
 */

Grow.prototype.onblur = function(){
  this.el.placeholder = this.label;
  if (!this.el.value) this.placeholder();
  this.remove();
};

/**
 * on-keypress.
 *
 * @param {Event} e
 * @api private
 */

Grow.prototype.onkeypress = function(e){
  var c = String.fromCharCode(e.keyCode);
  if (e.shiftKey) c = c.toUpperCase();
  this.update(e.target.value + c);
};

/**
 * on-keyup.
 *
 * @param {Event} e
 * @api public
 */

Grow.prototype.onkeyup = function(e){
  if (8 != e.which) return;
  this.update();
};
