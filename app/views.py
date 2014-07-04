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
import jsonpickle
from app import app
import models
import model_ops

################################################################################
# GLOBAL
#################################################################################
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
    result = ''
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
        voyage = models.Voyage(voyage_name=json_params['voyage_name'],
                               voyage_notes=json_params['voyage_notes'])
        model_ops.add_voyage(voyage)
    response = jsonify(message="success", data="")
    return response


#######################################
##
#
#######################################
@app.route('/voyages')
def route_voyages():
    return render_template('voyages.html')

#######################################
##
#
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