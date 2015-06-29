from bson import ObjectId
from source_model import delete_sources, get_sources_by_voyage
from waypoint_model import get_waypoints_by_voyage, delete_waypoints

__author__ = 'root'

mongo = None
app = None
logger = None


def init(in_app, in_mongo):
    """

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


def convert_voyage_id(in_voyage):
    """

    :param in_voyage:
    :return:
    """
    out_voyage = None
    if in_voyage is not None:
        out_voyage = in_voyage
        out_voyage['_id'] = str(in_voyage['_id'])
        out_voyage['voyage_id'] = out_voyage['_id']
    else:
        logger.error('convert_voyage_id(): in_voyage was None')
    return out_voyage


def get_all_voyages():
    """

    :return:
    """
    all_voyages = list(mongo.db.voyages.find())
    logger.debug('get_all_voyages(), retrieved: {0} voyages'.format(len(
        all_voyages)))
    all_voyages_out = []
    for av in all_voyages:
        av = convert_voyage_id(av)
        if av is not None:
            all_voyages_out.append(av)
        else:
            logger.error('get_all_voyages(): av was None')
    return all_voyages_out


def get_voyage_by_id(voyage_id):
    """

    :param voyage_id:
    :return:
    """
    found_voyage_out = None
    if voyage_id is not None:
        logger.debug('get_voyage_by_id(), voyage_id: {0}'.format(voyage_id))
        found_voyage = mongo.db.voyages.find_one({"_id": ObjectId(voyage_id)})
        if found_voyage is not None:
            found_voyage_out = convert_voyage_id(found_voyage)
        else:
            logger.error('get_voyage_by_id(): found_voyage_out was None')
    else:
        logger.error('get_voyage_by_id(): voyage_id was None')
    return found_voyage_out


def get_voyages(voyage_ids):
    """
    retrieve 0 or more voyages by their voyage id. If an empty list is
    provided, this function will return all voyages from the database. If one
    voyage_id is in the list this function will return the first voyage with a
    matching voyage_id. If multiple voayge IDs are specified, this function will
    return the first voyage matching a voyage id for each voyag ein the list.
    :param voyage_ids: a list of 0 or more voyage IDs to find
    :return: a list of 0 or more voyage objects
    """
    logger.debug('get_voyages()')
    found_voyages = []
    if voyage_ids is not None:
        app.logger.debug("get_voyages(), voyage_ids: {0}"
                         .format(str(voyage_ids)))
        if len(voyage_ids) == 0:
            found_voyages = get_all_voyages()
        else:
            for voyage_id in voyage_ids:
                found_voyage = get_voyage_by_id(voyage_id)
                if found_voyage is not None:
                    found_voyages.append(found_voyage)
                else:
                    logger.error('get_voyages(): found_voyage was None')
    else:
        logger.error('get_voyages(): voyage_ids was None')
    return found_voyages


def add_voyage(voyage_to_add):
    """

    :param voyage_to_add:
    :return:
    """
    logger.debug('add_voyage')
    added_voyage_id = ''
    if voyage_to_add is not None:
        add_voyage_result = mongo.db.voyages.insert(voyage_to_add)
        logger.debug("add_voyage_result: {0}".format(add_voyage_result))
        added_voyage_id = str(add_voyage_result)
    else:
        logger.error('add_voyage(): voyage_to_add was None')
    return added_voyage_id


def add_voyages(voyages_to_add):
    """

    :param voyages_to_add:
    :return:
    """
    logger.debug('add_voyages()')
    added_voyage_ids = []
    if voyages_to_add is not None:
        for voyage_to_add in voyages_to_add:
            added_voyage_id = add_voyage(voyage_to_add)
            if added_voyage_id is not None:
                added_voyage_ids.append(added_voyage_id)
    else:
        logger.error('add_voyages(): voyages_to_add was None')
    return added_voyage_ids


def modify_voyage(voyage_to_modify):
    """

    :param voyage_to_modify:
    :return:
    """
    logger.debug('modify_voyage()')
    success = False
    modify_voyage_result = None
    if voyage_to_modify is not None:
        modify_voyage_result = mongo.db.voyages.update(
            {"_id": ObjectId(voyage_to_modify["voyage_id"])},
            voyage_to_modify)
        logger.debug("modify_voyage_result: {0}".format(modify_voyage_result))
        if modify_voyage_result['updatedExisting'] is True and modify_voyage_result["nModified"] == 1:
            success = True
    else:
        logger.error('modify_voyage(): voyage to modify was None')
    return success


def modify_voyages(voyages_to_modify):
    """

    :param voyages_to_modify:
    :return:
    """
    logger.debug('modify_voyages()')
    success = True
    if voyages_to_modify is not None:
        for voyage_to_modify in voyages_to_modify:
            voyage_modified = modify_voyage(voyage_to_modify)
            if voyage_modified is False:
                success = False
                break
    else:
        logger.error('modify_voyages(): voyages_to_modify was None')
    return success


def delete_voyage(voyage_to_delete):
    """

    :param voyage_to_delete:
    :return:
    """
    logger.debug('delete_voyage()')
    success = False
    if voyage_to_delete is not None:
        voyage_id = voyage_to_delete["voyage_id"]
        del_voyage_result = mongo.db.voyages.remove(
            {"_id": ObjectId(voyage_to_delete["voyage_id"])})
        voyage_deleted = del_voyage_result['ok'] == 1
        waypoints = get_waypoints_by_voyage(voyage_id)
        waypoint_ids = []
        for waypoint in waypoints:
            waypoint_ids.append(waypoint["waypoint_id"])
        waypoints_deleted = delete_waypoints(waypoint_ids)

        sources = get_sources_by_voyage(voyage_id)
        source_ids = []
        for source in sources:
            source_ids.append(source["source_id"])
        sources_deleted = delete_sources(source_ids)

        if waypoints_deleted and voyage_deleted and sources_deleted:
            success = True
        logger.debug("del_voyage_result: {0}".format(del_voyage_result))
    else:
        logger.error('delete_voyage(): voyage_to_delete was None')
    return success


def delete_voyages(voyages_to_delete):
    """

    :param voyages_to_delete:
    :return:
    """
    logger.debug('delete_voyages()')
    success = True

    if voyages_to_delete is None:
        logger.error('delete_voyages, voyages_to_delete is None')
        return False

    for voyage_to_delete in voyages_to_delete:
        voyage_deleted = delete_voyage(voyage_to_delete)
        if voyage_deleted is False:
            logger.error('delete_voyages, failed to delete voyage')
            success = False
            break

    else:
        logger.error('delete_voyages(): voyages_to_delete was None')
    return success

# end of file #
