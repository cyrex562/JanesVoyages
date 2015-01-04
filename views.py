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
    return redirect(url_for('voyages_page_controller_2'))


@app.route('/voyages2', methods=['GET'])
def voyages_page_controller_2():
    """
    page controller
    :return:
    """
    return render_template('voyages2.html')


@app.route('/voyages', methods=['GET', 'POST', 'PUSH', 'DELETE'])
def voyages_route_handler():
    """
    route handler for voyages
    GET -- get a list of all voyages
    POST -- post a new voyage
    PUT -- update a voyage
    DELETE -- delete a voyage
    :return:
    """
    if request.method == 'GET':
        voyages = models.get_all_voyages()
        # return jsonpickle.encode({'message': 'success', 'data': {voyages}},
        #                          unpicklable=False)
        return jsonify(message="success", data={"voyages": voyages})
    elif request.method == 'POST':
        new_voyage = request.json["params"]["new_voyage"]
        add_result = models.add_voyage(new_voyage)
        return jsonify(message="success", data="")
    elif request.method == 'PUSH':
        mod_voyage = request.json["params"]["mod_voyage"]
        mod_result = models.modify_voyage(mod_voyage)
        return jsonify(message="success", data="")
    elif request.method == 'DELETE':
        del_voyage = request.json["params"]["del_voyage"]
        del_result = models.delete_voyage(del_voyage)
        return jsonify(message="success", data="")
    else:
        print('unsupported request method: {0}'.format(request.method))


if __name__ == '__main__':
    app.run()