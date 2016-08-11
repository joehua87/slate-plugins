'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onLinkClick = exports.hasLinks = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var renderNode = function renderNode(node) {
    return NODES[node.type];
  };
  return {
    renderNode: renderNode,
    test: function test() {
      return console.log('test() from link-plugin');
    }
  };
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NODES = {
  link: function link(props) {
    console.log(props);
    var data = props.node.data;

    var href = data.get('href');
    return _react2.default.createElement(
      'a',
      _extends({}, props.attributes, { href: href }),
      props.children
    );
  }
};

var hasLinks = exports.hasLinks = function hasLinks(state) {
  return state.inlines.some(function (inline) {
    return inline.type === 'link';
  });
};

var onLinkClick = exports.onLinkClick = function onLinkClick(state) {
  var isHasLinks = hasLinks(state);

  var transformedState = state;

  if (isHasLinks) {
    transformedState = transformedState.transform().unwrapInline('link').apply();
  } else if (transformedState.isExpanded) {
    var href = window.prompt('Enter the URL of the link:');
    transformedState = transformedState.transform().wrapInline({
      type: 'link',
      data: { href: href }
    }).collapseToEnd().apply();
  } else {
    var _href = window.prompt('Enter the URL of the link:');
    var text = window.prompt('Enter the text for the link:');
    transformedState = transformedState.transform().insertText(text).extendBackward(text.length).wrapInline({
      type: 'link',
      data: { href: _href }
    }).collapseToEnd().apply();
  }

  return transformedState;
};