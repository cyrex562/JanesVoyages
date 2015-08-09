function get_source_from_form() {
    console.log("get source from form");
    var voyage_id = $('#voyage_id').text();
    if (null_or_empty(voyage_id)) {
        voyage_id = $('#source_voyage_id').val();
    }
    return {
        source_id: $('#source_id').text(),
        source_citation: $('#source_citation').val(),
        source_notes: $('#source_notes').val().trim(),
        voyage_id: voyage_id
    };
}

function fill_source_form(response) {
    console.log("fill source form");

    var in_source = response;
    if ('data' in response) {
        in_source = response.data.found_sources[0];
    }

    $('#source_id').text(in_source.source_id);
    $('#source_id_form_group').show();
    $('#source_citation').val(in_source.source_citation);
    $('#source_notes').val(in_source.source_notes);
    $('#source_voyage_id').val(in_source.voyage_id);
}

function gen_source_option(source, selected_source_id) {
    console.log('get source option');
    var source_option = '<option value="[source_id]"[selected]>[source_citation]</option>';
    source_option = source_option.replace(/\[source_id]/g, source.source_id);
    source_option = source_option.replace(/\[source_citation]/g, source.source_citation);
    var selected_val = "";
    if (null !== selected_source_id && source.source_id === selected_source_id) {
        selected_val = " selected";
    }
    source_option = source_option.replace(/\[selected]/g, selected_val);
    return source_option;
}

function reset_sources_list() {
    console.log('reset sources list');
    var sources_list = $('#sources');
    sources_list.empty();
    sources_list.append('<option id="select_source">Select a source...</option>');
}

function refresh_sources_list_callback(response) {
    console.log('refresh sources list callback');
    reset_sources_list();
    var sources_list = $('#sources');
    if (response.message === 'success') {
        set_status_bar('success', 'sources retrieved');
        var sources = response.data.found_sources;
        var source_count = sources.length;
        for (var i = 0; i < source_count; i++) {
            var source_option =  gen_source_option(sources[i], null);
            sources_list.append(source_option);
        }
    } else {
        set_status_bar('danger', 'failed to get sources');
    }
}

function hide_source_form() {
    console.log("hid source form");
    $('#sources_sub_form').collapse('hide');
    $('#source_id_form_group').hide();
}

function show_source_form() {
    console.log('show source form');
    $('#sources_sub_form').collapse('show');
}

function refresh_sources_list(in_voyage_id) {
    console.log('refresh sources list');
    get_sources_for_voyage(in_voyage_id);
}

/**
 *
 * @param response
 */
function get_sources_for_voyage_cb(response) {
    console.log("get sources for voyage cb");
    if (response.message == 'success') {
        refresh_sources_list_callback(response);
        show_source_form();
        set_status_bar('success', 'sources retrieved for voyage');
    } else {
        set_status_bar('danger', 'failed to get sources for voyage');
    }
}

function get_sources_for_voyage(voyage_id) {
    console.log('get sources for voyage');
    send_request('sources/get', 'POST', {voyage_id: voyage_id},
        get_sources_for_voyage_cb);
}

function source_select_change_cb(response) {
    console.log("source select change cb");
    if (response.message === 'success') {
        console.log('source retrieved');
        if (response.data.found_sources.length > 0) {
            var found_source = response.data.found_sources[0];
            fill_source_form(found_source);
        }
        set_status_bar('success', 'source selection changed');
    } else {
        console.log('failed to get source');
        set_status_bar('danger', 'failed to set source selection');
    }
}

function source_select_change() {
    console.log('source select change');
    var selected_source_id = $('#sources').val();
    if (selected_source_id.toLowerCase().indexOf('select') === -1) {
        send_request('sources/get', 'POST', {source_ids: [selected_source_id]},
            source_select_change_cb);
    } else {
        clear_source_form(false);
    }
}

//function set_selected_source(source_id) {
//    console.log('set_selected_source');
//    var source_list = $('#sources');
//    source_list.val(source_id);
//}

function get_selected_source_id() {
    console.log('get selected source id');
    var selected_source_id = $('#sources').val();
    if (null_or_empty(selected_source_id)) {
        selected_source_id = $('#source_id').text();
    }
    return selected_source_id;
}

function add_source_callback(response) {
    console.log('add source callback, response=' + JSON.stringify(response));
    if (response.message === 'success') {
        //var added_source_id = response.data.added_source_ids[0];
        set_status_bar('success', 'source added');
        var current_voyage_id = $('#voyage_id').text();
        refresh_sources_list(current_voyage_id);
    } else {
        set_status_bar('danger', 'failed to add source');
    }
}

function add_source() {
    console.log('add source');
    var source_to_add = get_source_from_form();
    var sources_to_add = [source_to_add];
    console.log('sources_to_add=' + sources_to_add.toString());
    send_request('sources/add', 'POST', {sources_to_add: sources_to_add}, add_source_callback);
}

function modify_source_callback(response) {
    console.log('modify source callback');
    if (response.message === 'success') {
        set_status_bar('success', 'source modified');
        var current_voyage_id = $('#voyage_id').text();
        if ($('#sources_table').length === 0) {
            refresh_sources_list(current_voyage_id);
        } else {
            refresh_sources_table();
        }

        clear_source_form(false);
    } else {
        set_status_bar('danger', 'failed to modify source');
    }
}

function modify_source() {
    console.log('modify source');
    var source_to_modify = get_source_from_form();
    var sources_to_modify = [source_to_modify];
    send_request('sources/modify', 'POST',
        {sources_to_modify: sources_to_modify}, modify_source_callback);
}

function delete_source_callback(response) {
    console.log('delete waypoint callack');
    if (response.message === 'success') {
        set_status_bar('success', 'source deleted');
        var current_voyage_id = $('#voyage_id').text();
        if ($('#sources_table').length === 0) {
            refresh_sources_list(current_voyage_id);
        } else {
            refresh_sources_table();
        }

        clear_source_form(false);
    } else {
        set_status_bar('danger', 'source not deleted');
    }
}

function delete_source() {
    console.log('delete source');
    var selected_source_id = get_selected_source_id();
    var source_ids = [selected_source_id];
    send_request('sources/delete', 'POST', {source_ids: source_ids},
        delete_source_callback);
}

function clear_source_form(clear_list) {
    console.log('clear source form');
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

function get_source_by_id(source_id, callback) {
    console.log('get source by id');
    var source_ids = [source_id];
    send_request('sources/get', 'POST', {source_ids: source_ids}, callback);
}

function gen_source_row(source) {
    console.log('gen source row: source = %s', JSON.stringify(source));
    var row = '<tr class="source_row">' +
        '<td class="source_id_cell" data-toggle="tooltip" ' +
        'title="[source_id]">[source_id_brief]...</td>' +
        '<td data-toggle="tooltip" title="[voyage_id]">[voyage_id_brief]...</td>' +
        '<td>[source_citation]</td>';
    row = row.replace(/\[source_id\]/g, source.source_id);
    row = row.replace(/\[source_id_brief\]/g, source.source_id.substring(0,4));
    row = row.replace(/\[voyage_id\]/g, source.voyage_id);
    row = row.replace(/\[voyage_id_brief\]/g, source.voyage_id.substring(0,4));
    row = row.replace(/\[source_citation\]/g, source.source_citation);
    return row;
}

function source_row_click() {
    console.log('source row click');
    var source_id = $(this).find('.source_id_cell').attr('title');
    get_source_by_id(source_id, fill_source_form);
}

function populate_sources_table(response)
{
    console.log('populate sources table: response = %s', JSON.stringify(response));
    if (response.message === 'success') {
        set_status_bar('success', 'sources retrieved');
        var sources = response.data.found_sources;
        var sources_table = $('#sources_table');
        sources_table.find("tr:gt(0)").remove();
        for (var i = 0; i < sources.length; i++) {
            var source_row = gen_source_row(sources[i]);
            sources_table.append(source_row);
        }
        $('.source_row').click(source_row_click);
    }
}

function refresh_sources_table() {
    console.log('refresh sources table');
    send_request('sources/get', 'POST', {"source_ids": []},
        populate_sources_table);
}