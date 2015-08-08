$(document).ready(function() {
    clear_event_form(true);
    refresh_events_table();
    $('#modify_event_btn').click(modify_event);
    $('#delete_event_btn').click(delete_event);
    $('#reset_event_form_btn').click(reset_trade_form_btn_click);
    /* disable add event button for now, we still need a way to tie new trades to voyages and waypoints */
    $('#add_event_btn').prop('disabled', true);
});
