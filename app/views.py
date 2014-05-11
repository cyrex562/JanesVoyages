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
from app import app

################################################################################
# GLOBAL
# ################################################################################
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
@app.route('/server_request', methods=['GET', 'POST'])
def handle_server_request():
    result_msg = 'success'
    result_data = 'no data'
    if request.method == "POST":
        if 'session_id' in session:
            session_id = session['session_id']
        else:
            session_id = uuid.uuid4().hex
            session['session_id'] = session_id

        request_obj = request.get_json()
        request_obj['session_id'] = session_id
    response = jsonify(message=result_msg, data=result_data)
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