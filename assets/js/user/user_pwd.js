$(function(){
    var form=layui.form;
    var layer=layui.layer;
    form.verify({
        samePwd: function(value){ //value：表单的值、item：表单的DOM对象
          if(value===$('[name=oldPwd]').val()){
            return '新旧密码不能相等'
          }
        },rePwd: function(value){ //value：表单的值、item：表单的DOM对象
            if(value!==$('[name=newPwd]').val()){
              return '两次密码不一致'
            }
          }
        ,pwd: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ] 
      });      
     
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data:$(this).serialize(),
            success: function (res) {
                if(res.status!==0){
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功，2秒后重新登录')
                //重置表单
                $('.layui-form')[0].reset();
                //两秒钟重新登录
                setTimeout(() => {
                  window.parent.location.href="/login.html";
                }, 2000);
            }
        });
    })
    })