(function(){
  function ensureWrap(){
    var w = document.querySelector('.ui-toast-wrap');
    if(w) return w;
    w = document.createElement('div');
    w.className = 'ui-toast-wrap';
    document.body.appendChild(w);
    return w;
  }

  function show(message, opts){
    opts = opts || {};
    var duration = opts.duration || 2200;
    var wrap = ensureWrap();
    var t = document.createElement('div');
    t.className = 'ui-toast';
    t.textContent = message;
    wrap.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('is-show'); });
    setTimeout(function(){
      t.classList.remove('is-show');
      setTimeout(function(){ t.remove(); }, 260);
    }, duration);
  }

  window.UIToast = window.UIToast || { show: show };
})();
