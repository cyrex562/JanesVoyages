//var curr_trade = {
//    "trade_id": -1,
//    "trade_bought_sold": "bought",
//    "trade_item": "",
//    "trade_quantity": ""
//};
//
//var curr_waypoint = {
//    "waypoint_id": -1,
//    "waypoint_name": "",
//    "waypoint_type": "",
//    "waypoint_start_date": "",
//    "waypoint_end_date": "",
//    "waypoint_location": "",
//    "trades": [],
//    "waypoint_notes": ""
//};
//
//var curr_voyage = {
//    "voyage_id": -1,
//    "voyage_name": "",
//    "voyage_notes": "",
//    "ship_name": "",
//    "ship_captain": "",
//    "ship_flag": "",
//    "waypoints": []
//};

/**
 *
 * @param action
 * @param request_type
 * @param request_data
 * @param callback
 */
function send_request(action, request_type, request_data, callback) {
    console.log('send_request, action: %s, request_type: %s, ' +
        'request_data: %s, callback: %s', action, request_type, request_data,
        callback);
    //noinspection JSUnresolvedVariable
    $.ajax({
        type: request_type,
        url: $SCRIPT_ROOT + "/" + action,
        data: JSON.stringify({action: action, params: request_data},
            null, '\t'),
        contentType: "application/json; charset=UTF-8",
        success: callback,
        error: function (request, status, error) {
            console.log("AJAX request failed: action: {0}, " +
                    "request_data: {1}, callback: {2}, status: {3}, request: " +
                    "{4}, error: {5}", action, request_data, callback, status,
                request, error);
        }
    });
}


/**
 *
 * @param level
 * @param message
 *
 * <div class="alert alert-warning alert-dismissible" role="alert">
 <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
 <strong>Warning!</strong> Better check yourself, you're not looking too good.
 </div>
 *
 */
function set_status_bar(level, message) {
    var status_bar = $('#status-bar');
    status_bar.empty();
    status_bar.append('<div class="alert-dismissible alert alert-' + level +
        '" role="alert"><button type="button" class="close" ' +
        'data-dismiss="alert" aria-lable="Close"><span aria-hidden="true">' +
        '&times;</span></button><p>' + message + '</p></div>');
}

/**
 * when a row is clicked in the voyages table, set the currently selected voyage
 * id
 */
function voyage_row_click() {
    console.log('voyage_row_click()');
    var voyage_id_str = $(this).find('.voyage_id_cell').text();
    var voyage_id = parseInt(voyage_id_str);
    set_current_voyage(voyage_id)
}

function add_voyage_btn_click() {
    console.log('add_voyage_btn_click()');
    add_voyage();
}

function modify_voyage_btn_click() {
    console.log('modify_voyage_btn_click()');
    modify_voyage();
}

/**
 *
 */
$(document).ready(function () {
    console.log('document.ready()');
    refresh_voyages_table();
    $("#add_voyage_btn").click(add_voyage_btn_click);
    $("#modify_voyage_btn").click(modify_voyage_btn_click);
    $('#delete_voyage_btn').click(delete_voyage_btn_click);
    $('#add_waypoint_btn').click(add_waypoint_btn_click);
    $('#modify_waypoint_btn').click(modify_waypoint_btn_click);
    $('#delete_waypoint_btn').click(delete_waypoint_btn_click);
    $('#waypoints').change(waypoint_select_change);
    $('#add_trade_btn').click(add_trade_btn_click);
    $('#modify_trade_btn').click(modify_trade_btn_click);
    $('#delete_trade_btn').click(delete_trade_btn_click);
    $('#trades').change(trade_select_change);
});
