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
    if 'session_id' in in_session:
        result = in_session['session_id']
    else:
        result = uuid.uuid4().hex
        in_session['session_id'] = result
    return result


@app.route('/')
def default_page_controller():
    return redirect(url_for('voyages_page_get'))


@app.route('/voyages', methods=['GET'])
def voyages_page_get():
    return render_template('voyages2.html')


@app.route('/voyages/get', methods=['POST'])
def voyages_get():
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
def voyages_add():
    app.logger.debug('voyages_post')
    new_voyage = request.json["params"]["voyage_to_add"]
    new_voyage['waypoints'] = \
        models.get_waypoints_by_id(new_voyage['waypoints'])
    add_result = models.add_voyage(new_voyage)
    return jsonify(message="success", data={"added_voyage_id": add_result})


@app.route('/voyages/modify', methods=['POST'])
def voyages_modify():
    app.logger.debug('voyages_post')
    mod_voyage = request.json["params"]["voyage_to_modify"]
    mod_result = models.modify_voyage(mod_voyage)
    return jsonify(message="success", data={"modified_voyage_id": mod_result})


@app.route('/voyages/delete', methods=['POST'])
def voyages_delete():
    app.logger.debug('voyages_delete')
    del_voyage = request.json["params"]["voyage_to_delete"]
    del_result = models.delete_voyage(del_voyage)
    return jsonify(message="success", data={"deleted_voyage_id": del_result})


@app.route('/waypoints/get', methods=['POST'])
def waypoints_get():
    app.logger.debug('waypoint_get')
    waypoint_ids = request.json['params']['waypoint_ids']
    if len(waypoint_ids) == 0:
        waypoints = models.get_all_waypoints()
        waypoints = models.stringify_object_ids(waypoints)
    elif len(waypoint_ids) == 1:
        waypoint = models.get_waypoint_by_id(waypoint_ids[0])
        waypoints = [waypoint]
        waypoints = models.stringify_object_ids(waypoints)
    else:
        waypoints = []
        app.logger.error('waypoints_get: NOT IMPLEMENTED')
    result = jsonify(message="success", data={"waypoints": waypoints})
    return result


@app.route('/waypoints/add', methods=['POST'])
def waypoints_add():
    app.logger.debug('waypoints_add')
    waypoint_to_add = request.json["params"]["waypoint_to_add"]
    add_waypoint_result = models.add_waypoint(waypoint_to_add)
    return jsonify(message="success",
                   data={"added_waypoint_id": add_waypoint_result})


@app.route('/waypoints/modify', methods=['POST'])
def waypoints_modify():
    app.logger.debug('waypoints_modify')
    waypoint_to_modify = request.json["params"]["waypoint_to_modify"]
    modify_waypoint_result = models.modify_waypoint(waypoint_to_modify)
    return jsonify(message="success",
                   data={"modified_waypoint_id": modify_waypoint_result})


@app.route('/waypoints/delete', methods=['POST'])
def waypoints_delete():
    app.logger.debug('waypoints_delete')
    waypoint_to_delete = request.json["params"]["waypoint_to_delete"]
    delete_waypoint_result = models.delete_waypoint(waypoint_to_delete)
    return jsonify(message="success",
                   data={"deleted_waypoint_id": delete_waypoint_result})


@app.route('/trades/get', methods=['POST'])
def trades_get():
    app.logger.debug('trades_get')
    trade_ids = request.json['params']['trade_ids']
    if len(trade_ids) == 0:
        trades = models.get_all_trades()
        trades = models.stringify_object_ids(trades)
    elif len(trade_ids) == 1:
        trade = models.get_trade_by_id(trade_ids[0])
        trades = [trade]
        trades = models.stringify_object_ids(trades)
    else:
        trades = []
        app.logger.error('trades_get: NOT IMPLEMENTED')
    result = jsonify(message='success', data={"trades": trades})
    return result


@app.route('/trades/add', methods=['POST'])
def trades_add():
    app.logger.debug('trades_add')
    trade_to_add = request.json["parms"]["trade_to_add"]
    add_trade_result = models.add_trade(trade_to_add)
    return jsonify(message="success",
                   data={"added_trade_id": add_trade_result})


@app.route('/trades/modify', methods=['POST'])
def trades_modify():
    app.logger.debug('trades_modify')
    trade_to_modify = request.json["params"]["trade_to_modify"]
    modify_trade_result = models.modify_trade(trade_to_modify)
    return jsonify(message="success",
                   data={"modified_trade_id": modify_trade_result})


@app.route('/trades/delete', methods=['POST'])
def trades_delete():
    app.logger.debug('trades_delete')
    trade_to_delete = request.json["params"]["trade_to_delete"]
    delete_trade_result = models.delete_trade(trade_to_delete)
    return jsonify(message="success",
                   data={"deleted_trade_id": delete_trade_result})


if __name__ == '__main__':
    app.run()