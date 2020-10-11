$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  var q = {
    pagenum: 1,
    pagesize: 3,
    cata_id: '',
    state: ''
  }
  initTab();
  initDownSel();
  // 获取文章分类列表的方法
  function initTab() {
    $.ajax({
      type: "get",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取失败')
        }
        var htmlStr = template('sec_list', res);
        $('tbody').html(htmlStr);
        renderPage(res.total)
      }
    });
  }
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
  //将下拉框选中的值进行查询
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    console.log('111');
    var idp = $('[name=cate_id]').val();
    var sta = $('[name=state]').val();

    q.cate_id = idp;
    q.state = sta;

    initTab();
  })
  //渲染分页
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize,//每页显示的条数
      curr: q.pagenum,//当前页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        /*  console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
         console.log(obj.limit); //得到每页显示的条数 */
      /*   console.log(first)
        console.log(obj.curr) */
        q.pagesize = obj.limit;
        q.pagenum = obj.curr;

        //首次不执行
        if (!first) {
          initTab()
        }
      }
    })
  }
  //点击删除数据
  $('tbody').on('click', '#btn-delete', function() {
    var len=$('#btn-delete').length;
    console.log(len);
    var ids=$(this).attr('data-id');
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        type: "get",
        url: "/my/article/delete/"+ids,
        success: function (res) {
          // console.log(res);
          if(res.status!==0){
            return layer.msg('删除失败');

          }
          if(len==1){
            q.pagenum= q.pagenum===1? 1:q.pagenum-1
          }
         
          layer.msg('删除成功');
          initTab();
        }
      });
      layer.close(index)
    })
  })

})