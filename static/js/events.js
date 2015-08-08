function get_event_from_form() {
    console.log("get_event_from_form");
    var waypoint_id = $('#waypoint_id').text();
    if (waypoint_id == undefined || waypoint_id == '') {
        waypoint_id = $('#event_waypoint_id').val();
    }

    var voyage_id = $('#voyage_id').text();
    if (voyage_id == undefined || voyage_id == '') {
        voyage_id = $('#event_voyage_id').val();
    }

    return {
        event_id: $('#event_id').text(),
        event_name: $('#event_name').val(),
        waypoint_id: waypoint_id,
        voyage_id: voyage_id,
        event_notes: $('#event_notes').val().trim()
    }
}

function hide_event_form() {
    console.log('hide_event_form');
    $('#event_id_form_group').hide();
    $('#event_sub_form').collapse('hide');
}

function show_event_form() {
    console.log('show_event_form');
    $('#event_sub_form').collapse('show');
}

function fill_event_form(response) {
    console.log('fill_event_form');

    var in_event = response;
    if ('data' in response) {
        in_event = response.data.found_events[0];
    }

    $('#event_id').text(in_event.event_id);
    $('#event_id_form_group').show();
    $('#event_name').val(in_event.event_name);
    $('#event_waypoint_id').val(in_event.waypoint_id);
    $('#event_voyage_id').val(in_event.voyage_id);
    $('#event_notes').val(in_event.event_notes);
}

function gen_event_row(event) {
    console.log('gen_event_row, event=%s', JSON.stringify(event));
    var row = '<tr class="event_row">' +
        '<td class="event_id_cell" data-toggle="tooltip" title="[event_id]">[event_id_brief]...</td>' +
        '<td data-toggle="tooltip" title="[waypoint_id]">[waypoint_id_brief]...</td>' +
        '<td data-toggle="tooltip" title="[voyage_id]">[voyage_id_brief]...</td>' +
        '<td>[event_name]</td>' +
        '<td>[event_notes]</td>';
    row = row.replace(/\[event_id\]/g, event.event_id);
    row = row.replace(/\[event_id_brief\]/g, event.event_id.substring(0,4));
    row = row.replace(/\[waypoint_id\]/g, event.waypoint_id);
    row = row.replace(/\[waypoint_id_brief\]/g, event.waypoint_id.substring(0,4));
    row = row.replace(/\[voyage_id\]/g, event.voyage_id);
    row = row.replace(/\[voyage_id_brief\]/g, event.voyage_id.substring(0,4));
    row = row.replace(/\[event_name\]/g, event.event_name);
    return row;
}

function event_row_click() {
    console.log('event row click');
    var event_id = $(this).find('.event_id_cell').attr('title');
    get_event_by_id(event_id, fill_event_form);
}

function populate_events_table(response) {
    console.log('populate events table');
    if (response.message === 'success') {
        set_status_bar('success', 'events retrieved');
        var events = response.data.found_events;
        var events_table = $('#events_table');
        events_table.find("tr:gt(0)").remove();
        for (var i = 0; i < events.length; i++) {
            var event_row = gen_event_row(events[i]);
            events_table.append(event_row);
        }
        $('.event_row').click(event_row_click);
    }
}

function refresh_events_table() {
    console.log('refresh_events_table');
    send_request('events/get', 'POST', {"event_ids": []}, populate_events_table);
}

function gen_event_option(in_event) {
    console.log('gen_event_option()');
    var event_option = '<option value="[event_id]">[event_name]</option>';
    event_option = event_option.replace(/\[event_id]/g, in_event.event_id);
    event_option = event_option.replace(/\[event_name]/g, in_event.event_name);
    return event_option;
}

function refresh_event_list_cb(response) {
    console.log('refresh_event_list_cb');
    var event_list = $('#events');
    if (response.message === 'success') {
        set_status_bar('success', 'events retrieved');
        var events = response.data.found_events;
        event_list.empty();
        event_list.append('<option id="select event">Select an event...</option>');
        for (var i = 0; i < events.length; i++) {
            var event_option = gen_event_option(events[i]);
            event_list.append(event_option);
        }
    } else {
        set_status_bar('danger', 'failed to get events');
    }
}

function refresh_event_list(in_waypoint_id) {
    console.log('refresh_event_list');
    send_request('events/get', 'POST', {waypoint_id: in_waypoint_id});
}

function get_events_for_waypoint_cb(response) {
    console.log('get_events_for_waypoint_cb');
    if (response.message === 'success') {
        set_status_bar('success', 'events retrieved for waypoint');
        refresh_event_list_cb(response);
    } else {
        set_status_bar('danger', 'failed to get events for waypoint');
    }
}

function get_events_for_waypoint(waypoint_id) {
    console.log('get_events_for_waypoint');
    send_request('events/get', 'POST', {waypoint_id: waypoint_id}, get_events_for_waypoint_cb);
}

function event_select_change_cb(response) {
    console.log('event_select_change_cb');
    if (response.message === 'success') {
        var found_event = response.data.found_events[0];
        fill_event_form(found_event);
        set_status_bar('success', 'event selection changed');
    } else {
        set_status_bar('danger', 'failed to change event selection');
    }
}

function event_select_change() {
    console.log('event_select_change');
    var selected_event_id = $('#events').val();
    if (selected_event_id.indexOf("Select") === -1) {
        send_request('events/get', 'POST', {event_ids: [selected_event_id]},
            event_select_change_cb);
    } else {
        clear_event_form(false);
    }
}

function set_selected_event(event_id) {
    console.log('set_selected_event');
    var event_list = $('#events');
    event_list.val('');
    event_list.val(event_id);
}

function get_selected_event_id() {
    console.log('get_selected_event_id');
    var selected_event_id = $('#events').val();
    if (selected_event_id === undefined || selected_event_id === '') {
        selected_event_id = $('#event_id').text();
    }
    return selected_event_id;
}

function add_event_cb(response) {
    console.log("add_event_cb");
    if (response.message === 'success') {
        var current_waypoint_id = $('#waypoint_id').text();
        set_status_bar('success', 'event added');
        get_events_for_waypoint(current_waypoint_id);
    } else {
        set_status_bar('danger', 'event not added');
    }
}

function add_event() {
    console.log('add_event');
    var events_to_add = [get_event_from_form()];
    send_request('events/add', 'POST', {events_to_add: events_to_add}, add_event_cb);
}

function modify_event_cb(response) {
    console.log("add_event_cb");
    if (response.message === 'success') {
        var current_waypoint_id = $('#waypoint_id').text();
        set_status_bar('success', 'event modified');
        if ($('#events_table').length === 0) {
            get_events_for_waypoint(current_waypoint_id);
        } else {
            refresh_events_table();
        }
        clear_event_form(false);
    } else {
        set_status_bar('danger', 'event not modified');
    }
}

function modify_event() {
    console.log('modify_event');
    var events_to_modify = [get_event_from_form()];
    send_request('events/modify', 'POST', {events_to_modify: events_to_modify}, modify_event_cb);
}

function delete_event_cb(response) {
    console.log('delete_event_cb');
    if (response.message === 'success') {
        set_status_bar('success', 'event deleted');
        var current_waypoint_id = $('#waypoint_id').text();
        if ($('#events_table').length === 0) {
            get_events_for_waypoint(current_waypoint_id);
        } else {
            refresh_events_table();
        }
        clear_event_form(false);
    } else {
        set_status_bar('danger', 'event not deleted');
    }
}

function delete_event() {
    console.log('delete_event');
    var events_to_delete = [get_selected_event_id()];
    send_request('events/delete', 'POST', {events_to_delete: events_to_delete}, delete_event_cb);
}

function get_event_by_id(event_id, cb) {
    console.log('get_event_by_id, event_id = %s', event_id);
    var event_ids = [event_id];
    send_request('events/get', 'POST', {event_ids: event_ids}, cb);
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



