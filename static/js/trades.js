/**
 *
 */
function get_trade_from_form() {
    console.log('get_trade_from_form()');
    var bought_sold = $("input:radio[name='trade_bought_sold']:checked").val();
    console.log('get_Trade_from_form(), trade_bought_sold=', bought_sold);
    var waypoint_id = $('#waypoint_id').text();
    if (waypoint_id === undefined || waypoint_id === '') {
        waypoint_id = $('#trade_waypoint_id').val();
    }
    return {
        trade_id: $('#trade_id').text(),
        trade_bought_sold: bought_sold,
        trade_item: $('#trade_item').val(),
        trade_quantity: parseInt($('#trade_quantity').val()),
        waypoint_id: waypoint_id,
        trade_notes: $('#trade_notes').val().trim()
    }
}

function hide_trade_form() {
    console.log('hide_trade_form()');
    $('#trade_id_form_group').hide();
    $('#trade_sub_form').collapse('hide');

}

function show_trade_form() {
    console.log('show_trade_form()');
    $('#trade_sub_form').collapse('show');
}

function fill_trade_form(response) {
    console.log('fill_trade_form: in_trade: %s', JSON.stringify(response));
    var in_trade = response;
    if ('data' in response) {
        in_trade = response.data.found_trades[0];
    }

    $('#trade_id').text(in_trade.trade_id);
    $('#trade_id_form_group').show();
    $('#trade_item').val(in_trade.trade_item);
    $('#trade_quantity').val(parseInt(in_trade.trade_quantity));
    console.log('fill_trade_form, in_trade.trade_bought_sold="'
        + in_trade.trade_bought_sold + '"');
    $('input[type="radio"][name=trade_bought_sold][value=' +
        in_trade.trade_bought_sold + ']').prop('checked', true);
    //$('.trade_bought_sold').val(in_trade.trade_bought_sold);
    $('#trade_waypoint_id').val(in_trade.waypoint_id);
    $('#trade_notes').val(in_trade.trade_notes);
}

/**
 *
 * @param trade
 */
function gen_trade_option(trade) {
    console.log('gen_trade_option()');
    var trade_option = '<option value="[trade_id]">[trade_bought_sold] ' +
        '[trade_item] [trade_quantity]</option>';
    trade_option = trade_option.replace(/\[trade_id\]/g, trade.trade_id);
    trade_option = trade_option.replace(/\[trade_bought_sold\]/g,
        trade.trade_bought_sold);
    trade_option = trade_option.replace(/\[trade_item\]/g, trade.trade_item);
    trade_option = trade_option.replace(/\[trade_quantity\]/g,
        trade.trade_quantity);
    return trade_option;
}

/**
 *
 * @param response
 */
function refresh_trades_list_cb(response) {
    console.log('refresh_trades_list_cb()');
    var trades_list = $('#trades');
    if (response.message === 'success') {
        set_status_bar('success', 'trades retrieved');
        var trades = response.data.found_trades;
        trades_list.empty();
        trades_list.append('<option id="select_trade">Select A Trade...</option>');
        for (var i = 0; i < trades.length; i++) {
            var trade_option = gen_trade_option(trades[i]);
            trades_list.append(trade_option);
        }
    } else {
        set_status_bar('danger', 'failed to get trades');
    }
}

/**
 *
 * @param in_waypoint_id
 */
function refresh_trades_list(in_waypoint_id) {
    console.log('refresh_trades_list()');
    send_request('trades/get', 'POST', {waypoint_id: in_waypoint_id},
        refresh_trades_list_cb);
}

/**
 *
 * @param response
 */
function get_trades_for_waypoint_cb(response) {
    console.log('get_trades_for_waypoint_cb()');
    if (response.message === 'success') {
        set_status_bar('success', 'trades retrieved for waypoint');
        refresh_trades_list_cb(response);
    } else {
        console.log('danger', 'failed to get trades for waypoint');
        set_status_bar('danger', 'failed to get trades for waypoint');
    }
}

function get_trades_for_waypoint(waypoint_id) {
    console.log('get_trades_for_waypoint()');
    send_request('trades/get', 'POST', {waypoint_id: waypoint_id},
        get_trades_for_waypoint_cb);
}

/**
 *
 * @param response
 */
function trade_select_change_cb(response) {
    console.log('trade_select_change_cb()');
    if (response.message === 'success') {
        var found_trade = response.data.found_trades[0];
        console.log('trade retrieved, ', found_trade);
        fill_trade_form(found_trade);
        set_status_bar("success", "trade selection changed");
    } else {
        console.log('failed to get trade');
        set_status_bar("danger", "failed to change trade selection");
    }
}

function trade_select_change() {
    console.log('trade_select_change()');
    var selected_trade_id = $('#trades').val();
    if (selected_trade_id.indexOf("Select") == -1) {
        send_request('trades/get', 'POST', {trade_ids: [selected_trade_id]},
            trade_select_change_cb);
    } else {
        clear_trade_form(false);
    }
}

function set_selected_trade(trade_id) {
    console.log('set_selected_trade()');
    var trade_list = $('#trades');
    trade_list.val('');
    trade_list.val(trade_id);
}

function gen_trade_row(trade) {
    console.log('gen_trade_row, trade = %s', JSON.stringify(trade));
    var row =
        "<tr class=\"trade_row\">" +
        "<td class=\"trade_id_cell\" data-toggle=\"tooltip\" title=\"[trade_id]\">[trade_id_brief]...</td>" +
        "<td data-toggle=\"tooltip\" title=\"[voyage_id]\">[voyage_id_brief]...</td>" +
        "<td data-toggle=\"tooltip\" title=\"[waypoint_id]\">[waypoint_id_brief]...</td>" +
        "<td>[trade_type]</td>" +
        "<td>[trade_qty]</td>" +
        "<td>[trade_item]</td>" +
        "</tr>";

    row = row.replace(/\[trade_id]/g, trade.trade_id);
    row = row.replace(/\[trade_id_brief]/g, trade.trade_id.substring(0,4));
    row = row.replace(/\[voyage_id]/g, trade.voyage_id);
    row = row.replace(/\[voyage_id_brief]/g, trade.voyage_id.substring(0,4));
    row = row.replace(/\[waypoint_id]/g, trade.waypoint_id);
    row = row.replace(/\[waypoint_id_brief]/g, trade.waypoint_id.substring(0,4));
    row = row.replace(/\[trade_type]/g, trade.trade_bought_sold);
    row = row.replace(/\[trade_qty]/g, trade.trade_quantity);
    row = row.replace(/\[trade_item]/g, trade.trade_item);
    return row;
}

function populate_trades_table(response) {
    console.log('populate trades table');
    if (response.message === 'success') {
        set_status_bar('success', 'trades retrieved');
        var trades = response.data.found_trades;
        var trades_table2 = $('#trades_table2');
        trades_table2.find("tr:gt(0)").remove();
        for (var i = 0; i < trades.length; i++) {
            var trade_row = gen_trade_row(trades[i]);
            trades_table2.append(trade_row);
        }
        $('.trade_row').click(trade_row_click);
    }
}

function refresh_trades_table() {
    console.log('refresh trades table');
    send_request('trades/get', 'POST', {"trade_ids": []}, populate_trades_table);
}

function trade_row_click() {
    console.log('trade_row_click()');
    var trade_id = $(this).find('.trade_id_cell').attr('title');
    get_trade_by_id(trade_id, fill_trade_form);
}

function reset_trade_form_btn_click() {
    console.log('reset_trade_form_btn_click()');
    clear_trade_form(false);
}

function get_selected_trade_id() {
    console.log('get_selected_trade_id()');
    var selected_trade_id = $('#trades').val();
    if (selected_trade_id === undefined) {
        selected_trade_id = $('#trade_id').text();
    }
    return selected_trade_id;
}

function add_trade_callback(response) {
    console.log('add_trade_callback()');
    if (response.message === 'success') {
        var added_trade_id = response.data.added_trade_ids[0];
        var current_waypoint_id = $('#waypoint_id').text();
        set_status_bar('success', 'trade added');
        refresh_trades_list(current_waypoint_id);
        set_selected_trade(added_trade_id);
    } else {
        set_status_bar('danger', 'failed to add trade');
    }
}

function add_trade() {
    console.log('add_trade())');
    var trade_to_add = get_trade_from_form();
    var trades_to_add = [trade_to_add];
    send_request('trades/add', 'POST', {trades_to_add: trades_to_add},
        add_trade_callback);
}

function modify_trade_callback(response) {
    console.log('modify_trade_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'trade modified');
        //var modified_trade_id = response.data.modified_trade_ids[0];
        var current_waypoint_id = $('#waypoint_id').text();
        if ($('#trades_table2').length === 0) {
            refresh_trades_list(current_waypoint_id);
        } else {
            refresh_trades_table();
        }

        clear_trade_form(false);
    } else {
        set_status_bar('danger', 'trade not modified');
    }
}

function modify_trade() {
    console.log('modify_trade_btn_click()');
    var trade_to_modify = get_trade_from_form();
    var trades_to_modify = [trade_to_modify];
    send_request('trades/modify', 'POST', {trades_to_modify: trades_to_modify},
        modify_trade_callback);
}

function delete_trade_callback(response) {
    console.log('delete_trade_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'trade deleted');
        var current_waypoint_id = $('#waypoint_id').text();
        if ($('#trades_table2').length === 0) {
            refresh_trades_list(current_waypoint_id);
        } else {
            refresh_trades_table();
        }
        clear_trade_form(false);
    } else {
        set_status_bar('danger', 'trade not deleted');
    }
}

function delete_trade() {
    console.log('delete_trade()');
    var selected_trade_id = get_selected_trade_id();
    var trades_to_delete = [];
    trades_to_delete.push(selected_trade_id);
    console.log('trades_to_delete ', trades_to_delete);
    send_request('trades/delete', 'POST',
        {trades_to_delete: trades_to_delete}, delete_trade_callback);
}

function get_trade_by_id(trade_id, callback)
{
    console.log('get_trade_by_id');
    var trade_ids = [trade_id];
    send_request('trades/get', 'POST', {trade_ids: trade_ids}, callback);
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