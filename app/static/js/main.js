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
        url : $SCRIPT_ROOT + "/" + action,
        data : JSON.stringify({func: action, params: request_data},
            null, '\t'),
        contentType : "application/json; charset=UTF-8",
        success : callback,
        error : function(request, status, error) {
            console.log("AJAX request failed: action: {0}, " +
                "request_data: {1}, callback: {2}, status: {3}, request: " +
                "{4}, error: {5}", action, request_data, callback, status,
                request, error);
        }
    });
}

/**************************************
 *//**
 * @brief callback for update voyages list request
 * expects voyages list in the format
 * { message: "", data: { voyages: [ { voyage_id: 'voyage_id',
 *  voyage_name: 'voyage_name' } ] }
 *************************************/
function update_voyages_list_cb(response)
{
    console.log("update_voyages_list_cb()");
    voyages = response.data.voyages;
    var voyages_list = $("#voyages-list");
    voyages_list.empty();
    for (var i = 0; i < voyages.length; i++) {
        var voyage_list_option = '<option value="[voyage_id]">([voyage_id]) [voyage_name]</option>';
        voyage_list_option = voyage_list_option.replaceAll(/\[voyage_id\]/g,
            voyages_list[i].voyage_id);
        voyage_list_option = voyage_list_option.replace(/\[voyage_name\]/g,
            voyages_list[i].voyage_name);
        voyages_list.append(voyage_list_option);
    }
}

/**************************************
 *//**
 * @brief request update to voyages list
 *************************************/
function update_voyages_list()
{
    console.log("update_voyages_list()");
    send_request("get_voyages_list", {}, update_voyages_list_cb);
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