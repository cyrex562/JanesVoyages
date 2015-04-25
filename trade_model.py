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


def get_all_trades():
    return list(mongo.db.trades.find())


def get_trade_by_id(trade_id):
    found_trade = mongo.db.trades.find_one({"trade_id": trade_id})
    return found_trade


def get_trades_by_waypoint(waypoint_id):
    found_trades = mongo.db.trades.find({"waypoint_it": waypoint_id})
    return found_trades


def get_trades(trade_ids):
    found_trades = []
    if len(found_trades) == 0:
        found_trades = get_all_trades()
    else:
        for trade_id in trade_ids:
            found_trade = get_trade_by_id(trade_id)
            if found_trade is not None:
                found_trades.append(found_trade)
    return found_trades


def add_trade(trade_to_add):
    added_trade_id = mongo.db.trades.insert(trade_to_add)
    return added_trade_id


def add_trades(trades_to_add):
    added_trade_ids = []
    for trade_to_add in trades_to_add:
        added_trade_id = add_trade(trade_to_add)
        if added_trade_id is not None:
            added_trade_ids.append(trade_to_add)
    return added_trade_ids


def modify_trade(trade_to_modify):
    modified_trade_id = mongo.db.trades.update({"trade_id": trade_to_modify[
        "trade_id"]}, trade_to_modify)
    return modified_trade_id


def modify_trades(trades_to_modify):
    modified_trade_ids = []
    for trade_to_modify in trades_to_modify:
        modified_trade_id = modify_trade(trade_to_modify)
        if modified_trade_id is not None:
            modified_trade_ids.append(modified_trade_id)
    return modified_trade_ids


def delete_trade(trade_to_delete):
    deleted_trade_id = mongo.db.trades.remove({"trade_id": trade_to_delete[
        "trade_id"]})
    return deleted_trade_id


def delete_trades(trades_to_delete):
    deleted_trade_ids = []
    for trade_to_delete in trades_to_delete:
        deleted_trade_id = delete_trade(trade_to_delete)
        if deleted_trade_id is not None:
            deleted_trade_ids.append(deleted_trade_id)
    return deleted_trade_ids