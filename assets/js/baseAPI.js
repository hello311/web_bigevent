//每次调用$.get等时,会先调用ajaxPrefilter，在这个函数中会拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){

//在发起真正的ajax请求前，统一拼接请求根路径
// options.url='http://ajax.frontend.itheima.net'+options.url;
console.log(options.url);
})