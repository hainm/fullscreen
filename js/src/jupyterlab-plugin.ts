var fullscreen_js_widgets = require("./index");
var base = require("@jupyter-widgets/base");

module.exports = {
  id: "fullscreen-js-widgets",
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
    widgets.registerWidget({
      name: "fullscreen-js-widgets",
      version: fullscreen_js_widgets.version,
      exports: fullscreen_js_widgets
    });
  },
  autoStart: true
};
