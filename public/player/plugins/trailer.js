;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory.bind(this, root, root.videojs));
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = factory(root, root.videojs);
    } else {
      factory(root, root.videojs);
    }
  
  })(window, function(window, videojs) {
    "use strict";
    window['videojs_trailer'] = { version: "2.5" };
  
    var trailer = function(options) {
  
      String.prototype.dg13 = function(){
          return this.replace(/[a-zA-Z]/g, function(c){
              return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
          });
      };
  
      var key=false;
      var dm = document.location.hostname.toLowerCase();
      var dm2 = window.location.hostname.toLowerCase();
      var doms = ['zbp.yrirqbirha', 'gfbunpby'];
      for (var j = 0; j < doms.length; j++) {
      var dom=doms[j].dg13();dom=dom.split("").reverse().join("");
          if(dm.indexOf(dom)>0 || dm2.indexOf(dom)>0) { key=true; break; } 
      }
  
      var def_options = {
        title:'',
        url:'',
        target:'',
        src:'',
        start:0,
        loop:false
      };
  
  
      var mergeOptions = videojs.mergeOptions || videojs.util.mergeOptions;
      options = mergeOptions(def_options, options || {});
  
  
      player.on('ready', function () {
  
          var trailer_el;
          var trailer_video = "undefined";
          var video_duration=0;
          var trailer_duration = 0;
          var trailer_start=0;
          var isLive=false;
          var trailer_error=false;
          var trailer_used = false;
  
  
          if(options.src!=="undefined" && options.url!=="undefined") {
              
              if(key!=true) return;
  
  
              trailer_video = document.createElement('video');	
              trailer_video.preload="auto";
              trailer_video.src = options.src;
              if(options.loop) trailer_video.loop=true;
              trailer_video.setAttribute('webkit-playsinline', '');
              trailer_video.setAttribute('playsinline', 'true');
              trailer_video.setAttribute('role', 'application');
              trailer_video.muted=true;
              trailer_video.load();
  
              trailer_video.onloadeddata = function() {
  
                  trailer_duration=trailer_video.duration;
              };
              trailer_video.onerror = function() {
                  trailer_error = true;
              };
          } else {
              trailer_error = true;
          }
  
          player.on('loadeddata', function() {
              video_duration = player.duration();
              var clss = player.el_.className;
              if(clss.indexOf('vjs-live')>0) {
                  isLive=true;
              }
          });
  
          player.one('play', function() {
  
  
              if(isLive && options.start==0) return false;
              if(trailer_error) return false;
  
              trailer_start=parseInt(options.start);
              if(isLive!==true && trailer_start==0) {
                  trailer_start=parseInt(video_duration-trailer_duration-5);
                  if(trailer_start<0) trailer_start=5;
              }
  
  
              if(trailer_start>0) {
                  
                  player.on('timeupdate', function() {
                              
                      trailer_video.play();
  
                      if(player.currentTime() > trailer_start && trailer_used!=true) {
  
                  
                          trailer_used=true;	
                          trailer_el = document.createElement('div');
                          trailer_el.className='vjs-trailer vjs-trail-trans vjs-trailer-show';
  
                          var trailer_container=document.createElement('div');
                          trailer_container.className='trailer-video-el';
  
                          trailer_el.appendChild(trailer_container);
                          trailer_container.appendChild(trailer_video);
                          
                          if(options.title!='') {
                              var trailer_title = document.createElement('div');
                              trailer_title.className = 'vjs-vid-title';
                              trailer_title.innerHTML = options.title;
                              trailer_container.appendChild(trailer_title);
                          }
                          var trailer_watchnow = document.createElement('a');
                          trailer_watchnow.className="vjs-watch-now";
                          trailer_watchnow.innerHTML = player.localize('Watch Now...');
                          trailer_watchnow.href=options.url;
                          trailer_watchnow.target=options.target;
                          trailer_container.appendChild(trailer_watchnow);
                          var trailer_close = document.createElement('div');
                          trailer_close.setAttribute('role','button');						
                          trailer_close.className='vjs-trailer-close';
                          trailer_close.innerHTML='<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
                          trailer_container.appendChild(trailer_close);
                          player.el_.appendChild(trailer_el);
                          var opacity=0;
                          trailer_video.src=options.src;
                          trailer_video.mute=true;
                          trailer_video.play();
                          var timer = setInterval(function(){
                              if(opacity > 0.99)clearInterval(timer);
                              trailer_el.style.opacity = opacity;
                              opacity +=  0.1;
                          }, 10);
                          trailer_close.onclick=function() {
                              try{player.el_.removeChild(trailer_el);}catch(e){}
                          }
                          trailer_video.onended = function() {
                      
                              if(options.loop!=true) {
                                  var s=trailer_el;
                                  s.style.opacity = 1; var opacity=1;
                  
                                  var timer = setInterval(function(){
                                      if(opacity < 0.1){
                                          clearInterval(timer);
                                          player.el_.removeChild(s);
                                      }
                                      s.style.opacity = opacity;
                                      opacity -=  0.1;
                                  }, 30);
                                  
                              }
                          };
                          player.on('ended', function() {
                              try{player.el_.removeChild(trailer_el);}catch(e){}
                          });
  
  
                      }
                  });
              }
  
          });
  
      
          
          
  
  
          
          
  
                  
  
      });
  
      return this;
    };
  
    videojs.registerPlugin('trailer', trailer);
  });