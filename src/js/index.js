$(function () {
    // 处理轮播
    // 获取轮播图数据
    function loadSwiperData() {
        return axios.get('home/swiperdata');
    }
    // 渲染轮播图模板
    function renderSwiper(data) {
        return new Promise(function (resolve, reject) {
            if (data.meta.status === 200) {
                let html = template('banner_Tpl', {list: data.data});
                $('.banner_Tpl').html(html);
                resolve();
            } else {
                reject(data.meta.msg);
            }
        })
    }

    //处理菜单
    //获取菜单数据
    function loadMenuData() {
        return axios.get('home/catitems');
    }
    //渲染菜单
    function renderMenu(data) {
        return new Promise(function (resolve, reject) {
            if (data.meta.status === 200) {
                var html = template('menu_tpl', {list: data.data});
                $('.menuInfo').html(html);
                resolve();
            } else {
                reject(data.meta.msg);
            }
        })
    }

    //处理list
    //获取list数据
    function loadListData() {
        return axios.get('home/goodslist')
    }
    //渲染list
    function renderList(data) {
        return new Promise(function (resolve, reject) {
            if (data.meta.status === 200) {
                var html = template('list_tpl', {list:data.data})
                $('.listinfo').html(html);
                resolve();
            } else {
                reject(data.meta.msg);
            }
        })
    }

    // 页面初始化完成之后，触发该事件
    $(document).on("pageInit", function(e, pageId, $page) {
        //处理轮播效果
        loadSwiperData()
            .then(renderSwiper)
            .then(function () {
                //轮播图swiper初始化
                var mySwiper = new Swiper ('.swiper-container', {
                    direction: 'horizontal',
                    loop: true,
                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination',
                    }
                });
            })
            .catch(function (err) {
                $.toast(err);
            });

        // 处理菜单
        loadMenuData()
            .then(renderMenu)
            .catch(function (err) {
                $.toast(err)
            });

        // 处理列表
        // loadListData()
        //     .then(renderList)
        //     .catch(function (err) {
        //         $.toast(err);
        //     })

    });
    $.init();

});