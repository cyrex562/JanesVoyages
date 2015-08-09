function on_settings_retrieved(response) {
    console.log('on settings retrieved: response: %s', response);
}

function export_json_btn_click() {
    console.log('export json btn click');
    //send_request('dataset/get', 'POST', {}, on_settings_retrieved);

    //$.ajax({
    //    type: 'POST',
    //    url: $SCRIPT_ROOT + "/" + dataset/get,
    //    data: JSON.stringify({action: action, params: {}},
    //        null, '\t'),
    //    contentType: "application/download; charset=UTF-8",
    //    success: on_settings_retrieved,
    //    error: function (request, status, error) {
    //        console.log("AJAX request failed: action: {0}, " +
    //            "request_data: {1}, callback: {2}, status: {3}, request: " +
    //            "{4}, error: {5}", action, request_data, on_settings_retrieved, status,
    //            request, error);
    //    }
    //});
    document.location = $SCRIPT_ROOT + "/dataset/get";
}

$(document).ready(function() {
    $('#export_json_btn').click(export_json_btn_click);
});
