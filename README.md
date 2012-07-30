RocPy.org Website
=================

RocPy(.org)'s website, to be collabaratively edited by members of RocPy's organizational team.

Development Usage
-----------------
The website is written in [Flask](http://flask.pocoo.org/). To do development work on the website, simply execute `python rocpy-website/__init__.py`. You should be able to access the website at http://localhost:8080. Changes in the code should automatically reload the webserver.

In production, the server uses WSGI, so please don't rename, or move `__init__.py` in the root of the repository.
