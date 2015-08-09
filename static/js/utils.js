

function send_request(action, request_type, request_data, callback) {
    console.log('send_request, action: %s, request_type: %s, ' +
        'request_data: %s', action, request_type, JSON.stringify(request_data));
    //noinspection JSUnresolvedVariable
    $.ajax({
        type: request_type,
        url: $SCRIPT_ROOT + "/" + action,
        data: JSON.stringify({action: action, params: request_data},
            null, '\t'),
        contentType: "application/json; charset=UTF-8",
        success: callback,
        error: function (request, status, error) {
            console.log("AJAX request failed: action: {0}, " +
                "request_data: {1}, callback: {2}, status: {3}, request: " +
                "{4}, error: {5}", action, request_data, callback, status,
                request, error);
        }
    });
}

function set_status_bar(level, message) {
    var status_bar = $('#status-bar');
    if (parseInt(status_bar.attr('closed')) === 1) {
        status_bar.append('<div class="alert-dismissible alert alert-' + level +
        '" role="alert"><button id="dismiss_alert_btn" type="button" class="close" ' +
        'data-dismiss="alert" aria-lable="Close"><span aria-hidden="true">' +
        '&times;</span></button><div id="status_bar_msg"><p>' + message +
            '</p></div></div>');
        status_bar.attr('closed', "0");
    } else {
        $('#status_bar_msg').append('<p>' + message + '</p>');
    }
    $('#dismiss_alert_btn').click(function() {
        status_bar.empty();
        $('#status-bar').attr("closed", "1");
    });
}



function reset_source_form_btn_click() {
    console.log("reset source form btn click");
    clear_source_form(false);
}

function reset_event_form_btn_click() {
    console.log('reset event form btn click');
    clear_event_form(false);
}

function null_or_empty(v)
{
    if (v === undefined || v.length === 0) {
        return true;
    } else {
        return false;
    }
}