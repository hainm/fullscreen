from setuptools import setup, find_packages

setup(name='fullscreen',
      version='0.0.1',
      
      author='Hai Nguyen',
      author_email='hainm.comp@gmail.com',
      url='https://github.com/hainm/fullscreen',
            
      description="Make ipywidgets's widget fullscreen",
      long_description=open('README.md', encoding='utf-8').read(),
      long_description_content_type = 'text/markdown',
      
      packages=set(find_packages() + ['fullscreen.static']),
      package_data={
           "fullscreen.static": ["*"],
      },
      data_files=[
          ('share/jupyter/nbextensions/fullscreen-js-widgets', [
           'fullscreen/static/extension.js',
           'fullscreen/static/index.js',
           'fullscreen/static/index.js.map',
      ])],
      classifiers = ['Framework :: IPython',
                     'Programming Language :: Python',
                     'Intended Audience :: Developers',
                     'Development Status :: 3 - Alpha',
                     ],
      license='MIT')
