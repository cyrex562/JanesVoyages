"""
@file models.py
@brief data model objects definition
@author Josh Madden
@copyright Fifth Column Group 2014
"""


# class Voyage(db.Model):
#     """
#     Voyage DL object
#     """
#     voyage_id = db.Column(INTEGER, primary_key=True)
#     voyage_name = db.Column(VARCHAR(255), index=True)
#     voyage_notes = db.Column(TEXT)
#     waypoints = db.relationship('Waypoint', lazy='dynamic')
#     ships = db.relationship('Ship', lazy='dynamic')
#
#
# class Ship(db.Model):
#     """
#     Ship DL object
#     """
#     ship_id = db.Column(INTEGER, primary_key=True)
#     ship_name = db.Column(VARCHAR(255), index=True)
#     ship_captain = db.Column(VARCHAR(255), index=True)
#     ship_flag = db.Column(VARCHAR(255), index=True)
#     ship_notes = db.Column(TEXT)
#     ship_voyage_id = db.Column(db.Integer, db.ForeignKey('voyage.voyage_id'))
#
#
# class Waypoint(db.Model):
#     """
#     Waypoint DL object
#     """
#     waypoint_id = db.Column(INTEGER, primary_key=True)
#     waypoint_name = db.Column(VARCHAR(255), index=True)
#     waypoint_type = db.Column(VARCHAR(255), index=True)
#     waypoint_location = db.Column(VARCHAR(255), index=True)
#     waypoint_notes = db.Column(TEXT)
#     start_date = db.Column(TEXT, index=True)
#     end_date = db.Column(TEXT, index=True)
#     waypoint_voyage_id = db.Column(INTEGER, db.ForeignKey('voyage.voyage_id'))
#     trades = db.relationship('Trade', lazy='dynamic')
#
#
# class Trade(db.Model):
#     """
#     Trade DL object
#     """
#     trade_id = db.Column(INTEGER, primary_key=True)
#     trade_notes = db.Column(TEXT)
#     bought_sold = db.Column(BOOLEAN)
#     trade_quantity = db.Column(INTEGER)
#     trade_item = db.Column(TEXT)
#     trade_waypoint_id = db.Column(db.Integer,
#                                   db.ForeignKey('waypoint.waypoint_id'))
#
#
# waypoint_types = [
#     'start',
#     'stop',
#     'end'
# ]
#
#
# trade_items = \
#     [
#         "male slave",
#         "female slave",
#         "child slave",
#         "guns",
#         "cookware",
#         "livestock",
#         "wild game",
#         "fish",
#         "seafood",
#         "foodstuffs",
#         "grain",
#         "timber",
#         "minerals",
#         "metals",
#         "tea",
#         "coffee",
#         "tobacco",
#         "cocoa",
#         "sugar",
#         "spices",
#         "alcohol",
#         "textiles",
#         "medicine",
#         "jewelry",
#         "furs",
#         "leather",
#         "paper",
#         "manufactured goods",
#         "luxury items",
#         "dyes",
#         "plants",
#         "cotton",
#         "wool",
#         "other"
#     ]

mongo = None


def init(in_mongo):
    global mongo
    mongo = in_mongo


def get_all_voyages():
    return list(mongo.db.voyages.find())


def add_voyage(new_voyage):
    add_voyage_result = mongo.db.voyages.insert(new_voyage)
    print "add_voyage_result: {0}".format(add_voyage_result)
    return add_voyage_result


def modify_voyage(mod_voyage):
    modify_voyage_result = mongo.db.voyages.update({"voyage_id": mod_voyage[
        "voyage_id"]}, mod_voyage)
    print "modify_voyage_result: {0}".format(modify_voyage_result)
    return modify_voyage_result


def delete_voyage(del_voyage):
    del_voyage_result = mongo.db.voyages.remove(
        {"voyage_id": del_voyage["voyage_id"]})
    print "del_voyage_result: {0}".format(del_voyage_result)
    return del_voyage_result


def get_voyage_by_id(voyage_id):
    find_voyage_result = mongo.db.voyages.find_one({"voyage_id": voyage_id})
    print "find_voyage_result: {0}".format(find_voyage_result)
    return find_voyage_result


def stringify_object_ids(voyage_list):
    new_voyages_list = []
    for v in voyage_list:
        v['_id'] = str(v['_id'])
        new_voyages_list.append(v)
    return new_voyages_list






