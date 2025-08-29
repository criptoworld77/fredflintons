(function runner(){
  const canvas = document.getElementById('runnerCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * devicePixelRatio);
    canvas.height = Math.floor(h * devicePixelRatio);
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  resize(); window.addEventListener('resize', resize);

  const coinImg = new Image(); coinImg.src = 'img/logo.png';

  const state = {
    player: { x: 120, y: 0, w: 48, h: 56, vy:0, onGround:true, frame:0, ft:0 },
    groundY: 0,
    obstacles: [], stones: [], coins: [],
    speed: 220, spawnTimer: 0, stoneTimer: 0, coinTimer: 0,
    stonesCollected: Number(localStorage.getItem('fred_stones')||0),
    tokens: Number(localStorage.getItem('fred_tokens')||0),
    last: 0, running: true
  };
  const stonesCount = document.getElementById('stonesCount');
  const tokensBalance = document.getElementById('tokensBalance');
  stonesCount.textContent = state.stonesCollected;
  tokensBalance.textContent = state.tokens;

  const GRAV = 1200, JUMP_V = -520;

  function spawnObstacle(){ const h = 28 + Math.random()*36; const y = state.groundY - h; state.obstacles.push({ x: canvas.width + 40, y, w: 36 + Math.random()*24, h, vx: -state.speed }); }
  function spawnStone(){ const r = 14 + Math.random()*10; const y = state.groundY - 60 - Math.random()*120; state.stones.push({ x: canvas.width + 40, y, r, vx: -state.speed*0.9 }); }
  function spawnCoin(){  const r = 16 + Math.random()*10; const y = state.groundY - 80 - Math.random()*160; state.coins.push({ x: canvas.width + 40, y, r, vx: -state.speed*1.0 }); }

  function tryJump(){ if(state.player.onGround){ state.player.vy = JUMP_V; state.player.onGround = false; } }
  window.addEventListener('keydown', e=>{ if(e.code==='Space' || e.code==='ArrowUp') { e.preventDefault(); tryJump(); }});
  canvas.addEventListener('click', ()=> tryJump());
  canvas.addEventListener('touchstart', ()=> tryJump(), {passive:true});

  function rectIntersect(a,b){ return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h); }
  function circleRectIntersect(cx,cy,r,rect){
    const nx = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const ny = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const dx = cx - nx, dy = cy - ny;
    return dx*dx + dy*dy <= r*r;
  }

  function update(t){
    if(!state.last) state.last = t;
    const dt = Math.min(0.033, (t - state.last)/1000);
    state.last = t;
    if(!state.running){ requestAnimationFrame(update); return; }

    state.spawnTimer -= dt; state.stoneTimer -= dt; state.coinTimer  -= dt;
    if(state.spawnTimer <= 0){ spawnObstacle(); state.spawnTimer = 1.1 + Math.random()*0.9; }
    if(state.stoneTimer <= 0){ spawnStone(); state.stoneTimer = 0.8 + Math.random()*1.6; }
    if(state.coinTimer  <= 0){ spawnCoin();  state.coinTimer  = 2.4 + Math.random()*2.2; }

    state.player.vy += GRAV * dt; state.player.y  += state.player.vy * dt;
    if(!state.groundY) state.groundY = canvas.height - 80;
    if(state.player.y + state.player.h >= state.groundY){
      state.player.y = state.groundY - state.player.h; state.player.vy = 0; state.player.onGround = true;
    }

    if(state.player.onGround){ state.player.ft += dt; if(state.player.ft > 0.12){ state.player.frame = (state.player.frame+1)%2; state.player.ft = 0; } }

    for(const o of state.obstacles) o.x += -state.speed * dt;
    for(const s of state.stones) s.x += -state.speed * 0.9 * dt;
    for(const c of state.coins)  c.x += -state.speed * 1.0 * dt;

    state.obstacles = state.obstacles.filter(o => o.x + o.w > -50);
    state.stones    = state.stones.filter(s => s.x + s.r > -50);
    state.coins     = state.coins.filter(c => c.x + c.r > -50);

    const prect = { x: state.player.x, y: state.player.y, w: state.player.w, h: state.player.h };
    for(const o of state.obstacles){ if(rectIntersect(prect, o)){ state.speed = Math.max(120, state.speed - 60); state.player.vy = -240; } }
    for(let i=state.stones.length-1; i>=0; i--){
      const s = state.stones[i];
      if(circleRectIntersect(s.x, s.y, s.r, prect)){
        state.stonesCollected += 1;
        localStorage.setItem('fred_stones', state.stonesCollected);
        state.stones.splice(i,1);
        stonesCount.textContent = state.stonesCollected;
      }
    }
    for(let i=state.coins.length-1; i>=0; i--){
      const c = state.coins[i];
      if(circleRectIntersect(c.x, c.y, c.r, prect)){
        state.tokens += 1;
        localStorage.setItem('fred_tokens', state.tokens);
        tokensBalance.textContent = state.tokens;
        state.coins.splice(i,1);
      }
    }

    state.speed += (220 - state.speed) * dt * 0.25;

    render();
    requestAnimationFrame(update);
  }

  function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#0f0e0d'; ctx.fillRect(0,0,canvas.width,canvas.height);
    const gY = state.groundY || (canvas.height - 80);
    ctx.fillStyle = '#1b1714'; ctx.fillRect(0,gY,canvas.width,canvas.height-gY);
    for(let i=0;i<canvas.width;i+=48){
      ctx.fillStyle = '#3b342f';
      ctx.beginPath(); ctx.ellipse(i + (state.last/50)%48, gY + 18, 14, 10, 0, 0, Math.PI*2); ctx.fill();
    }
    for(const o of state.obstacles){
      ctx.fillStyle = '#6d5848';
      ctx.beginPath(); ctx.ellipse(o.x + o.w/2, o.y + o.h/2, o.w/2, o.h/2, 0,0,Math.PI*2); ctx.fill();
    }
    for(const s of state.stones){
      const grd = ctx.createRadialGradient(s.x - s.r*0.3, s.y - s.r*0.3, s.r*0.2, s.x, s.y, s.r);
      grd.addColorStop(0,'#cbbda2');grd.addColorStop(.5,'#a69782');grd.addColorStop(1,'#5a4f43');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    for(const c of state.coins){
      if(coinImg.complete) ctx.drawImage(coinImg, c.x - c.r, c.y - c.r, c.r*2, c.r*2);
      else { ctx.fillStyle='gold'; ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2); ctx.fill(); }
    }

    const p = state.player;
    ctx.save(); ctx.translate(p.x, p.y);
    ctx.fillStyle = '#c8b08f'; roundRect(ctx, 0, 0, p.w, p.h, 8); ctx.fill();
    ctx.strokeStyle = '#2a2218'; ctx.lineWidth = 4; ctx.lineCap='round';
    ctx.beginPath();
    if(p.frame===0){ ctx.moveTo(14, p.h); ctx.lineTo(14, p.h+12); ctx.moveTo(p.w-14, p.h-2); ctx.lineTo(p.w-6, p.h+10); }
    else          { ctx.moveTo(18, p.h-2); ctx.lineTo(8, p.h+10); ctx.moveTo(p.w-18, p.h); ctx.lineTo(p.w-18, p.h+12); }
    ctx.stroke();
    ctx.fillStyle='#2a2218'; ctx.beginPath(); ctx.arc(16, 18, 3, 0, Math.PI*2); ctx.arc(30, 18, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#7f5d3b'; ctx.fillRect(p.w-10, 14, 14, 6);
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  document.getElementById('convertBtn').addEventListener('click', ()=>{
    const rate = 5;
    if(state.stonesCollected < rate){ alert('Not enough stones to convert.'); return; }
    const coins = Math.floor(state.stonesCollected / rate);
    state.tokens += coins;
    state.stonesCollected -= coins * rate;
    localStorage.setItem('fred_tokens', state.tokens);
    localStorage.setItem('fred_stones', state.stonesCollected);
    document.getElementById('stonesCount').textContent = state.stonesCollected;
    document.getElementById('tokensBalance').textContent = state.tokens;
  });
  document.getElementById('resetRun').addEventListener('click', ()=>{
    if(confirm('Reset progress?')){
      state.stonesCollected = 0; state.tokens=0;
      localStorage.removeItem('fred_stones'); localStorage.removeItem('fred_tokens');
      document.getElementById('stonesCount').textContent = 0;
      document.getElementById('tokensBalance').textContent = 0;
      state.obstacles=[]; state.stones=[]; state.coins=[]; state.speed=220;
    }
  });

  requestAnimationFrame(update);
})();
