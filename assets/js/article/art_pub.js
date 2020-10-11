$(function () {
    var form = layui.form;
    var layer = layui.layer;
    var $image = $('#image')
    initDownSel();
    initEditor();
    // 将分类渲染下拉选择框
    function initDownSel() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                var htmlRes = template('downSel', res);
                $('[name=cate_id]').html(htmlRes);
                form.render();
            }
        });
    }
    //  裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    //  初始化裁剪区域
    $image.cropper(options)
    //点击按钮弹出文件框
    $('#btn-sub').on('click', function () {
        $('#coverFile').click();
    })
    //将选择的图片设置到裁剪区域中
    $('#coverFile').on('change', function (e) {
        //拿到选中的图片的信息
        var file = e.target.files[0];
        //将图片创建一个url地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)

    })
    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0]);
        console.log(fd);
        //将发布文章的状态存入fd
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
            fd.append('cover_img',blob)
            publishArticle(fd);
            })
    })
   function publishArticle(fd){
       $.ajax({
           type: "post",
           url: "/my/article/add",
           data: fd,
           contentType: false,
           processData: false,
           success: function (res) {
               console.log(res);
           }
       });
   }
})