

// 工具
!function (window,JSON,$){

    $.getObjValue=function (name,obj){

        name=name.split('.')
        obj=obj || window
        for(var i=0,length=name.length;i<length;i++){
            if(name[i] in obj){
                obj=obj[name[i]]
            }
            else{
                break
            }
        }

        return obj
    }

    // 触发一个事件
    $.dispatchEvent=function(tag,type,data){
        var eve=document.createEvent('Events')
        eve.initEvent(type||'click',true,true)

        $.objJoin(eve,data||{})

        tag.dispatchEvent(eve)
        return eve
    }

    $.null_fun=function(){}

    $.getUrlData=function(){

        var arr=decodeURI(location.search.slice(1)).split('&')
        var str
        var data={}

        if(arr[0])
        for(var i=0;i<arr.length;i++){
            str=arr[i].split('=')
            if(str.length==1 && i==0){
                return JSON.parse(str[0])
            }
            data[str[0]]=str[1]
        }

        return data
    }

    $.setUrlData=function(data){
        return encodeURI(JSON.stringify(data))
    }

    $.objJoin=function(obj,obj2){
        for(var name in obj2){
            obj[name] = obj2[name]
        }
    }
    $.tostr=function(obj){
        return JSON.stringify(obj)
    }
    $.toobj=function(str){
        return JSON.parse(str)
    }

    function getBMap(fn){
        if(getBMap.run){
            return
        }
        getBMap.run=true

        window.BMap_loadScriptTime = (new Date).getTime();
        var script=document.createElement('script')
        script.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=DraGF1TcdB3os28EWEpglUoXfCmuw50R&services='
        document.body.appendChild(script)
    }

    // 获取位置
    $.getPosition=function(fn,err){

        getBMap()

        try{
            var geoc = new BMap.Geocoder();
            var geolocation = new BMap.Geolocation();

            // 获取地理位置
            geolocation.getCurrentPosition(
                function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){

                        geoc.getLocation(r.point, function(rs){
                            var addComp = rs.addressComponents;

                            var data={
                                lon : r.point.lng,
                                lat : r.point.lat,

                                province : addComp.province,
                                city : addComp.city,
                                district : addComp.district,
                                street : addComp.street,
                                streetNumber : addComp.streetNumber,
                                time : new Date().getTime(),
                                add : addComp.province+addComp.city+(addComp.district || '')+(addComp.street || '')+(addComp.streetNumber || '')
                            }

                            if(fn)fn(data)

                            localStorage.position=JSON.stringify(data)
                        })
                    }
                    else {
                        if(err)err(this.getStatus())
                    }
                },
                {enableHighAccuracy: true}
            )
        }
        catch(e){
            setTimeout(function(){
                getPosition(fn)
            },100)
        }
    }

    window.ajax=function (url,data,fn1,fn2,fn3){

        if(typeof data=='function'){
            data={}
            fn3=fn2
            fn2=fn1
            fn1=data
        }

        $.ajax({
            url : url,
            data : data,
            dataType : 'json',
            type : 'post',
            success : function (data){
                if(data.status=='success'){
                    fn1(data)
                }
                else{
                    fn2(data)
                }
            },
            error : fn3,
            timeout : 5,
            cache : false
        })

    }

    $.loadJs=function(src,fn) {
        var script = document.createElement("script");

        script.type = "text/javascript",
        script.src = src,
        script.onload = fn,
        document.body.appendChild(script)
    }

}(window,JSON,$),

// 扩展方法
function(fn,$,ufind){

    fn.indexOf=function(el){
        if('length' in el)el=el[0]
        return Array.prototype.indexOf.call(this,el)
    }

    var dom={
        '<':'parent',
        '>':'children',
        '+':'next',
        '-':'prev',
    }
    fn.dom=function(str){

        var the=this

        str=str.split('')

        for(var i=0;i<str.length;i++){
            the=the[dom[str[i]]]()
            if(!the.length)return null
        }

        return the
    }

}($.fn,$),

// 模版
function($,ufind){

    // 模板对象
    function Temp(data,filter,filtertype,el){
        this.data=data
        this.filter=filter
        this.filtertype=filtertype
        this.el=el
    }

    // 输出模板
    Temp.prototype.tohtml=function (data){
        if(!isArray(data))data=[data];

        var back

        if(this.filter){
            if(this.filtertype){
                for(var i=0;i<data.length;i++){
                    back=this.filter(data[i])
                    if(back!==ufind)
                    data[i]=back
                }
            }
            else{
                data=this.filter(data) || data
            }
        }


        var str=this.data;
        var html='';
        var str2;

        for(var i=0;i<data.length;i++){
            str2=str[0];
            for(var i2=1;i2<str.length;i2++){

                switch(str[i2].key){
                    case '$this':
                        str2+=data[i]+str[i2].str;
                        break
                    case '$index':
                        str2+=i+str[i2].str;
                        break
                    default:
                        str2+=$.getObjValue(str[i2].key,data[i])+str[i2].str;
                }
            }
            html+=str2;
        }

        return html
    }


    Temp.prototype.reload=function (data){
        $(this.el)
        .html('')
        .html($(this.tohtml(data)))
    }

    Temp.prototype.load=function (data){
        $(this.el)
        .attr('temptype','show')
        .append(this.tohtml(data))
    }

    Temp.prototype.loadUp=function (data){
        $(this.el)
        .attr('temptype','show')
        .prepend(this.tohtml(data))
    }


    function isArray(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    }


    // 生成模版方法的方法
    function temp(str,filter,filtertype,el){

        if(str.obj_type || str.nodeName){
            return temp.init(str)
        }

        str=str.split('[[');
        for(var i=1;i<str.length;i++){
            var index=str[i].indexOf(']]');

            str[i]={
                key : str[i].slice(0,index),
                str : str[i].slice(index+2)
            };
        }

        return new Temp(str,filter,filtertype,el);
    }

    temp.list={}

    temp.init=function (el){

        el=$(el)[0]
        var str
        var tstr=el.getAttribute('temp').split(',')
        var obj={}

        for(var i=0;i<tstr.length;i++){
            str=tstr[i].split(':')
            obj[str[0]]=str[1]
        }

        var next
        var the=el.childNodes[0]
        while(the){
            next=the.nextSibling

            //            if(the.nodeType==3)
            //                el.removeChild(the)
            if(the.nodeName=='SCRIPT'){
                try{obj.fn=eval('('+the.innerHTML+')')}
                catch(e){}

                el.removeChild(the)
            }

            the=next
        }

        var html=el.innerHTML
        el.innerHTML=''

        if(obj.id)
            return temp.list[obj.id]=temp(html,obj.fn,obj.each=='true',el)
        else
            return temp(html,obj.fn,obj.each=='true',el)
    }

    temp.initAll=function (){
        $('[temp]').each(function (){
            temp.init(this)
        })

        return temp.list
    }

    $.temp=temp;
}($),

// 数据绑定
function (define,temp,$){

    // 表示正在获取焦点的输入框
    var focus_input

    // 绑定输入事件，实现双向绑定
    document.addEventListener('input',function (e){
        var input=e.target
        focus_input = input

        if(input.bind_data){
            input.bind_data[input.bind_type]=input.value
        }
    },true)

    document.addEventListener('blur',function (e){
        // focus_input = null
        // 以下是不完全兼容ie9的input事件删除处理

        var input=e.target
        focus_input = null
        if(input.bind_data){
            input.bind_data[input.bind_type]=input.value
        }
    },true)


    function bind(data,dom){

        dom=$(dom||document)

        set_hidden_value(data,'_bind',{
            text : {},
            input : {},
            attr : {},
        })

        set_hidden_value(data,'_data',{})
        set_hidden_value(data,'_temp',{})
        set_hidden_value(data,'_tag',{})


        var attr

        // 绑定（b='属性名'）
        var text=$('[b]',dom)
        for(var i=0;i<text.length;i++){

            attr = text[i].getAttribute('b')

            if(attr.indexOf(':')==0)
                bind_b_temp(text[i],attr.slice(1),data)
            else
            if(attr.indexOf('def:')==0)
                bind_b(text[i],attr.slice(4),data,true)
            else
                bind_b(text[i],attr,data)
        }


        // 绑定（:src='属性名'）,和（$click='alert1,alert2'）
        var tag=$('*',dom)
        for(var i=0;i<tag.length;i++){
            if(tag[i].attributes.length){
                var attr=tag[i].attributes
                for(var i2=0;i2<attr.length;i2++){


                    var name = attr[i2].name
                    var value=attr[i2].value

                    if(name.indexOf(':')!=0)continue
                    name=name.slice(1)

                    tag[i].setAttribute(name,'')
                    var n_attr=attr.getNamedItem(name)

                    if(value.indexOf(':')==0)
                        bind_attr_temp(n_attr,name,value.slice(1),data)
                    else
                    if(value.indexOf('def:')==0){
                        bind_attr(n_attr,name,value.slice(4),data,true)
                    }
                    else
                        bind_attr(n_attr,name,value,data)
                }
            }
        }

        // 汇总html绑定的属性，
        for(var name in data._temp){
            if(!(name in data))data[name]=''
        }
        for(var i in data._bind){
            for(var name in data._bind[i]){
                if(!(name in data))data[name]=''

                // 整理tag标签
                if(!data._tag[name])
                    data._tag[name]=[]
                data._tag[name]=data._tag[name].concat(data._bind[i][name])

                //ownerElement
            }
        }


        // 绑定tag标签
        for(var i in data._tag){

            for(var i2=0;i2<data._tag[i].length;i2++)
            if(data._tag[i][i2].ownerElement)
                data._tag[i][i2]=data._tag[i][i2].ownerElement

            if(data._tag[i].length==1)
                data._tag[i]=data._tag[i][0]
        }

        // 设置get set并初始化
        for(var name in data){
            data._data[name] = data[name]
            get_set(data,name)
        }

        data.$set=setValue
        return data
    }

    function setValue(data){
        for(var i in data){
            this[i]=data[i]
        }
    }

    function set_hidden_value(data,name,value){
        define(data ,name, {
            enumerable : false,
            value : value,
        })
    }

    var bindValueTags=['INPUT','TEXTAREA']
    function bind_b(text,attr,data,def){

        if(def){
            data[attr]=text.innerHTML || text.value
        }

        if(bindValueTags.indexOf(text.tagName)!=-1){

            if(!data._bind.input[attr])data._bind.input[attr]=[]
            data._bind.input[attr].push(text)

            text.bind_type=attr
            text.bind_data=data
        }
        else{
            if(!data._bind.text[attr])data._bind.text[attr]=[]
            data._bind.text[attr].push(text)
        }
    }

    function bind_b_temp(text,attr,data){
        var t=temp(attr)
        var key
        var valueName
        for(var i=1;i<t.data.length;i++){
            key=t.data[i].key

            if(!data._temp[key])data._temp[key]=[]    
                
            valueName='innerHTML'
            if(text.tagName=='INPUT' || text.tagName=='TEXTAREA'){
                valueName='value'
            }

            data._temp[key].push({
                tag : text,
                temp : t,
                value : valueName
            })
        }
    }

    function bind_attr(attr,name,value,data,def){

        if(def){
            var valveIndex=value.indexOf(';')

            data[value.slice(0,valveIndex)]=value.slice(valveIndex+1)
            value=value.slice(0,valveIndex)
        }

        if(!data._bind.attr[value])
        data._bind.attr[value]=[]
        data._bind.attr[value].push({
            tag : attr.ownerElement,
            name : name
        })
    }

    function bind_attr_temp(attr,name,value,data){
        var t=temp(value)
        var key

        for(var i=1;i<t.data.length;i++){
            key=t.data[i].key

            if(!data._temp[key])data._temp[key]=[]
            data._temp[key].push({
                tag : attr.ownerElement,
                temp : t,
                value : 'attr',
                name : name
            })
        }
    }

    function get_set(data,name){
        define(data,name,{
            set: function (value){
                setData(data,name,value)
            },
            get: function(value){
                return this._data[name]
            },
        })

        // 初始化
        data[name]=data[name]
    }

    function setData(data,name,value){

        data._data[name]=value

        if(data._bind.input[name]){
            var inputs = data._bind.input[name]
            for(var i=0;i<inputs.length;i++)
                if(focus_input!=inputs[i])
                    inputs[i].value=value
        }

        if(data._bind.text[name]){
            var texts = data._bind.text[name]
            for(var i=0;i<texts.length;i++)
                texts[i].innerHTML=value
        }

        if(data._bind.attr[name]){
            var attrs = data._bind.attr[name]
            for(var i=0;i<attrs.length;i++){
                attrs[i].tag.setAttribute(attrs[i].name,value)
            }
        }

        if(data._temp[name]){
            var temps = data._temp[name]
            for(var i=0;i<temps.length;i++){
                if(temps[i].value=='attr'){
                    temps[i].tag.setAttribute(temps[i].name,temps[i].temp.tohtml(data._data))
                }
                else{
                    temps[i].tag[temps[i].value]=temps[i].temp.tohtml(data._data)
                }
            }
        }
    }

    $.bindData=bind
}(Object.defineProperty,$.temp,$),

// 事件绑定
function (document,$){

    var events=['click','focus','blur','input','submit','keydown']
    var eve={}

    eve.stop=function (e){
        e.stop=true
    }
    eve.stopTrue=function (e){
        e.stopTrue=true
    }
    eve.def=function (e){
        e.def=true
    }



    for(var i=0;i<events.length;i++)
        document.addEventListener(events[i],event,true)


    function getFn(name){

        var fn=eve

        name=name.split('(')
        var value=name[1]

        if(!value)value=')'
        value=JSON.parse('['+value.slice(0,value.length-1)+']')

        name=name[0].split('.')

        for(var i=0,length=name.length;i<length;i++){
            fn=fn[name[i]]
            if(!fn)break
        }

        return {
            fn : fn,
            value : value
        }
    }

    function event(e){
    

        var type=e.type
        var tag=e.target
        var eventName
        var fn
        var href=''


        while(tag && tag!=document){

            if(type=='click'){
                href=href||tag.getAttribute('href')||''
                if(href.indexOf('#')==0){
                    href=''
                }
            }

            eventName = tag.getAttribute(type)

            if(eventName){

                eventName=eventName.split(';')
                
                for(var i2=0;i2<eventName.length;i2++){

                    fn=getFn(eventName[i2])
                    if(typeof fn.fn=='function'){
                        fn.value.unshift(e)

                        try{
                            fn.fn.apply(tag,fn.value)
                        }
                        catch(error){
                            console.log('eve.'+eventName[i2],tag)
                            console.error(error)
                        }


                        if(e.stopTrue)
                        break
                    }
                }

                if(e.stop || e.stopTrue)
                break
            }

            tag=tag.parentNode
        }


        if(e.stop && e.stopPropagation){
            e.stopPropagation()
        }


        if(e.def && e.preventDefault){
            e.preventDefault()
        }

        if(href)
        if(!e.def){
            e.preventDefault()
            window.open(href,'_self')
        }
    }

    $.bindEvent=function(type){
        if(events.indexOf(type)!=-1)return
        events.push(type)
        document.addEventListener(type,event,true)
    }

    window.eve=eve
}(document,$),
// 滑动手势和click补丁
function(document){

    var ios=navigator.userAgent.toLowerCase().indexOf('iphone')!=-1 || navigator.userAgent.toLowerCase().indexOf('ipad')!=-1;

    var focus_el=['INPUT','TEXTAREA'];
    var xy1,xy2,xy2_2,xy3,
        time1,time2,time3,
        event_data;
    var isMove=false;
    var moveDef=true;


    document.addEventListener('touchstart',function(e){
        time1 = e.timeStamp;
        xy2_2=xy3 = xy1 = [e.touches[0].clientX,e.touches[0].clientY];
        xy2 = null;
        slidstart(e.target,xy1[0],xy1[1],'touch');
    },true);

    document.addEventListener('touchmove',function move(e){
        time2=e.timeStamp;
        xy2 = [e.touches[0].clientX,e.touches[0].clientY];
        var backEve;

        if(!isMove)
        if(Math.abs(xy2[0]-xy1[0])>3 || Math.abs(xy2[1]-xy1[1])>3){
            isMove=true;
            moveDef=false;
        }


        if(isMove)
        backEve=slidmove(e.target,xy2[0],xy2[1])

        if(moveDef || (backEve && backEve.def)){
            e.preventDefault()
        }

        xy2_2=xy2
    },true);

    document.addEventListener('touchend',function(e){

        time3 = e.timeStamp;
        if(xy2){
            xy3 = xy2;
        }

        // 如果是安卓系统，但是触发了滑动操作，将不再触发click
        if(isMove && (!ios)){
            e.preventDefault()
        }

        // 针对ios系统的click补丁
        if(ios && time3 - time1 <300){

            if(!isMove){

                var tag=e.target
                var input=tag

                if(focus_el.indexOf(input.nodeName)==-1){

                    while(tag && tag!=document){
                        if(tag.nodeName=='LABEL'){
                            input=tag.querySelector(focus_el.toString()) || document.querySelector('#'+tag.getAttribute('for'))
                            if(input)
                                break
                        }
                        tag=tag.parentNode
                    }
                }

                if(input && focus_el.indexOf(input.nodeName)==-1){
                    document.activeElement.blur()
                }
                else{
                    tag.focus()
                }

                e.preventDefault()

                setTimeout(function(){
                    $.dispatchEvent(e.target,'click',{
                        clientX:xy3[0],
                        clientY:xy3[1]
                    })
                })

            }
        }

        slidend(e.target,xy3[0],xy3[1]);
        isMove=false;
        moveDef=true;
    },true);

    document.addEventListener('mousedown',function (e){
        xy2_2=xy3 = xy1 = [e.clientX,e.clientY]
        slidstart(e.target,e.clientX,e.clientY,'mouse');
    },true)
    document.addEventListener('mousemove',function (e){
        xy2 = [e.clientX,e.clientY]
        slidmove(e.target,e.clientX,e.clientY);
        xy2_2=xy2
    },true)
    document.addEventListener('mouseup',function (e){
        slidend(e.target,e.clientX,e.clientY);
    },true)




    var down=false;
    var move=false;

    function getTo(x,y,to){
        if(to)return getToNew(x,y,to)

        if(Math.abs(x)>Math.abs(y)){
            return x>0?'right':'left'
        }
        else{
            return y>0?'bottom':'top'
        }
    }

    function getToNew(x,y,to){
        if(to=='top' || to=='bottom'){
            if(!y)return to
            return y>0?'bottom':'top'
        }
        else{
            if(!x)return to
            return x>0?'right':'left'
        }
    }

    function slidstart(tag,x,y,eventForm){

        down={
            target:tag,
            x:x,
            y:y,
            eventForm : eventForm,
        };

        return $.dispatchEvent(down.target,'slidstart',down)
    }

    function slidmove(tag,x,y,to){
        if(!down)return

        move=true

        down.toNew=getTo(xy2[0]-xy2_2[0],xy2[1]-xy2_2[1],down.toNew)

        if(!down.to){
            down.to=down.toNew
        }

        down.newX=x
        down.newY=y
        down.newTarget=tag

        return $.dispatchEvent(down.target,'slidmove',down);
    }

    function slidend(tag,x,y){

        if(!move){
            down=false
            return
        }

        down.newX=x
        down.newY=y
        down.newTarget=tag

        var e=$.dispatchEvent(down.target,'slidend',down);

        move=false
        down=false
        return e
    }

}(document);