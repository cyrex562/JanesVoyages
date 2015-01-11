"""
@file views.py
@brief flask web app main script file for Janes Voyages Web App (JVAP)
@author Josh Madden <cyrex562@gmail.com>
@copyright Josh Madden 2014
"""

import os
import uuid

from flask import jsonify, render_template, request, redirect, \
    url_for, Flask
from flask.ext.pymongo import PyMongo

import models


app = Flask(__name__)
app.debug = True
app.secret_key = os.urandom(24)
mongo = PyMongo(app)
models.init(mongo)


def set_session_id(in_session):
    """

    :param in_session:
    :return:
    """
    if 'session_id' in in_session:
        result = in_session['session_id']
    else:
        result = uuid.uuid4().hex
        in_session['session_id'] = result
    return result


@app.route('/')
def default_page_controller():
    """
    default route handler
    :return:
    """
    return redirect(url_for('voyages_page_get'))


@app.route('/voyages', methods=['GET'])
def voyages_page_get():
    """
    page controller
    :return:
    """
    return render_template('voyages2.html')


@app.route('/voyages/get', methods=['POST'])
def voyages_get():
    """

    :return:
    """
    app.logger.debug('voyages_get')
    voyage_ids = request.json["params"]["voyage_ids"]

    if len(voyage_ids) == 0:
        voyages = models.get_all_voyages()
        voyages = models.stringify_object_ids(voyages)
    elif len(voyage_ids) == 1:
        voyage = models.get_voyage_by_id(voyage_ids[0])
        voyages = [voyage]
        voyages = models.stringify_object_ids(voyages)
    else:
        voyages = []
        app.logger.error('voyages_get: NOT IMPLEMENTED')
    result = jsonify(message="success", data={"voyages": voyages})
    return result


@app.route('/voyages/add', methods=['POST'])
def voyages_post():
    """

    :return:
    """
    app.logger.debug('voyages_post')
    new_voyage = request.json["params"]["new_voyage"]
    add_result = models.add_voyage(new_voyage)
    return jsonify(message="success", data="")


@app.route('/voyages/modify', methods=['POST'])
def voyages_put():
    app.logger.debug('voyages_post')
    mod_voyage = request.json["params"]["modified_voyage"]
    mod_result = models.modify_voyage(mod_voyage)
    return jsonify(message="success", data="")


@app.route('/voyages/delete', methods=['POST'])
def voyages_delete():
    app.logger.debug('voyages_delete')
    del_voyage = request.json["params"]["del_voyage"]
    del_result = models.delete_voyage(del_voyage)
    return jsonify(message="success", data="")


if __name__ == '__main__':
    app.run()