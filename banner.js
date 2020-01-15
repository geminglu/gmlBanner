;(function ($) {
    $.fn.banner = function (items,options) {
        options = options || {};
        this._obj_ = {
            items:items,
            but:options.but === false ? false : true,
            list:options.list === false ? false : true,
            butahidden:options.butahidden === false ? false : true,
            index:options.index || 0,
            autoPlay:options.autoPlay === false ? false : true,
            delayTiem:options.delayTiem || 2000,
            moveTime:options.moveTime || 300,
            // 假设上一张是最后一个索引
			iPrev:items.length-1,
        };
        var that = this;
        // 初始化布局
        this._obj_.init = function () {
            // 给大框加溢出隐藏
            that.css({
                overflow: "hidden"
            });
            // 每张图片的定位位置
            items.css({
                position:"absolute",
                left:items.eq(0).width(),
                top:0
            }).eq((this.index)).css({
                left:0
            });
        }
        this._obj_.init();
        // 判断是否传入左右按钮，有就做功能，没有就跳过
        if (this._obj_.but) {
            butLR();
            // 左按钮事件
            that.children(".btns").children('input:first').click(butLeft);
            // 右按钮事件
            that.children(".btns").children('input:last').click(butReft);
        }
        // 添加左右按钮元素
        function butLR() {
            var str = `<div class="btns">
                <input type="button" but="left" value="<">
                <input type="button" but="right" value=">">
            </div>`;
            that.append(str);
            // 左右按钮样式
            that.children(".btns").css({
                width:1000,
                height: 300,
                position: "absolute",
                left: 0,
                top:0,
                display: "flex",
                justifyContent:"space-between",
                alignItems: "center"
            }).children().css({
                border: 0,
                width: 50,
                height: 50,
                background: "#767676",
                outline: 0,
                cursor: "pointer",
                font: "30px/1em ''",
                opacity: 0.5,
                position: "absolute",
            }).eq(0).css({
                left:0
            }).end().eq(1).css({
                left:items.eq(1).width() - $(".btns>input:first-child").width()
            })
        }
        // 左按钮方法
        function butLeft() {
            if (that._obj_.index == 0) {
                that._obj_.index = items.length-1;
                that._obj_.iPrev = 0;
            }else{
                that._obj_.index--;
                that._obj_.iPrev = that._obj_.index + 1;
            }
            btnMove(1);
            // 按钮焦点
            focalPoint(that._obj_.index);
        }
        // 右按钮方法
        function butReft() {
            if (that._obj_.index == items.length-1) {
                that._obj_.index = 0;
                that._obj_.iPrev = items.length-1;
            }else{
                that._obj_.index++;
                that._obj_.iPrev = that._obj_.index - 1;
            }
            btnMove(-1);
            // 按钮焦点
            focalPoint(that._obj_.index);
        }
        // 移动图片
        function btnMove(type) {
            items.eq(that._obj_.iPrev).css({
                left:0
            }).stop().animate({
                left:items.eq(0).width() * type
            },that._obj_.moveTime).end().eq(that._obj_.index).css({
                left:-items.eq(0).width() * type
            }).stop().animate({
                left:0
            },that._obj_.moveTime);
            console.log()
        }
        // 如果list为true就创建小按钮
        if (this._obj_.list) {
            var str = "";
            for (var i=0;i<items.length;i++) {
                // 给每个li加上索引
                str += `<li index=${i}></li>`;
            }
            $("<ul id='navigationButtons'>").html(str).appendTo(this).css({
                position: "absolute",
                display: "flex",
                left: 0,
                right: 0,
                bottom: 10,
                justifyContent: "center",
                listStyle: "none",
                zIndex: 99999999
            }).children().css({
                width:10,
                height:10,
                borderRadius: 50+"%",
                cursor: "pointer",
                margin:5,
            });
        }
        // 按钮焦点
        function  focalPoint(i) {                                
            that.children("#navigationButtons").children().css({
                background: "#1a1a1aa6",
                border: "1px solid rgb(206, 206, 206, 0.33)"
            }).eq(i).css({
                background: "#46b2ffa6",
                border: "1px solid rgba(174, 202, 255, 0.33)",
            });
        }
        // 小按钮导航事件
        that.children("#navigationButtons").children().click(function () {
            // 如果当前索引大于点击的按钮索引，就向左远动
            if (that._obj_.index > this.getAttribute("index")) {
                limove(1,this.getAttribute("index"));
                // 如果当前索引小于点击的按钮索引，就向右远动
            }else if (that._obj_.index < this.getAttribute("index")) {
                limove(-1,this.getAttribute("index"));
            }
            focalPoint(this.getAttribute("index"));
        that._obj_.index = this.getAttribute("index")
        })
        function limove(type,q) {
            items.eq(that._obj_.index).css({
                left:0
            }).stop().animate({
                left:items.eq(0).width() * type
            },that._obj_.moveTime).end().eq(q).css({
                left:-items.eq(0).width() * type
            }).stop().animate({
                left:0
            },that._obj_.moveTime);
            console.log()
        }
        // 按钮焦点
        focalPoint(that._obj_.index);
        // 自动轮播
        var t;
        function automatic() {
            clearInterval(t)
            t = setInterval(() => {
                butReft();
            },that._obj_.delayTiem);
        }
        // that._obj_.autoPlay为true是才能自动播放
        if (that._obj_.autoPlay) {
            automatic();
            // 鼠标进入事件
            $(this).hover(()=> {
                showdis();
                clearInterval(t)
            },()=>{
                hidden();
                automatic();
            })
        }
        // 开启隐藏功能后自动隐藏
        if (that._obj_.butahidden) {
            hidden();
            $(this).hover(()=> {
                showdis();
            },()=>{
                hidden();
            })
        }
        // 自动隐藏
        function hidden() {
            if (that._obj_.butahidden) {
                that.children(".btns").children('input:first').stop().animate({
                    left:-that.children(".btns").children('input:last').width()
                },500)
                that.children(".btns").children('input:last').stop().animate({
                    left:items.eq(0).width()
                },500)
            }
        }
        // 显示
        function showdis() {
            that.children(".btns").children('input:first').stop().animate({
                left:0
            },500)
            that.children(".btns").children('input:last').stop().animate({
                left:items.eq(0).width() - that.children(".btns").children('input:first').width()
            },500)
        }
    }
    
})(jQuery);