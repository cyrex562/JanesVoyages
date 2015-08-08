function get_waypoint_from_form() {
    var voyage_id = $("#waypoint_voyage_id").val();
    if (voyage_id === undefined || voyage_id === '') {
        voyage_id = $('#voyage_id').text();
    }
    var waypoint = {
        waypoint_id: $('#waypoint_id').text(),
        waypoint_start_date: $('#waypoint_start_date').val(),
        waypoint_end_date: $('#waypoint_end_date').val(),
        waypoint_type: $('#waypoint_type').val(),
        waypoint_name: $('#waypoint_name').val(),
        waypoint_notes: $('#waypoint_notes').val().trim(),
        waypoint_location: $('#waypoint_location').val(),
        voyage_id: voyage_id
    };
    console.log('get_waypoint_from_form: %s', JSON.stringify(waypoint));
    return waypoint;
}

function fill_waypoint_form(response) {
    console.log('fill_waypoint_form: in_waypoint = %s', JSON.stringify(response));

    var in_waypoint = response;
    if ('data' in response) {
        in_waypoint = response.data.found_waypoints[0];
    }

    $('#waypoint_name').val(in_waypoint.waypoint_name);
    $('#waypoint_id').text(in_waypoint.waypoint_id);
    $("#waypoint_id_form_group").show();
    $('#waypoint_type').val(in_waypoint.waypoint_type);
    $('#waypoint_start_date').val(in_waypoint.waypoint_start_date);
    $('#waypoint_end_date').val(in_waypoint.waypoint_end_date);
    $('#waypoint_location').val(in_waypoint.waypoint_location);
    $('#waypoint_notes').val(in_waypoint.waypoint_notes);
    $('#waypoint_voyage_id').val(in_waypoint.voyage_id);
}

function gen_waypoint_option(waypoint, selected_waypoint_id) {
    console.log('gen_waypoint_option()');
    var waypoint_option = '<option value="[waypoint_id]"[selected]>' +
        '[waypoint_name], ' +
        '[waypoint_start_date]-[waypoint_end_date], ' +
        '[waypoint_location], [waypoint_type]</option>';
    waypoint_option = waypoint_option.replace(/\[waypoint_name]/g,
        waypoint.waypoint_name);
    waypoint_option = waypoint_option.replace(/\[waypoint_id\]/g,
        waypoint.waypoint_id);
    waypoint_option = waypoint_option.replace(/\[waypoint_start_date\]/g,
        waypoint.waypoint_start_date);
    waypoint_option = waypoint_option.replace(/\[waypoint_end_date\]/g,
        waypoint.waypoint_end_date);
    waypoint_option = waypoint_option.replace(/\[waypoint_location\]/g,
        waypoint.waypoint_location);
    waypoint_option = waypoint_option.replace(/\[waypoint_type\]/g,
        waypoint.waypoint_type);
    var selected_val = "";
    if (null !== selected_waypoint_id
        && waypoint.waypoint_id === selected_waypoint_id) {
        selected_val = " selected";
    }
    waypoint_option = waypoint_option.replace(/\[selected\]/g, selected_val);
    return waypoint_option;
}

function reset_waypoints_list() {
    console.log('reset_waypoints_list()');
    var waypoint_list = $('#waypoints');
    waypoint_list.empty();
    waypoint_list.append(
        '<option id="select_waypoint">Select a waypoint...</option>');
}

function refresh_waypoints_list_callback(response) {
    console.log('refresh_waypoints_list_callback()');
    reset_waypoints_list();
    var waypoint_list = $('#waypoints');
    if (response.message === 'success') {
        set_status_bar('success', 'waypoints retrieved');
        /** @namespace response.data.found_waypoints */
        var waypoints = response.data.found_waypoints;
        var waypoint_count = waypoints.length;
        for (var i = 0; i < waypoint_count; i++) {
            var waypoint_option = gen_waypoint_option(waypoints[i], null);
            waypoint_list.append(waypoint_option);
        }
    } else {
        set_status_bar('danger', 'failed to get waypoints');
    }
}

function hide_waypoint_form() {
    console.log('hide_waypoint_form()');
    $('#waypoint_sub_form').collapse('hide');
    $('#waypoint_id_form_group').hide();
}

function show_waypoint_form() {
    console.log('show_waypoint_form()');
    $('#waypoint_sub_form').collapse('show');
}

function refresh_waypoints_list(in_voyage_id) {
    console.log('refresh_waypoints_list()');
    send_request('waypoints/get', 'POST', {voyage_id: in_voyage_id}, get_waypoints_for_voyage_cb);
}

function get_waypoints_for_voyage_cb(response) {
    console.log('get_waypoints_for_voyage_cb()');
    if (response.message === 'success') {
        refresh_waypoints_list_callback(response);
        show_waypoint_form();
        set_status_bar("success", "waypoints retrieved for voyage");
    } else {
        console.log('danger', 'failed to get waypoints for voyage');
        set_status_bar("danger", "failed to get waypoints for voyage");
    }
}

function get_waypoints_for_voyage(voyage_id) {
    console.log('get_waypoints_for_voyage()');
    send_request('waypoints/get', 'POST', {voyage_id: voyage_id}, get_waypoints_for_voyage_cb);
}

function waypoint_select_change_cb(response) {
    console.log('waypoint_select_change_cb()');
    if (response.message === 'success') {
        console.log('waypoint retrieved');
        if (response.data.found_waypoints.length > 0) {
            var found_waypoint = response.data.found_waypoints[0];
            fill_waypoint_form(found_waypoint);
            show_trade_form();
            clear_trade_form(true);
            get_trades_for_waypoint(found_waypoint.waypoint_id);

            clear_event_form(true);
            show_event_form();
            get_events_for_waypoint(found_waypoint.waypoint_id);

            $('#trade_waypoint_id').text(found_waypoint.waypoint_id);

        } else {
            hide_trade_form();
        }
        set_status_bar("success", "waypoint selection changed");
    } else {
        console.log('failed to get waypoint');
        set_status_bar("danger", "failed to change waypoint selection");
    }
}

function waypoint_select_change() {
    console.log('waypoint_select_change()');
    var selected_waypoint_id = $('#waypoints').val();
    if (selected_waypoint_id.toLowerCase().indexOf('select') == -1) {
        send_request('waypoints/get', 'POST',
            {waypoint_ids: [selected_waypoint_id]}, waypoint_select_change_cb);
    } else {
        clear_waypoint_form(false);
        hide_trade_form();
    }
}

/**
 *
 * @param waypoint_id
 */
function set_selected_waypoint(waypoint_id) {
    console.log('set_selected_waypoint(), waypoint_id: ' + waypoint_id);
    var waypoint_list = $('#waypoints');
    waypoint_list.val(waypoint_id);
}

/**
 *
 * @returns {*|jQuery}
 */
function get_selected_waypoint_id() {
    console.log('get_selected_waypoint_id()');
    var selected_waypoint_id = $('#waypoints').val();
    if (selected_waypoint_id === undefined) {
        selected_waypoint_id = $('#waypoint_id').text();
    }
    return selected_waypoint_id;
}

function add_waypoint_callback(response) {
    console.log('add_waypoint_callback(), response = %s', JSON.stringify(response));
    if (response.message === 'success') {
        /** @namespace response.data.added_waypoint_ids */
        var added_waypoint_id = response.data.added_waypoint_ids[0];
        set_status_bar('success', 'waypoint added');
        var current_voyage_id = $('#voyage_id').text();
        refresh_waypoints_list(current_voyage_id);
        set_selected_waypoint(added_waypoint_id);
    } else {
        set_status_bar('danger', 'failed to add waypoint')
    }
}

function add_waypoint() {
    console.log('add_waypoint()');
    var waypoint_to_add = get_waypoint_from_form();
    var waypoints_to_add = [];
    waypoints_to_add.push(waypoint_to_add);
    send_request('waypoints/add', 'POST', {waypoints_to_add: waypoints_to_add},
        add_waypoint_callback);
}

function modify_waypoint_callback(response) {
    console.log('modify_waypoint_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'waypoint modified');
        var current_voyage_id = $('#voyage_id').text();
        if ($('#waypoints_table').length === 0) {
            refresh_waypoints_list(current_voyage_id);
        } else {
            refresh_waypoints_table();
        }
        clear_waypoint_form(false);
    } else {
        set_status_bar('danger', 'waypoint not modified');
    }
}

function modify_waypoint() {
    console.log('modify_waypoint()');
    var waypoint_to_modify = get_waypoint_from_form();
    var waypoints_to_modify = [];
    waypoints_to_modify.push(waypoint_to_modify);
    send_request('waypoints/modify', 'POST',
        {waypoints_to_modify: waypoints_to_modify}, modify_waypoint_callback);
}

function delete_waypoint_callback(response) {
    console.log('delete_waypoint_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'waypoint deleted');

        var current_voyage_id = $('#voyage_id').text();

        if ($('#waypoints_table').length === 0) {
            refresh_waypoints_list(current_voyage_id);
        } else {
            refresh_waypoints_table();
        }

        clear_waypoint_form(false);
    } else {
        set_status_bar('danger', 'waypoint not deleted');
    }
}

function delete_waypoint() {
    console.log('delete_waypoint()');
    var selected_waypoint_id = get_selected_waypoint_id();
    console.log('selected_waypoint_id = %s', selected_waypoint_id);
    var waypoint_ids = [selected_waypoint_id];
    send_request('waypoints/delete', 'POST',
        {waypoint_ids: waypoint_ids}, delete_waypoint_callback);
}

function reset_waypoint_form_btn_click() {
    console.log('reset_waypoint_form_btn_click()');
    clear_waypoint_form(false);
}

function get_waypoint_by_id(waypoint_id, callback) {
    console.log('get_waypoint_by_id()');
    var waypoint_ids = [waypoint_id];
    send_request('waypoints/get', 'POST', {waypoint_ids: waypoint_ids}, callback);
}

function gen_waypoint_row(waypoint) {
    console.log('gen_waypoint_row, waypoint = %s', JSON.stringify(waypoint));
    var row =
        "<tr class=\"waypoint_row\">" +
        "<td class=\"waypoint_id_cell\" data-toggle=\"tooltip\" " +
        "title=\"[waypoint_id]\">[waypoint_id_brief]...</td>" +
        "<td data-toggle=\"tooltip\" title=\"[voyage_id]\">" +
        "[voyage_id_brief]...</td>" +
        "<td>[waypoint_name]</td>" +
        "<td>[waypoint_type]</td>" +
        "<td>[waypoint_location]</td>" +
        "<td>[waypoint_start_date]</td>" +
        "<td>[waypoint_end_date]</td>" +
        "</tr>";
    /*

     "gen_waypoint_row, waypoint = {"_id":"558cad52ea03022a0c192921","voyage_id":"558cad01ea03022a0c192920","waypoint_end_date":"2 1 1","waypoint_id":"558cad52ea03022a0c192921","waypoint_location":"some where","waypoint_name":"waypoint 1","waypoint_notes":"","waypoint_start_date":"1 1 1","waypoint_type":"start"}"

     */
    row = row.replace(/\[waypoint_id\]/g, waypoint.waypoint_id);
    row = row.replace(/\[waypoint_id_brief\]/g, waypoint.waypoint_id.substring(0, 4));
    row = row.replace(/\[voyage_id_brief\]/g, waypoint.voyage_id.substring(0, 4));
    row = row.replace(/\[voyage_id\]/g, waypoint.voyage_id);
    row = row.replace(/\[waypoint_name\]/g, waypoint.waypoint_name);
    row = row.replace(/\[waypoint_type\]/g, waypoint.waypoint_type);
    row = row.replace(/\[waypoint_location\]/g, waypoint.waypoint_location);
    row = row.replace(/\[waypoint_start_date\]/g, waypoint.waypoint_start_date);
    row = row.replace(/\[waypoint_end_date\]/g, waypoint.waypoint_end_date);
    return row;
}

function populate_waypoints_table(response) {
    console.log('populate waypoints table');
    if (response.message === 'success') {
        set_status_bar('success', 'trades retrieved');
        var waypoints = response.data.found_waypoints;
        var waypoints_table = $('#waypoints_table');
        waypoints_table.find("tr:gt(0)").remove();
        for (var i = 0; i < waypoints.length; i++) {
            var waypoint_row = gen_waypoint_row(waypoints[i]);
            waypoints_table.append(waypoint_row);
        }
        $('.waypoint_row').click(waypoint_row_click);
    }
}

function refresh_waypoints_table() {
    console.log('refresh waypoints table');
    send_request('waypoints/get', 'POST', {"waypoint_ids": []},
        populate_waypoints_table);
}

function waypoint_row_click() {
    console.log('waypoint_row_click()');
    var waypoint_id = $(this).find('.waypoint_id_cell').attr('title');
    get_waypoint_by_id(waypoint_id, fill_waypoint_form);
}

function clear_waypoint_form(clear_waypoints_list) {
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