/**
 *
 * @returns {number}
 */
function get_waypoint_id() {
    console.log('get_waypoint_id()');
    return Date.now();
}

/**
 *
 */
function update_curr_waypoint_from_form() {
    console.log('update_curr_waypoint_from_form()');
    curr_waypoint.waypoint_id = parseInt($('#waypoint_id').text());
    curr_waypoint.waypoint_start_date = $('#waypoint_start_date').val();
    curr_waypoint.waypoint_start_date = $('#waypoint_end_date').val();
    curr_waypoint.waypoint_type = $('#waypoint_type').val();
    curr_waypoint.waypoint_name = $('#waypoint_name').val();
    curr_waypoint.waypoint_notes = $('#waypoint_notes').val();
    curr_waypoint.waypoint_location = $('#waypoint_location').val();
}

/**
 *
 * @param waypoint
 * @param selected_waypoint_id
 * @returns {string}
 */
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
    if (waypoint.waypoint_id === selected_waypoint_id) {
        selected_val = " selected";
    }
    waypoint_option = waypoint_option.replace(/\[selected\]/g, selected_val);
    return waypoint_option;
}

/**
 *
 */
function populate_waypoints_list(selected_waypoint_id) {
    console.log('populate_waypoints_list()');
    console.log('selected_waypoint_id: %s', toString(selected_waypoint_id));
    var waypoints_list = $('#waypoints');
    waypoints_list.empty();
    for (var i = 0; i < curr_voyage.waypoints.length; i++) {
        waypoints_list.append(gen_waypoint_option(curr_voyage.waypoints[i],
            selected_waypoint_id));
    }
}

/**
 *
 */
function add_waypoint_btn_click() {
    console.log('add_waypoint_btn_click()');
    update_curr_waypoint_from_form();
    curr_waypoint.waypoint_id = get_waypoint_id();
    curr_voyage.waypoints.push(JSON.parse(JSON.stringify(curr_waypoint)));
    populate_waypoints_list(curr_waypoint.waypoint_id);
}

/**
 *
 */
function fill_waypoint_form() {
    console.log('fill_waypoint_form()');
    $('#waypoint_name').val(curr_waypoint.waypoint_name);
    $('#waypoint_id').text(curr_waypoint.waypoint_id);
    $('#waypoint_type').val(curr_waypoint.waypoint_type);
    $('#waypoint_start_date').val(curr_waypoint.waypoint_start_date);
    $('#waypoint_end_date').val(curr_waypoint.waypoint_start_date);
    $('#waypoint_location').val(curr_waypoint.waypoint_location);
    $('#waypoint_notes').val(curr_waypoint.waypoint_notes);
    refresh_trades_list();
}

/**
 *
 */
function waypoint_select_change() {
    console.log('waypoint_select_change()');
    var sel_waypoint_id = parseInt($('#waypoints').find('option:selected')
        .attr('value'));
    for (var i = 0; i < curr_voyage.waypoints.length; i++) {
        if (curr_voyage.waypoints[i].waypoint_id === sel_waypoint_id) {
            curr_waypoint = curr_voyage.waypoints[i];
            fill_waypoint_form();
            break;
        }
    }
}

/**
 *
 */
function modify_waypoint_btn_click() {
    console.log('modify_waypoint_btn_click()');
    update_curr_waypoint_from_form();
    for (var i = 0; i < curr_voyage.waypoints.length; i++) {
        if (curr_voyage.waypoints[i].waypoint_id === curr_waypoint.waypoint_id) {
            curr_voyage.waypoints[i] = JSON.parse(JSON.stringify(curr_waypoint));
            populate_waypoints_list(curr_waypoint.waypoint_id);
            break;
        }
    }
}

/**
 *
 */
function delete_waypoint_btn_click() {
    console.log('delete_waypoint_btn_click()');
    update_curr_waypoint_from_form();
    var waypoints_index = -1;
    for (var i = 0; i < curr_voyage.waypoints.length; i++) {
        if (curr_voyage.waypoints[i].waypoint_id === curr_waypoint.waypoint_id) {
            waypoints_index = i;
            break;
        }
    }

    if (waypoints_index >= 0) {
        curr_voyage.waypoints.slice(waypoints_index, 1);
        populate_waypoints_list(curr_waypoint.waypoint_id);
    }
}