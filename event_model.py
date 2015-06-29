from bson import ObjectId

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


def convert_event_ids(in_event):
    out_event = None
    if in_event is None:
        return out_event

    out_event = in_event
    out_event['_id'] = str(out_event['_id'])
    out_event['event_id'] = out_event['_id']
    return out_event


def get_all_events():
    all_events = list(mongo.db.events.find())
    all_events_out = []
    for at in all_events:
        at = convert_event_ids(at)
        if at is not None:
            all_events_out.append(at)
        else:
            logger.error('get_all_events(): at was None')
    logger.debug('get_all_events(): retrieved {0} events'.format(len(all_events_out)))
    return all_events_out


def get_event_by_id(event_id):
    found_event_out = None
    if event_id is None:
        return found_event_out
    found_event = mongo.db.events.find_one({"_id": ObjectId(event_id)})
    found_event_out = convert_event_ids(found_event)
    logger.debug('get_event_by_id(): found_event_out={0}'.format(str(found_event_out)))
    return found_event_out


def get_events_by_waypoint(waypoint_id):
    logger.debug('get_events_by_waypoint(), waypoint_id: {0}'
        .format(waypoint_id))
    found_events_out = []

    if waypoint_id is None:
        return found_events_out

    found_events = mongo.db.events.find({"waypoint_id": waypoint_id})
    for ft in found_events:
        ft = convert_event_ids(ft)
        if ft is not None:
            found_events_out.append(ft)
        else:
            logger.error('get_events_by_waypoint()')
    logger.debug('get_events_by_waypoint(), retrieved {0} events'.format(len(
        found_events_out)))

    return found_events_out


def get_events(event_ids):
    found_events = []
    if event_ids is None:
        return found_events

    if len(event_ids) == 0:
        found_events = get_all_events()
    else:
        for event_id in event_ids:
            found_event = get_event_by_id(event_id)
            if found_event is not None:
                found_events.append(found_event)
            else:
                logger.error('get_events(), found_event was None')
    return found_events


def add_event(event_to_add):
    added_event_id = None
    if event_to_add is None:
        return added_event_id

    added_event_id = mongo.db.events.insert(event_to_add)
    added_event_id = str(added_event_id)

    return added_event_id


def add_events(events_to_add):
    added_event_ids = []
    if events_to_add is None:
        return added_event_ids
    for event_to_add in events_to_add:
        added_event_id = add_event(event_to_add)
        if added_event_id is not None:
            added_event_ids.append(added_event_id)
    return added_event_ids


def modify_event(event_to_modify):
    success = False

    if event_to_modify is None:
        return False

    modify_event_result = mongo.db.events.update({"_id": ObjectId(event_to_modify[
        "event_id"])}, event_to_modify)
    if modify_event_result['updatedExisting'] is True \
            and modify_event_result["nModified"] == 1:
        success = True
    else:
        logger.warning('modify_event, error modifying event, modify_event_result={0}'.format(modify_event_result))

    return success


def modify_events(events_to_modify):
    events_modified = False

    if events_to_modify is None:
        logger.error('modify_events(): events_to_modify is None')
        return events_modified

    events_modified = True
    for event_to_modify in events_to_modify:
        event_modified = modify_event(event_to_modify)
        if event_modified is False:
            events_modified = False
            break

    return events_modified


def delete_event(event_to_delete):
    success = False
    if event_to_delete is None:
        return success

    deleted_event_result = \
        mongo.db.events.remove({"_id": ObjectId(event_to_delete)})
    if deleted_event_result['ok'] == 1:
        success = True
    else:
        logger.error('delete_event(), failed to delete event')

    return success


def delete_events(events_to_delete):
    success = True

    if events_to_delete is None:
        return False

    for event_to_delete in events_to_delete:
        event_deleted = delete_event(event_to_delete)
        if event_deleted is False:
            success = False
            logger.error('delete_events, failed to delete event')
            break
    return success


# END OF FILE