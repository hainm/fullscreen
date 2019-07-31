import { Signal } from "signals";

// adapted from
// https://github.com/arose/ngl/blob/27d238dc4fec32ffeab9a330dbfbc78365d558dc/src/stage/stage.ts
// MIT License, Copyright (c) 2014-2017, Alexander S Rose  

declare global {
  interface Document {
    mozFullScreen: boolean;
    mozFullScreenEnabled: boolean;
    mozFullScreenElement: Element;
    mozCancelFullScreen(): void;

    msFullscreenEnabled: boolean;
    msFullscreenElement: Element;
    msExitFullscreen(): void;

    webkitFullscreenEnabled: boolean;
    webkitFullscreenElement: Element;
    webkitExitFullscreen(): void;
  }

  interface Element {
    mozRequestFullScreen(): void;
    msRequestFullscreen(): void;
    webkitRequestFullscreen(): void;
  }
}

export
class Fullscreen {
  signals = { fullscreenChanged: new Signal() };
  lastFullscreenElement: HTMLElement;

  toggleFullscreen(element: HTMLElement) {
    if (
      !document.fullscreenEnabled &&
      !document.mozFullScreenEnabled &&
      !document.webkitFullscreenEnabled &&
      !document.msFullscreenEnabled
    ) {
      console.log("fullscreen mode (currently) not possible");
      return;
    }

    const self = this;
    this.lastFullscreenElement = element;

    //

    function getFullscreenElement() {
      return (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    }

    function resizeElement() {
      if (!getFullscreenElement() && self.lastFullscreenElement) {
        const element = self.lastFullscreenElement;
        element.style.width = element.dataset.normalWidth || "";
        element.style.height = element.dataset.normalHeight || "";

        document.removeEventListener("fullscreenchange", resizeElement);
        document.removeEventListener("mozfullscreenchange", resizeElement);
        document.removeEventListener("webkitfullscreenchange", resizeElement);
        document.removeEventListener("MSFullscreenChange", resizeElement);

        self.signals.fullscreenChanged.dispatch(false);
      }
    }
    if (!getFullscreenElement()) {
      element.dataset.normalWidth = element.style.width || "";
      element.dataset.normalHeight = element.style.height || "";
      element.style.width = window.screen.width + "px";
      element.style.height = window.screen.height + "px";

      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }

      document.addEventListener("fullscreenchange", resizeElement);
      document.addEventListener("mozfullscreenchange", resizeElement);
      document.addEventListener("webkitfullscreenchange", resizeElement);
      document.addEventListener("MSFullscreenChange", resizeElement);

      this.signals.fullscreenChanged.dispatch(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
}
