
        if(document.body.clientWidth>760){
            
            var hideNavTime;
            $('header [open]').hover(
                function (){
                    $('header [open]>span').attr('class','ico-下拉')
                    $('header [hideNav]').show()
                    clearTimeout(hideNavTime)
                },
                function (){
                    hideNavTime=setTimeout(function(){
                        $('header [open]>span').attr('class','ico-ico-81')
                        $('header [hideNav]').hide()
                    },300)
                }
            )
        }
        else{
            eve.toggleNav=function (){
                if($(this).toggleClass('ico-menu').toggleClass('ico-80').hasClass('ico-menu')){
                    $('header>nav').hide()
                    $('html').css('overflow','visible')
                }
                else{
                    $('header>nav').show()
                    $('html').css('overflow','hidden')
                }
            }
        }



        eve.open404=function (){

            layer.msg('系统正在维护！请稍后再试。')
            return
            setTimeout(function(){

                var area=['600px','400px']
                if(document.body.clientWidth<=760){
                    area=['300px','200px']
                }

                layer.open({
                    type: 1,
                    closeBtn : true,
                    shadeClose : true,
                    title : false,
                    area: area, //宽高
                    content: "<div class='popup404'>\
                                <img src='img/whz.png'>\
                            </div>",
                });
            },0)
        }