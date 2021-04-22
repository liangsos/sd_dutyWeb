const baseUrl = "http://localhost:8088/sd-duty/api/";
// const baseUrl = "http://10.37.1.17:9003/sd-duty/api/";
const sxxUrl = "http://10.37.1.17:9001/sd-api/";
const rainUrl = "http://10.37.1.17:8081/webservice_shandong/rs/get_Real_Rain";
$(document).ajaxError(function (event, request, settings) {
    // console.log(request.status);
    if (request.status == 401) {
        window.parent.toLogin();
        // window.location.replace("/page/DutyLogin.html");
    }
});
