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
from flask import jsonify, render_template, request, session
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
def set_session_id(session):
    result = ''
    if 'session_id' in session:
        result = session['session_id']
    else:
        result = uuid.uuid4().hex()
        session['session_id'] = result
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

@app.route('/get_voyages_list', methods=['GET', 'POST'])
def retrieve_voyages_list():
    result_msg = 'success'
    data = {}
    if request.method == "POST":
        session_id = set_session_id(session)
        request_obj = request.get_json()
        request_obj['session_id'] = session_id
        voyages = model_ops.get_all_voyages()
        data = voyages
    response = jsonpickle.encode({'message': result_msg, 'data': data})
    return response

@app.route('/create_voyage', methods=['GET', 'POST'])
def create_voyage():
    if request.method == "POST":
        request_obj = request.get_json()
        print "request_obj: {0}".format(request_obj)
    response = jsonify(message="success", data="")
    return response

#######################################
##
#
#######################################
@app.route('/')
def hello_world():
    return render_template('index.html')


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