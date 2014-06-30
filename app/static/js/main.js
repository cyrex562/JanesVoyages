/*******************************************************************************
 *//**
 * @file main.js
 * @brief primary client-side javascript script file for JVWA
 * @author Josh Madden <cyrex562@gmail.com>
 * @copyright Josh Madden 2014
 ******************************************************************************/
/*******************************************************************************
 * GLOBALS
 ******************************************************************************/
current_voyage = {};
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
    var voyages = response.data.voyages;
    var voyages_list = $("#voyages-list");
    voyages_list.empty();
    for (var i = 0; i < voyages.length; i++) {
        var voyage_list_option = '<option value="[voyage_id]">([voyage_id]) [voyage_name]</option>';
        voyage_list_option = voyage_list_option.replace(/\[voyage_id\]/g,
            voyages[i].voyage_id);
        voyage_list_option = voyage_list_option.replace(/\[voyage_name\]/g,
            voyages[i].voyage_name);
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
 * @brief clear the voyage form
 *************************************/
function clear_voyage_form() {
    $("#voyage-id").empty();
    $("#voyage-name").empty();
    $("#voyage-notes").empty();
}

/**************************************
 *//**
 * @brief clear and show the voyage form
 *************************************/
function create_voyage_btn_click() {
    $("#voyage-form").show();
    clear_voyage_form();
}

/**************************************
 *//**
 * @brief clear and hide the voyage form
 *************************************/
function cancel_voyage_btn_click() {
    $("#voyage-form").hide();
    clear_voyage_form();
}

/**************************************
 *//**
 * @brief clear the voyage form
 *************************************/
function reset_voyage_form_btn_click() {
    clear_voyage_form();
}

/**************************************
 *//**
 * @brief set the status bar text field.
 *************************************/
function set_status_bar(msg) {
    var status_bar = $("#status-bar");
    status_bar.empty();
    status_bar.append('<span>' + msg + '</span');
}

/**************************************
 *//**
 * @brief handle response to create voyage request
 *************************************/
function request_create_voyage_cb(response) {
    console.log("request_create_voyage_cb");
    set_status_bar(response.message);
    if (response.message === 'success') {
        console.log('create voyage success');
        update_voyages_list()
    }
}

/**************************************
 *//**
 * @brief send a request to the server to create a voyage
 *************************************/
function request_create_voyage() {
    console.log("request_create_voyage");
    send_request("create_voyage", current_voyage, request_create_voyage_cb);
}

/**************************************
 *//**
 * @brief process updsate request response
 *************************************/
function request_update_voyage_cb(response) {
    console.log("request_create_voyage_cb");
    var response_json = JSON.parse(response);
    var message = response_json.message;
    set_status_bar(message);
    if (message === 'success') {
        console.log('create voyage success');
    }
    // TODO: take action based on message
    // TODO: update voyages list
}

/**************************************
 *//**
 * @brief send a request to the server to update a voyage
 *************************************/
function request_update_voyage() {
    console.log("request_update_voyage");
    send_request("update_voyage", current_voyage, request_update_voyage_cb);
}

/**************************************
 *//**
 * @brief on save button click either create a new voyage or update an existing one.
 *************************************/
function save_voyage_form_btn_click() {
    current_voyage.voyage_name = $("#voyage-name").val();
    current_voyage.voyage_notes = $("#voyage-notes").val();
    if (current_voyage.voyage_id === undefined) {
        request_create_voyage();
    } else {
        request_update_voyage();
    }
}

/**************************************
 *//**
 * @brief set up the client-side UI and other freatures.
 *************************************/
$(document).ready(function()
{
    $("#voyage-form").hide();

    $("#create-voyage-btn")
        .button()
        .click(create_voyage_btn_click);

    $("#cancel-voyage-btn")
        .button()
        .click(cancel_voyage_btn_click);

    $("#reset-voyage-form-btn")
        .button()
        .click(reset_voyage_form_btn_click);

    $("#save-voyage-btn")
        .button()
        .click(save_voyage_form_btn_click);
});

/*******************************************************************************
 * END OF FILE
 ******************************************************************************/