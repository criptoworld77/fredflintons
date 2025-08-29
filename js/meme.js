(function memeGen(){
  const file = document.getElementById('memeFile'),
        top = document.getElementById('topText'),
        bottom = document.getElementById('bottomText'),
        canvas = document.getElementById('memeCanvas'),
        ctx = canvas.getContext('2d'),
        dl = document.getElementById('downloadMeme');
  let img = new Image();

  function draw(){
    ctx.fillStyle = '#0f0e0d'; ctx.fillRect(0,0,canvas.width,canvas.height);
    const pad = 12;
    if(img && img.naturalWidth){
      const scale = Math.min((canvas.width-2*pad)/img.naturalWidth, (canvas.height-2*pad)/img.naturalHeight);
      const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
      const x = (canvas.width - w)/2, y = (canvas.height - h)/2;
      ctx.drawImage(img, x, y, w, h);
    } else {
      ctx.fillStyle = '#1a1614'; ctx.fillRect(pad,pad,canvas.width-2*pad, canvas.height-2*pad);
      ctx.fillStyle = '#ddd'; ctx.font = '600 20px system-ui'; ctx.textAlign='center';
      ctx.fillText('Choose an image to create a meme', canvas.width/2, canvas.height/2);
    }
    ctx.textAlign='center'; ctx.lineJoin='round'; ctx.strokeStyle='black';
    function drawLines(text, yStart){
      const lines = (text||'').toUpperCase().split('\n').slice(0,4);
      lines.forEach((ln,i)=>{
        const size = 48 - i*6;
        ctx.font = `900 ${size}px Impact, system-ui, sans-serif`;
        ctx.lineWidth = Math.max(6, size/12);
        ctx.strokeText(ln, canvas.width/2, yStart + i*size);
        ctx.fillStyle = 'white'; ctx.fillText(ln, canvas.width/2, yStart + i*size);
      });
    }
    drawLines(top.value, 64);
    drawLines(bottom.value, canvas.height - 140);
  }

  file.addEventListener('change', e=>{
    const f = e.target.files[0]; if(!f) return;
    const url = URL.createObjectURL(f);
    img.onload = ()=>{ draw(); URL.revokeObjectURL(url); };
    img.src = url;
  });
  top.addEventListener('input', draw); bottom.addEventListener('input', draw);
  dl.addEventListener('click', ()=>{
    draw();
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'fred-meme.png'; a.click();
  });
  draw();
})();
