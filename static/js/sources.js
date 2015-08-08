/**
 * Created by cyrex_000 on 30-May-15.
 */

function get_source_from_form() {
    console.log("get_source_from_form");
    return {
        source_id: $('#source_id').text(),
        source_citation: $('#source_citation').val(),
        source_notes: $('#source_notes').val().trim(),
        voyage_id: $('#voyage_id').text()
    };
}

function fill_source_form(in_source) {
    console.log("fill_source_form()");
    $('#source_id').text(in_source.source_id);
    $('#source_id_form_group').show();
    $('#source_citation').val(in_source.source_citation);
    $('#source_notes').val(in_source.source_notes);
    $('#source_voyage_id').val(in_source.voyage_id);
}

function gen_source_option(source, selected_source_id) {
    console.log('get_source_option');
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
    console.log('reset_sources_list');
    var sources_list = $('#sources');
    sources_list.empty();
    sources_list.append('<option id="select_source">Select a source...</option>');
}

function refresh_sources_list_callback(response) {
    console.log('refresh_sources_list_callback()');
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
    console.log("hide_source_form");
    $('#sources_sub_form').collapse('hide');
    $('#source_id_form_group').hide();
}

function show_source_form() {
    console.log('show_source_form');
    $('#sources_sub_form').collapse('show');
}

function refresh_sources_list(in_voyage_id) {
    console.log('refresh_sources_list');
    //send_request('sources/get', 'POST', {voayge_id: in_voyage_id}, get_sources_for_voyage_cb);
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
    send_request('sources/get', 'POST', {voyage_id: voyage_id}, get_sources_for_voyage_cb);
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
    return $('#sources').val();
}

function add_source_callback(response) {
    console.log('add source callback, response=' + response.toString());
    if (response.message === 'success') {
        //var added_source_id = response.data.added_source_ids[0];
        set_status_bar('success', 'source added');
        var current_voyage_id = $('#voyage_id').text();
        refresh_sources_list(current_voyage_id);
    } else {
        set_status_bar('danger', 'failed to add source');
    }
}

/**
 *
 */
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
        refresh_sources_list(current_voyage_id);
        clear_source_form(false);
    } else {
        set_status_bar('danger', 'failed to modify source');
    }
}

function modify_source() {
    console.log('modify_source');
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
        refresh_sources_list(current_voyage_id);
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