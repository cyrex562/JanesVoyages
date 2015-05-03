function send_request(action, request_type, request_data, callback) {
    console.log('send_request, action: %s, request_type: %s, ' +
        'request_data: %s', action, request_type, request_data);
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

function set_status_bar(level, message) {
    var status_bar = $('#status-bar');
    status_bar.empty();
    status_bar.append('<div class="alert-dismissible alert alert-' + level +
        '" role="alert"><button type="button" class="close" ' +
        'data-dismiss="alert" aria-lable="Close"><span aria-hidden="true">' +
        '&times;</span></button><p>' + message + '</p></div>');
}

function voyage_row_click() {
    console.log('voyage_row_click()');
    var voyage_id = $(this).find('.voyage_id_cell').text();
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

function modify_waypoint_btn_click() {
    console.log('modify_waypoint_btn_click()');
    modify_waypoint();
}
function delete_waypoint_btn_click() {
    console.log('delete_waypoint_btn_click()');
    delete_waypoint();
}

function add_waypoint_btn_click() {
    console.log('add_waypoint_btn_click()');
    add_waypoint();
}

function add_trade_btn_click() {
    console.log('add_trade_btn_click');
    add_trade();
}

function modify_trade_btn_click() {
    console.log('modify_trade_btn_click');
    modify_trade();
}

function delete_trade_btn_click() {
    console.log('delete_trade_btn_click');
    delete_trade();
}

function clear_voyage_form() {
    $('#voyage_name').val('');
    $('#voyage_id').text('');
    $('#voyage_notes').text('');
    $('#ship_name').val('');
    $('#ship_captain').val('');
    $('#ship_flag').val('');
    $('#ship_notes').text('');
}

function clear_waypoint_form() {
    $('#waypoints').empty();
    $('#waypoint_id').text('');
    $('#waypoint_type').val('start');
    $('#waypoint_start_date').val('');
    $('#waypoint_end_date').val('');
    $('#waypoint_location').val('');
    $('#waypoint_notes').text('');
}

function clear_trade_form() {
    $('#trade_id').text('');
    // TODO: clear bought/sold
    $('#trade_item').val('');
    $('#trade_quantity').val('');
}

/**
 *
 */
$(document).ready(function () {
    console.log('document.ready()');
    clear_voyage_form();
    clear_waypoint_form();
    clear_trade_form();
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
