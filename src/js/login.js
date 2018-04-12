$(function () {
    // 隔离的空间
    // 实现登录
    // $('#loginBtn').on('click', function () {
    //     let mobile = $('.login_mobile').val();
    //     let password = $('.login_password').val();
    //     axios.post('login', {
    //         username : mobile,
    //         password : password
    //     })
    //         .then(function (data) {
    //             if (data.meta.status === 200) {
    //                 // 登录成功
    //                 // 保存token和用户相关信息
    //                 let info = data.data.token;
    //                 localStorage.setItem('userInfo', info);
    //                 // 跳转页面
    //                 location.href = '/index.html';
    //             } else {
    //                 //登陆失败
    //                 $.toast(data.meta.msg);
    //             }
    //         })
    // })
    // 基于Promise的编码风格：分而治之（把单个的业务封装到独立的方法中，然后通过then串联起来）
    // 表单验证
    function checkForm(params) {
        return new Promise(function (resolve, reject) {
             let reg = /^1\d{10}$/;
             if (!reg.test(params.username) || !params.username) {
                 reject('手机号格式错误!');
             }
             if (!params.password || params.password < 6) {
                 reject('密码至少是6位!');
             }
             resolve(params);
        })
    }
    // 调用登录验证接口
    function login(params) {
        return axios.post('login', params);
    }
    // 验证成功与否
    function check(data) {
        return new Promise(function (resolve, reject) {
            if (data.meta.status === 200) {
                // 登录成功
                // 保存token和用户相关信息
                let suc = JSON.stringify(data.data);
                localStorage.setItem('userInfo', suc);
                resolve();
            }else {
                reject(data.meta.msg);
            }
        })
    }
    $('#loginBtn').on('click', function () {
        // 获取页面表单数据
        let mobile = $('.login_mobile').val();
        let password = $('.login_password').val();
        // 调用接口要提交的参数
        let params = {
            username: mobile,
            password: password
        };
        // 执行登录
        checkForm(params)
            .then(login)
            .then(check)
            .then(function () {
                location.href = '/index.html';
            })
            .catch(function (err) {
                $.toast(err);
            })
    });

    // 页面初始化完成之后，触发该事件
    $(document).on("pageInit", function(e, pageId, $page) {
        //验证本地缓存 判断是否登录
        if (localStorage.getItem('userInfo')) {
            // 从本地缓存中取出用户信息，显示到输入框中
            let info = localStorage.getItem('userInfo');
            let uname = JSON.parse(info).username;
            $('.login_mobile').val(uname);
        }
    });
    // 必须显示的调用该方法，从而触发pageInit事件
    $.init();
});