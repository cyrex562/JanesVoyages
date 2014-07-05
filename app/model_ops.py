################################################################################
# @file model_ops.py
# @brief data model operations
# @author Josh Madden
# @copyright Fifth Column Group 2014
################################################################################
################################################################################
# IMPORTS
################################################################################
from app import db, models


################################################################################
# DEFINES
################################################################################


################################################################################
# CLASSES
################################################################################


################################################################################
# GLOBALS
################################################################################


################################################################################
# FUNCTIONS
################################################################################
def add_voyage(voyage):
    db.session.add(voyage)
    db.session.commit()


def update_voyage(in_voyage):
    voyage = models.Voyage.query.filter_by(voyage_id=in_voyage.voyage_id).first()
    voyage.voyage_name = in_voyage.voyage_name
    voyage.voyage_notes = in_voyage.voyage_notes
    db.session.commit()


def delete_voyage(voyage):
    db.session.delete(voyage)
    db.session.commit()


def delete_voyages_by_id(voyage_ids):
    for v in voyage_ids:
        voyage = models.Voyage.query.filter_by(voyage_id=v).first()
        db.session.delete(voyage)
    db.session.commit()


def get_all_voyages():
    return models.Voyage.query.all()

def get_all_voyage_ids():
    voyages = models.Voyage.query.all()
    result = []
    for v in voyages:
        result.append(v.voyage_id)
    return result


def add_ship(ship):
    db.session.add(ship)
    db.session.commit()


def update_ship(ship):
    db.session.add(ship)
    db.session.commit()


def delete_ship(ship):
    db.session.delete(ship)
    db.session.commit()


def get_all_ships():
    return db.session.query(models.Ship)


def add_waypoint(waypoint):
    db.session.add(waypoint)
    db.session.commit()


def update_waypoint(waypoint):
    db.session.add(waypoint)
    db.session.commit()


def delete_waypoint(waypoint):
    db.session.delete(waypoint)
    db.session.commit()


def get_all_waypoints():
    return db.session.query(models.Waypoint)


def add_trade(trade):
    db.session.add(trade)
    db.session.commit()


def update_trade(trade):
    db.session.add(trade)
    db.session.commit()


def delete_trade(trade):
    db.session.delete(trade)
    db.session.commit()


def get_all_trades():
    return db.session.query(models.Trade)


def add_item(item):
    db.session.add(item)
    db.session.commit()


def update_item(item):
    db.session.add(item)
    db.session.commit()


def delete_item(item):
    db.session.delete(item)
    db.session.commit()


def get_all_items():
    return db.session.query(models.Item)


################################################################################
# ENTRY POINT
################################################################################


################################################################################
# END OF FILE
################################################################################