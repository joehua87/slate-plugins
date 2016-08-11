'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onClickMark = exports.hasMark = undefined;

exports.default = function () {
  var _this = this;

  var hasMark = function hasMark(type, state) {
    console.log(state);
    // const { state } = this.state;
    return state.marks.some(function (mark) {
      return mark.type == type;
    });
  };

  var onClickMark = function onClickMark(e, type) {
    for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    console.log('onClickMark', rest);
    e.preventDefault();
    var state = _this.state.state;


    state = state.transform().toggleMark(type).apply();

    _this.setState({ state: state });
  };

  var renderMark = function renderMark(mark) {
    return MARKS[mark.type];
  };

  var renderMarkButton = function renderMarkButton(type, icon) {
    var isActive = hasMark(type);
    var onMouseDown = function onMouseDown(e) {
      return onClickMark(e, type);
    };

    return _react2.default.createElement(
      'span',
      { className: 'button', onMouseDown: onMouseDown, 'data-active': isActive },
      _react2.default.createElement(
        'span',
        { className: 'material-icons' },
        icon
      )
    );
  };

  return {
    onClickMark: onClickMark,
    hasMark: hasMark,
    renderMarkButton: renderMarkButton,
    renderMark: renderMark
  };
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MARKS = {
  bold: {
    fontWeight: 'bold'
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: '3px',
    borderRadius: '4px'
  },
  italic: {
    fontStyle: 'italic'
  },
  underlined: {
    textDecoration: 'underline'
  }
};

var hasMark = exports.hasMark = function hasMark(type, state) {
  return state.marks.some(function (mark) {
    return mark.type === type;
  });
};

var onClickMark = exports.onClickMark = function onClickMark(type, state) {
  return state.transform().toggleMark(type).apply();
};