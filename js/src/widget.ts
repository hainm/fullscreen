import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import * as _ from "underscore";
import {Fullscreen} from "./fullscreen"

// adapted from:
// https://github.com/arose/nglview/blob/7ba64def232a246c68fc96d059600b4c671703c5/js/src/widget_ngl.js#L1115
// The MIT License, Copyright (c); 2015 Alexander S. Rose

var FullscreenModel = DOMWidgetModel.extend({
  defaults: function() {
    return _.extend(DOMWidgetModel.prototype.defaults(), {
      _model_name: "FullscreenModel",
      _model_module: "fullscreen-js-widgets",
      _model_module_version: require("../package.json").version,
      _view_name: "FullscreenView",
      _view_module: "fullscreen-js-widgets",
      _view_module_version: require("../package.json").version
    });
  }
});

var FullscreenView = DOMWidgetView.extend({
  render: function() {
    this.fs = new Fullscreen();
    var that = this;
    this.model.on("msg:custom", function(msg) {
      that.on_msg(msg);
    });
    this.handleSignals();
  },

  fullscreen: function(model_id) {
    var that = this;
    this.model.widget_manager.get_model(model_id).then(model => {
      var key = Object.keys(model.views)[0];
      model.views[key].then(view => {
        that.fs.toggleFullscreen(view.el);
      });
    });
  },

  handleSignals: function() {
    var that = this;
    this.fs.signals.fullscreenChanged.add(function(isFullscreen) {
      that.model.set("_is_fullscreen", isFullscreen);
      that.touch();
    });
  },

  execute_code: function(code) {
    eval(code);
  },

  on_msg: function(msg) {
    if ("execute_code" in msg) {
      this.execute_code(msg.execute_code);
    }
  }
});

module.exports = {
  FullscreenModel: FullscreenModel,
  FullscreenView: FullscreenView
};
