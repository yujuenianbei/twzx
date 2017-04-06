!function ($){
    
    $.bindEvent('slidstart')
    $.bindEvent('slidmove')
    $.bindEvent('slidend')

    function d3x(x){
        return 'translate3d('+x+'px,0,0)'
    }
    
    function getSlideSet(box){
        try{
            return eval('({'+box.attr('slide')+'})')
        }
        catch(e){
            return {time:2000,infinite:true}
        }
    }

    eve._slide={
        start : function (){
            this.slide.moveBox.css('transition','0s')
        },
        move : function (e){

            if(e.to=='top' || e.to=='bottom'){
                e.def=false
                return
            }

            var sd=this.slide
            var move=e.newX-e.x

            if(sd.infinite){
                if(sd.cssIndex==-1 && e.to=='right'){
                    sd.cssIndex-=sd.length
                }

                if(sd.cssIndex+sd.length == 0  && e.to=='left'){
                    sd.cssIndex=0
                }
            }
            else{
                if(sd.cssIndex==0 && e.to=='right'){
                    move/=2.5
                }

                if(sd.cssIndex+sd.length==1 && e.to=='left'){
                    move/=2.5
                }
            }

            sd.moveBox.css('transform',d3x(sd.width*sd.cssIndex+move))
            
            if(sd._move.length){
                sd._move.forEach(function (the){
                    the.call(sd,move)
                })
            }
        },
        end : function (e){

            if(e.to=='top' || e.to=='bottom')return

            var sd=this.slide

            var move=e.newX-e.x
            
            if(!sd.infinite){
                if(sd.cssIndex==0 && e.to=='right' && move>0){
                    move=0
                }
                if(sd.cssIndex+sd.length==1 && e.to=='left' && move<0){
                    move=0
                }
            }

            if(Math.abs(move)<50){
                sd.gotoCssIndex(sd.cssIndex,true)
                return
            }

            if(move>0)
                sd.gotoCssIndex(sd.cssIndex+1,true)
            else
                sd.gotoCssIndex(sd.cssIndex-1,true)


            if(sd._up.length){
                sd._up.forEach(function (the){
                    the.call(sd,move)
                })
            }
        }
    }

    function slideAniEnd(e){
        var sd=this.slide
        if(sd.cssIndex==sd.lastIndex)return

        sd.lastIndex=sd.cssIndex        

        if(sd.infinite){
            sd.index=-1-sd.cssIndex
        }
        else{
            sd.index=0-sd.cssIndex
        }
        
        if(sd._end.length){
            sd._end.forEach(function (the){
                the.call(sd,sd.index)
            })
        }
    }

    function Slide(box){
        box
        .attr('slidstart','def;_slide.start')
        .attr('slidmove','def;_slide.move')
        .attr('slidend','_slide.end')
        [0].slide=this

        this.set=getSlideSet(box)

        this.box=box
        this.moveBox=box.dom('>').eq(0)
        this.moveBox[0].slide=this
        this.moveBox[0].addEventListener('webkitTransitionEnd',slideAniEnd,true)

        this.time=this.set.time || 2000
        this.infinite=!(this.set.infinite===false)

        this.cssIndex=0
        this.index=0
        this.lastIndex=0

        this.height=box[0].clientHeight
        this.width=box[0].clientWidth
        this.length=this.moveBox.dom('>').length

        this.init_infinite()
        
        this._move=[]
        this._end=[]
        this._up=[]
    }


    Slide.prototype={
        init_infinite:function (){
            if(!this.infinite)return
            var list=this.moveBox.dom('>')

            this.moveBox
            .insert(list[0].cloneNode(true))
            .insert(list[list.length-1].cloneNode(true),'<')

            this.cssIndex=-1
            this.gotoCssIndex(this.cssIndex)
        },
        gotoCssIndex:function (cssIndex,mv){
            this.cssIndex=cssIndex

            if(mv)
            this.moveBox.css('transition','transform 0.3s cubic-bezier(0, 0, 0.2, 1)')

            this.moveBox.css('transform',d3x(this.width*this.cssIndex))
        },
        goto:function (index){
            
            if(index<0)index=0
            if(index>this.length-1)index=this.length-1

            if(this.infinite){
                this.gotoCssIndex(-index-1,true)
            }
            else{
                this.gotoCssIndex(-index,true)
            }

            return this
        },
        onmove:function (fn){
            this._move.push(fn)
            return this
        },
        onup:function (fn){
            this._up.push(fn)
            return this
        },
        onend:function (fn){
            this._end.push(fn)
            return this  
        }
    }


    $.Slide=function (box){
        return new Slide($(box))
    }
    
}($);