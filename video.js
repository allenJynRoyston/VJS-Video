
export class VJSVideo {
  constructor(ele){      
    this.ele = ele;
    this.type = ele.getAttribute('type')
    this.videoId = ele.getAttribute('videoId')
    this.fallbackImage = ele.getAttribute('fallbackImage')
    this.loop = (!!this.ele.getAttribute('loop')) ? this.ele.getAttribute('loop')  === 'loop' || this.ele.getAttribute('loop')  === 'true' : false
    this.autoplay = (!!this.ele.getAttribute('autoplay')) ? this.ele.getAttribute('autoplay')  === 'autoplay' || this.ele.getAttribute('autoplay')  === 'true' : false
    this.controls = (!!this.ele.getAttribute('controls')) ? this.ele.getAttribute('controls')  === 'controls' || this.ele.getAttribute('controls')  === 'true' : false
    this.muted = this.autoplay ? true : (!!this.ele.getAttribute('muted')) ? this.ele.getAttribute('muted')  === 'muted' || this.ele.getAttribute('muted')  === 'true' : false
    this.playingInBackground = ele.parentNode.classList.contains('video-fullscreen-bg')    
    this.playingInCard =  ele.parentNode.classList.contains('video-card')   
    this.playingInElement = this.playingInBackground || this.playingInCard
    

    this._div;
    this.init();
  }

  init(){
    let {ele, type, videoId, fallbackImage, loop, autoplay, controls, muted, playingInElement, playingInCard, _div} = this;

    let _customBtn = ``;
        _customBtn += `
        <div class='video-fallbackimage--container'>
          <i class="video-fallbackimage--btn fas fa-play-circle fa-3x  ${playingInCard ? 'margin--150t white' : 'va-red'}"></i>
        </div>         
        `       
    let externalBtn = ele.parentNode.parentNode.querySelector('.video-external-btn')
    if(!!externalBtn){
      externalBtn.style.zIndex =  2;
      externalBtn.addEventListener('click', () => {
        this.loadVideo(true)
        ele.parentNode.parentNode.removeChild(externalBtn)
      })
    }

    
    if( !(!!fallbackImage) ){
      this.loadVideo();
    } else{
      _div = document.createElement('div')
      _div.innerHTML = `
        <div class="${playingInElement ? 'video-ready' : 'video-container video-ready'}" >
          <div class='video-fallbackimage--image' style='background: url(${fallbackImage}) no-repeat center center; background-size: cover;'>
          </div>  
          ${_customBtn}
        </div>
        `
        ele.parentNode.insertBefore( _div, ele );     
        ele.parentNode.querySelectorAll('.video-ready').forEach(_ele => {  
          _ele.querySelectorAll('.video-fallbackimage--btn').forEach(btn => {
            btn.onclick = () => {
              _ele.parentNode.removeChild(_ele)            
              this.loadVideo(true)
            }
          })
        })
    }    
  }

  loadVideo(forceAuto = false){    
    let {ele, type, videoId, fallbackimage, loop, autoplay, controls, muted, playingInElement, _div} = this;

   
    switch(type) {
        case 'venmo':        
          controls = autoplay ? false : controls; 
          if(forceAuto){
            loop = true
            autoplay = true
            controls = true
          }
          _div = document.createElement('div')
          _div.innerHTML = `
            <div class="${playingInElement ? '' : 'video-container'}" >
              <iframe src="https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&autopause=${loop ? 1 : 0}&background=${controls ? 0 : 1}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen >
            </div>
          `
          ele.parentNode.insertBefore( _div, ele );
        break;
        case 'youtube':          
          if(forceAuto){
            loop = true
            autoplay = true
            controls = false
          }      
          

          _div = document.createElement('div')
          _div.innerHTML = `
            <div class="${playingInElement ? '' : 'video-container'}" >      
              <iframe id="ytplayer" type="text/html" src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&autopause=${loop ? 1 : 0}&controls=${controls ? 1 : 0}&mute=${muted ? 1 : 0}&fs=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen >
            </div>
          `
          ele.parentNode.insertBefore( _div, ele );              
        break;
        case 'local':
          if(forceAuto){
            loop = false
            autoplay = true
            controls = true
          }    
          _div = document.createElement('div')
          _div.innerHTML = `
            <div class="${playingInElement ? '' : 'video-container'}" >
              <video ${autoplay ? 'autoPlay' : ''}  ${muted ? 'muted' : ''}  ${loop ? 'loop' : ''} ${controls ? 'controls' : ''}>              
                    <source src='${videoId}' type="video/mp4" />        
              </video> 
            </div>
          `
          ele.parentNode.insertBefore( _div, ele );                  
        break;
        default:        
    } 
  }

}
