import { o_create } from "oasis/shims";
import oasisInlineAdapter from "oasis/inline_adapter";

var inlineAdapter = o_create(oasisInlineAdapter);

inlineAdapter.wrapResource = function(data, oasis) {
  var functionDef = 
    'var _globalOasis = window.oasis; window.oasis = oasis;' +
    'try {' +
    data +
    ' } finally {' +
    'window.oasis = _globalOasis;' +
    '}';
  return new Function("oasis", functionDef);
};

export default inlineAdapter;
