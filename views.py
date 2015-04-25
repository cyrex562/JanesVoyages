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

import voyage_model
import trade_model
import waypoint_model


app = Flask(__name__)
app.debug = True
app.secret_key = os.urandom(24)
mongo = PyMongo(app)
voyage_model.init(app, mongo)
trade_model.init(app, mongo)
waypoint_model.init(app, mongo)


def set_session_id(in_session):
    if 'session_id' in in_session:
        result = in_session['session_id']
    else:
        result = uuid.uuid4().hex
        in_session['session_id'] = result
    return result


@app.route('/')
def render_default():
    return redirect(url_for('voyages_page_get'))


@app.route('/voyages', methods=['GET'])
def render_voyages_page():
    return render_template('voyages.html')


@app.route('/voyages/get', methods=['POST'])
def voyages_get():
    """
    route handler for a request to get one or more (or all) voyages
    :return: a JSON object in the format:
    { "message": "success|<error message>", data={"voyages": []}}
    """
    app.logger.debug('voyages_get')
    voyage_ids = request.json["params"]["voyage_ids"]
    found_voyages = voyage_model.get_voyages(voyage_ids)
    result = jsonify(message="success", data={"found_voyages": found_voyages})
    return result


@app.route('/voyages/add', methods=['POST'])
def voyages_add():
    """
    route handler for a request oadd one or more voyages
    :return: a JSON object in the format
    { "message": "success|<error message>", data={"added_voyage_ids": []}}
    """
    app.logger.debug('voyages_post')
    voyages_to_add = request.json["params"]["voyages_to_add"]
    added_voyage_ids = voyage_model.add_voyages(voyages_to_add)
    result = jsonify(message="success", data={"added_voyage_ids":
        added_voyage_ids})
    return result


@app.route('/voyages/modify', methods=['POST'])
def voyages_modify():
    """
    route handler for a request modify one or more voyages
    :return: a JSON object in the format
    { "message": "success|<error message>", data={"modified_voyage_ids": []}}
    """
    app.logger.debug('voyages_post')
    voyages_to_modify = request.json["params"]["voyages_to_modify"]
    modified_voyage_ids = voyage_model.modify_voyages(voyages_to_modify)
    result = jsonify(message="success", data={"modified_voyage_ids":
        modified_voyage_ids})
    return result


@app.route('/voyages/delete', methods=['POST'])
def voyages_delete():
    """
    route handler for a request modify one or more voyages
    :return: a JSON object in the format
    { "message": "success|<error message>", data={"modified_voyage_ids": []}}
    """
    app.logger.debug('voyages_delete')
    voyages_to_delete = request.json["params"]["voyages_to_delete"]
    deleted_voyage_ids = voyage_model.delete_voyages(voyages_to_delete)
    result = jsonify(message="success", data={"deleted_voyage_ids":
        deleted_voyage_ids})
    return result


@app.route('/waypoints/get', methods=['POST'])
def waypoints_get():
    app.logger.debug('/voyages/get')
    waypoint_ids = request.json["params"]["waypoint_ids"]
    found_waypoints = waypoint_model.get_waypoints(waypoint_ids)
    return jsonify(message="success", data={"found_waypoints": found_waypoints})


@app.route('/waypoints/add', methods=['POST'])
def waypoints_add():
    app.logger.debug('/waypoints/add')
    waypoints_to_add = request.json["params"]["waypoints_to_add"]
    added_waypoint_ids = waypoint_model.add_waypoints(waypoints_to_add)
    return jsonify(message="success",
                   data={"added_waypoint_ids": added_waypoint_ids})


@app.route('/waypoints/modify', methods=['POST'])
def waypoints_modify():
    app.logger.debug('/waypoints/modify')
    waypoints_to_modify = request.json["params"]["waypoints_to_modify"]
    modified_waypoint_ids = waypoint_model.modify_waypoints(waypoints_to_modify)
    return jsonify(message="success",
                   data={"modified_waypoint_ids": modified_waypoint_ids})


@app.route('/waypoints/delete', methods=['POST'])
def waypoints_delete():
    app.logger.debug('waypoints/delete')
    waypoints_to_delete = request.json["params"]["waypoints_to_delete"]
    deleted_waypoint_ids = waypoint_model.delete_waypoint(waypoints_to_delete)
    return jsonify(message="success",
                   data={"deleted_waypoint_ids": deleted_waypoint_ids})


@app.route('/trades/get', methods=['POST'])
def trades_get():
    app.logger.debug('trades_get')
    params = request.json['params']
    if 'trade_ids' in params:
        trade_ids = params['trade_ids']
        found_trades = trade_model.get_trades(trade_ids)
    elif 'waypoint_id' in params:
        waypoint_id = params['waypoint_id']
        found_trades = trade_model.get_trades_for_waypoint(waypoint_id)

    else:
        found_trades = []
        app.logger.error('invalid params: "{0}"'.format(params))
    result = jsonify(message='success', data={"found_trades": found_trades})
    return result


@app.route('/trades/add', methods=['POST'])
def trades_add():
    app.logger.debug('trades_add')
    trades_to_add = request.json["parms"]["trades_to_add"]
    added_trade_ids = trade_model.add_trades(trades_to_add)
    return jsonify(message="success",
                   data={"added_trade_ids": added_trade_ids})


@app.route('/trades/modify', methods=['POST'])
def trades_modify():
    app.logger.debug('trades_modify')
    trades_to_modify = request.json["params"]["trades_to_modify"]
    modified_trade_ids = trade_model.modify_trades(trades_to_modify)
    return jsonify(message="success",
                   data={"modified_trade_ids": modified_trade_ids})


@app.route('/trades/delete', methods=['POST'])
def trades_delete():
    app.logger.debug('trades_delete')
    trades_to_delete = request.json["params"]["trades_to_delete"]
    deleted_trade_ids = trade_model.delete_trade(trades_to_delete)
    return jsonify(message="success",
                   data={"deleted_trade_ids": deleted_trade_ids})


if __name__ == '__main__':
    app.run()