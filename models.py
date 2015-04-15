"""
@file models.py
@brief data model objects definition
@author Josh Madden
@copyright Fifth Column Group 2014
"""
mongo = None
app = None


def init(app, in_mongo):
    global mongo
    mongo = in_mongo


def get_all_voyages():
    return list(mongo.db.voyages.find())


def add_voyage(voyage_to_add):
    add_voyage_result = mongo.db.voyages.insert(voyage_to_add)
    print "add_voyage_result: {0}".format(add_voyage_result)
    return add_voyage_result


def modify_voyage(voyage_to_modify):
    modify_voyage_result = mongo.db.voyages.update(
        {"voyage_id": voyage_to_modify["voyage_id"]}, voyage_to_modify)
    print "modify_voyage_result: {0}".format(modify_voyage_result)
    return modify_voyage_result


def delete_voyage(voyage_to_delete):
    del_voyage_result = mongo.db.voyages.remove(
        {"voyage_id": voyage_to_delete["voyage_id"]})
    print "del_voyage_result: {0}".format(del_voyage_result)
    return del_voyage_result


def get_voyage_by_id(voyage_id):
    find_voyage_result = mongo.db.voyages.find_one({"voyage_id": voyage_id})
    print "find_voyage_result: {0}".format(find_voyage_result)
    return find_voyage_result


def get_voyages_by_id(voyage_ids):
    app.logger.debug('get_voyages_by_ids: NOT IMPLEMENTED')
    pass


def stringify_object_ids(in_list):
    new_list = []
    for i in in_list:
        i['_id'] = str(i['_id'])
        new_list.append(i)
    return new_list


def add_waypoint(waypoint_to_add):
    add_waypoint_result = mongo.db.waypoints.insert(waypoint_to_add)
    app.logger.debug('add waypoint result: {0}'.format(add_waypoint_result))
    return add_waypoint_result


def modify_waypoint(waypoint_to_modify):
    modify_waypoint_result = mongo.db.waypoints.update(
        {"waypoint_id": waypoint_to_modify["waypoint_id"]}, waypoint_to_modify)
    app.logger.debug(
        "modify waypoint result: {0}".format(modify_waypoint_result))
    return modify_waypoint_result


def delete_waypoint(waypoint_to_delete):
    delete_waypoint_result = mongo.db.waypoints.remove(
        {"waypoint_id": waypoint_to_delete["waypoint_id"]})
    app.logger.debug(
        "delete waypoint result: {0}".format(delete_waypoint_result))
    return delete_waypoint_result


def get_all_waypoints():
    return list(mongo.db.waypoints.find())


def get_waypoint_by_id(waypoint_id):
    find_waypoint_result = mongo.db.waypoints.find_one(
        {"waypoint_id": waypoint_id})
    app.logger.debug("get_waypoint_id: find_waypoint_result: {0}".format(
        find_waypoint_result))
    return find_waypoint_result


def get_waypoints_by_id(waypoint_ids):
    pass


def get_all_trades():
    pass


def get_trade_by_id(trade_id):
    pass


def get_trades_by_id(trade_ids):
    pass


def add_trade(trade_to_add):
    pass


def modify_trade(trade_to_modify):
    pass


def delete_trade(trade_to_delete):
    pass


