(function(){
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 헤더 아래 선 */
  var gh=$('#gtop'); function hs(){ if(gh) gh.classList.toggle('sc',scrollY>8); } hs(); addEventListener('scroll',hs,{passive:true});

  /* 등장 모션 (한 번만) */
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } }); },{threshold:.08});
  $$('.rv').forEach(function(el){ io.observe(el); });

  /* 숫자: 화면에 들어올 때 한 번만 올라감 */
  var cio=new IntersectionObserver(function(es){ es.forEach(function(e){
    if(!e.isIntersecting) return; cio.unobserve(e.target);
    var el=e.target, to=+el.dataset.to, t0=null, d=1100;
    if(reduce){ el.textContent=to.toLocaleString(); return; }
    function f(t){ if(!t0) t0=t; var k=Math.min(1,(t-t0)/d), v=Math.round(to*(1-Math.pow(1-k,3))); el.textContent=v.toLocaleString(); if(k<1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }); },{threshold:.6});
  $$('.cnt[data-to]').forEach(function(el){ cio.observe(el); });

  /* 평점 막대: 한 번만 올라감 (.gpa.on 은 위 등장 모션이 붙임) */

  /* 히어로 회전 단어 */
  var rot=$$('.rot span'); if(rot.length){ var ri=0; rot[0].classList.add('on'); if(!reduce) setInterval(function(){ rot[ri].classList.remove('on'); ri=(ri+1)%rot.length; rot[ri].classList.add('on'); },2200); }

  /* 영상: 화면에 들어오면 재생, 장면 목록으로 이동 */
  var vio=new IntersectionObserver(function(es){ es.forEach(function(e){ var v=e.target; if(e.isIntersecting){ var p=v.play(); if(p&&p.catch)p.catch(function(){}); } else v.pause(); }); },{threshold:.45});
  $$('.demo').forEach(function(d){
    var v=$('video',d), bs=$$('.chap button',d), ol=$('.chap ol',d);
    if(!v) return;
    if(!reduce) vio.observe(v);
    bs.forEach(function(b){ b.addEventListener('click',function(){ v.currentTime=+b.dataset.t; var p=v.play(); if(p&&p.catch)p.catch(function(){}); }); });
    var last=-1;
    v.addEventListener('timeupdate',function(){
      var t=v.currentTime, k=-1; bs.forEach(function(b,i){ if(+b.dataset.t<=t+.2) k=i; });
      if(k!==last){ bs.forEach(function(b,i){ b.classList.toggle('on',i===k); }); last=k;
        if(k>=0&&ol){ var b=bs[k]; var top=b.offsetTop-ol.offsetTop-40; ol.scrollTo({top:top,behavior:'smooth'}); } }
    });
  });

  /* 소리 켜기 */
  $$('[data-snd]').forEach(function(b){ var v=b.parentNode.querySelector('video'); function sync(){ b.textContent=v.muted?'소리 켜기':'소리 끄기'; b.classList.toggle('on',!v.muted); }
    b.addEventListener('click',function(){ v.muted=!v.muted; if(!v.muted){ var p=v.play(); if(p&&p.catch)p.catch(function(){}); } sync(); }); v.addEventListener('volumechange',sync); });


  /* 두 줄로 흐르는 이미지: 윗줄은 왼쪽, 아랫줄은 오른쪽으로. 마우스를 올리면 멈추고, 끌어서 넘길 수 있음 */
  var mq=$('#mq');
  if(mq){
    var rows=$$('.mtrack',mq).map(function(el){ return {el:el,x:0,half:0,dir:+el.dataset.dir,v:0,init:false}; });
    var dragging=false,lastX=0,hover=false;
    function measure(){ rows.forEach(function(r){ r.half=r.el.scrollWidth/2||1; if(!r.init&&r.half>2){ r.init=true; if(r.dir>0) r.x=-r.half*0.5; } }); }
    function wrapR(r){ while(r.x<=-r.half) r.x+=r.half; while(r.x>0) r.x-=r.half; }
    function loop(){
      rows.forEach(function(r){
        if(!dragging){ r.x+=r.v; r.v*=0.94; if(Math.abs(r.v)<0.05) r.v=0; if(!reduce&&!hover&&!r.v) r.x+=0.35*r.dir; }
        wrapR(r); r.el.style.transform='translate3d('+r.x+'px,0,0)';
      });
      requestAnimationFrame(loop);
    }
    mq.addEventListener('pointerdown',function(e){ if(e.button>0) return; dragging=true; lastX=e.clientX; rows.forEach(function(r){r.v=0}); mq.classList.add('drag'); });
    window.addEventListener('pointermove',function(e){ if(!dragging) return; var dx=e.clientX-lastX; lastX=e.clientX; rows.forEach(function(r,i){ var d=i%2?-dx:dx; r.x+=d; r.v=d; }); });
    window.addEventListener('pointerup',function(){ dragging=false; mq.classList.remove('drag'); });
    mq.addEventListener('mouseenter',function(){hover=true}); mq.addEventListener('mouseleave',function(){hover=false});
    measure(); addEventListener('resize',measure); addEventListener('load',measure); setTimeout(measure,800); requestAnimationFrame(loop);
  }


  /* 따라다니는 커서 (마우스 기기에서만): 흐르는 이미지=양방향 화살표, 카드=보기, 외부 링크=GitHub, 확대 이미지=돋보기 */
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    var marks=[['#mq','drag'],['.card','view'],['.fname h3 a','view'],['.pidx6 a','view'],['a[href*="github.com"]','ext'],['[data-zoom]','zoom']];
    marks.forEach(function(m){ $$(m[0]).forEach(function(el){ if(!el.dataset.cur) el.dataset.cur=m[1]; }); });
    var A='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
    var cur=document.createElement('div'); cur.id='cur'; cur.setAttribute('aria-hidden','true');
    cur.innerHTML='<span class="ci ci-drag">'+A+'<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>드래그</span>'
      +'<span class="ci ci-view">'+A+'<path d="M7 17L17 7M9 7h8v8"/></svg>보기</span>'
      +'<span class="ci ci-ext"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>GitHub</span>'
      +'<span class="ci ci-zoom">'+A+'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8v6M8 11h6"/></svg>크게</span>';
    document.body.appendChild(cur); document.body.classList.add('cur-on');
    var mx=-200,my=-200,cx=-200,cy=-200,on=false,k='',sc=0;
    addEventListener('mousemove',function(e){ mx=e.clientX; my=e.clientY; var t=e.target.closest&&e.target.closest('[data-cur]'); var nk=t?t.dataset.cur:''; if(nk!==k){ k=nk; if(k) cur.dataset.k=k; on=!!k; } },{passive:true});
    function recheck(){ var el=document.elementFromPoint(mx,my); var t=el&&el.closest?el.closest('[data-cur]'):null; var nk=t?t.dataset.cur:''; if(nk!==k){ k=nk; if(k) cur.dataset.k=k; } on=!!k; }
    addEventListener('scroll',recheck,{passive:true});
    document.addEventListener('mouseleave',function(){ on=false; });
    (function tick(){ cx+=(mx-cx)*.22; cy+=(my-cy)*.22; sc+=((on?1:0)-sc)*.2; cur.style.transform='translate3d('+cx+'px,'+cy+'px,0) scale('+sc.toFixed(3)+')'; requestAnimationFrame(tick); })();
  }

  /* 복사 */
  var toast=$('#toast');
  $$('[data-copy]').forEach(function(b){ b.addEventListener('click',function(){
    var s=b.dataset.copy; (navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).catch(function(){ var t=document.createElement('textarea'); t.value=s; document.body.appendChild(t); t.select(); try{document.execCommand('copy')}catch(e){} t.remove(); });
    if(toast){ toast.classList.add('on'); setTimeout(function(){toast.classList.remove('on')},1400); }
  }); });

  /* 코드 파일: 펼칠 때 불러오기 */
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  $$('details.file').forEach(function(d){
    d.addEventListener('toggle',function(){
      if(!d.open||d.dataset.loaded) return; d.dataset.loaded='1';
      var body=$('.fbody',d);
      fetch(d.dataset.src).then(function(r){ if(!r.ok) throw 0; return r.text(); }).then(function(txt){
        var n=txt.split('\n').length, nums=''; for(var i=1;i<=n;i++) nums+=i+'\n';
        body.innerHTML='<div class="codewrap"><pre class="gut" aria-hidden="true">'+nums+'</pre><pre class="src"><code class="language-'+(d.dataset.lang||'plaintext')+'">'+esc(txt)+'</code></pre></div>';
        var c=$('code',body); if(window.hljs&&txt.length<400000){ try{ hljs.highlightElement(c); }catch(e){} }
      }).catch(function(){ body.innerHTML='<div class="loading">코드를 불러오지 못했습니다. GitHub 링크로 확인해 주세요.</div>'; });
    });
  });
  if(window.hljs){ $$('.cb pre code').forEach(function(c){ try{ hljs.highlightElement(c); }catch(e){} }); }

  /* 이미지 크게 보기 */
  var lb=$('#lb'), lbi=$('#lb-img'), lbc=$('#lb-cap');
  if(lb){
    document.addEventListener('click',function(e){
      if(lb.classList.contains('on')){ lb.classList.remove('on'); return; }
      var t=e.target.closest('[data-zoom]'); if(!t) return;
      lbi.src=t.getAttribute('src'); lbc.textContent=t.getAttribute('alt')||''; lb.classList.add('on');
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') lb.classList.remove('on'); });
  }

  /* 상세 탭 위치 표시 */
  var tabs=$$('.dtabs a'), map={}; tabs.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
  if(tabs.length){
    var tio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ tabs.forEach(function(a){a.classList.remove('on')}); var a=map[en.target.id]; if(a){ a.classList.add('on'); var bar=a.parentNode; var x=a.offsetLeft-bar.offsetLeft; if(x<bar.scrollLeft||x+a.offsetWidth>bar.scrollLeft+bar.clientWidth) bar.scrollLeft=x-16; } } }); },{rootMargin:'-35% 0px -60% 0px'});
    $$('.ds[id]').forEach(function(s){ tio.observe(s); });
  }
})();
