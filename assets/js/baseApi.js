$.ajaxPrefilter(function(option) {
    var baseUrl = 'http://www.liulongbin.top:3008';
    option.url = baseUrl + option.url;
    option.headers = {
        //使用||更加严谨,如果local里没有token这个键,name我们就默认返回个'';
        Authorization: localStorage.getItem('token') || ''
    };
    option.complete = function(response) {
        if (response.responseJSON && response.responseJSON.code !== 0) {
            // location.href = '/login.html';

        }
    }
});