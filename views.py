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
import source_model
import event_model

VERSION = 'version 0.1.3'
COPYRIGHT = 'Copyright Fifth Column Group 2015'

app = Flask(__name__)
app.debug = True
app.secret_key = os.urandom(24)
mongo = PyMongo(app)
voyage_model.init(app, mongo)
trade_model.init(app, mongo)
waypoint_model.init(app, mongo)
source_model.init(app, mongo)
event_model.init(app, mongo)


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
def render_default():
    """

    :return:
    """
    return redirect(url_for('render_voyages_page'))


@app.route('/voyages', methods=['GET'])
def render_voyages_page():
    """

    :return:
    """
    return render_template('voyages.html', version=VERSION, copyright=COPYRIGHT)


@app.route('/waypoints', methods=['GET'])
def render_waypoints_page():
    return render_template('waypoints.html', version=VERSION, copyright=COPYRIGHT)


@app.route('/trades', methods=['GET'])
def render_trade_page():
    return render_template('trades.html', version=VERSION, copyright=COPYRIGHT)


@app.route('/ships', methods=['GET'])
def render_ships_page():
    return render_template('ships.html', version=VERSION, copyright=COPYRIGHT)


@app.route('/events', methods=['GET'])
def render_events_page():
    return render_template('events.html', version=VERSION, copyright=COPYRIGHT)


@app.route('/sources', methods=['GET'])
def render_sources_page():
    return render_template('sources.html', version=VERSION, copyright=COPYRIGHT)


@app.route('/voyages/get', methods=['POST'])
def voyages_get():
    """
    route handler for a request to get one or more (or all) voyages
    :return: a JSON object in the format:
    { "message": "success|<error message>", data={"voyages": []}}
    """
    voyage_ids = request.json["params"]["voyage_ids"]
    app.logger.debug('route: "/voyages/get", voyage_ids: {0}'.format(
        voyage_ids))
    found_voyages = voyage_model.get_voyages(voyage_ids)
    for voyage in found_voyages:
        voyage['waypoint_count'] = \
            waypoint_model.get_voyage_waypoint_count(voyage['voyage_id'])
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
    result = jsonify(message="success",
                     data={"added_voyage_ids": added_voyage_ids})
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
    voyages_modified = voyage_model.modify_voyages(voyages_to_modify)
    if voyages_modified is True:
        modified_voyage_ids = []
        for vtm in voyages_to_modify:
            modified_voyage_ids.append(vtm['voyage_id'])
        result = jsonify(message="success",
                         data={"modified_voyage_ids": modified_voyage_ids})
    else:
        result = jsonify(message="failure", data={})
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
    success = voyage_model.delete_voyages(voyages_to_delete)
    if success is True:
        result = jsonify(message="success", data={})
    else:
        result = jsonify(message="failure", data={})
    return result


@app.route('/waypoints/get', methods=['POST'])
def waypoints_get():
    """

    :return:
    """
    params = request.json['params']
    app.logger.debug('route: /waypoints/get, params: {0}'.format(str(params)))
    if 'waypoint_ids' in params:
        waypoint_ids = params["waypoint_ids"]
        found_waypoints = waypoint_model.get_waypoints(waypoint_ids)
    elif 'voyage_id' in params:
        voyage_id = params['voyage_id']
        found_waypoints = waypoint_model.get_waypoints_by_voyage(voyage_id)
    else:
        app.logger.debug('params not valid: {0}'.format(params))
        found_waypoints = []

    return jsonify(message="success", data={"found_waypoints": found_waypoints})


@app.route('/waypoints/add', methods=['POST'])
def waypoints_add():
    """

    :return:
    """
    waypoints_to_add = request.json["params"]["waypoints_to_add"]
    app.logger.debug('route: "/waypoints/add", waypoints_to_add: {0}'.format(
        waypoints_to_add))
    added_waypoint_ids = waypoint_model.add_waypoints(waypoints_to_add)
    return jsonify(message="success",
                   data={"added_waypoint_ids": added_waypoint_ids})


@app.route('/waypoints/modify', methods=['POST'])
def waypoints_modify():
    """

    :return:
    """
    waypoints_to_modify = request.json["params"]["waypoints_to_modify"]
    app.logger.debug('route: "/waypoints/modify", waypoints_to_modify: {'
                     '0}'.format(str(waypoints_to_modify)))
    waypoints_modified = waypoint_model.modify_waypoints(waypoints_to_modify)
    if waypoints_modified is True:
        modified_waypoint_ids = []
        for wtm in waypoints_to_modify:
            modified_waypoint_ids.append(wtm['waypoint_id'])
        result = jsonify(message="success",
                         data={'modified_waypoint_ids': modified_waypoint_ids})
    else:
        result = jsonify(message="failure", data={})
    return result


@app.route('/waypoints/delete', methods=['POST'])
def waypoints_delete():
    """

    :return:
    """
    waypoint_ids = request.json["params"]["waypoint_ids"]
    app.logger.debug('route: "/waypoints/delete", waypoint_ids: {'
                     '0}'.format(str(waypoint_ids)))
    success = waypoint_model.delete_waypoints(waypoint_ids)
    if success is True:
        result = jsonify(message="success", data={})
    else:
        result = jsonify(message="failure", data={})
    return result


@app.route('/trades/get', methods=['POST'])
def trades_get():
    params = request.json['params']
    app.logger.debug('route: "/trades/get", params: {0}'.format(params))
    if 'trade_ids' in params:
        trade_ids = params['trade_ids']
        found_trades = trade_model.get_trades(trade_ids)
    elif 'waypoint_id' in params:
        waypoint_id = params['waypoint_id']
        found_trades = trade_model.get_trades_by_waypoint(waypoint_id)
    else:
        found_trades = []
        app.logger.error('invalid params: "{0}"'.format(params))
        app.logger.debug('trades_get, found trades count={0}'
                         .format(len(found_trades)))
    if len(found_trades) > 0:
        for i in xrange(0, len(found_trades)):
            waypoint_id = found_trades[i]['waypoint_id']
            if waypoint_id != '' and waypoint_id != None:
                voyage_id = waypoint_model.get_voyage_id_for_waypoint_id(waypoint_id)
                found_trades[i]['voyage_id'] = voyage_id
            else:
                found_trades[i]['voyage_id'] = ''
    result = jsonify(message='success', data={"found_trades": found_trades})
    return result


@app.route('/trades/add', methods=['POST'])
def trades_add():
    app.logger.debug('trades_add')
    trades_to_add = request.json["params"]["trades_to_add"]
    added_trade_ids = trade_model.add_trades(trades_to_add)
    result = jsonify(message="success",
                     data={"added_trade_ids": added_trade_ids})
    return result


@app.route('/trades/modify', methods=['POST'])
def trades_modify():
    app.logger.debug('trades_modify')
    trades_to_modify = request.json["params"]["trades_to_modify"]
    trades_modified = trade_model.modify_trades(trades_to_modify)
    if trades_modified is True:
        modified_trade_ids = []
        for ttm in trades_to_modify:
            modified_trade_ids.append(ttm['trade_id'])
        result = jsonify(message="success",
                         data={'modified_trade_ids': modified_trade_ids})
    else:
        result = jsonify(message="failure", data={})

    return result


@app.route('/trades/delete', methods=['POST'])
def trades_delete():
    app.logger.debug('trades_delete')
    trades_to_delete = request.json["params"]["trades_to_delete"]
    success = trade_model.delete_trades(trades_to_delete)
    if success is True:
        result = jsonify(message="success", data={})
    else:
        result = jsonify(message="failure", data={})
    return result


@app.route('/sources/get', methods=['POST'])
def sources_get():
    params = request.json['params']
    if 'source_ids' in params:
        source_ids = params['source_ids']
        found_sources = source_model.get_sources(source_ids)
    elif 'voyage_id' in params:
        voyage_id = params['voyage_id']
        found_sources = source_model.get_sources_by_voyage(voyage_id)
    else:
        found_sources = []
    app.logger.debug('found_sources={0}'.format(found_sources))
    return jsonify(message="success", data={"found_sources": found_sources})


@app.route('/sources/add', methods=['POST'])
def sources_add():
    sources_to_add = request.json["params"]["sources_to_add"]
    added_source_ids = source_model.add_sources(sources_to_add)
    app.logger.debug('added_source_ids: {0}'.format(added_source_ids))
    return jsonify(message="success",
                   data={"added_source_ids": added_source_ids})


@app.route('/sources/modify', methods=['POST'])
def sources_modify():
    sources_to_modify = request.json["params"]["sources_to_modify"]
    sources_modified = source_model.modify_sources(sources_to_modify)
    if sources_modified is True:
        modified_source_ids = []
        for stm in sources_to_modify:
            modified_source_ids.append(stm['source_id'])
        result = jsonify(message="success", data={'modified_source_ids': modified_source_ids})
    else:
        result = jsonify(message="failure", data={})
    return result


@app.route('/sources/delete', methods=['POST'])
def sources_delete():
    sources_to_delete = request.json['params']['source_ids']
    sources_deleted = source_model.delete_sources(sources_to_delete)
    if sources_deleted is True:
        result = jsonify(message="success", data={})
    else:
        result = jsonify(message="failure", data={})
    return result


@app.route('/events/get', methods=['POST'])
def events_get():
    params = request.json['params']
    if 'event_ids' in params:
        event_ids = params['event_ids']
        found_events = event_model.get_events(event_ids)
    elif 'waypoint_id' in params:
        waypoint_id = params['waypoint_id']
        found_events = event_model.get_events_by_waypoint(waypoint_id)
    else:
        found_events = []

    if len(found_events) > 0:
        for i in xrange(0, len(found_events)):
            waypoint_id = found_events[i]['waypoint_id']
            if waypoint_id != '' and waypoint_id != None:
                voyage_id = waypoint_model.get_voyage_id_for_waypoint_id(waypoint_id)
                found_events[i]['voyage_id'] = voyage_id
            else:
                found_events[i]['voyage_id'] = ''

    result = jsonify(message="success", data={"found_events": found_events})
    return result


@app.route('/events/add', methods=['POST'])
def events_add():
    events_to_add = request.json['params']['events_to_add']
    added_event_ids = event_model.add_events(events_to_add)
    return jsonify(message="success",
                   data={"added_event_ids": added_event_ids})


@app.route('/events/modify', methods=['POST'])
def events_modify():
    events_to_modify = request.json["params"]["events_to_modify"]
    events_modified = event_model.modify_events(events_to_modify)
    if events_modified is True:
        modified_event_ids = []
        for etm in events_to_modify:
            modified_event_ids.append(etm['event_id'])
        result = jsonify(message="success", data={'modified_event_ids': modified_event_ids})
    else:
        result = jsonify(message="failure", data={})

    return result


@app.route('/events/delete', methods=['POST'])
def events_delete():
    events_to_delete = request.json["params"]["events_to_delete"]
    success = event_model.delete_events(events_to_delete)
    if success is True:
        result = jsonify(message="success", data={})
    else:
        result = jsonify(message="failure", data={})
    return result


# entry point #
if __name__ == '__main__':
    app.run()


# END OF FILE #
