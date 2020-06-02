class lay{
    constructor(obj){
        // 属性筛洗
        this.obj = this.clean(obj)

        // 外部带入
        this.type = 'type' in obj ? obj.type : 1;

        if('content' in obj){
            if(Array.isArray(obj.content)){
                this.icon = obj.content[0];
                this.content =  obj.content[1];
            }else{
                this.content =  obj.content;
            }
        }else{
            this.content =  '';
        }

        this.anim = 'anim' in obj ? obj.anim : 'anim1';
        this.area = 'area' in obj ? obj.area : ['600px','300px'];
        this.shade = 'shade' in obj ? [ obj.shade[0] , obj.shade[1] ] : ['black','0.6'];
        this.title = 'title' in obj ? obj.title : '温馨提示';
       
        
        //弹框背景样式-没有则默认，有则换
        if('skin' in obj) this.skin = obj.skin
        if('btn' in obj) this.btn = obj.btn;
        if('btn1Func' in obj) this.btn1Func = obj.btn1Func;
        if('btn2Func' in obj) this.btn2Func = obj.btn2Func;
        // 内部自有属性
        this.times = new Date().getTime();
        
        
        //初始化执行 
        this.init();
    }
    clean(obj){
        for(let key in obj){
            if((obj[key]==false)||(obj[key]==null)||(obj[key]==undefined)) delete obj[key];
        }
        return obj
    }

    init(){
        //主体dom动态载入执行
        this.start();

        // 类型选择
        switch (this.type) {
            case 1:
                // alert场景 一段话或者一段话加一个按钮，固定
                if('btn' in this) this.oneBtn();
                break;
            case 2:
                // config场景 一段话加两个按钮，固定
                if('btn' in this){
                    this.oneBtn();
                    this.twoBtn();
                }
                break;
            case 3:
                // 复杂dom元素场景1 保留title与close 删除内部其他元素，将dom元素复制克隆到container内
                this.open();
                break;
            case 4:
                // 复杂dom元素场景2 删除内部所有元素，将dom元素复制克隆到container内
                this.titleDom.remove();
                this.open();
                
                break;
            default:
                break;
        }

        // 弹框背景定义
        this.bg();
        // 窗口大小跟踪
        this.resize();
        // 位置定位
        this.position();
        // 窗口icon执行
        this.stateIcon();
        // 右上关闭按钮
        this.rightTopClose();
    }
    start(){    
        $('body').append(`
        <div class="lay_shade " data_shade="id${this.times}"  ></div>
        <div class="lay_container" > 
        <div class="lay_title">${this.title}</div>
        <a class="lay_close iconfont icon-close" ></a>
        <div class="lay_content">${this.content}</div>
        <div class="lay_btn_box"></div>
        </div>`);
        

        this.shadeDom = $(`.lay_shade[data_shade="id${this.times}"]`);
        this.contDom = this.shadeDom.next();
        this.titleDom = this.contDom.children('.lay_title'); 
        this.closeDom = this.contDom.children('.lay_close'); 
        this.contentDom = this.contDom.children('.lay_content');  
        this.btnBoxDom = this.contDom.children('.lay_btn_box');  
        
        // 遮罩执行
        this.shadeDom.height(this.winHeight()).width(this.winWidth()).css({'background':this.shade[0],'opacity':this.shade[1]})
        // 弹框执行
        this.contDom.width(this.area[0]).height(this.area[1]).addClass(this.anim)
        
    }
    open(){
        // this.titleDom.remove();
        this.contentDom.remove();
        this.btnBoxDom.remove();

        this.contDom.append(this.content.clone(true).css('display','block'));
    }
    bg(){
        if('skin' in this){
            this.contDom.addClass(`custom  ${this.skin}`)
        }
    }
    winWidth(){
        return $(window).width();
    }
    winHeight(){
        return $(window).height();
    }
    // container位置定位
    position(){
        this.contDom.css({top:this.winHeight()/2-this.contDom.height()/2,left:this.winWidth()/2-this.contDom.width()/2})
    }
    // 窗口大小跟踪
    resize(){   
        $(window).resize(()=>{
            $('.lay_shade').height(this.winHeight()).width(this.winWidth());
            this.position();
        });
    }
    // 右上关闭按钮
    rightTopClose(){
        this.closeDom.click(()=>{
            this.close()
        })
    }
    // 框内状态图标
    stateIcon(){
        if('icon' in this){
            
            
            this.contentDom.prepend(`<i class="lay_icon iconfont"></i>`);
            this.stateIconDom = this.contentDom.children('.iconfont');
            // 类型选择
            switch (this.icon) {
                case 'success':
                    this.stateIconDom.addClass('icon-chenggong')
                    break;
                case 'error':
                    this.stateIconDom.addClass('icon-shibai')
                    break;
                case 'inquiry':
                    this.stateIconDom.addClass('icon-wenhao')
                    break;
                default:
                    break;
            }

        }
    }
    // dom元素框内按钮执行
    oneBtn(){
        // 第一个按钮触发
        switch (this.btn[0]) {
            case 1: this.btnBoxDom.append(`<a class="lay_bttn lay_bttn1" >${this.btn[1][0]}</a>`);
                break;
            case 2: this.btnBoxDom.append(`<a class="lay_bttn  ${this.btn[1][0]}" ></a>`); 
                break;
            case 3: this.btnBoxDom.append(this.btn[1][0]);
                break;
            default:
                break;
        }
       
        
        
        this.btnBoxDom.children().eq(0).click(()=>{
            this.btn1Func();
        })

        //判断type类型来决定单个按钮的位置
    }
    twoBtn(){
        // 第二个按钮触发
        switch (this.btn[0]) {
            case 1: this.btnBoxDom.append(`<a class="lay_bttn lay_bttn2" >${this.btn[1][1]}</a>`);
                break;
            case 2: this.btnBoxDom.append(`<a class="lay_bttn ${this.btn[1][1]}" ></a>`);
                break;
            case 3: this.btnBoxDom.append(this.btn[1][1]);
                break;
            default:
                break;
        }
        
        this.btnBoxDom.children().eq(1).click(()=>{
            this.btn2Func();
        })
    }
    // 关闭函数
    close(){    
        
        this.contDom.addClass(this.anim+'0')
        this.shadeDom.animate({'opacity':'0'},300);
        setTimeout(() => {
            this.contDom.remove();
            this.shadeDom.remove();
        },300);
    }

}