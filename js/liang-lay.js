class lay{
  static age = 0

  constructor(obj){
      // 属性筛洗
      this.obj = this.clean(obj)
      
      if('content' in obj){
          if(Array.isArray(obj.content)){
              this.icon = obj.content[0];
              this.content =  obj.content[1];
          }else{
              this.content =  obj.content;
          }
      }

      // 外部带入-覆盖
      this.type = 'type' in obj ? obj.type : 1;
      this.anim = 'anim' in obj ? obj.anim : 'anim1';
      this.area = 'area' in obj ? obj.area : ['500px','240px'];
      this.shade = 'shade' in obj ? [ obj.shade[0] , obj.shade[1] ] : ['black','0.6'];
      this.title = 'title' in obj ? obj.title : '温馨提示';
      this.time = 'time' in obj ? obj.time : 1200;
      this.zindex = 'zindex' in obj ? obj.zindex : 100;
      //-无覆盖
      //弹框背景样式
      if('skin' in obj) this.skin = obj.skin;
      if('btn' in obj) this.btn = obj.btn;
      if('btn1Func' in obj) this.btn1Func = obj.btn1Func;
      if('btn2Func' in obj) this.btn2Func = obj.btn2Func;
      // 内部自有属性
      this.times = new Date().getTime();
      
      
      //初始化执行 
      this.init(obj);
  }
  clean(obj){
      for(let key in obj){
          if((obj[key]==null)||(obj[key]==undefined)) delete obj[key];
      }
      return obj
  }

  init(obj){
      // 静态标识属性-自增1
      this.getId()
      
      //主体dom动态载入执行
      this.start();
      
      //标题执行
      this.Title();
      // 内容执行
      this.addCont();

      
      // 弹框背景定义
      this.bg();
      // 窗口大小跟踪
      this.resize();
      
      // 窗口icon执行
      this.stateIcon();
      // 右上关闭按钮
      this.rightTopClose();
      // 弹框关闭时间
      this.closeTime(obj);
      
      

      // 类型选择
      switch (this.type) {
          case 0:
              // msg倒计时弹框
              this.titleDom.remove();
              this.btnBoxDom.remove();
              this.closeDom.remove();
              this.area = 'area' in obj ? obj.area : ['240px','80px'];
              
              this.shade = 'shade' in obj ? obj.shade : ['transparent','0.6'];

              this.contDom.addClass('c_msgClass')
              this.contDom.children('.lay_content').addClass('mt0')
              setTimeout(()=>{
                  this.close()
              }, this.time);

              break;
          case 1:
              // alert场景 一段话或者再加一个按钮，固定
              if('btn' in this)   this.oneBtn();
              break;
          case 2:
              // config场景 一段话加两个按钮，固定
              if('btn' in this){
                  this.oneBtn();
                  this.twoBtn();
              }
              break;
          case 3:
              // 复杂dom元素场景  删除内部其他元素保留close按钮，将dom元素复制克隆到container内
              // this.contentDom.remove();
              this.btnBoxDom.remove();
              break;
          case 4:
              // loading弹出
              // msg倒计时弹框
              this.titleDom.remove();
              
              this.btnBoxDom.remove();
              this.closeDom.remove();
              
              this.shade = 'shade' in obj ? obj.shade : ['transparent','0.6'];

              this.contDom.addClass('c_loadClass')


              break;
          default:
              break;
      }


      // 弹出
      this.end();
      // 位置定位
      this.position();
      
  }
  
  getId(){
      lay.age++;
  }
  start(){  
      $('body').append(`<div class="lay_shade " uid="${lay.age}" style="z-index:${this.zindex}"  ></div>`);
      if(this.type == 3){
          this.content.css('display','block');
          this.content.wrapAll(`<div class="lay_container" uid="${lay.age}" style="z-index:${this.zindex+1}"></div>`)
          .wrapAll('<div class="lay_content"></div>');
      }else{
          $('body').append(`
          <div class="lay_container" uid="${lay.age}" style="z-index:${this.zindex+1}">
              <div class="lay_content">${this.content}</div>
          </div>`);
      }
    

      this.shadeDom = $(`.lay_shade[uid="${lay.age}"]`);
      this.contDom =  $(`.lay_container[uid="${lay.age}"]`);
      this.contDom.prepend(`<div class="lay_title">${this.title}</div><a class="lay_close iconfont icon-close" ></a>`)
      this.contDom.append(`<div class="lay_btn_box"></div>`)


      this.titleDom = this.contDom.children('.lay_title'); 
      this.closeDom = this.contDom.children('.lay_close'); 
      this.contentDom = this.contDom.children('.lay_content');  
      this.btnBoxDom = this.contDom.children('.lay_btn_box');  
      
  }
  end(){
      // 遮罩执行
      this.shadeDom.height(this.winHeight()).width(this.winWidth()).css({'background':this.shade[0],'opacity':this.shade[1]})
      // 弹框执行
      this.contDom.width(this.area[0]).height(this.area[1]).addClass(this.anim)
  }
  Title(){
      if(this.title == false){
          this.titleDom.remove();
      }
  }
  // 将this.content判断后放入lay_content
  addCont(){
      // 判断是否为对象
      let Type = typeof(this.content);
      if(Type == 'object'){
          // this.contDom.append(this.content.clone(true).css('display','block'));
      }else if(Type == 'string'){
          if(this.type == 4){
              // this.contDom.append(this.content);
          }else{
              // this.contentDom.append(this.content);
          }
      }
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
          this.close();
          if('btn1Func' in this) this.btn1Func();
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
          this.close();
          if('btn1Func' in this) this.btn2Func();
      })
  }
  // 关闭函数
  close(){    
      
      this.contDom.addClass(this.anim+'0')
      this.shadeDom.animate({'opacity':'0'},300);
      setTimeout(() => {
          if(this.type == 3){
              this.titleDom.remove(); 
              this.closeDom.remove(); 
              this.content.unwrap().unwrap().css({'display':'none'});
          }else{
              this.contDom.remove();
          }
          this.shadeDom.remove();
      },300);
  }
  closeTime(obj){
      if(('time' in obj)&&(this.type != 0)) {
          setTimeout(()=>{
              this.close()
          }, this.time);
      }
  }
}