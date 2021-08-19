$.ajaxPrefilter(function(option) {
    var baseUrl = 'http://www.liulongbin.top:3008';
    option.url = baseUrl + option.url;
});