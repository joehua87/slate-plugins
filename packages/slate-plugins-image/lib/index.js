'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertImage = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createImagePlugin;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isImage = require('is-image');

var _isImage2 = _interopRequireDefault(_isImage);

var _isUrl = require('is-url');

var _isUrl2 = _interopRequireDefault(_isUrl);

var _slate = require('slate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Image = function (_React$Component) {
  _inherits(Image, _React$Component);

  function Image() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Image);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Image)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.onSubmitChangeSrc = function (e) {
      e.preventDefault();

      var _this$props = _this.props;
      var state = _this$props.state;
      var node = _this$props.node;
      var editor = _this$props.editor;

      var isFocused = state.selection.hasEdgeIn(node);
      if (isFocused) e.stopPropagation();

      var nextState = state.transform().moveToRangeOf(node).setBlock({
        data: _slate.Data.create({ src: 'http://image.24h.com.vn/upload/3-2016/images/2016-08-10/1470800520-147073857273445-untitled-35.jpg' })
      }).apply();

      editor.onChange(nextState);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Image, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var node = _props.node;
      var state = _props.state;
      var attributes = _props.attributes;
      // console.log('Image Props', props);

      var isFocused = state.selection.hasEdgeIn(node);
      var src = node.data.get('src');
      var caption = node.data.get('caption');
      var className = isFocused ? 'active' : null;
      return _react2.default.createElement('img', _extends({ src: src, className: className }, attributes));
      // return (
      //   <div>
      //     <img src={src} className={className} {...attributes} />
      //     <button onClick={this.onSubmitChangeSrc}>Edit Caption</button>
      //   </div>
      // );
    }
  }]);

  return Image;
}(_react2.default.Component);

var NODES = {
  image: Image
};

var insertImage = exports.insertImage = function insertImage(state, src) {
  return state.transform().insertBlock({
    type: 'image',
    isVoid: true,
    data: { src: src }
  }).apply();
};

function createImagePlugin() {
  var renderNode = function renderNode(node) {
    return NODES[node.type];
  };

  var onDocumentChange = function onDocumentChange(document, state, editor) {
    var blocks = document.getBlocks();
    var last = blocks.last();
    if (last.type !== 'image') return;

    var normalized = state.transform().collapseToEndOf(last).splitBlock().setBlock({
      type: 'paragraph',
      isVoid: false,
      data: {}
    }).apply({
      snapshot: false
    });

    editor.onChange(normalized);
  };

  var onDrop = function onDrop(e, data, state, editor) {
    switch (data.type) {
      case 'files':
        return onDropOrPasteFiles(e, data, state, editor);
      case 'node':
        return onDropNode(e, data, state);
      default:
        return undefined;
    }
  };

  var onDropNode = function onDropNode(e, data, state) {
    return state.transform().removeNodeByKey(data.node.key).moveTo(data.target).insertBlock(data.node).apply();
  };

  var onDropOrPasteFiles = function onDropOrPasteFiles(e, data, state, editor) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var file = _step.value;

        var reader = new FileReader();

        var _file$type$split = file.type.split('/');

        var _file$type$split2 = _slicedToArray(_file$type$split, 1);

        var type = _file$type$split2[0];

        if (type !== 'image') return 'continue';

        reader.addEventListener('load', function () {
          // eslint-disable-line
          state = editor.getState(); // eslint-disable-line
          state = insertImage(state, reader.result); // eslint-disable-line
          editor.onChange(state);
        });

        reader.readAsDataURL(file);
      };

      for (var _iterator = data.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ret2 = _loop();

        if (_ret2 === 'continue') continue;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  /**
   * On paste text, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  var onPasteText = function onPasteText(e, data, state) {
    if (!(0, _isUrl2.default)(data.text)) return undefined;
    if (!(0, _isImage2.default)(data.text)) return undefined;
    return insertImage(state, data.text);
  };

  /**
   * On paste, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  var onPaste = function onPaste(e, data, state, editor) {
    switch (data.type) {
      case 'files':
        return onDropOrPasteFiles(e, data, state, editor);
      case 'text':
        return onPasteText(e, data, state);
      default:
        return undefined;
    }
  };

  return {
    renderNode: renderNode,
    onDocumentChange: onDocumentChange,
    onDrop: onDrop,
    onDropNode: onDropNode,
    onDropOrPasteFiles: onDropOrPasteFiles,
    onPaste: onPaste,
    onPasteText: onPasteText
  };
}