$(function () {
    var layer = layui.layer;
    var form = layui.form;
    //获取分类列表
    getArtList();
    function getArtList() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            data: "",
            success: function (res) {
                //console.log(res);
                var htmlcontent = template('tpl-table', res);
                $('tbody').html(htmlcontent);
            }

        });
    }
    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('新增文章失败')
                }
                getArtList();
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    })
    // 点击btn-edit 编辑弹出一个页面框
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open(
            {
                area: ['500px', '250px'],
                type: 1,
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            }

        )
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })

    })
    //为弹出层的表单  绑定提交事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                getArtList();
                layer.close(indexEdit)
            }
        });
    })
    //删除文章数据
    $('body').on('click','#btn-delete',function(){
        var id=$(this).attr('data-id')
        console.log('11');
        layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: "get",
                url: "/my/article/deletecate/"+id,
                data: "",
                success: function (res) {
                    if(res.status!=0){
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                  
                    layer.close(index);
                    getArtList();
                }
            });
          });
    })
  
})