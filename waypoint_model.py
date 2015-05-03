from bson import ObjectId

mongo = None
app = None
logger = None


def init(in_app, in_mongo):
    """
    +
    :param in_app:
    :param in_mongo:
    :return:
    """
    global mongo
    global app
    global logger
    mongo = in_mongo
    app = in_app
    logger = app.logger


def convert_waypoint_ids(in_waypoint):
    """

    :param in_waypoint:
    :return:
    """
    out_waypoint = None
    if in_waypoint is not None:
        out_waypoint = in_waypoint
        out_waypoint['_id'] = str(out_waypoint['_id'])
        out_waypoint['waypoint_id'] = out_waypoint['_id']
    else:
        logger.error('convert_waypoint_ids(): in_waypoint was None')
    return out_waypoint


def get_all_waypoints():
    """

    :return:
    """
    logger.debug('get_all_waypoints()')
    all_waypoints = list(mongo.db.waypoints.find())
    all_waypoints_out = []
    for aw in all_waypoints:
        aw = convert_waypoint_ids(aw)
        if aw is not None:
            all_waypoints_out.append(aw)
        else:
            logger.error('get_all_waypoints(): aw was None')
    logger.debug('get_all_waypoints(), retrieved {0} waypoints'.format(
        len(all_waypoints_out)))
    return all_waypoints_out


def get_waypoint_by_id(waypoint_id):
    """

    :param waypoint_id:
    :return:
    """
    found_waypoint_out = None
    if waypoint_id is not None:
        logger.debug(
            'get_waypoint_by_id(), waypoint_id: {0}'.format(str(waypoint_id)))
        found_waypoint = mongo.db.waypoints.find_one(
            {"_id": ObjectId(waypoint_id)})
        found_waypoint_out = convert_waypoint_ids(found_waypoint)
        logger.debug("get_waypoint_id: found_waypoint_out: {0}".format(
            found_waypoint_out))
    else:
        logger.error('get_waypoint_by_id(): waypoint_id was None')
    return found_waypoint_out


def get_waypoints_by_voyage(voyage_id):
    """

    :param voyage_id:
    :return:
    """
    found_waypoints_out = []
    if voyage_id is not None:
        logger.debug(
            'get_waypoints_by_voyage(), voyage_id: {0}'.format(str(voyage_id)))
        found_waypoints = list(
            mongo.db.waypoints.find({"voyage_id": voyage_id}))
        for fw in found_waypoints:
            fw = convert_waypoint_ids(fw)
            if fw is not None:
                found_waypoints_out.append(fw)
            else:
                logger.error('get_waypoints_by_voyage(): fw was None')
        logger.debug(
            'get_waypoints_by_voyage(), retrieved {0} waypoints'.format(
                len(found_waypoints_out)))
    else:
        logger.error('get_waypoints_by_voyage(): voyage_id was None')
    return found_waypoints_out


def get_waypoints(waypoint_ids):
    """

    :param waypoint_ids:
    :return:
    """
    found_waypoints = []
    if waypoint_ids is not None:
        logger.debug('get_waypoints(), waypoint_ids: {0}'.format(waypoint_ids))
        if len(waypoint_ids) == 0:
            found_waypoints = get_all_waypoints()
        else:
            for waypoint_id in waypoint_ids:
                found_waypoint = get_waypoint_by_id(waypoint_id)
                if found_waypoint is not None:
                    found_waypoints.append(found_waypoint)
    else:
        logger.error('get_waypoints(): waypoint_ids was None')
    return found_waypoints


def add_waypoint(waypoint_to_add):
    """

    :param waypoint_to_add:
    :return:
    """
    added_waypoint_id = None
    if waypoint_to_add is not None:
        logger.debug(
            'add_waypoint(), waypoint_to_add: {0}'.format(str(waypoint_to_add)))
        add_waypoint_result = mongo.db.waypoints.insert(waypoint_to_add)
        added_waypoint_id = str(add_waypoint_result)
        logger.debug(
            'add_waypoint(), add_waypoint_out: {0}'.format(add_waypoint_result))
    else:
        logger.error('add_waypoint(): waypoint_to_add is None')
    return added_waypoint_id


def add_waypoints(waypoints_to_add):
    """

    :param waypoints_to_add:
    :return:
    """
    added_waypoint_ids = []
    if waypoints_to_add is not None:
        logger.debug('add_waypoints(), waypoints_to_add: {0}'.format(
            str(waypoints_to_add)))
        for waypoint_to_add in waypoints_to_add:
            added_waypoint_id = add_waypoint(waypoint_to_add)
            if added_waypoint_id is not None:
                added_waypoint_ids.append(added_waypoint_id)
            else:
                logger.error('add_waypoints(): added_waypoint_id was None')
    else:
        logger.error('add_waypoints(): waypoints_to_add was None')
    return added_waypoint_ids


def modify_waypoint(waypoint_to_modify):
    """

    :param waypoint_to_modify:
    :return:
    """
    modify_waypoint_result = None
    if waypoint_to_modify is not None:
        modify_waypoint_result = mongo.db.waypoints.update(
            {"_id": ObjectId(waypoint_to_modify["_id"])},
            waypoint_to_modify)
        logger.debug(
            "modify waypoint result: {0}".format(modify_waypoint_result))
    else:
        logger.error('modify_waypoint(): waypoint_to_modify was None')
    return modify_waypoint_result


def modify_waypoints(waypoints_to_modify):
    """

    :param waypoints_to_modify:
    :return:
    """
    modified_waypoint_ids = []
    if waypoints_to_modify is not None:
        for waypoint_to_modify in waypoints_to_modify:
            modified_waypoint_id = modify_waypoint(waypoint_to_modify)
            if modified_waypoint_id is not None:
                modified_waypoint_ids.append(modified_waypoint_id)
            else:
                logger.error('modify_waypoints(): modified_waypoint_id is None')
    else:
        logger.error('modify_waypoints(): waypoints_to_modify is None')
    return modified_waypoint_ids


def delete_waypoint(waypoint_id):
    """

    :param waypoint_id:
    :return:
    """
    success = False
    if waypoint_id is not None:
        delete_waypoint_result = mongo.db.waypoints.remove(
            {"_id": ObjectId(waypoint_id)})
        if delete_waypoint_result['ok'] == 1:
            success = True
        else:
            logger.error('delete_waypoint(): failed to delete waypoint')
    else:
        logger.error('delete_waypoint(): waypoint_to_delete is None')
    return success


def delete_waypoints(waypoint_ids):
    """

    :param waypoint_ids:
    :return:
    """
    success = True
    if waypoint_ids is not None:
        for waypoint_to_delete in waypoint_ids:
            waypoint_deleted = delete_waypoint(waypoint_to_delete)
            if waypoint_deleted is False:
                logger.error('delete_waypoints(): failed to delete waypoint')
                success = False
                break
            else:
                logger.error('delete_waypoints(): deleted_waypoint_id is None')
    else:
        logger.error('delete_waypoints(): waypoint_ids is None')
    return success





