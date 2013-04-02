#!/usr/bin/env python
# -*- coding: utf-8 -*-

from google.appengine.ext import db, webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import rest


# 公開したいModel
class Task(db.Model):
    title = db.StringProperty()
    author = db.StringProperty()
    achieved = db.BooleanProperty(default=False)
    created = db.DateTimeProperty(auto_now_add=True)

# サンプルデータの登録
Task.get_or_insert('task1', title='Foo', author='Tom')
Task.get_or_insert('task2', title='Bar', author='Jhon', acheved=True)

# ベースアドレスを登録し、公開するモデルを登録します
rest.Dispatcher.base_url = '/api'
rest.Dispatcher.add_models({
    'tasks': (Task, ['META_DATA', 'POST', 'GET']),
    })

application = webapp.WSGIApplication([
    ('/api/.*', rest.Dispatcher)
    ], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == '__main__':
    main()
