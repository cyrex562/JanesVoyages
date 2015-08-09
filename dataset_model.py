import source_model
import trade_model
import event_model
import waypoint_model
import voyage_model

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


def get_dataset():
    voyages = voyage_model.get_all_voyages()
    waypoints = waypoint_model.get_all_waypoints()
    sources = source_model.get_all_sources()
    trades = trade_model.get_all_trades()
    events = event_model.get_all_events()
    dataset = {
        'voyages': voyages,
        'waypoints': waypoints,
        'sources': sources,
        'trades': trades,
        'events': events,
    }

    return dataset




