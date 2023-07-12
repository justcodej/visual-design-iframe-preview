var _excluded = ["title", "forwardRef"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import iframeResize from 'iframe-resizer/js/iframeResizer';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import filterIframeAttribs from './filter-iframe-attribs';
var IframeResizer = function IframeResizer(props) {
  var title = props.title,
    forwardRef = props.forwardRef,
    rest = _objectWithoutProperties(props, _excluded);
  var iframeProps = filterIframeAttribs(rest);
  var iframeRef = useRef(null);
  var onClose = function onClose() {
    return !iframeRef.current;
  };

  // This hook is only run once, as once iframeResizer is bound, it will
  // deal with changes to the element and does not need recalling
  useEffect(function () {
    var iframe = iframeRef.current;
    iframeResize(_objectSpread(_objectSpread({}, rest), {}, {
      onClose: onClose
    }), iframe);
    return function () {
      return iframe.iFrameResizer && iframe.iFrameResizer.removeListeners();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(forwardRef, function () {
    return {
      resize: function resize() {
        return iframeRef.current.iFrameResizer.resize();
      },
      moveToAnchor: function moveToAnchor(anchor) {
        return iframeRef.current.iFrameResizer.moveToAnchor(anchor);
      },
      sendMessage: function sendMessage(message, targetOrigin) {
        iframeRef.current.iFrameResizer.sendMessage(message, targetOrigin);
      }
    };
  });
  return /*#__PURE__*/React.createElement("iframe", _extends({
    title: title
  }, iframeProps, {
    ref: iframeRef
  }));
};
IframeResizer.defaultProps = {
  title: 'iframe'
};
export default IframeResizer;