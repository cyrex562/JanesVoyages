from bson import ObjectId

__author__ = 'cyrex_000'

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


def convert_source_ids(in_source):
    out_source = None
    if in_source is None:
        logger.error('convert_source_ids: in_source was None')
        return out_source

    out_source = in_source
    out_source['_id'] = str(out_source['_id'])
    out_source['source_id'] = out_source['_id']

    return out_source


def get_all_sources():
    all_sources = list(mongo.db.sources.find())
    all_sources_out = []
    for src in all_sources:
        src = convert_source_ids(src)
        if src is not None:
            all_sources_out.append(src)
        else:
            logger.error('get_all_sources(): src was None')
    logger.debug('get_all_sources(): retrieved {0} sources'.format(len(all_sources_out)))
    return all_sources_out


def get_source_by_id(source_id):
    """

    :param source_id:
    :return:
    """
    found_source_out = None
    if source_id is None:
        logger.error('source_id is None')
        return found_source_out
    found_source = mongo.db.sources.find_one({"_id": ObjectId(source_id)})
    found_source_out = convert_source_ids(found_source)
    logger.debug('get_source_by_id(): found_source_out={0}'.format(str(found_source_out)))
    return found_source_out


def get_sources_by_voyage(voyage_id):
    """

    :param voyage_id:
    :return:
    """
    found_sources_out = []
    if voyage_id is None:
        logger.error('get_sources_by_voyage(): voyage_id was None')
        return found_sources_out

    found_sources = list(mongo.db.sources.find({'voyage_id': voyage_id}))
    for fs in found_sources:
        fso = convert_source_ids(fs)
        if fso is not None:
            found_sources_out.append(fso)
        else:
            logger.error('get_sources_by_voyage: fso was None')
    logger.debug('get_sources_by_voyage(): found_sources_out={0}'.format(str(found_sources_out)))
    return found_sources_out


def get_voyage_source_count(voyage_id):
    """

    :param voyage_id:
    :return:
    """
    voyage_sources = get_sources_by_voyage(voyage_id)
    voyage_source_count = len(voyage_sources)
    logger.debug('get_voyage_source_count(): voyage_source_count={0}'.format(voyage_source_count))
    return voyage_source_count


def get_sources(source_ids):
    """

    :param source_ids:
    :return:
    """
    found_sources = []
    if source_ids is None:
        logger.error('get_sources(): source_ids was None')
        return found_sources

    if len(source_ids) == 0:
        found_sources = get_all_sources()
    else:
        for source_id in source_ids:
            found_source = get_source_by_id(source_id)
            if found_source is not None:
                found_sources.append(found_source)
            else:
                logger.error('get_sources(): found_source was None')
    logger.debug('get_sources(): found_sources={0}'.format(str(found_sources)))
    return found_sources


def add_source(source_to_add):
    """
    :param source_to_add:
    :return:
    """
    added_source_id = None
    if source_to_add is None:
        logger.error('add_source(): source_to_add was None')
        return added_source_id

    add_source_result = mongo.db.sources.insert(source_to_add)
    added_source_id = str(add_source_result)
    logger.debug("add_source(): added_source_id={0}".format(added_source_id))
    return added_source_id


def add_sources(sources_to_add):
    """

    :param sources_to_add:
    :return:
    """
    added_source_ids = []
    if sources_to_add is None:
        logger.error('add_sources(): sources_to_add was None')
        return added_source_ids

    for source_to_add in sources_to_add:
        added_source_id = add_source(source_to_add)
        if added_source_id is not None:
            added_source_ids.append(added_source_id)
        else:
            logger.error('add_sources(): added_source_id is None')

    logger.debug('add_sources(): added_source_ids={0}'
                 .format(str(added_source_ids)))
    return added_source_ids


def modify_source(source_to_modify):
    """

    :param source_to_modify:
    :return:
    """
    success = False
    if source_to_modify is None:
        logger.error('modify_source: source_to_modify is None')
        return success

    modify_source_result = mongo.db.sources.update(
            {"_id": ObjectId(source_to_modify["source_id"])}, source_to_modify)
    if modify_source_result['updatedExisting'] is True \
            and modify_source_result["nModified"] == 1:
        success = True
    else:
        logger.warning('modify_source(): failed to modify source')
    return success


def modify_sources(sources_to_modify):
    """

    :param sources_to_modify:
    :return:
    """
    success = False
    if sources_to_modify is None:
        logger.error('modify_sources: sources_to_modify is None')
        return success

    success = True
    for src in sources_to_modify:
        success = modify_source(src)
        if success is False:
            logger.error('modify_sources: failed to modify source')
            break

    return success


def delete_source(source_id):
    """

    :param source_id:
    :return:
    """
    success = False
    if source_id is None:
        logger.error('delete_source: source_id is None')
        return success

    delete_source_result = mongo.db.sources.remove({"_id": ObjectId(source_id)})
    if delete_source_result['ok'] == 1:
        success = True
    return success


def delete_sources(source_ids):
    success = True
    if source_ids is None:
        return False
    for src_id in source_ids:
        success = delete_source(src_id)
        if success is False:
            break
    return success



