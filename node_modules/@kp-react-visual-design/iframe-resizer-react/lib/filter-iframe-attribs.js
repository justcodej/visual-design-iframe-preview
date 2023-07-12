"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _excluded = ["autoResize", "bodyBackground", "bodyMargin", "bodyPadding", "checkOrigin", "inPageLinks", "heightCalculationMethod", "interval", "log", "maxHeight", "maxWidth", "minHeight", "minWidth", "resizeFrom", "scrolling", "sizeHeight", "sizeWidth", "warningTimeout", "tolerance", "widthCalculationMethod", "onClosed", "onInit", "onMessage", "onResized"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var _default = function _default(props) {
  var autoResize = props.autoResize,
    bodyBackground = props.bodyBackground,
    bodyMargin = props.bodyMargin,
    bodyPadding = props.bodyPadding,
    checkOrigin = props.checkOrigin,
    inPageLinks = props.inPageLinks,
    heightCalculationMethod = props.heightCalculationMethod,
    interval = props.interval,
    log = props.log,
    maxHeight = props.maxHeight,
    maxWidth = props.maxWidth,
    minHeight = props.minHeight,
    minWidth = props.minWidth,
    resizeFrom = props.resizeFrom,
    scrolling = props.scrolling,
    sizeHeight = props.sizeHeight,
    sizeWidth = props.sizeWidth,
    warningTimeout = props.warningTimeout,
    tolerance = props.tolerance,
    widthCalculationMethod = props.widthCalculationMethod,
    onClosed = props.onClosed,
    onInit = props.onInit,
    onMessage = props.onMessage,
    onResized = props.onResized,
    iframeProps = _objectWithoutProperties(props, _excluded);
  return iframeProps;
};
exports.default = _default;