$(function(){
    // 搜索条业务功能
    // 初始化遮罩层
    $('.search').css('top', $('.mysearch').height());

    $('.search').hide();

    //根据输入的关键字加载列表数据
    function loadKeyWordData(keyword) {
        return axios.get('goods/qsearch', {
            params: {
                query: keyword
            }
        });
    }
    //渲染数据到提示列表
    function renderList(data) {
        return new Promise(function (resolve, reject) {
            if (data.meta.status === 200) {
                if (data.data.length == 0) {
                    let datakong = [{goods_id:0,goods_name:"暂无数据"}]
                    let html = template('list_block_tpl', datakong);
                    $('.list-block').html(html);
                } else {
                    let html = template('list_block_tpl', data.data);
                    $('.list-block').html(html);
                }
            } else {
                reject(data.meta.msg);
            }
        })
    }

    // 实现搜索跳转功能
    function showDetail(id, name) {
        let history = localStorage.getItem('searchHistory');
        if (history) {
            let onOff = true;
            let historyInfo = JSON.parse(history);
            // 判断数组中是否包含指定的id对象
            historyInfo.some(function (item) {
                if (id === item.goods_id) {
                    onOff = false
                    return true;
                }
            });
            if (onOff)  {
                // 如果不存在，就添加进去
                let info = {
                    goods_id: id,
                    goods_name: name
                };
                historyInfo.push(info);
                localStorage.setItem('searchHistory', JSON.stringify(historyInfo));
            }
        } else {
            let arr = [];
            let info = {
                goods_id: id,
                goods_name: name
            };
            arr.push(info);
            localStorage.setItem('searchHistory', JSON.stringify(arr));

        }
        // 实现跳转
        location.href = '/goods-detail.html?goods_id=' + id;
        $('#search').val('');
        $('.list-block').html('');
    }
    
    //获取焦点
    $('#search').on('focus',function () {
        $('.search').show();
        let historyInfo = localStorage.getItem('searchHistory');
        if (historyInfo) {
            //表示有历史
            historyInfo = JSON.parse(historyInfo);
            //渲染历史信息
            let html = template('list_block_tpl',historyInfo);
            $('.list-block').html(html);
        }
    });

    //输入内容时，添加事件处理函数
    $('#search').on('input', function () {
        let keyword = $('#search').val();
        //判断输入框内容是否为空
        if (keyword.length === 0) {
            $('.list-block').html('');
        }else {
            loadKeyWordData(keyword)
                .then(renderList)
                .catch(function (err) {
                    $.toast(err)
                })
        }

    });
    //点击取消按钮
    $('.searchbar-cancel').on('click', function () {
        $('.search').hide();
        $('#search').val('');
        $('.list-block').html('');
    });

    //点击列表实现功能
    $('.list-block').on('click', 'a' , function () {
        let goods_id = $(this).data('dataid');
        let goods_name = $(this).find('.item-title').html();
        showDetail(goods_id, goods_name);
    });
    //失去焦点
    $('#search').on('blur', function () {
        setTimeout(function(){
            $('.search').hide();
        },0);
    })
});