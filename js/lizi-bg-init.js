
    !function (window){
        if(!window.FileReader){
            return $(document.body).attr('ie9','')
        }

        // 安卓 ipad iPhone
        var userAgent=navigator.userAgent.toLowerCase()
        if(userAgent.indexOf('iphone')!=-1 || userAgent.indexOf('ipad')!=-1 || userAgent.indexOf('android')!=-1){
            return $(document.body).attr('ie9','')
        }

        // 谷歌内核，火狐
        if(userAgent.indexOf('webkit')!=-1 || userAgent.indexOf('firefox')!=-1){
            document.write('<script src="http://cdn.bootcss.com/three.js/r60/three.min.js"><\/script>')
            document.write('<script src="js/lizi-bg.js"><\/script>')
        }

    }(window);