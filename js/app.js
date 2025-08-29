// I18N, particles, theme, copy/explorer, year, smooth-scroll
const LOCALES = {
  en: {
    nav: { tokenomics: "Tokenomics", rockmap: "Rockmap", howto: "How to buy", play: "Play the Meme Game", meme: "Meme Generator", community: "Community" },
    cta: { buy: "Buy FRED" },
    hero: { title: "“Yabba Dabba To The Moon!” 🚀🌕", subtitle: "The Stone Age memecoin for the Crypto Era. 1 Billion FREDs carved in stone. Community > Technology.", p1:"🪨 Prehistoric memes", p2:"⚒️ Forged by community", p3:"🔥 Fair launch" },
    tokenomics: { title: "Tokenomics" },
    rockmap: { title: "Rockmap" },
    howto: { title: "How to buy (Solana)", step1: "Install a Solana wallet (Phantom, Solflare).", step2: "Fund it with SOL for fees.", step3: "Use a Solana DEX (Raydium, Jupiter) and add the token mint.", step4: "Set slippage and swap — be careful." },
    play: { title: "Play the Meme Game — Fred runs" },
    meme: { title: "Meme Generator" },
    community: { title: "Community" }
  },
  pt: {
    nav: { tokenomics: "Tokenomics", rockmap: "Rockmap", howto: "Como comprar", play: "Jogar", meme: "Gerador de Meme", community: "Comunidade" },
    cta: { buy: "Comprar FRED" },
    hero: { title: "“Yabba Dabba Para a Lua!” 🚀🌕", subtitle: "O memecoin da Idade da Pedra para a Era Cripto. 1 Bilhão de FREDs esculpidos na pedra. Comunidade > Tecnologia.", p1:"🪨 Memes pré-históricos", p2:"⚒️ Forjado pela comunidade", p3:"🔥 Lançamento justo" },
    tokenomics: { title: "Tokenomics" },
    rockmap: { title: "Rockmap" },
    howto: { title: "Como comprar (Solana)", step1: "Instale uma carteira Solana (Phantom, Solflare).", step2: "Carregue com SOL para as taxas.", step3: "Use um DEX (Raydium, Jupiter) e adicione o mint do token.", step4: "Ajuste slippage e troque — tenha cuidado." },
    play: { title: "Jogar — Fred corre" },
    meme: { title: "Gerador de Meme" },
    community: { title: "Comunidade" }
  }
};

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

(function initLang(){
  const select = $('#langSelect');
  let lang = localStorage.getItem('fred_lang') || 'en';
  select.value = lang;
  applyLocale(lang);
  select.addEventListener('change', e=>{
    lang = e.target.value;
    localStorage.setItem('fred_lang', lang);
    applyLocale(lang);
  });
})();

function applyLocale(lang){
  const pack = LOCALES[lang] || LOCALES.en;
  $$('[data-i18n]').forEach(el=>{
    const path = el.getAttribute('data-i18n').split('.');
    let v = pack;
    for(const p of path){ v = v?.[p]; if(v===undefined) break; }
    if(v!==undefined) el.textContent = v;
  });
  $('#howto').querySelectorAll('ol li').forEach((li,i)=>{
    const key = `step${i+1}`;
    const txt = pack.howto[key];
    if(txt) li.textContent = txt;
  });
  $('#buyBtn').textContent = pack.cta.buy;
}

(function particles(){
  const box = $('#particles'); if(!box) return;
  const n = 30;
  for(let i=0;i<n;i++){
    const el = document.createElement('i'); el.className = 'particle';
    const size = 3 + Math.random()*8; el.style.width = el.style.height = size + 'px';
    el.style.left = (Math.random()*100)+'%';
    el.style.bottom = (-10 - Math.random()*80)+'px';
    el.style.opacity = 0.25 + Math.random()*0.6;
    const dur = 4 + Math.random()*6;
    el.style.animation = `floatUp ${dur}s linear ${Math.random()*2}s infinite`;
    el.style.background = Math.random()>0.5 ? 'linear-gradient(180deg,var(--accent),var(--accent-2))' : 'linear-gradient(180deg,#f5f0de,#ffd27a)';
    box.appendChild(el);
  }
})();

$('#themeBtn').addEventListener('click', ()=>{
  const b = document.body;
  b.animate([{filter:'brightness(1)'},{filter:'brightness(1.06)'},{filter:'brightness(1)'}], {duration:400});
});

$('#copyMint').addEventListener('click', async ()=>{
  try{ await navigator.clipboard.writeText($('#mint').value); const btn=$('#copyMint'); const t=btn.textContent; btn.textContent='Copied!'; setTimeout(()=>btn.textContent=t,1200); }catch(e){ alert('Copy failed'); }
});
$('#viewExplorer').addEventListener('click', ()=>{
  const mint = $('#mint').value;
  const url = `https://explorer.solana.com/address/${encodeURIComponent(mint)}?cluster=devnet`;
  window.open(url,'_blank');
});
$('#dexLink').addEventListener('click', ()=> window.open('https://jup.ag/','_blank'));
$('#explorerLink').addEventListener('click', ()=> window.open('https://explorer.solana.com','_blank'));
$('#year').textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  });
});
