/*******************************************************************************
 *//**
 * @file main.js
 * @brief primary client-side javascript script file for JVWA
 * @author Josh Madden <cyrex562@gmail.com>
 * @copyright Josh Madden 2014
 ******************************************************************************/
/*******************************************************************************
 * FUNCTIONS
 ******************************************************************************/
/**************************************
 *//**
 * @brief send a request to the server.
 * @param action the action reuqested
 * @param request_data the data to be prcessed/required by the request.
 * @param callback the callback to call on success.
 *************************************/
function send_request(action, request_data, callback)
{
    $.ajax({
        type : "POST",
        url : $SCRIPT_ROOT + "/agent_request",
        data : JSON.stringify({func: func_name, params: in_data},
            null, '\t'),
        contentType : "application/json; charset=UTF-8",
        success : callback
    });
}

/**************************************
 *//**
 * @brief set up the client-side UI and other freatures.
 *************************************/
$(document).ready(function()
{

});

/*******************************************************************************
 * END OF FILE
 ******************************************************************************/