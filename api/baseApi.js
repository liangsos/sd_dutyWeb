const baseUrl = "http://localhost:8088/sd-duty/api/";
// const baseUrl = "http://10.37.1.79:9003/sd-duty/api/";
const sxxUrl = "http://10.37.1.155:9001/sd-api/";
const rainUrl = "http://10.37.1.155:9001/sd-api/rs/";
$(document).ajaxError(function (event, request, settings) {
    // console.log(request.status);
    if (request.status == 401) {
        window.parent.toLogin();
        // window.location.replace("/page/DutyLogin.html");
    }
});
