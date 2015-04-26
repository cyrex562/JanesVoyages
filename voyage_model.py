__author__ = 'root'

import utils

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


def get_all_voyages():
    all_voyages = list(mongo.db.voyages.find())
    all_voyages_out = []
    for av in all_voyages:
        # convert object id to string for output purposes
        av['_id'] = unicode(av['_id'])
        av['voyage_id'] = av['_id']
        all_voyages_out.append(av)
    return all_voyages_out


def get_voyage_by_id(voyage_id):
    found_voyage = mongo.db.voyages.find_one({"voyage_id": voyage_id})
    found_voyage_out = found_voyage
    found_voyage_out['_id'] = unicode(found_voyage_out['_id'])
    found_voyage_out['voyage_id'] = found_voyage_out['_id']
    logger.debug("find_voyage_result: {0}".format(found_voyage))
    return found_voyage


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
    found_voyages = []
    if len(voyage_ids) == 0:
        found_voyages = get_all_voyages()
    else:
        for voyage_id in voyage_ids:
            found_voyage = get_voyage_by_id(voyage_id)
            if found_voyage is not None:
                found_voyages.append(found_voyage)

    return found_voyages


def add_voyage(voyage_to_add):
    add_voyage_result = mongo.db.voyages.insert(voyage_to_add)
    logger.debug("add_voyage_result: {0}".format(add_voyage_result))
    return utils.stringify_obj_id(add_voyage_result)


def add_voyages(voyages_to_add):
    added_voyage_ids = []
    for voyage_to_add in voyages_to_add:
        added_voyage_id = add_voyage(voyage_to_add)
        if added_voyage_id is not None:
            added_voyage_ids.append(added_voyage_id)
    return added_voyage_ids


def modify_voyage(voyage_to_modify):
    modify_voyage_result = mongo.db.voyages.update(
        {"voyage_id": voyage_to_modify["voyage_id"]}, voyage_to_modify)
    logger.debug("modify_voyage_result: {0}".format(modify_voyage_result))
    return modify_voyage_result


def modify_voyages(voyages_to_modify):
    modified_voyage_ids = []
    for voyage_to_modify in voyages_to_modify:
        modified_voyage_id = modify_voyage(voyage_to_modify)
        if modified_voyage_id is not None:
            modified_voyage_ids.append(modified_voyage_id)
    return modified_voyage_ids


def delete_voyage(voyage_to_delete):
    del_voyage_result = mongo.db.voyages.remove(
        {"voyage_id": voyage_to_delete["voyage_id"]})
    logger.debug("del_voyage_result: {0}".format(del_voyage_result))
    return del_voyage_result


def delete_voyages(voyages_to_delete):
    deleted_voyage_ids = []
    for voyage_to_delete in voyages_to_delete:
        deleted_voyage_id = delete_voyage(voyage_to_delete)
        if deleted_voyage_id is not None:
            deleted_voyage_ids.append(deleted_voyage_id)
    return deleted_voyage_ids