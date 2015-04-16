// jsglobal curr_trade
// jsglboal curr_waypoint

/**
 *
 * @returns {number}
 */
function get_trade_id() {
    console.log('get_trade_id()');
    return Date.now();
}

/**
 *
 */
function update_curr_trade_from_form() {
    console.log('udpate_curr_trade_from_form()');
    curr_trade.trade_id = parseInt($('#trade_id').text());
    curr_trade.trade_bought_sold = 'bought';
    if ($('.trade_bought_sold').val() === 'sold') {
        curr_trade.trade_bought_sold = 'sold';
    }
    curr_trade.trade_item = $('#trade_item').val();
    curr_trade.trade_quantity = parseInt($('#trade_quantity').val());
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
 */
function refresh_trades_list() {
    console.log('refresh_trades_list()');
    var trades_list = $('#trades');
    trades_list.empty();
    for (var i = 0; i < curr_waypoint.trades.length; i++) {
        trades_list.append(gen_trade_option(curr_waypoint.trades[i]));
    }
}

/**
 *
 */
function add_trade_btn_click() {
    console.log('add_trade_btn_click()');
    update_curr_trade_from_form();
    curr_trade.trade_id = get_trade_id();
    curr_waypoint.trades.push(JSON.parse(JSON.stringify(curr_trade)));
    refresh_trades_list();
}

/**
 *
 */
function trade_select_change() {
    console.log('trade_select_change()');
    var sel_trade_id = parseInt($('#trades').find('option:selected').attr('value'));
    for (var i = 0; i < curr_waypoint.trades.length; i++) {
        if (curr_waypoint.trades[i].trade_id === sel_trade_id) {
            curr_trade = curr_waypoint.trades[i];
            fill_trade_form();
            break;
        }
    }
}

/**
 *
 */
function modify_trade_btn_click() {
    console.log('modify_trade_btn_click()');
    update_curr_trade_from_form();
    for (var i = 0; i < curr_waypoint.trades.length; i++) {
        if (curr_waypoint.trades[i].trade_id === curr_trade.trade_id) {
            curr_waypoint.trades[i] = JSON.parse(JSON.stringify(curr_trade));
            refresh_trades_list();
            break;
        }
    }
}

/**
 *
 */
function delete_trade_btn_click() {
    console.log('delete_trade_btn_click()');
    update_curr_trade_from_form();
    var trades_index = -1;
    for (var i = 0; i < curr_waypoint.trades.length; i++) {
        if (curr_waypoint.trades[i].trade_id === curr_trade.trade_id) {
            trades_index = i;
            break;
        }
    }

    if (trades_index >= 0) {
        curr_waypoint.trades.slice(trades_index, 1);
        refresh_trades_list();
    }
}
