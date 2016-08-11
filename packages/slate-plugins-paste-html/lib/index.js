'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPasteHtmlPlugin;

var _slate = require('slate');

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */
/**
 * Tags to blocks.
 *
 * @type {Object}
 */

var BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'quote',
  img: 'image',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six'
};

/**
 * Tags to marks.
 *
 * @type {Object}
 */

var MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code'
};

var RULES = [{
  deserialize: function deserialize(el, next) {
    var block = BLOCK_TAGS[el.tagName];
    if (!block) return undefined;
    return {
      kind: 'block',
      type: block,
      nodes: next(el.children)
    };
  }
}, {
  // Special case for code blocks, which need to grab the nested children.
  deserialize: function deserialize(el, next) {
    console.log(el.tagName);
    if (el.tagName != 'img') return undefined;
    console.log(el.children);
    return {
      kind: 'block',
      type: 'image',
      isVoid: true,
      data: {
        src: el.attribs.src
      }
    };
  }
}, {
  deserialize: function deserialize(el, next) {
    var mark = MARK_TAGS[el.tagName];
    if (!mark) return undefined;
    return {
      kind: 'mark',
      type: mark,
      nodes: next(el.children)
    };
  }
}, {
  // Special case for links, to grab their href.
  deserialize: function deserialize(el, next) {
    if (el.tagName !== 'a') return undefined;
    return {
      kind: 'inline',
      type: 'link',
      nodes: next(el.children),
      data: {
        href: el.attribs.href
      }
    };
  }
}];

var serializer = new _slate.Html({ rules: RULES });

function createPasteHtmlPlugin() {
  var onPaste = function onPaste(e, data, state) {
    if (data.type !== 'html') return;

    var _serializer$deseriali = serializer.deserialize(data.html);

    var document = _serializer$deseriali.document;


    return state.transform().insertFragment(document).apply();
  };

  return {
    onPaste: onPaste
  };
}