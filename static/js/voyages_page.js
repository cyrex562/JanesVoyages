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
    if (parseInt(status_bar.attr('closed')) === 1) {
        status_bar.append('<div class="alert-dismissible alert alert-' + level +
        '" role="alert"><button id="dismiss_alert_btn" type="button" class="close" ' +
        'data-dismiss="alert" aria-lable="Close"><span aria-hidden="true">' +
        '&times;</span></button><div id="status_bar_msg"><p>' + message +
            '</p></div></div>');
        status_bar.attr('closed', "0");
    } else {
        $('#status_bar_msg').append('<p>' + message + '</p>');
    }
    $('#dismiss_alert_btn').click(function() {
        status_bar.empty();
        $('#status-bar').attr("closed", "1");
    });
}




function voyage_row_click() {
    console.log('voyage_row_click()');
    var voyage_id = $(this).find('.voyage_id_cell').attr('title');
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

function add_source_btn_click() {
    console.log('add_source_btn_click');
    add_source();
}

function modify_source_btn_click() {
    console.log('modify_source_btn_click');
    modify_source();
}

function delete_source_btn_click() {
    console.log('delete_source_btn_click');
    delete_source();
}

function add_event_btn_click() {
    console.log('add_event_btn_click');
    add_event();
}

function modify_event_btn_click() {
    console.log('modify_event_btn_click');
    modify_event();
}

function delete_event_btn_click() {
    console.log('delete_event_btn_click');
    delete_event();
}



function clear_voyage_form() {
    console.log('clear_voyage_form');
    $('#voyage_name').val('');
    $('#voyage_id').text('');
    $('#voyage_id_form_group').hide();
    $('#voyage_notes').val('');
    $('#ship_name').val('');
    $('#ship_captain').val('');
    $('#ship_flag').val('');
    $('#ship_notes').text('');
}

function clear_waypoint_form(clear_waypoints_list)
{
    console.log('clear_waypoint_form');
    if (clear_waypoints_list === true) {
        reset_waypoints_list();
    }

    $('#waypoint_name').val('');
    $('#waypoint_id').text('');
    $('#waypoint_type').val('start');
    $('#waypoint_start_date').val('');
    $('#waypoint_end_date').val('');
    $('#waypoint_location').val('');
    $('#waypoint_notes').val('');
    $('#waypoint_id_form_group').hide();
}

function clear_trade_form(clear_list)
{
    console.log('clear_trade_form');
    if (clear_list) {
        var trades_list = $('#trades');
        trades_list.empty();
        trades_list.append('<option id="select_trade">Select A Trade...</option>');
    }

    $('#trade_id').text('');
    $('.trade_bought_sold').removeProp('checked');
    $('#trade_item').val('');
    $('#trade_quantity').val('');
    $('#trade_notes').val('');
    $('#trade_id_form_group').hide();
}

function clear_event_form(clear_list) {
    console.log('clear_event_form');
    if (clear_list) {
        var event_list = $('#events');
        event_list.empty();
        event_list.append('<option id="select_event">Select an event...</option>');
    }

    $('#event_id').text('');
    $('#event_name').val('');
    $('#event_id_form_group').hide();
    $('#event_notes').val('');
}

function clear_source_form(clear_list) {
    console.log('clear_source_form');
    if (clear_list) {
        var sources_list = $('#sources');
        sources_list.empty();
        sources_list.append('<option id="select_source">Select A Source...</option>');
    }

    $('#source_id').text('');
    $('#source_citation').val('');
    $('#source_notes').val('');
    $('#source_id_form_group').hide();
}

function clear_form_btn_click()
{
    console.log('clear_form_btn_click()');
    clear_voyage_form();
    clear_waypoint_form(true);
    clear_trade_form(true);
    clear_source_form(true);
    clear_event_form(true);
    hide_event_form();
    hide_waypoint_form();
    hide_trade_form();
    hide_source_form();
}



function reset_waypoint_form_btn_click() {
    console.log('reset_waypoint_form_btn_click()');
    clear_waypoint_form(false);
}

function reset_trade_form_btn_click() {
    console.log('reset_trade_form_btn_click()');
    clear_trade_form(false);
}

function reset_source_form_btn_click() {
    console.log("reset source form btn click");
    clear_source_form(false);
}

function reset_event_form_btn_click() {
    console.log('reset event form btn click');
    clear_event_form(false);
}

$(document).ready(function () {
    console.log('document.ready()');
    clear_voyage_form();
    clear_waypoint_form(true);
    clear_trade_form();
    clear_event_form();
    refresh_voyages_table();
    hide_waypoint_form();
    hide_trade_form();
    hide_source_form();
    hide_event_form();
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
    $('#clear_form_btn').click(clear_form_btn_click);
    $('#reset_waypoint_form_btn').click(reset_waypoint_form_btn_click);
    $('#reset_trade_form_btn').click(reset_trade_form_btn_click);
    /* source */
    $('#add_source_btn').click(add_source_btn_click);
    $('#modify_source_btn').click(modify_source_btn_click);
    $('#delete_source_btn').click(delete_source_btn_click);
    $('#sources').change(source_select_change);
    $('#reset_source_form_btn').click(reset_source_form_btn_click);
    /* event */
    $('#add_event_btn').click(add_event_btn_click);
    $('#modify_event_btn').click(modify_event_btn_click);
    $('#delete_event_btn').click(delete_event_btn_click);
    $('#reset_event_form_btn').click(reset_event_form_btn_click);
    $('#events').change(event_select_change);
    /* handler for status bar close */
});
