function get_waypoint_from_form() {
    console.log('update_curr_waypoint_from_form()');
    return {
        waypoint_id: $('#waypoint_id').text(),
        waypoint_start_date: $('#waypoint_start_date').val(),
        waypoint_end_date: $('#waypoint_end_date').val(),
        waypoint_type: $('#waypoint_type').val(),
        waypoint_name: $('#waypoint_name').val(),
        waypoint_notes: $('#waypoint_notes').val(),
        waypoint_location: $('#waypoint_location').val(),
        voyage_id: $('#voyage_id').val()
    };
}

function fill_waypoint_form(in_waypoint) {
    console.log('fill_waypoint_form()');
    $('#waypoint_name').val(in_waypoint.waypoint_name);
    $('#waypoint_id').text(in_waypoint.waypoint_id);
    $('#waypoint_type').val(in_waypoint.waypoint_type);
    $('#waypoint_start_date').val(in_waypoint.waypoint_start_date);
    $('#waypoint_end_date').val(in_waypoint.waypoint_start_date);
    $('#waypoint_location').val(in_waypoint.waypoint_location);
    $('#waypoint_notes').val(in_waypoint.waypoint_notes);
    $('#waypoint_voyage_id').val(in_waypoint.voyage_id);
    refresh_trades_list();
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

function refresh_waypoints_list_callback(response) {
    console.log('refresh_waypoints_list_callback()');
    var waypoint_list = $('#waypoints');
    if (response.message === 'success') {
        set_status_bar('success', 'waypoints retrieved');
        /** @namespace response.data.found_waypoints */
        var waypoints = response.data.found_waypoints;
        waypoint_list.empty();
        for (var i = 0; i < waypoints.length; i++) {
            var waypoint_option = gen_waypoint_option(waypoints[i], null);
            waypoint_list.append(waypoint_option);
        }
    } else {
        set_status_bar('danger', 'failed to get waypoints');
    }

    if ($('#waypoints option').size() === 0) {
        $('#trade_sub_form').attr("disabled");
    } else {
        $('#trade_sub_form').removeAttr("disabled");
    }
}

function refresh_waypoints_list(in_waypoint_id) {
    console.log('refresh_waypoints_list');
    var waypoint_list_ids = [];
    if (in_waypoint_id !== null) {
        waypoint_list_ids.push(in_waypoint_id);
    }
    $('#waypoints').each(function() {
        waypoint_list_ids.push($(this).val());
    });
    send_request('waypoints/get', 'POST', {waypoint_ids: waypoint_list_ids},
        refresh_waypoints_list_callback);
}

function get_waypoints_for_voyage_cb(response) {
    console.log('get_waypoints_for_voyage_cb()');
    if (response.message === 'success') {
        refresh_waypoints_list_callback(response);
    } else {
        console.log('danger', 'failed to get waypoints for voyage');
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
        var found_waypoint = response.data.found_waypoints[0];
        fill_waypoint_form(found_waypoint);
        get_trades_for_waypoint(found_waypoint.waypoint_id);
    } else {
        console.log('failed to get waypoint')
    }
}

function waypoint_select_change() {
    console.log('waypoint_select_change()');
    var selected_waypoint_id = $('#waypoints').val();
    send_request('waypoints/get', 'POST',
        {waypoint_ids: [selected_waypoint_id]}, waypoint_select_change_cb);
}

function set_selected_waypoint(waypoint_id) {
    var waypoint_list = $('#waypoint_list');
    waypoint_list.val('');
    waypoint_list.val(waypoint_id);
}

function get_selected_waypoint_id() {
    console.log('get_selected_waypoint_id');
    return $('#waypoint_list').val();
}

function add_waypoint_callback(response) {
    console.log('add_waypoint_callback');
    if (response.message === 'success') {
        /** @namespace response.data.added_waypoint_ids */
        var added_waypoint_id = response.data.added_waypoint_ids[0];
        set_status_bar('success', 'waypoint added');
        refresh_waypoints_list(added_waypoint_id);
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
    console.log('modify_waypoint_callback');
    if (response.message === 'success') {
        set_status_bar('success', 'waypoint modified');
        /** @namespace response.data.modified_waypoint_ids */
        var modified_waypoint_id = response.data.modified_waypoint_ids[0];
        refresh_waypoints_list(modified_waypoint_id);
        set_selected_waypoint(modified_waypoint_id)
    } else {
        set_status_bar('danger', 'waypoint not modified');
    }
}

function modify_waypoint() {
    console.log('modify_waypoint');
    var waypoint_to_modify = get_waypoint_from_form();
    var waypoints_to_modify = [];
    waypoints_to_modify.push(waypoint_to_modify);
    send_request('waypoints/modify', 'POST',
        {waypoints_to_modify: waypoints_to_modify}, modify_waypoint_callback);
}

function delete_waypoint_callback(response) {
    if (response.message === 'success') {
        set_status_bar('success', 'waypoint deleted');
        /** @namespace response.data.deleted_waypoint_ids */
        var deleted_waypoint_id = response.data.deleted_waypoint_ids[0];
        refresh_waypoints_list(deleted_waypoint_id);
        set_selected_waypoint(deleted_waypoint_id);
    } else {
        set_status_bar('danger', 'waypoint not deleted');
    }
}

function delete_waypoint() {
    console.log('delete_waypoint()');
    var selected_waypoint_id = get_selected_waypoint_id();
    var waypoints_to_delete = [];
    waypoints_to_delete.push(selected_waypoint_id);
    send_request('waypoints/delete', 'POST',
        {waypoints_to_delete: waypoints_to_delete}, delete_waypoint_callback);
}
