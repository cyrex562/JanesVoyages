

$(document).ready(function() {
    clear_trade_form(true);
    refresh_trades_table();
    $('#modify_trade_btn').click(modify_trade);
    $('#delete_trade_btn').click(delete_trade);
    $('#reset_trade_form_btn').click(reset_trade_form_btn_click);
    /* disable add trade button for now, we still need a way to tie new trades to voyages and waypoints */
    $('#add_trade_btn').prop('disabled', true);
});