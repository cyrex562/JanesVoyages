/**
 *
 * @param voyage
 * @returns {string}
 */
function gen_voyage_row(voyage) {
    console.log('gen_voyage_row()');
    var voyage_row = '' +
        '<tr class="voyage_row">' +
        '<td class="voyage_id_cell">[voyage_id]</td>' +
        '<td class="voyage_name_cell">[voyage_name]</td>' +
        '<td class="ship_name_cell">[ship_name]</td>' +
        '<td class="ship_captain_cell">[ship_captain]</td>' +
        '<td class="ship_flag_cell">[ship_flag]</td>' +
        '<td>[waypoints]</td>' +
        '</tr>';
    voyage_row = voyage_row.replace(/\[voyage_id\]/g, voyage.voyage_id);
    voyage_row = voyage_row.replace(/\[voyage_name\]/g, voyage.voyage_name);
    voyage_row = voyage_row.replace(/\[ship_name\]/g, voyage.ship_name);
    voyage_row = voyage_row.replace(/\[ship_captain]/g, voyage.ship_captain);
    voyage_row = voyage_row.replace(/\[ship_flag]/g, voyage.ship_flag);
    voyage_row = voyage_row.replace(/\[waypoints\]/g, '<span class="badge">' +
        voyage.waypoints.length + '</span> waypoints');
    return voyage_row;
}

//function gen_trade_waypoint_option(waypoint) {
//    console.log('gen_trade_waypoint_option()');
//    var option = '<option value="[waypoint_id]">[waypoint_name] ' +
//    '[waypoint_location] [waypoint_start_date] [waypoint_end_date]</option>';
//    option = option.replace(/\[waypoint_id\]/g, waypoint.waypoint_id);
//    option = option.replace(/\[waypoint_name\]/g, waypoint.waypoint_name);
//    option = option.replace(/\[waypoint_location\]/g, waypoint.waypoint_location);
//    option = option.replace(/\[waypoint_start_date\]/g, waypoint.waypoint_start_date);
//    option = option.replace(/\[waypoint_end_date\]/g, waypoint.waypoint_end_date);
//    return option;
//}

//function populate_trade_waypoints() {
//    console.log('populate_trade_waypoints()');
//    var trade_waypoints = $('#trade_waypoints');
//    trade_waypoints.empty();
//    for (var i = 0; i < curr_voyage.waypoints.length; i++) {
//        trade_waypoints.append(gen_trade_waypoint_option(
//            curr_voyage.waypoints[i]));
//    }
//}
//
//function disable_trade_form() {
//    console.log('disable_trade_form()');
//    $('#trade_sub_form').children().attr("disabled", "");
//}
//
//function enable_trade_form() {
//    console.log('enable_trade_form()');
//    $('#trade_sub_form').children().removeAttr("disabled");
//}

/**
 *
 */
function fill_voyage_form(response) {
    console.log('fill_voyage_form()');

    if (response.message === 'success') {
        /** @namespace response.data.voyages */
        var curr_voyage = response.data.voyages[0];
        console.log('current_voyage = %s', JSON.stringify(curr_voyage));
        /** @namespace curr_voyage.voyage_name */
        $('#voyage_name').val(curr_voyage.voyage_name);
        /** @namespace curr_voyage.voyage_id */
        $('#voyage_id').text(curr_voyage.voyage_id);
        /** @namespace curr_voyage.voyage_notes */
        $('#voyage_notes').val(curr_voyage.voyage_notes);
        /** @namespace curr_voyage.ship_name */
        $('#ship_name').val(curr_voyage.ship_name);
        /** @namespace curr_voyage.ship_captain */
        $('#ship_captain').val(curr_voyage.ship_captain);
        /** @namespace curr_voyage.ship_flag */
        $('#ship_flag').val(curr_voyage.ship_flag);
        /** @namespace curr_voyage.waypoints */
        populate_waypoints_list(curr_voyage.waypoints[0]);
    } else {
        set_status_bar('danger', 'failed to find voyage');
    }
}

function get_voyage_by_id(voyage_id, callback) {
    var voyage_ids = [voyage_id];
    send_request('voyages/get', 'POST', {voyage_ids: voyage_ids},
        callback);
}

/**
 * Get the selected voyage from the server, fill in the voyage form
 * @param voyage_id
 */
function set_current_voyage(voyage_id) {
    /* get the voyage */
    get_voyage_by_id(voyage_id, fill_voyage_form);
}

/**
 *
 * @param response
 */
function populate_voyages_table(response) {
    console.log('get_voyages_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyages retrieved');
        var voyages = response.data.voyages;
        var voyages_table = $('#voyages_table');
        voyages_table.find("tr:gt(0)").remove();
        for (var i = 0; i < voyages.length; i++) {
            var voyage_row = gen_voyage_row(voyages[i]);
            voyages_table.append(voyage_row);
        }
        $('.voyage_row').click(voyage_row_click);
    }

}

/**
 *
 */
function refresh_voyages_table() {
    console.log('refresh_voyages_table()');
    send_request('voyages/get', 'POST', {voyage_ids: []}, populate_voyages_table);
}

/**
 *
 */
function get_voyage_form_data() {
    var waypoint_ids = [];
    $('#waypoints').each(function() {
        waypoint_ids.push(($(this)).text());
    });

    var voyage = {
        voyage_id: "",
        voyage_name: $('#voyage_name').val(),
        voyage_notes: $('#voyage_notes').val(),
        ship_name: $('#ship_name').val(),
        ship_captain: $('#ship_captain').val(),
        ship_flag: $('#ship_flag').val(),
        waypoints: waypoint_ids
    };
    var voyage_id_form_val = $('#voyage_id').text();
    if (voyage_id_form_val !== "") {
        voyage.voyage_id = voyage_id_form_val;
    }

    return voyage;
}

/**
 *
 * @param response
 */
function add_voyage_callback(response) {
    console.log('add_voyage_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyage added');
        refresh_voyages_table();
        set_current_voyage(response.data.added_voyage_id);
    } else {
        set_status_bar('danger', 'failed to add voyage');
    }
}

/**
 *
 */
function add_voyage() {
    console.log('add_voyage()');
    send_request('voyages/add', 'POST', {new_voyage: get_voyage_form_data()},
        add_voyage_callback);
}

/**
 *
 * @param response
 */
function modify_voyage_callback(response) {
    console.log('modify_voyage_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyage modified');
        refresh_voyages_table();
        set_current_voyage(response.data.modified_voyage_id);
    } else {
        set_status_bar('danger', 'failed to modify voyage');
    }
}

/**
 *
 */
function modify_voyage() {
    console.log('modify_voyage()');
    var modified_voyage = get_voyage_form_data();
    if (modified_voyage !== {}) {
        send_request('voyages/modify', 'POST', {modified_voyage: modified_voyage},
            modify_voyage_callback);
    } else {
        console.log('failed to get voyage from form data');
    }
}

function delete_voyage_callback(response) {
    console.log('delete_voyage_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyage deleted');
        refresh_voyages_table();
        set_current_voyage({});
    } else {
        set_status_bar('danger', 'failed to delete voyage');
    }
}

/**
 *
 */
function delete_voyage_btn_click() {
    console.log('delete_voyage_btn_click()');
    var voy_to_delete = get_voyage_form_data();
    if (voy_to_delete !== {}) {
        send_request('voyages/delete', 'POST', {del_voyage: voy_to_delete},
            delete_voyage_callback);
    }
}
