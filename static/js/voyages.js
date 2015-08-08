/**
 *
 * @param response
 */
function fill_voyage_form(response) {
    console.log('fill_voyage_form()');
    if (response.message === 'success') {
        /** @namespace response.data.voyages */
        var found_voyages = response.data.found_voyages;
        if (found_voyages.length === 1) {
            var curr_voyage = found_voyages[0];
            console.log('current_voyage = %s', JSON.stringify(curr_voyage));
            /** @namespace curr_voyage.voyage_name */
            $('#voyage_name').val(curr_voyage.voyage_name);
            /** @namespace curr_voyage.voyage_id */
            $('#voyage_id').text(curr_voyage.voyage_id);
            $('#voyage_id_form_group').show();
            $('#voyage_id_form_group').removeClass('hide');
            /** @namespace curr_voyage.voyage_notes */
            $('#voyage_notes').val(curr_voyage.voyage_notes);
            /** @namespace curr_voyage.ship_name */
            $('#ship_name').val(curr_voyage.ship_name);
            /** @namespace curr_voyage.ship_captain */
            $('#ship_captain').val(curr_voyage.ship_captain);
            /** @namespace curr_voyage.ship_flag */
            $('#ship_flag').val(curr_voyage.ship_flag);
            /** @namespace curr_voyage.ship_notes */
            $('#ship_notes').val(curr_voyage.ship_notes);
            get_waypoints_for_voyage(curr_voyage.voyage_id);
            get_sources_for_voyage(curr_voyage.voyage_id);
        } else {
            console.log('bad found_voyages length: ' + found_voyages.length);
        }
    } else {
        set_status_bar('danger', 'failed to find voyage');
    }
}

function get_voyage_by_id(voyage_id, callback) {
    console.log('get_voyage_by_id()');
    var voyage_ids = [voyage_id];
    send_request('voyages/get', 'POST', {voyage_ids: voyage_ids},
        callback);
}

function set_current_voyage(voyage_id) {
    console.log('set_current_voyage()');
    /* get the voyage */
    get_voyage_by_id(voyage_id, fill_voyage_form);
}

function gen_voyage_row(voyage) {
    console.log('gen_voyage_row()');
    var voyage_row = '' +
        '<tr class="voyage_row">' +
        '<td class="voyage_id_cell" data-toggle="tooltip" title="[voyage_id]">[voyage_id_brief]...</td>' +
        '<td class="voyage_name_cell">[voyage_name]</td>' +
        '<td class="ship_name_cell">[ship_name]</td>' +
        '<td class="ship_captain_cell">[ship_captain]</td>' +
        '<td class="ship_flag_cell">[ship_flag]</td>' +
        '<td class="waypoint_count_cell">[waypoint_count]</td>' +
        '</tr>';
    voyage_row = voyage_row.replace(/\[voyage_id\]/g, voyage.voyage_id);
    voyage_row = voyage_row.replace(/\[voyage_id_brief\]/g, voyage.voyage_id.substring(0,4));
    voyage_row = voyage_row.replace(/\[voyage_name\]/g, voyage.voyage_name);
    voyage_row = voyage_row.replace(/\[ship_name\]/g, voyage.ship_name);
    voyage_row = voyage_row.replace(/\[ship_captain\]/g, voyage.ship_captain);
    voyage_row = voyage_row.replace(/\[ship_flag]/g, voyage.ship_flag);
    voyage_row = voyage_row.replace(/\[waypoint_count]/g, voyage.waypoint_count);
    return voyage_row;
}

function populate_voyages_table(response) {
    console.log('populate_voyages_table()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyages retrieved');
        /** @namespace response.data.found_voyages */
        var voyages = response.data.found_voyages;
        var voyages_table = $('#voyages_table');
        voyages_table.find("tr:gt(0)").remove();
        for (var i = 0; i < voyages.length; i++) {
            var voyage_row = gen_voyage_row(voyages[i]);
            voyages_table.append(voyage_row);
        }
        $('.voyage_row').click(voyage_row_click);
    }
}

function voyage_row_click() {
    console.log('voyage_row_click()');
    var voyage_id = $(this).find('.voyage_id_cell').attr('title');
    set_current_voyage(voyage_id)
}

/**
 *
 */
function refresh_voyages_table() {
    console.log('refresh_voyages_table()');
    send_request('voyages/get', 'POST', {voyage_ids: []},
        populate_voyages_table);
}

/**
 *
 * @returns {{voyage_id: (*|jQuery), voyage_name: (*|jQuery), voyage_notes: (*|jQuery), ship_name: (*|jQuery), ship_captain: (*|jQuery), ship_flag: (*|jQuery), ship_notes: (*|jQuery)}}
 */
function get_voyage_form_data() {
    console.log('get_voyage_form_data()');
    var voyage = {
        voyage_id: $('#voyage_id').text(),
        voyage_name: $('#voyage_name').val(),
        voyage_notes: $('#voyage_notes').val().trim(),
        ship_name: $('#ship_name').val(),
        ship_captain: $('#ship_captain').val(),
        ship_flag: $('#ship_flag').val(),
        ship_notes: $('#ship_notes').val().trim()
    };
    console.log('get_voyage_form_data(): voyage: ' + voyage);
    return voyage;
}

function add_voyage_callback(response) {
    console.log('add_voyage_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyage added');
        refresh_voyages_table();
        set_current_voyage(response.data.added_voyage_ids[0]);
    } else {
        set_status_bar('danger', 'failed to add voyage');
    }
}

function add_voyage() {
    console.log('add_voyage()');
    var voyages_to_add = [];
    var voyage_to_add = get_voyage_form_data();
    voyages_to_add.push(voyage_to_add);
    send_request('voyages/add', 'POST', {voyages_to_add: voyages_to_add},
        add_voyage_callback);
}

function modify_voyage_callback(response) {
    console.log('modify_voyage_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyage modified');
        refresh_voyages_table();
        /** @namespace response.data.modified_voyage_ids */
        set_current_voyage(response.data.modified_voyage_ids[0]);
    } else {
        set_status_bar('danger', 'failed to modify voyage');
    }
}

function modify_voyage() {
    console.log('modify_voyage()');
    var voyage_to_modify = get_voyage_form_data();
    var voyages_to_modify = [];
    voyages_to_modify.push(voyage_to_modify);
    send_request('voyages/modify', 'POST',
        {voyages_to_modify: voyages_to_modify}, modify_voyage_callback);
}

function delete_voyage_callback(response) {
    console.log('delete_voyage_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'voyage deleted');
        refresh_voyages_table();
        //set_current_voyage({});
        clear_voyage_form();
    } else {
        set_status_bar('danger', 'failed to delete voyage');
    }
}

function delete_voyage_btn_click() {
    console.log('delete_voyage_btn_click()');
    var voyage_to_delete = get_voyage_form_data();
    var voyages_to_delete = [];
    voyages_to_delete.push(voyage_to_delete);
    send_request('voyages/delete', 'POST',
        {voyages_to_delete: voyages_to_delete}, delete_voyage_callback);
}
