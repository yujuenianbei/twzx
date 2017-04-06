

!function ($,document){
    
    window.onresize=function (){
        pagesHeight=pages.height()
    }
    
    if(document.body.clientWidth<=760){
        //$('.pages>div').append($('#foot').addClass('page'))
    }


    var pages=$('.pages>div')
    var page=pages.find('>.page')
    var pagesHeight=pages.height()
    var index=0
    var maxIndex=page.length-1

    $.temp.init('.pageNav').reload(new Array(page.length))
    
    var pageNav=$('.pageNav>a')

    // 右侧导航栏垂直对其功能
    $('.pageNav').height($('.pageNav>a').length*($('.pageNav>a').height()+10)-10)
    $('.pageNav>a:nth-child(1)').addClass('on')


    $.bindEvent('slidstart')
    $.bindEvent('slidmove')
    $.bindEvent('slidend')

    // 对外事件，滚动到某块
    eve.bodyScrollTo=function (e,index,time){

        if(move.type=='move')return

        if(this.tagName){
            if($(this).hasClass('on'))return

            $(this).dom('<>').removeClass('on')
            $(this).addClass('on')
        }

        move(index,time)
    }

    eve.bodyScrollNext=function (){

        if(index==maxIndex){
            index=-1
        }

        move(index+1)
    }

    // 滑动事件
    eve.moveStart=function (e){
        if(e.eventForm!='touch')return

        pages.css('transition','0s')
    }

    eve.move=function (e){
        if(e.eventForm!='touch')return
        if(move.type=='move')return

        if(e.to=='top' || e.to=='bottom'){
            pages.css('transform','translateY('+(-index*pagesHeight+e.newY-e.y)+'px)')
            pages
        }

        e.def=true
    }

    eve.moveEnd=function (e){
        if(e.eventForm!='touch')return

        if(e.to=='top' || e.to=='bottom'){
            
            if(e.to!=e.toNew){
                move(index,0.3)
                return
            }

            var y=e.newY-e.y
            
            if(Math.abs(y)<50){
                move(index,0.3)
                return
            }

            if(y<0)
                index++
            else
                index--
            
            if(index<0)
                index=0
            if(index>maxIndex)
                index=maxIndex

            move(index,0.3)
        }
    }



    // 鼠标滑动切换上下
    $(document).mousewheel(function (e,delta){

        console.log('mousewheel')
        var down=delta<0

        if(move.type=='move')return

        if(down){
            if(index==maxIndex)return
            index++
        }
        else{
            if(index==0)return
            index--
        }

        move(index)
    })
    
    
    $(document).keydown(function (e){
        
        // 键盘上，pageUp
        if(e.keyCode==38 || e.keyCode==33){
            e.preventDefault()
            if(index==0)return
            index--
        }

        // 键盘下，pageDown
        if(e.keyCode==40 || e.keyCode==34){
            e.preventDefault()
            if(index==maxIndex)return
            index++
        }

        // 键盘home
        if(e.keyCode==36){
            e.preventDefault()
            eve.bodyScrollTo(null,0)
            return
        }
        // 键盘end
        if(e.keyCode==35){
            e.preventDefault()
            eve.bodyScrollTo(null,maxIndex)
            return
        }

        move(index)
    })
    


    // ie9用滚动方法
    function move(i){
        
        if(window.bodyScroll)
        bodyScroll(i)

        if(move.type=='move')return
        move.type='move'

        pages.stop(true).animate({top:-i*100+'%'},500,function (){
            move.type='end'
            index=i

            pageNav.removeClass('on')
            if(pageNav[i]){
                $(pageNav[i]).addClass('on')
            }
        })
    }

    // ie10+用滚动方法
    if('transition' in document.body.style){

        move=function(i,time){
            
            bodyScroll(i)
            
            if(move.type=='move')return
            move.type='move'

            pages
            .css('transition',(time || '0.5')+'s')
            .css('transform','translateY(-'+(i*100)+'%)')
            .y=i
        }


        pages[0].addEventListener('transitionend',function (){
            move.type='end'
            index=pages.y||0

            pageNav.removeClass('on')
            if(pageNav[index]){
                $(pageNav[index]).addClass('on')
            }

            pages.css('transition','0s')
        },true)
    }

}($,document)