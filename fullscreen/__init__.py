from ipywidgets import DOMWidget
from traitlets import Unicode, Bool, observe

__frontend_version__ = '0.0.1'

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'fullscreen-js-widgets',
        'require': 'fullscreen-js-widgets/extension'
    }]


class Fullscreen(DOMWidget):
    _view_name = Unicode("FullscreenView").tag(sync=True)
    _view_module = Unicode("fullscreen-js-widgets").tag(sync=True)
    _view_module_version = Unicode(__frontend_version__).tag(sync=True)
    _model_name = Unicode("FullscreenModel").tag(sync=True)
    _model_module = Unicode("fullscreen-js-widgets").tag(sync=True)
    _model_module_version = Unicode(__frontend_version__).tag(sync=True)

    _is_fullscreen = Bool().tag(sync=True)

    def __init__(self, target, views=None):
        super().__init__()
        self._target = target
        self._views = views or []
        self._callbacks = []

    def fullscreen(self):
        self._js("this.fullscreen('%s')" % self._target.model_id)

    def _js(self, code):
        msg = {"execute_code": code}
        self.send(msg)

    @observe('_is_fullscreen')
    def _fullscreen_changed(self, change):
        if not change.new:
            self._target.layout.height = '300px'
        self.handle_resize()
        for c in self._callbacks:
            c(change.new)

    def handle_resize(self):
        for v in self._views:
            v.handle_resize()

    def on_fullscreened(self, callback, remove=False):
        if remove:
            self._callbacks.remove(callback)
        else:
            self._callbacks.append(callback)
