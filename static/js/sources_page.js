$(document).ready(function() {
    clear_source_form(true);
    refresh_sources_table();
    $('#modify_source_btn').click(modify_source);
    $('#delete_source_btn').click(delete_source);
    $('#reset_source_form_btn').click(reset_source_form_btn_click);
    /* disable add source button for now, we still need a way to tie new sources to voyages and waypoints */
    $('#add_source_btn').prop('disabled', true);
});