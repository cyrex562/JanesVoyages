################################################################################
##
# @file views.py
# @brief flask web app main script file for Janes Voyages Web App (JVAP)
# @author Josh Madden <cyrex562@gmail.com>
# copyright Josh Madden 2014
################################################################################
################################################################################
# IMPORTS
################################################################################
import uuid
from flask import jsonify, render_template, request, session, redirect, url_for

from app import app
import models
import model_ops


################################################################################
# GLOBAL
################################################################################
# app = Flask(__name__)
# app.debug = True
# app.secret_key = os.urandom(24)


################################################################################
# FUNCTIONS
################################################################################
#######################################
##
#
#######################################
def set_session_id(in_session):
    if 'session_id' in in_session:
        result = in_session['session_id']
    else:
        result = uuid.uuid4().hex
        in_session['session_id'] = result
    return result


@app.route('/server_request', methods=['GET', 'POST'])
def handle_server_request():
    result_msg = 'success'
    result_data = 'no data'
    if request.method == "POST":
        session_id = set_session_id(session)
        request_obj = request.get_json()
        request_obj['session_id'] = session_id
    response = jsonify(message=result_msg, data=result_data)
    return response


#######################################
##
# @brief get a list of voyages
#######################################
@app.route('/get_voyages', methods=['GET', 'POST'])
def retrieve_voyages_list():
    result_msg = 'success'
    response = ''
    if request.method == "POST":
        voyage_query = model_ops.get_all_voyages()
        voyages = []
        for v in voyage_query:
            voyages.append({'voyage_id': v.voyage_id,
                            'voyage_name': v.voyage_name,
                            'voyage_notes': v.voyage_notes})
        response = jsonify(message=result_msg,
                           data={'voyages': voyages})
    return response


#######################################
##
# @brief create a new voyage row
#######################################
@app.route('/create_voyage', methods=['GET', 'POST'])
def create_voyage():
    if request.method == "POST":
        request_json = request.get_json()
        print "request_obj: {0}".format(request_json)
        json_params = request_json['params']
        voyage = models.Voyage(voyage_name=json_params['new_voyage_name'],
                               voyage_notes=json_params['new_voyage_notes'])
        model_ops.add_voyage(voyage)
    response = jsonify(message="success", data="")
    return response


#######################################
##
# @brief update a voyage
#######################################
@app.route('/update_voyage', methods=['GET', 'POST'])
def update_voyage():
    if request.method == "POST":
        request_json = request.get_json()
        json_params = request_json['params']
        voyage = models.Voyage(voyage_id=json_params['updated_voyage_id'],
                               voyage_name=json_params['updated_voyage_name'],
                               voyage_notes=json_params['updated_voyage_notes'])
        model_ops.update_voyage(voyage)
    response = jsonify(message="success", data="")
    return response


#######################################
##
# @brief delete voyages by id
#######################################
@app.route('/delete_voyages_by_id', methods=['POST'])
def delete_voyages_by_id():
    request_json = request.get_json()
    json_params = request_json['params']
    voyages_to_delete_ids = json_params['voyages_to_delete_ids']
    model_ops.delete_voyages_by_id(voyages_to_delete_ids)
    return jsonify(message="success", data='')

#######################################
##
# @brief create a new voyage row
#######################################
@app.route('/get_all_voyage_ids', methods=['GET', 'POST'])
def get_all_voyage_ids():
    voyage_ids = model_ops.get_all_voyage_ids()
    response = jsonify(message="success", data={'voyage_ids': voyage_ids})
    return response


#######################################
##
# @brief route handler for voyages page
#######################################
@app.route('/voyages')
def route_voyages():
    return render_template('voyages.html')


#######################################
##
# @brief default route handler
#######################################
@app.route('/')
def route_default():
    return redirect(url_for('route_voyages'))



#######################################
##
#
#######################################
# def run_server():
#     app.run()


################################################################################
# ENTRY POINT
################################################################################
# if __name__ == '__main__':
#     run_server()

################################################################################
# END OF FILE
################################################################################