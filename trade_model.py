from bson import ObjectId

__author__ = 'root'


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


def convert_trade_ids(in_trade):
    out_trade = None
    if in_trade is None:
        return out_trade

    out_trade = in_trade
    out_trade['_id'] = str(out_trade['_id'])
    out_trade['trade_id'] = out_trade['_id']
    return out_trade


def get_all_trades():
    """

    :return:
    """
    all_trades = list(mongo.db.trades.find())
    all_trades_out = []
    for at in all_trades:
        at = convert_trade_ids(at)
        if at is not None:
            all_trades_out.append(at)
        else:
            logger.error('get_all_trades(): at was None')
    logger.debug('get_all_trades(): retrieved {0} trades'.format(len(all_trades_out)))
    return all_trades_out


def get_trade_by_id(trade_id):
    """

    :param trade_id:
    :return:
    """
    found_trade_out = None
    if trade_id is None:
        return found_trade_out
    found_trade = mongo.db.trades.find_one({"_id": ObjectId(trade_id)})
    found_trade_out = convert_trade_ids(found_trade)
    return found_trade_out


def get_trades_by_waypoint(waypoint_id):
    """

    :param waypoint_id:
    :return:
    """
    logger.debug('get_trades_by_waypoint(), waypoint_id: {0}'
        .format(waypoint_id))
    found_trades_out = []

    if waypoint_id is None:
        return found_trades_out

    found_trades = mongo.db.trades.find({"waypoint_id": waypoint_id})
    for ft in found_trades:
        ft = convert_trade_ids(ft)
        if ft is not None:
            found_trades_out.append(ft)
        else:
            logger.error('get_trades_by_waypoint()')
    logger.debug('get_trades_by_waypoint(), retrieved {0} trades'.format(len(
        found_trades_out)))

    return found_trades_out


def get_trades(trade_ids):
    """

    :type trade_ids: list
    :return:
    """
    found_trades = []
    if trade_ids is None:
        return found_trades

    if len(trade_ids) == 0:
        found_trades = get_all_trades()
    else:
        for trade_id in trade_ids:
            found_trade = get_trade_by_id(trade_id)
            if found_trade is not None:
                found_trades.append(found_trade)
            else:
                logger.error('get_trades(), found_trade was None')
    return found_trades


def add_trade(trade_to_add):
    """

    :type trade_to_add: dict
    :return:
    """
    added_trade_id = None
    if trade_to_add is None:
        return added_trade_id

    added_trade_id = mongo.db.trades.insert(trade_to_add)
    added_trade_id = str(added_trade_id)

    return added_trade_id


def add_trades(trades_to_add):
    """

    :type trades_to_add: list
    :return:
    """
    added_trade_ids = []
    if trades_to_add is None:
        return added_trade_ids
    for trade_to_add in trades_to_add:
        added_trade_id = add_trade(trade_to_add)
        if added_trade_id is not None:
            added_trade_ids.append(added_trade_id)
    return added_trade_ids


def modify_trade(trade_to_modify):
    """

    :param trade_to_modify:
    :return:
    """
    success = False

    if trade_to_modify is None:
        return False

    modify_trade_result = mongo.db.trades.update({"_id": ObjectId(trade_to_modify[
        "trade_id"])}, trade_to_modify)
    if modify_trade_result['updatedExisting'] is True \
            and modify_trade_result["nModified"] == 1:
        success = True
    else:
        logger.warning('modify_trade, error modifying trade, modify_trade_result={0}'.format(modify_trade_result))

    return success


def modify_trades(trades_to_modify):
    """

    :param trades_to_modify:
    :return:
    """
    trades_modified = False

    if trades_to_modify is None:
        logger.error('modify_trades(): trades_to_modify is None')
        return trades_modified

    trades_modified = True
    for trade_to_modify in trades_to_modify:
        trade_modified = modify_trade(trade_to_modify)
        if trade_modified is False:
            trades_modified = False
            break

    return trades_modified


def delete_trade(trade_to_delete):
    """

    :param trade_to_delete:
    :return:
    """
    success = False
    if trade_to_delete is None:
        return success

    deleted_trade_result = mongo.db.trades.remove({"trade_id": trade_to_delete[
        "trade_id"]})
    if deleted_trade_result['ok'] == 1:
        success = True
    else:
        logger.error('delete_trade(), failed to delete trade')

    return success


def delete_trades(trades_to_delete):
    success = True

    if trades_to_delete is None:
        return False

    for trade_to_delete in trades_to_delete:
        waypoint_deleted = delete_trade(trade_to_delete)
        if waypoint_deleted is False:
            success = False
            logger.error('delete_trades, failed to delete trade')
            break
    return success


# END OF FILE
