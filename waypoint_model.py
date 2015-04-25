mongo = None
app = None
logger = None


def init(in_app, in_mongo):
    global mongo
    global app
    global logger
    mongo = in_mongo
    app = in_app
    logger = app.logger


def get_all_waypoints():
    return list(mongo.db.waypoints.find())


def get_waypoint_by_id(waypoint_id):
    found_waypoint = mongo.db.waypoints.find_one(
        {"waypoint_id": waypoint_id})
    logger.debug("get_waypoint_id: find_waypoint_result: {0}".format(
        found_waypoint))
    return found_waypoint


def get_waypoints_by_voyage(voyage_id):
    found_waypoints = mongo.db.waypoints.find({"voyage_id": voyage_id})
    return found_waypoints


def get_waypoints(waypoint_ids):
    found_waypoints = []
    if len(waypoint_ids) == 0:
        found_waypoints = get_all_waypoints()
    else:
        for waypoint_id in waypoint_ids:
            found_waypoint = get_waypoint_by_id(waypoint_id)
            if found_waypoint is not None:
                found_waypoints.append(found_waypoint)
    return found_waypoints


def add_waypoint(waypoint_to_add):
    add_waypoint_result = mongo.db.waypoints.insert(waypoint_to_add)
    logger.debug('add waypoint result: {0}'.format(add_waypoint_result))
    return add_waypoint_result


def add_waypoints(waypoints_to_add):
    added_waypoint_ids = []
    for waypoint_to_add in waypoints_to_add:
        added_waypoint_id = add_waypoint(waypoint_to_add)
        if added_waypoint_id is not None:
            added_waypoint_ids.append(added_waypoint_id)
    return added_waypoint_ids


def modify_waypoint(waypoint_to_modify):
    modify_waypoint_result = mongo.db.waypoints.update(
        {"waypoint_id": waypoint_to_modify["waypoint_id"]}, waypoint_to_modify)
    logger.debug("modify waypoint result: {0}".format(modify_waypoint_result))
    return modify_waypoint_result


def modify_waypoints(waypoints_to_modify):
    modified_waypoint_ids = []
    for waypoint_to_modify in waypoints_to_modify:
        modified_waypoint_id = modify_waypoint(waypoint_to_modify)
        if modified_waypoint_id is not None:
            modified_waypoint_ids.append(modified_waypoint_id)
    return modified_waypoint_ids


def delete_waypoint(waypoint_to_delete):
    delete_waypoint_result = mongo.db.waypoints.remove(
        {"waypoint_id": waypoint_to_delete["waypoint_id"]})
    logger.debug("delete waypoint result: {0}".format(delete_waypoint_result))
    return delete_waypoint_result


def delete_waypoints(waypoints_to_delete):
    deleted_waypoint_ids = []
    for waypoint_to_delete in waypoints_to_delete:
        deleted_waypoint_id = delete_waypoint(waypoint_to_delete)
        if deleted_waypoint_id is not None:
            deleted_waypoint_ids.append(deleted_waypoint_id)
    return deleted_waypoint_ids





