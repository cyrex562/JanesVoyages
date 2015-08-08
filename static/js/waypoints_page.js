$(document).ready(function() {
    clear_waypoint_form(true);
    refresh_waypoints_table();
    $('#modify_waypoint_btn').click(modify_waypoint);
    $('#delete_waypoint_btn').click(delete_waypoint);
    $('#reset_waypoint_form_btn').click(reset_waypoint_form_btn_click);
    /* disable add trade button for now, we still need a way to tie new trades to voyages and waypoints */
    $('#add_trade_btn').prop('disabled', true);
});
