function get_event_from_form() {
    console.log("get_event_from_form");
    return {
        event_id: $('#event_id').text(),
        event_name: $('#event_name').val(),
        waypoint_id: $('#waypoint_id').text(),
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

function fill_event_form(in_event) {
    console.log('fill_event_form');
    $('#event_id').text(in_event.event_id);
    $('#event_id_form_group').show();
    $('#event_name').val(in_event.event_name);
    $('#event_waypoint_id').text(in_event.waypoint_id);
    $('#event_notes').val(in_event.event_notes);
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
    return $('#events').val();
}

function add_event_cb(response) {
    console.log("add_event_cb");
    if (response.message === 'success') {
        var added_event_id = response.data.added_event_ids[0];
        var current_waypoint_id = $('#waypoint_id').text();
        set_status_bar('success', 'event added');
        //refresh_event_list(current_waypoint_id);
        get_events_for_waypoint(current_waypoint_id);
        //set_selected_event(added_event_id);
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
        var modified_event_id = response.data.modified_event_ids[0];
        var current_waypoint_id = $('#waypoint_id').text();
        set_status_bar('success', 'event modified');
        get_events_for_waypoint(current_waypoint_id);
        //set_selected_event(modified_event_id);
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
        get_events_for_waypoint(current_waypoint_id);
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

