/**
 *
 */
function get_trade_from_form() {
    console.log('get_trade_from_form()');
    return {
        trade_id: $('#trade_id').text(),
        trade_bought_sold: $('.trade_bought_sold').val(),
        trade_item: $('#trade_item').val(),
        trade_quantity: parseInt($('#trade_quantity').val()),
        //waypoint_id: $('#trade_waypoint_id').text()
        waypoint_id: $('#waypoint_id').text()
    }
}

function hide_trade_form() {
    console.log('hide_trade_form()');
    $('#trade_sub_form').collapse('hide');
}

function show_trade_form() {
    console.log('show_trade_form()');
    $('#trade_sub_form').collapse('show');
}

function fill_trade_form(in_trade) {
    console.log('fill_trade_form()');
    $('#trade_id').text(in_trade.trade_id);
    $('#trade_item').val(in_trade.trade_item);
    $('#trade_quantity').val(parseInt(in_trade.trade_quantity));
    console.log('fill_trade_form, in_trade.trade_bought_sold="'
        + in_trade.trade_bought_sold + '"');32
    $('input[type="radio"][name=trade_bought_sold][value=' + in_trade.trade_bought_sold + ']').prop('checked', true);
    //$('.trade_bought_sold').val(in_trade.trade_bought_sold);
    $('#trade_waypoint_id').text(in_trade.waypoint_id);
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

function refresh_trades_list_cb(response) {
    console.log('refresh_trades_list_cb()');
    var trades_list = $('#trades');
    if (response.message === 'success') {
        set_status_bar('success', 'trades retrieved');
        var trades = response.data.found_trades;
        trades_list.empty();
        trades_list.append('<option id=select_trade>Select A Trade...</trade>');
        for (var i = 0; i < trades.length; i++) {
            var trade_option = gen_trade_option(trades[i]);
            trades_list.append(trade_option);
        }
    } else {
        set_status_bar('danger', 'failed to get trades');
    }
}

function refresh_trades_list(in_trade_id) {
    console.log('refresh_trades_list()');
    var trade_list_ids = [];
    if (in_trade_id !== null) {
        trade_list_ids.push(in_trade_id);
    }
    $('#trades').each(function () {
        trade_list_ids.push($(this).val());
    });
    send_request('trades/get', 'POST', {trade_ids: trade_list_ids},
        refresh_trades_list_cb);
}

function get_trades_for_waypoint_cb(response) {
    console.log('get_trades_for_waypoint_cb()');
    if (response.message === 'success') {
        refresh_trades_list_cb(response);
    } else {
        console.log('danger', 'failed to get trades for waypoint');
    }
}

function get_trades_for_waypoint(waypoint_id) {
    console.log('get_trades_for_waypoint()');
    send_request('trades/get', 'POST', {waypoint_id: waypoint_id},
        get_trades_for_waypoint_cb);
}

function trade_select_change_cb(response) {
    console.log('trade_select_change_cb()');
    if (response.message === 'success') {
        var found_trade = response.data.found_trades[0];
        console.log('trade retrieved, ', found_trade);
        fill_trade_form(found_trade);
    } else {
        console.log('failed to get trade');
    }
}

function trade_select_change() {
    console.log('trade_select_change()');
    var selected_trade_id = $('#trades').val();
    if (selected_trade_id.indexOf("select") == -1) {
        send_request('trades/get', 'POST', {trade_ids: [selected_trade_id]},
            trade_select_change_cb);
    }
}

function set_selected_trade(trade_id) {
    console.log('set_selected_trade()');
    var trade_list = $('#trades');
    trade_list.val('');
    trade_list.val(trade_id);
}

function get_selected_trade() {
    console.log('get_selected_trade()');
    return $('#trades').val();
}

function add_trade_callback(response) {
    console.log('add_trade_callback()');
    if (response.message === 'success') {
        var added_trade_id = response.data.added_trade_ids[0];
        set_status_bar('success', 'trade added');
        refresh_trades_list(added_trade_id);
        set_selected_trade(added_trade_id);
    } else {
        set_status_bar('danger', 'failed to add trade');
    }
}

function add_trade() {
    console.log('add_trade())');
    var trade_to_add = get_trade_from_form();
    var trades_to_add = [];
    trades_to_add.push(trade_to_add);
    send_request('trades/add', 'POST', {trades_to_add: trades_to_add},
        add_trade_callback);
}

function modify_trade_callback(response) {
    console.log('modify_trade_callback()');
    if (resposne.message === 'success') {
        set_status_bar('success', 'trade modified');
        var modified_trade_id = response.data.modified_trade_ids[0];
        refresh_trades_list(modified_trade_id);
        set_selected_trade(modified_trade_id);
    } else {
        set_status_bar('danger', 'trade not modified');
    }
}

function modify_trade() {
    console.log('modify_trade_btn_click()');
    var trade_to_modify = get_trade_from_form();
    var trades_to_modify = [];
    trade_to_modify.push(trade_to_modify);
    send_request('trades/modify', 'POST', {trades_to_modify: trades_to_modify},
        modify_trade_callback);
}

function delete_trade_callback(response) {
    console.log('delete_trade_callback()');
    if (response.message === 'success') {
        set_status_bar('success', 'trade deleted');
        var deleted_trade_id = response.data.deleted_trades[0];
        refresh_trades_list(deleted_trade_id);
        set_selected_trade(deleted_trade_id);
    } else {
        set_status_bar('danger', 'trade not deleted');
    }
}

function delete_trade() {
    console.log('delete_trade()');
    var selected_trade_id = get_selected_trade().trade_id;
    var trades_to_delete = [];
    trades_to_delete.push(selected_trade_id);
    send_request('trades/delete', 'POST',
        {trades_to_delete: trades_to_delete}, delete_trade_callback);
}
