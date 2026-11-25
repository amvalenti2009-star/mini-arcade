
const $=s=>document.querySelector(s),stage=$('#stage'),K={},G={};let C=[],cur,rnd=n=>Math.random()*n|0;
const on=(t,e,f)=>{t.addEventListener(e,f);C.push(()=>t.removeEventListener(e,f))};
const tick=(f,ms)=>{const i=setInterval(f,ms);C.push(()=>clearInterval(i))};
const raf=f=>{let id,a=1,p=performance.now(),acc=0;const l=t=>{acc=Math.min(acc+t-p,100);p=t;while(acc>=16.67){f();acc-=16.67}if(a)id=requestAnimationFrame(l)};f();id=requestAnimationFrame(l);C.push(()=>{a=0;cancelAnimationFrame(id)})};
const st=t=>$('#st').textContent=t;
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;stage.append(c);return c.getContext('2d')};
const R=(x,c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h)};
const grid=(n,w)=>{const g=document.createElement('div');g.className='g';g.style.cssText=`grid-template-columns:repeat(${n},1fr);width:min(92vw,${w}px)`;stage.append(g);return g};
const cell=(g,t,f)=>{const b=document.createElement('button');b.className='c';b.textContent=t;b.onclick=f;g.append(b);return b};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
function back(){C.forEach(f=>f());C=[];stage.innerHTML=''}
function launch(n){back();cur=n;V=E[n].v;$('#menu').hidden=1;$('#game').hidden=0;$('#title').textContent=E[n].i+' '+E[n].t;st('');scrollTo(0,0);$('#fv').textContent=fav.has(E[n].t)?'★':'☆';E[n].f()}
function home(){back();cur=0;render();$('#menu').hidden=0;$('#game').hidden=1}
addEventListener('keydown',e=>{K[e.key]=1;if($('#game').hidden||(e.target.tagName=='INPUT'&&e.key!='Escape'))return;if(e.key.startsWith('Arrow')||e.key==' ')e.preventDefault();if((e.key=='r'||e.key=='R')&&!E[cur].nk)launch(cur);if(e.key=='Escape')home()});
addEventListener('keyup',e=>K[e.key]=0);

G['🐍 Snake']=()=>{const x=cv(480,360);let s=[[5,9],[4,9]],d=[1,0],n=d,f=[12,9],sc=0,dead=0;
on(document,'keydown',e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];if(m&&(m[0]+d[0]||m[1]+d[1]))n=m});
tick(()=>{if(dead)return;d=n;const h=[s[0][0]+d[0],s[0][1]+d[1]];if(V.w){h[0]=(h[0]+24)%24;h[1]=(h[1]+18)%18}
if(h[0]<0||h[1]<0||h[0]>23||h[1]>17||s.some(p=>p[0]==h[0]&&p[1]==h[1])){dead=1;st(`Game over, score ${sc}. Press R`);return}
s.unshift(h);h[0]==f[0]&&h[1]==f[1]?(sc++,f=[rnd(24),rnd(18)]):s.pop();
R(x,'#10132b',0,0,480,360);R(x,'#ff6b8a',f[0]*20,f[1]*20,18,18);s.forEach((p,i)=>R(x,i?'#ffd166':'#fff',p[0]*20,p[1]*20,18,18));st('Score '+sc+' (arrow keys or WASD)')},V.sp||100)};

G['🏓 Pong']=()=>{const x=cv(480,360);let p=150,a=150,b,S=[0,0];const rs=d=>b={x:240,y:180,vx:4*d,vy:rnd(5)-2||1};rs(1);
on(stage.firstChild,'pointermove',e=>{const r=e.target.getBoundingClientRect();p=(e.clientY-r.top)/r.height*360-30});
raf(()=>{if(K.ArrowUp||K.w)p-=6;if(K.ArrowDown||K.s)p+=6;p=cl(p,0,300);a=cl(a+cl(b.y-a-30,-(V.ai||3.4),V.ai||3.4),0,300);
b.x+=b.vx;b.y+=b.vy;if(b.y<0||b.y>352)b.vy*=-1;
if(b.vx<0&&b.x<18&&b.x>4&&b.y>p-8&&b.y<p+68){b.vx*=-1.06;b.vy+=(b.y-p-30)/8}
if(b.vx>0&&b.x>454&&b.x<470&&b.y>a-8&&b.y<a+68){b.vx*=-1.06;b.vy+=(b.y-a-30)/8}
if(b.x<-10){S[1]++;rs(1)}if(b.x>490){S[0]++;rs(-1)}
R(x,'#10132b',0,0,480,360);R(x,'#ffd166',8,p,10,60);R(x,'#ff6b8a',462,a,10,60);R(x,'#fff',b.x,b.y,8,8);
st(`You ${S[0]} : ${S[1]} Bot (mouse or W/S)`)})};

G['♟️ Chess vs Bot']=()=>{
const U={p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚'},V={p:100,n:320,b:330,r:500,q:900,k:9999};
let B=('rnbqkbnrpppppppp'+' '.repeat(32)+'PPPPPPPPRNBQKBNR').split(''),sel=-1,lm=[],busy=0,over=0;
const gen=(B,w)=>{const o=[];for(let i=0;i<64;i++){const c=B[i];if(c==' '||(c===c.toUpperCase())!=w)continue;
const r=i>>3,f=i&7,t=c.toLowerCase();
const add=(R,F)=>{if(R<0||R>7||F<0||F>7)return 0;const j=R*8+F,d=B[j];if(d!=' '&&(d===d.toUpperCase())==w)return 0;o.push([i,j]);return d==' '};
if(t=='p'){const dr=w?-1:1;if(B[(r+dr)*8+f]==' '){o.push([i,(r+dr)*8+f]);if(r==(w?6:1)&&B[(r+2*dr)*8+f]==' ')o.push([i,(r+2*dr)*8+f])}
for(const df of[-1,1]){const R=r+dr,F=f+df;if(R<0||R>7||F<0||F>7)continue;const d=B[R*8+F];if(d!=' '&&(d===d.toUpperCase())!=w)o.push([i,R*8+F])}}
else if(t=='n')for(const[a,b]of[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]])add(r+a,f+b);
else if(t=='k'){for(let a=-1;a<2;a++)for(let b=-1;b<2;b++)(a||b)&&add(r+a,f+b)}
else{const D=[];if(t!='b')D.push([1,0],[-1,0],[0,1],[0,-1]);if(t!='r')D.push([1,1],[1,-1],[-1,1],[-1,-1]);for(const[a,b]of D){let R=r+a,F=f+b;while(add(R,F)){R+=a;F+=b}}}}
return o};
const ap=(B,[a,b])=>{const n=B.slice();n[b]=n[a];n[a]=' ';if(n[b]=='P'&&b<8)n[b]='Q';if(n[b]=='p'&&b>55)n[b]='q';return n};
const chk=(B,w)=>{const k=B.indexOf(w?'K':'k');return gen(B,!w).some(m=>m[1]==k)};
const legal=(B,w)=>gen(B,w).filter(m=>!chk(ap(B,m),w));
const ev=B=>{let s=0;for(let i=0;i<64;i++){const c=B[i];if(c==' ')continue;const t=c.toLowerCase(),w=c!=t,r=i>>3,f=i&7;
const v=V[t]+(t=='p'?(w?7-r:r)*4:0)+(t=='n'||t=='b'?(3.5-Math.abs(3.5-f)+3.5-Math.abs(3.5-r))*5:0);s+=w?v:-v}return s};
const se=(B,w,d,a,b)=>{if(!d)return ev(B);let best=w?-1e9:1e9;for(const m of gen(B,w)){const v=se(ap(B,m),!w,d-1,a,b);if(w){best=Math.max(best,v);a=Math.max(a,v)}else{best=Math.min(best,v);b=Math.min(b,v)}if(b<=a)break}return best};
const g=grid(8,480),cs=B.map((_,i)=>cell(g,'',()=>click(i)));
const draw=()=>cs.forEach((b,i)=>{const c=B[i],w=c==c.toUpperCase();b.className='c '+(((i>>3)+i)&1?'d':'l')+(i==sel?' s':'')+(lm.some(m=>m[1]==i)?' h':'');b.innerHTML=c==' '?'':c.toLowerCase()=='p'?PW(w):U[c.toLowerCase()]+'\uFE0E';b.style.fontSize='min(9vw,46px)';b.style.color=w?'#fff':'#111';b.style.textShadow=w?'0 0 3px #000,0 0 3px #000':'0 0 2px #fff'});
const fin=w=>{const n=legal(B,w);draw();if(!n.length){over=1;st(chk(B,w)?(w?'Checkmate, the bot wins. Press R':'Checkmate, you win! 🎉'):'Stalemate, it’s a draw');return 1}st((chk(B,w)?'Check! ':'')+(w?'Your move (white)':'Bot is thinking…'))};
const bot=()=>{let best=1e9,bm;for(const m of legal(B,0)){const v=se(ap(B,m),1,2,-1e9,1e9)+Math.random()*6;if(v<best){best=v;bm=m}}B=ap(B,bm);fin(1)};
const click=i=>{if(busy||over)return;const c=B[i];if(c!=' '&&c==c.toUpperCase()){sel=i;lm=legal(B,1).filter(m=>m[0]==i)}
else if(lm.some(m=>m[1]==i)){B=ap(B,[sel,i]);sel=-1;lm=[];busy=1;if(!fin(0))setTimeout(()=>{bot();busy=0},50);return}draw()};
draw();st('Your move (white). Simplified rules: no castling or en passant.')};

G['⭕ Tic-Tac-Toe']=()=>{let b=Array(9).fill(''),over=0;const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const win=b=>{for(const[p,q,r]of L)if(b[p]&&b[p]==b[q]&&b[p]==b[r])return b[p];return b.includes('')?0:'T'};
const mm=(b,t)=>{const w=win(b);if(w)return w=='O'?1:w=='X'?-1:0;let best=t=='O'?-2:2;for(let i=0;i<9;i++)if(!b[i]){b[i]=t;const v=mm(b,t=='O'?'X':'O');b[i]='';best=t=='O'?Math.max(best,v):Math.min(best,v)}return best};
const g=grid(3,300),cs=b.map((_,i)=>cell(g,'',()=>{if(over||b[i])return;b[i]='X';fin()||bot()}));
const fin=()=>{b.forEach((v,i)=>cs[i].textContent=v);const w=win(b);if(w){over=1;st(w=='T'?'Draw. The bot can’t be beaten, only tied.':w=='X'?'You won?!':'Bot wins. Press R');return 1}st('Your move (X)')};
const bot=()=>{let bi,bv=-2;for(let i=0;i<9;i++)if(!b[i]){b[i]='O';const v=mm(b,'X');b[i]='';if(v>bv){bv=v;bi=i}}b[bi]='O';fin()};
st('Your move (X)')};

G['🔴 Connect 4']=()=>{let b=Array(42).fill(0),over=0;
const win=(b,p)=>{for(let r=0;r<6;r++)for(let c=0;c<7;c++)for(const[a,d]of[[0,1],[1,0],[1,1],[1,-1]]){let k=0;while(k<4){const y=r+a*k,x=c+d*k;if(y>5||x<0||x>6||b[y*7+x]!=p)break;k++}if(k==4)return 1}return 0};
const drop=(b,c,p)=>{for(let r=5;r>=0;r--)if(!b[r*7+c]){const n=b.slice();n[r*7+c]=p;return n}};
const g=grid(7,420),cs=b.map((_,i)=>cell(g,'',()=>play(i%7)));
const fin=p=>{b.forEach((v,i)=>{cs[i].textContent=v?'●':'';cs[i].style.color=v==1?'#ff6b8a':'#ffd166'});if(win(b,p)){over=1;st(p==1?'You win! 🎉':'Bot wins. Press R');return 1}if(!b.includes(0)){over=1;st('Draw');return 1}};
const play=c=>{if(over)return;const n=drop(b,c,1);if(!n)return;b=n;if(fin(1))return;st('Bot is thinking…');
setTimeout(()=>{if(over)return;const A=[0,1,2,3,4,5,6],ok=A.filter(c=>drop(b,c,2));
const pick=ok.find(c=>win(drop(b,c,2),2))??ok.find(c=>win(drop(b,c,1),1))??(()=>{const s=ok.filter(c=>{const n=drop(b,c,2);return!A.some(k=>{const q=drop(n,k,1);return q&&win(q,1)})});return(s.length?s:ok).sort((a,z)=>Math.abs(a-3)-Math.abs(z-3)+Math.random()*2-1)[0]})();
b=drop(b,pick,2);if(!fin(2))st('Your move (red)')},400)};
st('Click a column to drop a disc (you are red)')};

G['🧱 Breakout']=()=>{const x=cv(480,360);let p=200,b={x:240,y:300,vx:3,vy:-3},br=[],sc=0,lives=3,dead=0;
for(let r=0;r<5;r++)for(let c=0;c<8;c++)br.push([c*60+3,r*20+30,54,14,`hsl(${r*50+10},85%,62%)`]);
on(stage.firstChild,'pointermove',e=>{const r=e.target.getBoundingClientRect();p=(e.clientX-r.left)/r.width*480-40});
raf(()=>{if(dead)return;if(K.ArrowLeft)p-=7;if(K.ArrowRight)p+=7;p=cl(p,0,400);
b.x+=b.vx;b.y+=b.vy;if(b.x<0||b.x>472)b.vx*=-1;if(b.y<0)b.vy*=-1;
if(b.vy>0&&b.y>337&&b.y<352&&b.x>p-8&&b.x<p+88){b.vy*=-1;b.vx=(b.x-p-40)/10}
if(b.y>360){lives--;Object.assign(b,{x:240,y:300,vx:3,vy:-3});if(!lives)dead=1}
const i=br.findIndex(k=>b.x+8>k[0]&&b.x<k[0]+k[2]&&b.y+8>k[1]&&b.y<k[1]+k[3]);if(i>=0){br.splice(i,1);b.vy*=-1;sc++}
if(!br.length)dead=2;
R(x,'#10132b',0,0,480,360);br.forEach(k=>R(x,k[4],k[0],k[1],k[2],k[3]));R(x,'#ffd166',p,345,80,10);R(x,'#fff',b.x,b.y,8,8);
st(dead?(dead==2?'You win! ':'Game over. ')+'Press R':`Score ${sc}   Lives ${lives} (mouse or arrows)`)})};

G['🐦 Flappy']=()=>{const x=cv(360,480);let y=240,v=0,P=[],t=0,sc=0,dead=0;
const flap=()=>{if(!dead)v=-5};on(document,'keydown',e=>e.key==' '&&flap());on(stage.firstChild,'pointerdown',flap);
raf(()=>{if(dead)return;v+=.28;y+=v;if(t++%110==0)P.push({x:360,g:100+rnd(280)});P.forEach(p=>p.x-=1.9);
if(P.length&&P[0].x<-50){P.shift();sc++}
if(y<0||y>460||P.some(p=>p.x<80&&p.x>10&&(y<p.g-(V.gp||70)||y+20>p.g+(V.gp||70))))dead=1;
R(x,'#10132b',0,0,360,480);P.forEach(p=>{R(x,'#4ade80',p.x,0,50,p.g-(V.gp||70));R(x,'#4ade80',p.x,p.g+(V.gp||70),50,480)});R(x,'#ffd166',60,y,20,20);
st(dead?`Game over, score ${sc}. Press R`:`Score ${sc} (Space or click to flap)`)})};

G['🧠 Memory']=()=>{const e=(V.e||'🍎🍌🍇🍒🍋🥝🍉🍓').match(/./gu),d=[...e,...e].sort(()=>Math.random()-.5);let o=[],m=0,mv=0,lock=0;
const g=grid(4,360),bs=d.map((v,i)=>cell(g,'?',()=>{if(lock||bs[i].disabled||o.includes(i))return;bs[i].textContent=v;o.push(i);if(o.length<2)return;mv++;st('Moves '+mv);
if(d[o[0]]==d[o[1]]){bs[o[0]].disabled=bs[o[1]].disabled=1;o=[];if(++m==8)st(`Done in ${mv} moves! Press R`)}
else{lock=1;const[a,b]=o;setTimeout(()=>{bs[a].textContent=bs[b].textContent='?';o=[];lock=0},700)}}));
st('Find all the pairs')};

G[' 2048']=()=>{let b=Array(16).fill(0),sc=0;const g=grid(4,360),cs=b.map(()=>cell(g,''));
const add=()=>{const e=b.map((v,i)=>v?-1:i).filter(i=>i>=0);if(e.length)b[e[rnd(e.length)]]=Math.random()<.9?2:4};
const draw=()=>{b.forEach((v,i)=>{const l=Math.log2(v||1);cs[i].textContent=v||'';cs[i].style.background=v?`hsl(${45-l*3},90%,${78-l*4}%)`:'';cs[i].style.color=v?'#222':'';cs[i].style.fontSize=v>999?'22px':''});st(`Score ${sc} (arrow keys or swipe)`)};
const mvl=l=>{l=l.filter(v=>v);for(let i=0;i<l.length-1;i++)if(l[i]==l[i+1]){l[i]*=2;sc+=l[i];l.splice(i+1,1)}while(l.length<4)l.push(0);return l};
const go=(dr,dc)=>{const o=b.join();for(let k=0;k<4;k++){const ix=[0,1,2,3].map(j=>dr?(dr>0?(3-j)*4+k:j*4+k):(dc>0?k*4+3-j:k*4+j));const l=mvl(ix.map(i=>b[i]));ix.forEach((i,j)=>b[i]=l[j])}if(b.join()!=o){add();draw()}};
const M={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};on(document,'keydown',e=>M[e.key]&&go(...M[e.key]));
let sx,sy;on(g,'pointerdown',e=>{sx=e.clientX;sy=e.clientY});on(g,'pointerup',e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))>30)Math.abs(dx)>Math.abs(dy)?go(0,Math.sign(dx)):go(Math.sign(dy),0)});
add();add();draw()};

G['💣 Minesweeper']=()=>{let m=null,rv=Array(81).fill(0),fl=Array(81).fill(0),over=0;
const g=grid(9,360),cs=rv.map((_,i)=>{const b=cell(g,'',()=>open(i));b.style.fontSize='18px';b.oncontextmenu=e=>{e.preventDefault();if(!rv[i]&&!over){fl[i]^=1;b.textContent=fl[i]?'🚩':''}};return b});
const nb=i=>{const r=i/9|0,c=i%9,o=[];for(let a=-1;a<2;a++)for(let b=-1;b<2;b++){const y=r+a,z=c+b;if((a||b)&&y>=0&&y<9&&z>=0&&z<9)o.push(y*9+z)}return o};
const cnt=i=>nb(i).filter(j=>m[j]).length;
const open=i=>{if(over||fl[i]||rv[i])return;if(!m){m=Array(81).fill(0);let k=0;while(k<(V.mn||10)){const j=rnd(81);if(!m[j]&&j!=i){m[j]=1;k++}}}
if(m[i]){over=1;m.forEach((v,j)=>v&&(cs[j].textContent='💣'));st('Boom! Press R');return}
const q=[i];while(q.length){const j=q.pop();if(rv[j]||fl[j])continue;rv[j]=1;const n=cnt(j);cs[j].className='c o';cs[j].textContent=n||'';if(!n)q.push(...nb(j))}
if(rv.reduce((a,v)=>a+v)==81-(V.mn||10)){over=1;st('You cleared the board! 🎉')}};
st('10 mines. Click to reveal, right-click to flag')};

G['🐹 Whack-a-Mole']=()=>{let sc=0,t=30,a=-1;const g=grid(3,330),cs=[...Array(9)].map((_,i)=>cell(g,'',()=>{if(t>0&&i==a){sc++;a=-1;draw()}}));
const draw=()=>{cs.forEach((c,i)=>c.textContent=i==a?'🐹':'🕳️');st(t>0?`Score ${sc}   Time ${t}`:`Time’s up! Final score ${sc}. Press R`)};
tick(()=>{if(t>0){a=rnd(9);draw()}},V.sp||700);tick(()=>{if(t>0){t--;if(!t)a=-1;draw()}},1000);draw()};

/* ---- extras ---- */
let V={};const N={},E=[];
const PW=w=>`<svg viewBox="0 0 45 45" width="64%"><path d="M22 9c-2.2 0-4 1.8-4 4 0 .9.3 1.7.8 2.4-2 1.1-3.3 3.2-3.300 5.600 0 2 .9 3.800 2.400 5-3 1.100-7.400 5.600-7.400 13.500h23c0-7.900-4.400-12.400-7.400-13.500 1.500-1.200 2.400-3 2.400-5 0-2.400-1.300-4.500-3.300-5.600.5-.7.8-1.500.8-2.400 0-2.200-1.800-4-4-4z" fill="${w?'#fff':'#111'}" stroke="${w?'#000':'#ccc'}" stroke-width="1.5"/></svg>`;
const div=c=>{const d=document.createElement('div');d.className=c||'';stage.append(d);return d};
const inp=()=>{const i=document.createElement('input');i.className='in';stage.append(i);setTimeout(()=>i.focus(),50);return i};
const bt=(t,f)=>{const b=document.createElement('button');b.className='b';b.textContent=t;b.onclick=f;return b};
const W='time year people way day man thing woman life child world school state family group country problem hand part place case week system program question work number night point home water room mother area money story month right study book word business side kind head house service friend father power hour game line member car city name team minute idea body face level office door health person art'.split(' ');
const W5='apple brave crane dream eagle flame grape house input jolly knife lemon music night ocean piano queen river stone tiger uncle vivid water yacht zebra bread chair dance earth field ghost heart light money plant smile train world sweet'.split(' ');
const pos=(e,c)=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};

N.react=()=>{const d=div('tap');let t0,to,s=0;const set=(c,t)=>{d.style.background=c;d.textContent=t};
d.onclick=()=>{if(s==0){s=1;set('#c0392b','Wait for green…');to=setTimeout(()=>{s=2;t0=performance.now();set('#27ae60','CLICK NOW!')},1000+rnd(3000))}
else if(s==1){clearTimeout(to);s=0;set('#555','Too soon! Click to try again')}else{s=0;const ms=Math.round(performance.now()-t0);set('#2563eb',ms+' ms. Click to go again');st('Last: '+ms+' ms')}};
C.push(()=>clearTimeout(to));set('#2563eb','Click to start')};

N.aim=()=>{const x=cv(480,360),r=V.r;let n=0,t0=0,tg;const nx=()=>tg=[r+rnd(480-2*r),r+rnd(360-2*r)];
const dr=()=>{R(x,'#10132b',0,0,480,360);if(tg){x.fillStyle='#ff6b8a';x.beginPath();x.arc(tg[0],tg[1],r,0,7);x.fill()}};
on(stage.firstChild,'pointerdown',e=>{if(!tg)return;const[a,b]=pos(e,e.target);if(Math.hypot(a*480-tg[0],b*360-tg[1])<=r){if(!n)t0=performance.now();n++;if(n==21){tg=0;st(`Done! ${Math.round((performance.now()-t0)/20)} ms per target. Press R`)}else{nx();st(n+' / 20')}dr()}});
nx();dr();st('Click the target 20 times. The timer starts on the first hit')};

N.cps=()=>{let n=0,t=V.s,go=0;const b=div('tap');b.textContent='Click here!';
b.onclick=()=>{if(t<=0)return;if(!go){go=1;tick(()=>{if(--t<=0){b.textContent='Time!';st(`${n} clicks = ${(n/V.s).toFixed(1)} per second. Press R`)}else st(t+'s left')},1000)}n++;b.textContent=n};st('Click as fast as you can for '+V.s+' seconds')};

N.type=()=>{let t=V.s,n=0,w=W[rnd(W.length)],go=0;const d=div('box'),i=inp();d.style.fontSize='40px';d.textContent=w;
i.oninput=()=>{if(!go){go=1;tick(()=>{if(--t<=0){i.disabled=1;d.textContent='Time!';st(`${Math.round(n*60/V.s)} words per minute. Press R`)}else st(t+'s left')},1000)}
if(i.value.trim()==w&&t>0){n++;i.value='';w=W[rnd(W.length)];d.textContent=w}};st('Type the word shown. The timer starts when you begin')};

N.math=()=>{let sc=0,t=30,a,b,o,ans;const d=div('box'),i=inp();d.style.fontSize='44px';
const q=()=>{o=V.o[rnd(V.o.length)];a=1+rnd(V.m);b=1+rnd(V.m);if(o=='-'&&b>a)[a,b]=[b,a];ans=o=='+'?a+b:o=='-'?a-b:a*b;d.textContent=`${a} ${o=='*'?'×':o} ${b}`;i.value=''};
tick(()=>{if(--t<=0){i.disabled=1;d.textContent='Time!';st(`Score ${sc}. Press R`)}else st(`Score ${sc}   ${t}s`)},1000);
i.oninput=()=>{if(i.value!==''&&+i.value==ans&&t>0){sc++;q()}};q();st('Solve as many as you can in 30 seconds')};

N.simon=()=>{const cs=['#ef4444','#22c55e','#3b82f6','#eab308'],g=grid(2,300),bs=cs.map((c,i)=>{const b=cell(g,'',()=>press(i));b.style.background=c;b.style.opacity=.5;return b});let seq=[],k=0,lock=1;
const fl=(i,ms)=>{bs[i].style.opacity=1;setTimeout(()=>bs[i].style.opacity=.5,ms)};
const play=()=>{lock=1;k=0;seq.push(rnd(4));st('Watch… round '+seq.length);seq.forEach((s,j)=>setTimeout(()=>fl(s,V.sp*.7),600+j*V.sp));setTimeout(()=>{lock=0;st('Your turn')},600+seq.length*V.sp)};
const press=i=>{if(lock)return;fl(i,150);if(i!=seq[k]){lock=1;st(`Wrong! You reached round ${seq.length}. Press R`);return}if(++k==seq.length){lock=1;setTimeout(play,700)}};setTimeout(play,500)};

N.num=()=>{let L=3,s;const d=div('box'),i=inp();d.style.fontSize='44px';
const nx=()=>{s=[...Array(L)].map(()=>rnd(10)).join('');d.textContent=s;i.hidden=1;i.value='';setTimeout(()=>{d.textContent='?';i.hidden=0;i.focus()},800+L*350);st('Level '+(L-2)+'. Memorise the number')};
i.onkeydown=e=>{if(e.key=='Enter'){if(i.value==s){L++;nx()}else{i.disabled=1;d.textContent=s;st(`Wrong. You remembered ${L-1} digits. Press R`)}}};nx()};

N.hang=()=>{const w=V.w[rnd(V.w.length)],g=new Set,bs={};let bad=0;const d=div('box'),kb=div('kb');d.style.cssText+=';font:30px monospace;letter-spacing:6px';
const dr=()=>{const sh=[...w].map(c=>g.has(c)?c:'_').join(' ');d.textContent=(bad>=7?w:sh).toUpperCase();st(bad>=7?'You lose! Use Restart to play again':sh.includes('_')?'Lives: '+'❤️'.repeat(7-bad):'You win! 🎉')};
const press=c=>{if(g.has(c)||bad>=7)return;g.add(c);if(!w.includes(c))bad++;bs[c].disabled=1;dr()};
[...'abcdefghijklmnopqrstuvwxyz'].forEach(c=>{bs[c]=bt(c,()=>press(c));kb.append(bs[c])});
on(document,'keydown',e=>{if(/^[a-z]$/.test(e.key)&&bs[e.key])press(e.key)});dr()};

N.guess=()=>{const n=1+rnd(V.m);let k=0;const d=div('box'),i=inp();i.type='number';d.textContent=`I’m thinking of a number from 1 to ${V.m}. Type a guess and press Enter`;
i.onkeydown=e=>{if(e.key!='Enter')return;const v=+i.value;i.value='';if(!v)return;k++;if(v==n){d.textContent=`🎉 ${n}! You got it in ${k} tries`;i.disabled=1}else d.textContent=v<n?`${v} is too low`:`${v} is too high`;st('Tries: '+k)}};

N.hilo=()=>{let c=1+rnd(13),s=0,dead=0;const d=div('box'),f=div(),nm=c=>['A',2,3,4,5,6,7,8,9,10,'J','Q','K'][c-1];d.style.fontSize='64px';
const show=()=>{d.textContent=nm(c);st('Streak '+s)};
['Higher','Lower'].forEach((t,j)=>f.append(bt(t,()=>{if(dead)return;const n=1+rnd(13);if(n==c)return;if((n>c)==(j==0)){s++;c=n;show()}else{dead=1;d.textContent='Next card: '+nm(n);st(`Wrong! Streak ${s}. Press R`)}})));show()};

N.rps=()=>{let a=0,b=0;const d=div('box'),f=div(),Z=['✊','✋','✌️'];d.style.fontSize='30px';d.textContent='Choose!';
Z.forEach((e,i)=>{const k=bt(e,()=>{if(a==V.b||b==V.b)return;const c=rnd(3),r=(i-c+3)%3;if(r==1)a++;else if(r==2)b++;d.textContent=`${e} vs ${Z[c]}\n${r?r==1?'You win the round':'Bot wins the round':'Tie'}`;st(`You ${a} : ${b} Bot`+(a==V.b?'. You win the match! 🎉':b==V.b?'. Bot wins the match.':''))});k.style.fontSize='34px';f.append(k)});st('First to '+V.b+' wins')};

N.bj=()=>{const dk=[];for(let i=0;i<52;i++)dk.push(i%13+1);dk.sort(()=>Math.random()-.5);const P=[dk.pop(),dk.pop()],D=[dk.pop(),dk.pop()];let done=0;
const val=h=>{let s=0,a=0;h.forEach(c=>{s+=c>10?10:c==1?(a++,11):c});while(s>21&&a--)s-=10;return s};
const nm=c=>['A',2,3,4,5,6,7,8,9,10,'J','Q','K'][c-1],d=div('box'),f=div();d.style.fontSize='22px';
const dr=()=>d.textContent=`Dealer: ${done?D.map(nm).join(' ')+' ('+val(D)+')':nm(D[0])+' ?'}\n\nYou: ${P.map(nm).join(' ')} (${val(P)})`;
const end=m=>{done=1;dr();st(m+' Use Restart for a new hand')};
f.append(bt('Hit',()=>{if(done)return;P.push(dk.pop());val(P)>21?end('Bust! You lose.'):dr()}),bt('Stand',()=>{if(done)return;while(val(D)<17)D.push(dk.pop());const p=val(P),q=val(D);end(q>21||p>q?'You win! 🎉':p==q?'Push.':'Dealer wins.')}));
dr();if(val(P)==21)end('Blackjack! 🎉')};

N.mm=()=>{const cs=['🔴','🟢','🔵','🟡','🟣','🟠'],n=V.n,sec=[...Array(n)].map(()=>rnd(6));let cu=[],t=0,log='',done=0;const d=div('box'),f=div();d.style.cssText+=';min-height:230px;font-size:22px;justify-content:flex-start';
const dr=()=>d.textContent=log+(done?'':cu.map(c=>cs[c]).join('')||'…');
cs.forEach((c,i)=>f.append(bt(c,()=>{if(!done&&cu.length<n){cu.push(i);dr()}})));
f.append(bt('⌫',()=>{cu.pop();dr()}),bt('Check',()=>{if(done||cu.length<n)return;let bl=0,wh=0;const a=[],q=[];cu.forEach((c,i)=>c==sec[i]?bl++:(a.push(c),q.push(sec[i])));a.forEach(c=>{const j=q.indexOf(c);if(j>=0){wh++;q.splice(j,1)}});t++;log+=cu.map(c=>cs[c]).join('')+`  ⚫${bl} ⚪${wh}\n`;cu=[];
if(bl==n){done=1;st(`Cracked it in ${t} tries! 🎉`)}else if(t==10){done=1;log+='Answer: '+sec.map(c=>cs[c]).join('');st('Out of tries')}else st(`Try ${t+1} of 10`);dr()}));
st('Crack the code. ⚫ right spot, ⚪ right colour, wrong spot');dr()};

N.lights=()=>{const n=V.n,b=Array(n*n).fill(0),g=grid(n,360);let mv=0;const cs=b.map((_,i)=>cell(g,'',()=>press(i,1)));
const press=(i,u)=>{const r=i/n|0,c=i%n;[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,d])=>{const y=r+a,x=c+d;if(y>=0&&y<n&&x>=0&&x<n)b[y*n+x]^=1});if(u){mv++;draw()}};
const draw=()=>{cs.forEach((c,i)=>c.style.background=b[i]?'#ffd166':'');st(b.some(v=>v)?`Turn all the lights off. Moves ${mv}`:`Solved in ${mv} moves! 🎉`)};
for(let k=0;k<n*n;k++)if(Math.random()<.5)press(k);if(!b.some(v=>v))press(0);draw()};

N.slide=()=>{const n=V.n,Q=n*n;let b=[...Array(Q).keys()].map(i=>(i+1)%Q),z=Q-1,mv=0;const g=grid(n,360),cs=b.map((_,i)=>cell(g,'',()=>go(i)));
const nbs=i=>[[1,0],[-1,0],[0,1],[0,-1]].map(([a,d])=>[(i/n|0)+a,i%n+d]).filter(([y,x])=>y>=0&&y<n&&x>=0&&x<n).map(([y,x])=>y*n+x);
const sw=i=>{[b[z],b[i]]=[b[i],b[z]];z=i};
const draw=()=>{cs.forEach((c,i)=>{c.textContent=b[i]||'';c.style.opacity=b[i]?1:.15});st(b.every((v,i)=>v==(i+1)%Q)?`Solved in ${mv} moves! 🎉`:`Moves ${mv}. Click a tile next to the gap`)};
const go=i=>{if(nbs(z).includes(i)){sw(i);mv++;draw()}};
for(let k=0;k<Q*20;k++){const o=nbs(z);sw(o[rnd(o.length)])}draw()};

N.hanoi=()=>{const n=V.n,P=[[...Array(n).keys()].map(i=>n-i),[],[]];let sel=-1,mv=0;const d=div('hn');
const dr=()=>{d.innerHTML='';P.forEach((p,j)=>{const c=document.createElement('div');c.className='pg'+(j==sel?' on':'');
c.onclick=()=>{if(sel<0){if(p.length)sel=j}else{const a=P[sel];if(sel!=j&&(!p.length||p[p.length-1]>a[a.length-1])){p.push(a.pop());mv++}sel=-1}dr()};
[...p].reverse().forEach(s=>{const r=document.createElement('i');r.style.width=s*(100/(n+1))+'%';r.style.background=`hsl(${s*40},70%,60%)`;c.append(r)});d.append(c)});
st(P[2].length==n?`Solved in ${mv} moves (best possible: ${2**n-1})! 🎉`:`Moves ${mv}. Move the whole tower to the right peg`)};dr()};

N.tetris=()=>{const x=cv(240,480),Sh=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]],Co=['#22d3ee','#facc15','#a855f7','#4ade80','#ef4444','#3b82f6','#fb923c'];
const bd=[...Array(20)].map(()=>Array(10).fill(0));let p,px,py,sc=0,dead=0,sp=V.sp,last=0;
const rot=m=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());
const hit=(m,X,Y)=>m.some((r,j)=>r.some((v,i)=>v&&(X+i<0||X+i>9||Y+j>19||bd[Y+j][X+i])));
const nw=()=>{const k=rnd(7);p={m:Sh[k],c:Co[k]};px=3;py=0;if(hit(p.m,px,py))dead=1};
const lock=()=>{p.m.forEach((r,j)=>r.forEach((v,i)=>v&&(bd[py+j][px+i]=p.c)));let n=0;for(let j=19;j>=0;j--)if(bd[j].every(v=>v)){bd.splice(j,1);bd.unshift(Array(10).fill(0));n++;j++}sc+=[0,100,300,500,800][n];sp=Math.max(90,V.sp-sc/8);nw()};
const dn=()=>{if(!hit(p.m,px,py+1))py++;else lock()};
on(document,'keydown',e=>{if(dead)return;const k=e.key;if(k=='ArrowLeft'&&!hit(p.m,px-1,py))px--;if(k=='ArrowRight'&&!hit(p.m,px+1,py))px++;if(k=='ArrowDown')dn();if(k=='ArrowUp'){const r=rot(p.m);if(!hit(r,px,py))p.m=r}if(k==' '){while(!hit(p.m,px,py+1))py++;lock()}});
nw();raf(()=>{const t=performance.now();if(!dead&&t-last>sp){last=t;dn()}
R(x,'#10132b',0,0,240,480);bd.forEach((r,j)=>r.forEach((c,i)=>c&&R(x,c,i*24,j*24,23,23)));if(!dead)p.m.forEach((r,j)=>r.forEach((v,i)=>v&&R(x,p.c,(px+i)*24,(py+j)*24,23,23)));
st(dead?`Game over, score ${sc}. Press R`:`Score ${sc} (arrows, up = rotate, space = drop)`)})};

N.inv=()=>{const x=cv(480,360);let p=220,B=[],En=[],ed=1,sc=0,dead=0,cd=0;for(let r=0;r<4;r++)for(let c=0;c<8;c++)En.push([40+c*45,30+r*32]);
raf(()=>{if(dead)return;if(K.ArrowLeft)p-=5;if(K.ArrowRight)p+=5;p=cl(p,0,450);if(K[' ']&&cd<=0){B.push([p+13,330]);cd=16}cd--;
B.forEach(b=>b[1]-=7);B=B.filter(b=>b[1]>0);const v=ed*(.5+(32-En.length)*.06);En.forEach(e=>e[0]+=v);
if(En.some(e=>e[0]<5||e[0]>450)){ed*=-1;En.forEach(e=>{e[1]+=14;e[0]+=ed*6})}
B.forEach(b=>{const i=En.findIndex(e=>b[0]>e[0]&&b[0]<e[0]+26&&b[1]>e[1]&&b[1]<e[1]+22);if(i>=0){En.splice(i,1);b[1]=-9;sc+=10}});
if(En.some(e=>e[1]>305))dead=1;if(!En.length)dead=2;
R(x,'#10132b',0,0,480,360);x.font='22px serif';En.forEach(e=>x.fillText('👾',e[0],e[1]+20));B.forEach(b=>R(x,'#fff',b[0],b[1],3,10));R(x,'#ffd166',p,335,30,12);R(x,'#ffd166',p+11,328,8,8);
st(dead?(dead==2?'You saved Earth! 🎉 ':'Invaded! ')+`Score ${sc}. Press R`:`Score ${sc} (arrows to move, space to shoot)`)})};

N.run=()=>{const x=cv(480,240);let y=0,v=0,O=[],t=0,sc=0,dead=0,sp=V.sp;const jp=()=>{if(!y&&!dead)v=11};on(document,'keydown',e=>(e.key==' '||e.key=='ArrowUp')&&jp());on(stage.firstChild,'pointerdown',jp);
raf(()=>{if(dead)return;t++;sc++;sp+=.002;y=Math.max(0,y+v);v-=.7;if(!y)v=Math.min(v,0);if(t%Math.max(45,95-(sc/50|0))==0)O.push({x:480,h:20+rnd(25),w:14+rnd(14)});O.forEach(o=>o.x-=sp);O=O.filter(o=>o.x>-40);
if(O.some(o=>o.x<56&&o.x+o.w>30&&y<o.h))dead=1;
R(x,'#10132b',0,0,480,240);R(x,'#556',0,200,480,2);R(x,'#ffd166',30,170-y,26,30);O.forEach(o=>R(x,'#ff6b8a',o.x,200-o.h,o.w,o.h));
st(dead?`Game over, score ${sc>>3}. Press R`:`Score ${sc>>3} (space, up arrow or click to jump)`)})};

N.dodge=()=>{const x=cv(360,480);let p=170,O=[],t=0,sc=0,dead=0;on(stage.firstChild,'pointermove',e=>{p=pos(e,e.target)[0]*360-10});
raf(()=>{if(dead)return;t++;sc++;if(K.ArrowLeft)p-=6;if(K.ArrowRight)p+=6;p=cl(p,0,340);if(t%Math.max(10,40-(sc/60|0))==0)O.push({x:rnd(330),y:-30,w:20+rnd(30),v:V.sp+rnd(3)});O.forEach(o=>o.y+=o.v);O=O.filter(o=>o.y<480);
if(O.some(o=>o.y+20>440&&o.y<466&&o.x<p+20&&o.x+o.w>p))dead=1;
R(x,'#10132b',0,0,360,480);O.forEach(o=>R(x,'#ff6b8a',o.x,o.y,o.w,20));R(x,'#ffd166',p,440,20,26);
st(dead?`Game over, score ${sc>>3}. Press R`:`Score ${sc>>3} (mouse or arrows)`)})};

N.catch=()=>{const x=cv(360,480),em=['🍎','🍌','🍇','🍒'];let p=150,F=[],t=0,sc=0,lv=5;on(stage.firstChild,'pointermove',e=>{p=pos(e,e.target)[0]*360-30});
raf(()=>{if(lv<=0)return;t++;if(K.ArrowLeft)p-=7;if(K.ArrowRight)p+=7;p=cl(p,0,300);if(t%V.n==0)F.push({x:10+rnd(320),y:-20,e:em[rnd(4)],v:2+rnd(2)+sc/40});
F.forEach(f=>f.y+=f.v);F=F.filter(f=>{if(f.y>430&&f.y<470&&Math.abs(f.x-p-16)<45){sc++;return 0}if(f.y>480){lv--;return 0}return 1});
R(x,'#10132b',0,0,360,480);R(x,'#ffd166',p,450,60,12);x.font='28px serif';F.forEach(f=>x.fillText(f.e,f.x,f.y));
st(lv>0?`Score ${sc}   Lives ${lv} (mouse or arrows)`:`Game over, score ${sc}. Press R`)})};

N.stack=()=>{const x=cv(320,480);let L=[{x:100,w:120}],c={x:0,w:120,d:3},dead=0;
const place=()=>{if(dead)return;const b=L[L.length-1],o=Math.min(c.x+c.w,b.x+b.w)-Math.max(c.x,b.x);if(o<=0){dead=1;return}L.push({x:Math.max(c.x,b.x),w:o});c={x:0,w:o,d:3+L.length*.15}};
on(document,'keydown',e=>e.key==' '&&place());on(stage.firstChild,'pointerdown',place);
raf(()=>{if(!dead){c.x+=c.d;if(c.x<0||c.x+c.w>320)c.d*=-1}const bs=Math.max(0,L.length-14);R(x,'#10132b',0,0,320,480);
L.forEach((b,i)=>R(x,`hsl(${i*25},70%,60%)`,b.x,440-(i-bs)*26,b.w,24));if(!dead)R(x,'#fff',c.x,440-(L.length-bs)*26,c.w,24);
st(dead?`Game over, height ${L.length-1}. Press R`:`Height ${L.length-1} (space or click to drop)`)})};

N.cookie=()=>{let n=0,pc=1,ps=0;const u=[20,50],d=div('tap'),f=div(),bs=[0,1].map(i=>{const b=bt('',()=>{if(n>=u[i]){n-=u[i];u[i]=Math.ceil(u[i]*1.6);i?ps++:pc++;dr()}});f.append(b);return b});d.style.fontSize='90px';d.textContent='🍪';d.onclick=()=>{n+=pc;dr()};
const dr=()=>{bs[0].textContent=`Stronger clicks (${u[0]})`;bs[1].textContent=`Auto baker (${u[1]})`;st(`${Math.floor(n)} cookies · ${pc} per click · ${ps} per second`)};tick(()=>{n+=ps;dr()},1000);dr()};

N.maze=()=>{const n=V.n,w=n*2+1,m=Array(w*w).fill(1),z=480/w,x=cv(480,480),sk=[[1,1]];m[w+1]=0;
while(sk.length){const[a,b]=sk[sk.length-1],o=[[2,0],[-2,0],[0,2],[0,-2]].filter(([i,j])=>a+i>0&&a+i<w&&b+j>0&&b+j<w&&m[(b+j)*w+a+i]);if(!o.length){sk.pop();continue}const[i,j]=o[rnd(o.length)];m[(b+j/2)*w+a+i/2]=0;m[(b+j)*w+a+i]=0;sk.push([a+i,b+j])}
let px=1,py=1;const dr=()=>{R(x,'#10132b',0,0,480,480);m.forEach((v,i)=>v&&R(x,'#3b4a8a',(i%w)*z,(i/w|0)*z,z+.5,z+.5));R(x,'#4ade80',(w-2)*z,(w-2)*z,z,z);R(x,'#ffd166',px*z+z*.15,py*z+z*.15,z*.7,z*.7);st(px==w-2&&py==w-2?'You escaped! 🎉 Press R':'Reach the green square (arrow keys)')};
on(document,'keydown',e=>{const d={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(d&&!m[(py+d[1])*w+px+d[0]]){px+=d[0];py+=d[1];dr()}});dr()};

N.othello=()=>{const D=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];let b=Array(64).fill(0),over=0,busy=0;b[27]=b[36]=2;b[28]=b[35]=1;
const fl=(b,i,p)=>{const r=i>>3,c=i&7,o=[];if(b[i])return o;D.forEach(([a,d])=>{let y=r+a,x=c+d;const t=[];while(y>=0&&y<8&&x>=0&&x<8&&b[y*8+x]==3-p){t.push(y*8+x);y+=a;x+=d}if(t.length&&y>=0&&y<8&&x>=0&&x<8&&b[y*8+x]==p)o.push(...t)});return o};
const mv=(b,p)=>[...Array(64).keys()].filter(i=>fl(b,i,p).length);
const pl=(b,i,p)=>{const n=b.slice();fl(b,i,p).forEach(j=>n[j]=p);n[i]=p;return n};
const Wt=i=>[0,7,56,63].includes(i)?30:[1,6,8,15,48,55,57,62,9,14,49,54].includes(i)?-8:1;
const g=grid(8,480),cs=b.map((_,i)=>cell(g,'',()=>{if(busy||over||!mv(b,1).includes(i))return;b=pl(b,i,1);busy=1;dr();setTimeout(bot,400)}));
const dr=()=>{const ok=busy?[]:mv(b,1);cs.forEach((c,i)=>{c.style.cssText='border-radius:0;box-shadow:inset 0 0 0 1px #0005;background:#2f7d4f;font-size:min(8vw,36px);color:'+(b[i]==1?'#111':'#fff');c.textContent=b[i]?'●':ok.includes(i)?'·':''});
const a=b.filter(v=>v==1).length,z=b.filter(v=>v==2).length;over=!mv(b,1).length&&!mv(b,2).length;st(over?(a>z?'You win! ':a<z?'Bot wins. ':'Draw. ')+`${a} to ${z}`:`You are black: ${a}   Bot is white: ${z}`)};
const bot=()=>{const m=mv(b,2);if(m.length){const s=m.map(i=>[i,V.h?Wt(i)*3+fl(b,i,2).length:Math.random()]).sort((a,z)=>z[1]-a[1]);b=pl(b,s[0][0],2)}
if(!mv(b,1).length&&mv(b,2).length){dr();return setTimeout(bot,500)}busy=0;dr()};dr()};

N.wordle=()=>{const w=W5[rnd(W5.length)];let k=0;const g=grid(5,300),cs=[...Array(30)].map(()=>{const b=cell(g,'');b.style.fontSize='24px';b.disabled=1;b.style.opacity=1;return b}),i=inp();i.maxLength=5;
i.onkeydown=e=>{if(e.key!='Enter')return;const v=i.value.toLowerCase();if(v.length!=5||!/^[a-z]+$/.test(v)||k>5)return;i.value='';const u=[...w];[...v].forEach((c,j)=>{if(c==w[j])u[j]=null});
[...v].forEach((c,j)=>{const b=cs[k*5+j];b.textContent=c.toUpperCase();b.style.color='#fff';b.style.background=c==w[j]?'#22a559':u.includes(c)?(u[u.indexOf(c)]=null,'#c9a227'):'#444'});
if(v==w){st('You got it! 🎉');k=9}else if(++k==6)st('The word was '+w.toUpperCase());else st(`Guess ${k+1} of 6`)};st('Guess the 5-letter word. Type and press Enter')};

N.slots=()=>{let bk=100;const d=div('box'),f=div(),S=['🍒','🍋','🔔','⭐','7️⃣'];d.style.fontSize='56px';d.textContent='🎰';
f.append(bt('Spin (10 coins)',()=>{if(bk<10)return;bk-=10;const r=[0,0,0].map(()=>S[rnd(5)]),k=new Set(r).size,w=k==1?100:k==2?20:0;bk+=w;d.textContent=r.join(' ');st(`Coins ${bk}${w?' (won '+w+')':''}${bk<10?'. Out of coins, use Restart':''}`)}));st('Coins '+bk)};

N.stroop=()=>{const Nm=['RED','GREEN','BLUE','YELLOW'],Cc=['#ef4444','#22c55e','#3b82f6','#eab308'];let sc=0,t=30,a;const d=div('box'),f=div();d.style.fontSize='56px';
const q=()=>{a=rnd(4);d.textContent=Nm[rnd(4)];d.style.color=Cc[a]};
Nm.forEach((n,i)=>f.append(bt(n,()=>{if(t>0){i==a?sc++:sc=Math.max(0,sc-1);q()}})));
tick(()=>{if(--t<=0){d.textContent='Time!';d.style.color='';st(`Score ${sc}. Press R`)}else st(`Click the INK colour, not the word. Score ${sc}   ${t}s`)},1000);q()};

/* ---- catalogue ---- */
const add=(t,i,c,f,v,nk)=>E.push({t,i,c,f,v:v||{},nk});
const g0=Object.values(G);
add('Snake','🐍','Arcade',g0[0]);add('Snake Wrap-Around','🐍','Arcade',g0[0],{w:1});add('Snake Speed Run','⚡','Arcade',g0[0],{sp:60});add('Snake Chill','🐢','Arcade',g0[0],{sp:160});
add('Pong','🏓','Arcade',g0[1]);add('Pong Easy','🏓','Arcade',g0[1],{ai:2.2});add('Pong Hard','🏓','Arcade',g0[1],{ai:5});
add('Chess vs Bot','♟️','Board',g0[2]);add('Tic-Tac-Toe','⭕','Board',g0[3]);add('Connect 4','🔴','Board',g0[4]);
add('Breakout','🧱','Arcade',g0[5]);add('Flappy','🐦','Arcade',g0[6]);add('Flappy Easy','🐥','Arcade',g0[6],{gp:95});add('Flappy Hard','🔥','Arcade',g0[6],{gp:52});
add('Memory Match','🧠','Puzzle',g0[7]);add('Memory Animals','🐶','Puzzle',g0[7],{e:'🐶🐱🐭🐹🐰🦊🐻🐼'});add('Memory Faces','😀','Puzzle',g0[7],{e:'😀😎😍🤔😴🤯🥳😡'});
add('2048','🔢','Puzzle',g0[8]);add('Minesweeper','💣','Puzzle',g0[9]);add('Minesweeper Easy','🚩','Puzzle',g0[9],{mn:5});add('Minesweeper Hard','☠️','Puzzle',g0[9],{mn:18});
add('Whack-a-Mole','🐹','Skill',g0[10]);add('Whack Slow','🐌','Skill',g0[10],{sp:1000});add('Whack Fast','⚡','Skill',g0[10],{sp:450});add('Whack Insane','🔥','Skill',g0[10],{sp:300});
[['Tetris Slow',700],['Tetris',500],['Tetris Fast',280]].forEach(([t,s])=>add(t,'🧩','Arcade',N.tetris,{sp:s}));
add('Space Invaders','👾','Arcade',N.inv);
[['Runner',5],['Runner Fast',7.5],['Runner Insane',10]].forEach(([t,s])=>add(t,'🦖','Arcade',N.run,{sp:s}));
[['Dodge Easy',3],['Dodge',4.5],['Dodge Hard',6.5],['Dodge Insane',9]].forEach(([t,s])=>add(t,'☄️','Arcade',N.dodge,{sp:s}));
[['Fruit Catch Easy',60],['Fruit Catch',42],['Fruit Catch Hard',28],['Fruit Catch Insane',18]].forEach(([t,s])=>add(t,'🧺','Arcade',N.catch,{n:s}));
add('Stack Tower','🏗️','Arcade',N.stack);
[['Maze Tiny',6],['Maze Small',10],['Maze Medium',15],['Maze Huge',22]].forEach(([t,s])=>add(t,'🌀','Puzzle',N.maze,{n:s}));
[3,4,5].forEach(n=>add(`Lights Out ${n}×${n}`,'💡','Puzzle',N.lights,{n}));
[3,4,5].forEach(n=>add(`Sliding Puzzle ${n}×${n}`,'🔲','Puzzle',N.slide,{n}));
[3,4,5,6,7,8].forEach(n=>add(`Tower of Hanoi ${n} discs`,'🗼','Puzzle',N.hanoi,{n}));
add('Mastermind','🎨','Puzzle',N.mm,{n:4});add('Mastermind Hard','🎨','Puzzle',N.mm,{n:5});
add('Othello Easy','⚫','Board',N.othello);add('Othello Hard','⚪','Board',N.othello,{h:1});
add('Reaction Test','⚡','Skill',N.react);
[['Aim Trainer Big',30],['Aim Trainer',18],['Aim Trainer Hard',10],['Aim Trainer Sniper',6]].forEach(([t,r])=>add(t,'🎯','Skill',N.aim,{r}));
[5,10,30,60].forEach(s=>add(`Click Speed ${s}s`,'👆','Skill',N.cps,{s}));
[15,30,60,120].forEach(s=>add(`Typing Test ${s}s`,'⌨️','Word',N.type,{s}));
[['Addition Sprint','+',9],['Big Addition','+',99],['Subtraction Sprint','-',50],['Times Tables','*',9],['Big Multiplication','*',15],['Mixed Math','+-*',12],['Mixed Math Hard','+-*',30]].forEach(([t,o,m])=>add(t,'➕','Skill',N.math,{o,m}));
[['Simon Slow',800],['Simon',550],['Simon Fast',350],['Simon Insane',220]].forEach(([t,sp])=>add(t,'🔵','Skill',N.simon,{sp}));
add('Number Memory','🔟','Skill',N.num);add('Color Clash','🌈','Skill',N.stroop);
add('Hangman Animals','🪢','Word',N.hang,{w:'elephant giraffe penguin dolphin kangaroo crocodile butterfly squirrel hamster octopus'.split(' ')},1);
add('Hangman Food','🪢','Word',N.hang,{w:'pizza burger noodles pancake sandwich chocolate spaghetti burrito pretzel avocado'.split(' ')},1);
add('Hangman Countries','🪢','Word',N.hang,{w:'canada brazil japan egypt mexico germany norway kenya spain india'.split(' ')},1);
add('Wordle','🟩','Word',N.wordle,0,1);
[10,100,1000,10000].forEach(m=>add(`Guess the Number 1–${m}`,'❓','Casual',N.guess,{m}));
add('Higher or Lower','🃏','Casual',N.hilo);add('Cookie Clicker','🍪','Casual',N.cookie);
[['Rock Paper Scissors: First to 2',2],['Rock Paper Scissors: First to 3',3],['Rock Paper Scissors: First to 5',5]].forEach(([t,b])=>add(t,'✌️','Casual',N.rps,{b}));

/* ---- casino + cube dash ---- */
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
let bank=LS.get('bank')==null?1000:+LS.get('bank');const setBank=v=>{bank=Math.max(0,Math.floor(v));LS.set('bank',bank)};
const take=n=>{if(!(n>0)||n>bank){st('Not enough chips. Lower your bet or use Refill. 🪙 '+bank);return 0}setBank(bank-n);return 1};
const pay=n=>setBank(bank+n);
function betbar(){let b=10;const row=div('kb'),O=[10,50,100,500,'All in'],bs=O.map(v=>bt(v=='All in'?v:'🪙'+v,()=>{b=v;mk()}));
const mk=()=>bs.forEach((x,i)=>x.classList.toggle('on',O[i]==b));bs.forEach(x=>row.append(x));
row.append(bt('Refill',()=>{if(bank<10){setBank(1000);st('Free refill! 🪙 '+bank)}else st('Refill only works under 10 chips. 🪙 '+bank)}));mk();return{get:()=>b=='All in'?bank:b}}
//EV-START
const RK='23456789TJQKA',SU='♣♦♥♠',su=c=>c/13|0,cn=c=>RK[c%13]+SU[su(c)],red=c=>su(c)==1||su(c)==2;
const cdh=(c,h)=>h?'<span class="cd x">??</span>':`<span class="cd${red(c)?' r':''}">${cn(c)}</span>`;
const ev5=h=>{const r=h.map(c=>c%13).sort((a,b)=>b-a),fl=h.every(c=>su(c)==su(h[0])),n={};r.forEach(v=>n[v]=(n[v]||0)+1);
const g=Object.entries(n).map(([v,k])=>[k,+v]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);let s=0;if(g.length==5){if(r[0]-r[4]==4)s=r[0];else if(r[0]==12&&r[1]==3)s=3}
const c=s&&fl?8:g[0][0]==4?7:g[0][0]==3&&g[1][0]==2?6:fl?5:s?4:g[0][0]==3?3:g[0][0]==2&&g[1][0]==2?2:g[0][0]==2?1:0;
return c*1e6+(s?[s]:g.map(x=>x[1])).reduce((a,v)=>a*13+v,0)};
const best=c=>{let m=0;for(let a=0;a<c.length;a++)for(let b=a+1;b<c.length;b++)m=Math.max(m,ev5(c.filter((_,i)=>i!=a&&i!=b)));return m};
//EV-END
N.poker=()=>{let dk,pc,ac,bd=[],pot=0,pb=0,ab=0,street=0,acted=0,rs=0,over=1,turn='p',msg='Press Deal. Blinds are 20 (you) and 10 (AI).';const A=V.a,d=div('box'),f=div();d.style.cssText+=';flex-direction:column;gap:8px;font-size:18px';
const eq=(h,b)=>{const u=[...Array(52).keys()].filter(c=>!h.includes(c)&&!b.includes(c)),n=5-b.length;let w=0;for(let t=0;t<100;t++){const s=u.slice().sort(()=>Math.random()-.5),bb=b.concat(s.slice(2,2+n)),x=best(h.concat(bb)),y=best(s.slice(0,2).concat(bb));w+=x>y?1:x==y?.5:0}return w/100};
const draw=sh=>{d.innerHTML=`<div>🤖 AI ${ac?ac.map(c=>cdh(c,!sh)).join(''):''}</div><div>Board ${bd.map(c=>cdh(c)).join('')||'—'} &nbsp; Pot <b>${pot}</b></div><div>You ${pc?pc.map(c=>cdh(c)).join(''):''}</div><div>${msg}</div>`;btns();st('🪙 '+bank)};
const btns=()=>{f.innerHTML='';if(over){f.append(bt(bank>=20?'Deal':'Refill 1000 chips',()=>bank>=20?deal():(setBank(1000),draw(1))));return}if(turn!='p')return;const need=ab-pb;
f.append(bt('Fold',()=>fin('a','You folded')),bt(need?'Call '+need:'Check',()=>act('p','c')));[40,pot].forEach(a=>{if(rs<3&&bank>need+a)f.append(bt('Raise '+a,()=>act('p','r',a)))});if(bank>need&&rs<3)f.append(bt('All in',()=>act('p','r',bank-need)))};
const act=(w,a,amt)=>{const me=w=='p',need=me?ab-pb:pb-ab;let p=need;if(a=='r'){p=need+amt;rs++}if(me){setBank(bank-p);pb+=p}else ab+=p;pot+=p;acted++;msg=`${me?'You':'AI'} ${a=='r'?'raised '+amt:need?'called':'checked'}`;
if(pb==ab&&acted>=2)nxt();else if(me)aiTurn();else{turn='p';draw()}};
const nxt=()=>{if(street==3||bank==0){while(bd.length<5)bd.push(dk.pop());return show()}street++;bd.push(...(street==1?[dk.pop(),dk.pop(),dk.pop()]:[dk.pop()]));pb=ab=0;acted=0;rs=0;turn='p';draw()};
const show=()=>{const a=best(pc.concat(bd)),b=best(ac.concat(bd)),H=['High card','Pair','Two pair','Three of a kind','Straight','Flush','Full house','Four of a kind','Straight flush'];
if(a>b)pay(pot);else if(a==b)pay(pot/2);over=1;msg=`${a>b?'You win '+pot+'!':a<b?'AI wins.':'Split pot.'} You: ${H[a/1e6|0]}. AI: ${H[b/1e6|0]}.`;draw(1)};
const fin=(w,t)=>{if(w=='p'){pay(pot);msg=t+'. You win '+pot+'!'}else msg=t+'.';over=1;draw()};
const aiTurn=()=>{turn='a';draw();setTimeout(()=>{if(over)return;const need=pb-ab,s=eq(ac,bd)+(Math.random()-.5)*.3/A,r=Math.random(),od=need/(pot+need||1),mx=Math.min(bank,Math.max(40,pot*(r<.5?.5:1)|0));
if(!need){bank>0&&rs<3&&(s>.62||(s<.3&&r<.1*A))&&r<.75*A?act('a','r',mx):act('a','c')}
else if(s<od*.95-.03&&r>.07*A)fin('p','AI folds');
else if(s>.72&&bank>0&&rs<3&&r<.6*A)act('a','r',mx);else act('a','c')},800)};
const deal=()=>{dk=[...Array(52).keys()].sort(()=>Math.random()-.5);pc=[dk.pop(),dk.pop()];ac=[dk.pop(),dk.pop()];bd=[];street=0;setBank(bank-20);pb=20;ab=10;pot=30;acted=0;rs=0;over=0;msg='Blinds posted';aiTurn()};draw()};

N.bj2=()=>{const bb=betbar(),d=div('box'),f=div();let dk,P=[],D=[],live=0,bet=0;d.style.fontSize='22px';d.textContent='Place a bet and press Deal';
const val=h=>{let s=0,a=0;h.forEach(c=>{s+=c>10?10:c==1?(a++,11):c});while(s>21&&a--)s-=10;return s},nm=c=>['A',2,3,4,5,6,7,8,9,10,'J','Q','K'][c-1];
const dr=()=>d.textContent=`Dealer: ${live?nm(D[0])+' ?':D.map(nm).join(' ')+' ('+val(D)+')'}\n\nYou: ${P.map(nm).join(' ')} (${val(P)})`;
const fin=(m,x)=>{live=0;dr();pay(Math.floor(bet*x));st(`${m} 🪙 ${bank}`)};
f.append(bt('Deal',()=>{if(live)return;bet=bb.get();if(!take(bet))return;dk=[];for(let i=0;i<52;i++)dk.push(i%13+1);dk.sort(()=>Math.random()-.5);P=[dk.pop(),dk.pop()];D=[dk.pop(),dk.pop()];live=1;if(val(P)==21)fin('Blackjack pays 3:2!',2.5);else{dr();st('Hit or stand?')}}),
bt('Hit',()=>{if(!live)return;P.push(dk.pop());val(P)>21?fin('Bust.',0):dr()}),
bt('Stand',()=>{if(!live)return;while(val(D)<17)D.push(dk.pop());const p=val(P),q=val(D);live=0;q>21||p>q?fin('You win!',2):p==q?fin('Push.',1):fin('Dealer wins.',0)}));st('🪙 '+bank)};

N.roul=()=>{const bb=betbar(),d=div('box'),f=div(),Rd=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];d.style.fontSize='40px';d.textContent='🎡';
[['Red',n=>Rd.includes(n),2],['Black',n=>n&&!Rd.includes(n),2],['Even',n=>n&&n%2==0,2],['Odd',n=>n%2==1,2],['1–18',n=>n>=1&&n<=18,2],['19–36',n=>n>=19,2],['Green 0',n=>n==0,36]].forEach(([t,fn,m])=>f.append(bt(t,()=>{const n=bb.get();if(!take(n))return;const r=rnd(37);d.textContent=`${r==0?'🟢':Rd.includes(r)?'🔴':'⚫'} ${r}`;if(fn(r)){pay(n*m);st(`Win ${n*(m-1)}! 🪙 ${bank}`)}else st(`Lose ${n}. 🪙 ${bank}`)})));st('Pick a bet. 🪙 '+bank)};

N.slots2=()=>{const bb=betbar(),d=div('box'),f=div(),S=['🍒','🍋','🔔','⭐','🍇','🍉','7️⃣'];d.style.fontSize='56px';d.textContent='🎰';
f.append(bt('Spin',()=>{const n=bb.get();if(!take(n))return;const r=[0,0,0].map(()=>rnd(7)),k=new Set(r).size,m=k==1?(r[0]==6?60:20):k==2?1:0;pay(n*m);d.textContent=r.map(i=>S[i]).join(' ');st(m>1?`Won ${n*m}! 🪙 ${bank}`:m?`Pair: bet returned. 🪙 ${bank}`:`Lost ${n}. 🪙 ${bank}`)}));st('Three of a kind pays 20× (777 pays 60×). 🪙 '+bank)};

N.coin=()=>{const bb=betbar(),d=div('box'),f=div();d.style.fontSize='54px';d.textContent='🪙';
['Heads','Tails'].forEach((t,i)=>f.append(bt(t,()=>{const n=bb.get();if(!take(n))return;const r=rnd(2);d.textContent=r?'Tails':'Heads';if(r==i){pay(n*2);st(`You win ${n}! 🪙 ${bank}`)}else st(`You lose ${n}. 🪙 ${bank}`)})));st('Double or nothing. 🪙 '+bank)};

N.dice=()=>{const bb=betbar(),d=div('box'),f=div(),p=V.p;d.style.fontSize='48px';d.textContent='🎲';
f.append(bt(`Roll (win ${Math.round(p*100)}%, pays ${(.98/p).toFixed(2)}×)`,()=>{const n=bb.get();if(!take(n))return;const r=Math.random(),w=r<p,x=Math.floor(n*.98/p);d.textContent='🎲 '+(r*100).toFixed(1);if(w)pay(x);st(w?`Win ${x}! 🪙 ${bank}`:`Lose ${n}. 🪙 ${bank}`)}));st('Roll under '+Math.round(p*100)+' to win. 🪙 '+bank)};

N.crash=()=>{const bb=betbar(),d=div('box'),f=div();let m=1,live=0,cp,bet,iv;d.style.fontSize='54px';d.textContent='🚀 1.00×';
const cash=()=>{if(!live)return;live=0;clearInterval(iv);const w=Math.floor(bet*m);pay(w);st(`Cashed out at ${m.toFixed(2)}×: won ${w}. 🪙 ${bank}`)};
f.append(bt('Launch',()=>{if(live)return;bet=bb.get();if(!take(bet))return;live=1;m=1;cp=Math.max(1,.99/(1-Math.random()));st('Cash out before it crashes!');
iv=setInterval(()=>{m*=1.012;if(m>=cp){live=0;clearInterval(iv);d.textContent='💥 '+cp.toFixed(2)+'×';st(`Crashed! Lost ${bet}. 🪙 ${bank}`)}else d.textContent='🚀 '+m.toFixed(2)+'×'},50);C.push(()=>clearInterval(iv))}),bt('Cash out',cash));st('🪙 '+bank)};

N.mines=()=>{const bb=betbar(),g=grid(5,300),f=div(),k=V.k;let m=[],rv=0,bet=0,live=0;const cs=[...Array(25)].map((_,i)=>{const c=cell(g,'?',()=>pick(i));c.disabled=1;return c});
const mult=()=>[...Array(rv).keys()].reduce((a,i)=>a*(25-i)/(25-k-i),1)*.97;
const stop=w=>{live=0;cs.forEach((c,i)=>{c.disabled=1;if(m[i]&&c.textContent!='💥')c.textContent='💣'});st(w)};
const cash=()=>{if(!live||!rv)return;const w=Math.floor(bet*mult());pay(w);stop(`Cashed out ${w}! 🪙 ${bank}`)};
const pick=i=>{if(!live)return;if(m[i]){cs[i].textContent='💥';stop(`Boom! Lost ${bet}. 🪙 ${bank}`);return}cs[i].textContent='💎';cs[i].disabled=1;rv++;if(rv==25-k)cash();else st(`${rv} gems. Cash out for ${Math.floor(bet*mult())} (×${mult().toFixed(2)})`)};
f.append(bt('Start',()=>{if(live)return;bet=bb.get();if(!take(bet))return;m=Array(25).fill(0);let n=0;while(n<k){const j=rnd(25);if(!m[j]){m[j]=1;n++}}rv=0;live=1;cs.forEach(c=>{c.textContent='?';c.disabled=0});st(`Find gems, avoid ${k} mine${k>1?'s':''}`)}),bt('Cash out',cash));st('🪙 '+bank)};

N.vp=()=>{const bb=betbar(),d=div('kb'),f=div(),L=div();let h=[],hold=[],dk,bet=0,ph=0;
const dr=()=>{d.innerHTML='';h.forEach((c,i)=>{const b=bt(cn(c),()=>{if(ph==1){hold[i]^=1;dr()}});b.style.cssText=`font-size:26px;padding:16px 10px;color:${red(c)?'#ff5a5a':'inherit'}`;b.classList.toggle('on',!!hold[i]);d.append(b)})};
const val=s=>{const c=s/1e6|0,r=(s%1e6)/2197|0;return c==8?(s%1e6==12?250:50):c==7?25:c==6?9:c==5?6:c==4?4:c==3?3:c==2?2:c==1&&r>=9?1:0};
f.append(bt('Deal / Draw',()=>{if(ph==0){bet=bb.get();if(!take(bet))return;dk=[...Array(52).keys()].sort(()=>Math.random()-.5);h=dk.splice(0,5);hold=[];ph=1;dr();st('Tap cards to HOLD, then press Deal / Draw')}
else{h=h.map((c,i)=>hold[i]?c:dk.pop());ph=0;dr();const m=val(ev5(h));pay(bet*m);st(m?`Win ×${m}: ${bet*m}! 🪙 ${bank}`:`No win. 🪙 ${bank}`)}}));
L.textContent='Pays: pair of Jacks or better 1×, two pair 2×, trips 3×, straight 4×, flush 6×, full house 9×, quads 25×, straight flush 50×, royal 250×';L.style.cssText='font-size:13px;opacity:.7;max-width:440px';st('🪙 '+bank)};

N.wheel=()=>{const bb=betbar(),d=div('box'),f=div(),S=[0,0,0,0,0,0,0,0,.5,.5,.5,1,1,1,1,1.5,1.5,2,3,5];d.style.fontSize='48px';d.textContent='🎡';
f.append(bt('Spin',()=>{const n=bb.get();if(!take(n))return;const k=S[rnd(20)],w=Math.floor(n*k);d.textContent=`🎡 ${k}×`;pay(w);st(w?`Won ${w}! 🪙 ${bank}`:`Lost ${n}. 🪙 ${bank}`)}));st('Segments from 0× to 5×. 🪙 '+bank)};

N.scratch=()=>{const bb=betbar(),g=grid(3,300),f=div(),Sy=[['🍒',2,.5],['🍋',3,.25],['⭐',5,.15],['💎',10,.08],['👑',50,.02]];let cd=[],rvl=0,bet=0,live=0;
const cs=[...Array(6)].map((_,i)=>cell(g,'▒',()=>{if(!live||cs[i].dataset.o)return;cs[i].dataset.o=1;cs[i].textContent=cd[i];if(++rvl==6)settle()}));
const mk=w=>{for(;;){const a=w?[w,w,w]:[];while(a.length<6)a.push(Sy[rnd(5)][0]);const n={};a.forEach(c=>n[c]=(n[c]||0)+1);if(Object.entries(n).every(([c,k])=>k<=2||(c==w&&k==3)))return a.sort(()=>Math.random()-.5)}};
const settle=()=>{live=0;const n={};cd.forEach(c=>n[c]=(n[c]||0)+1);const w=Sy.find(s=>n[s[0]]>=3),p=w?Math.floor(bet*w[1]):0;pay(p);st(p?`Three ${w[0]}! Won ${p}! 🪙 ${bank}`:`No match. 🪙 ${bank}`)};
f.append(bt('Buy card',()=>{if(live)return;bet=bb.get();if(!take(bet))return;rvl=0;live=1;cs.forEach(c=>{c.textContent='▒';delete c.dataset.o});let r=Math.random(),a=0;const s=Sy.find(s=>(a+=s[2])>=r)||Sy[0];cd=mk(Math.random()<.22?s[0]:null);st('Tap all 6 squares. Match 3 to win')}));st('🪙 '+bank)};

N.gd=()=>{const x=cv(480,270),GY=220,S=V.s,PX=100,JV=9.5,GR=.55,O=[],END=V.len+300;let seed=V.sd,att=1,y,vy,rot,cam,dead,won,ptr=0;
const rn=()=>(seed=seed*16807%2147483647)/2147483647;
{let px=600;while(px<V.len){const r=rn();if(r<.45){const n=1+(rn()*V.mx|0);for(let i=0;i<n;i++)O.push({x:px+i*30,w:30,h:30,t:'s'});px+=n*30+230+rn()*150}else if(r<.8){const w=60+(rn()*3|0)*30;O.push({x:px,w,h:40,t:'b'});px+=w+210+rn()*150}else{O.push({x:px,w:60,h:40,t:'b'},{x:px+60,w:30,h:30,t:'s'},{x:px+90,w:60,h:40,t:'b'});px+=410}}}
const reset=()=>{y=0;vy=0;rot=0;cam=0;dead=0;won=0};reset();
on(stage.firstChild,'pointerdown',()=>ptr=1);on(document,'pointerup',()=>ptr=0);
raf(()=>{if(!dead&&!won){cam+=S;const py=y;vy-=GR;y+=vy;let gr=0;if(y<=0){y=0;vy=0;gr=1}
O.forEach(o=>{const xs=o.x-cam;if(xs>PX+40||xs+o.w<PX-10)return;if(o.t=='s'){if(PX+26>xs+8&&PX+4<xs+o.w-8&&y<o.h-8)dead=1}else if(PX+28>xs&&PX+2<xs+o.w){if(py>=o.h-.5&&y<=o.h){y=o.h;vy=0;gr=1}else if(y<o.h-.5)dead=1}});
if(gr&&(K[' ']||K.ArrowUp||ptr)){vy=JV;gr=0}rot=gr?Math.round(rot/1.5708)*1.5708:rot+.11;
if(dead)setTimeout(()=>{att++;reset()},700);if(cam>END)won=1}
const gd=x.createLinearGradient(0,0,0,270);gd.addColorStop(0,`hsl(${V.h},60%,32%)`);gd.addColorStop(1,`hsl(${V.h},60%,12%)`);x.fillStyle=gd;x.fillRect(0,0,480,270);
R(x,`hsl(${V.h},45%,38%)`,0,GY,480,50);R(x,'#fffa',0,GY,480,2);
O.forEach(o=>{const xs=o.x-cam;if(xs>480||xs+o.w<0)return;if(o.t=='b'){R(x,'#fff',xs,GY-o.h,o.w,o.h);R(x,`hsl(${V.h},50%,18%)`,xs+2,GY-o.h+2,o.w-4,o.h-4)}else{x.fillStyle='#000';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(xs,GY);x.lineTo(xs+o.w/2,GY-o.h);x.lineTo(xs+o.w,GY);x.closePath();x.fill();x.stroke()}});
x.save();x.translate(PX+15,GY-y-15);x.rotate(rot);R(x,'#000',-16,-16,32,32);R(x,'#ffd166',-14,-14,28,28);R(x,'#000',-8,-8,5,5);R(x,'#000',3,-8,5,5);R(x,'#000',-8,4,16,4);x.restore();
const pct=Math.min(100,cam/END*100|0);R(x,'#0008',20,12,440,8);R(x,'#4ade80',20,12,440*pct/100,8);
st(won?`Level complete! 🎉 Attempts: ${att}`:dead?`Crashed at ${pct}%…`:`Attempt ${att}   ${pct}% (hold space, up arrow or click)`)})};

[['Poker vs AI Easy',.6],['Poker vs AI',1],['Poker vs AI Tough',1.5]].forEach(([t,a])=>add(t,'♠️','Casino',N.poker,{a}));
add('Blackjack (chips)','🂡','Casino',N.bj2);add('Roulette','🎡','Casino',N.roul);add('Slots (chips)','🎰','Casino',N.slots2);add('Coin Flip','🪙','Casino',N.coin);
[.5,.25,.1,.05].forEach(p=>add(`Dice ${Math.round(p*100)}% Chance`,'🎲','Casino',N.dice,{p}));
add('Crash','🚀','Casino',N.crash);[1,3,5,10].forEach(k=>add(`Mines (${k} mine${k>1?'s':''})`,'💎','Casino',N.mines,{k}));
add('Video Poker','🃏','Casino',N.vp);add('Lucky Wheel','🎡','Casino',N.wheel);add('Scratch Cards','🎟️','Casino',N.scratch);
[['Cube Dash 1: Easy',4,4000,2,1,210],['Cube Dash 2: Normal',4.6,5500,2,7,280],['Cube Dash 3: Hard',5.2,7000,3,13,340],['Cube Dash 4: Harder',5.8,8000,3,21,30],['Cube Dash 5: Insane',6.5,9500,3,33,140],['Cube Dash Marathon',5,24000,3,99,180]].forEach(([t,s,len,mx,sd,h])=>add(t,'🟨','Arcade',N.gd,{s,len,mx,sd,h}));

/* ---- menu ---- */
let cat='All',qs='';const CATS=['All','★ Favorites','Arcade','Puzzle','Board','Casino','Skill','Word','Casual'];
let fav=new Set((()=>{try{return JSON.parse(LS.get('fav')||'[]')}catch(e){return[]}})());const sv=()=>LS.set('fav',JSON.stringify([...fav]));
const hue=t=>Math.abs([...t].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))%360;
function render(){const l=$('#list');l.innerHTML='';let k=0;
E.forEach((e,n)=>{if((cat=='★ Favorites'?!fav.has(e.t):cat!='All'&&e.c!=cat)||!e.t.toLowerCase().includes(qs))return;k++;const w=document.createElement('div'),h=hue(e.t);w.className='card';
w.innerHTML=`<button class="play"><span class="pv" style="background:linear-gradient(135deg,hsl(${h},75%,58%),hsl(${(h+50)%360},70%,32%))">${e.i}</span><span><b></b><small>${e.c}</small></span></button><button class="star" aria-label="Favorite"></button>`;
w.querySelector('b').textContent=e.t;const st_=w.querySelector('.star');st_.textContent=fav.has(e.t)?'★':'☆';st_.onclick=()=>{fav.has(e.t)?fav.delete(e.t):fav.add(e.t);sv();render()};w.querySelector('.play').onclick=()=>launch(n);l.append(w)});
$('#cnt').textContent=(cat=='★ Favorites'&&!k?'No favorites yet. Tap ☆ on any game!':k+' games')+' · 🪙 '+bank}
function tfav(){const t=E[cur].t;fav.has(t)?fav.delete(t):fav.add(t);sv();$('#fv').textContent=fav.has(t)?'★':'☆'}
CATS.forEach(c=>{const b=document.createElement('button');b.className='chip'+(c==cat?' on':'');b.textContent=c;b.onclick=()=>{cat=c;[...$('#cats').children].forEach(x=>x.classList.toggle('on',x==b));render()};$('#cats').append(b)});
$('#q').oninput=e=>{qs=e.target.value.toLowerCase().trim();render()};render();

/* ---- app shell ---- */
// Chrome fires beforeinstallprompt only when the app can be installed
let ask;addEventListener('beforeinstallprompt',e=>{e.preventDefault();ask=e;$('#insp').hidden=0});
$('#ins').onclick=()=>{if(ask)ask.prompt();ask=null;$('#insp').hidden=1};
addEventListener('appinstalled',()=>$('#insp').hidden=1);
$('#bk').onclick=home;$('#rs').onclick=()=>launch(cur);$('#fv').onclick=tfav;
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});