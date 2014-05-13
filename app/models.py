###############################################################################
# @file models.py
# @brief data model objects definition
# @author Josh Madden
# @copyright Fifth Column Group 2014
###############################################################################
###############################################################################
# IMPORTS
###############################################################################
from app import db
from sqlalchemy.dialects.mysql import \
        BIGINT, BINARY, BIT, BLOB, BOOLEAN, CHAR, DATE, \
        DATETIME, DECIMAL, DECIMAL, DOUBLE, ENUM, FLOAT, INTEGER, \
        LONGBLOB, LONGTEXT, MEDIUMBLOB, MEDIUMINT, MEDIUMTEXT, NCHAR, \
        NUMERIC, NVARCHAR, REAL, SET, SMALLINT, TEXT, TIME, TIMESTAMP, \
        TINYBLOB, TINYINT, TINYTEXT, VARBINARY, VARCHAR, YEAR


###############################################################################
# DEFINES
###############################################################################


###############################################################################
# CLASSES
###############################################################################
class Voyage(db.Model):
    voyage_id = db.Column(INTEGER, primary_key=True)
    voyage_name = db.Column(VARCHAR(255), index=True)
    voyage_notes = db.Column(LONGTEXT)
    waypoints = db.relationship('Waypoint', lazy='dynamic')


class Ship(db.Model):
    ship_id = db.Column(INTEGER, primary_key=True)
    ship_name = db.Column(VARCHAR(255), index=True)
    ship_captain = db.Column(VARCHAR(255), index=True)
    ship_flag = db.Column(VARCHAR(255), index=True)
    ship_notes = db.Column(LONGTEXT)
    ship_voyage_id = db.Column(db.Integer, db.ForeignKey('voyage.voyage_id'))


class Waypoint(db.Model):
    waypoint_id = db.Column(INTEGER, primary_key=True)
    waypoint_name = db.Column(VARCHAR(255), index=True)
    waypoint_type = db.Column(VARCHAR(255), index=True)
    waypoint_location = db.Column(VARCHAR(255), index=True)
    waypoint_notes = db.Column(LONGTEXT)
    start_date = db.Column(DATETIME, index=True)
    end_date = db.Column(DATETIME, index=True)
    waypoint_voyage_id = db.Column(INTEGER, db.ForeignKey('voyage.voyage_id'))
    trades = db.relationship('Trade', lazy='dynamic')


class Trade(db.Model):
    trade_id = db.Column(INTEGER, primary_key=True)
    trade_name = db.Column(VARCHAR(255), index=True)
    trade_notes = db.Column(LONGTEXT)
    trade_waypoint_id = db.Column(db.Integer,
                                  db.ForeignKey('waypoint.waypoint_id'))
    items = db.relationship('Item', lazy='dynamic')


class Item(db.Model):
    item_id = db.Column(INTEGER, primary_key=True)
    item_description = db.Column(LONGTEXT)
    item_quantity = db.Column(INTEGER)
    bought_sold = db.Column(BOOLEAN)
    item_trade_id = db.Column(INTEGER, db.ForeignKey('trade.trade_id'))


###############################################################################
# GLOBALS
###############################################################################


###############################################################################
# FUNCTIONS
###############################################################################


###############################################################################
# ENTRY POINT
###############################################################################


###############################################################################
# END OF FILE
###############################################################################