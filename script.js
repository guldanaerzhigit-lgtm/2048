
const size = 5;
let board = [];
let score = 0;
let best = localStorage.getItem("best") || 0;
let lives = localStorage.getItem("lives") || 3;
let coins = localStorage.getItem("coins") || 0;

document.getElementById("best").textContent = best;
document.getElementById("lives").textContent = lives;
document.getElementById("coins").textContent = coins;

const game = document.getElementById("game");

function createBoard(){
  board = Array(size).fill().map(()=>Array(size).fill(0));
  addTile(); addTile();
  draw();
}

function addTile(){
  let empty=[];
  for(let r=0;r<size;r++)
    for(let c=0;c<size;c++)
      if(board[r][c]==0) empty.push({r,c});
  if(empty.length==0) return;
  let {r,c}=empty[Math.floor(Math.random()*empty.length)];
  board[r][c]=Math.random()<0.9?2:4;
}

function draw(){
  game.innerHTML="";
  board.flat().forEach(val=>{
    let div=document.createElement("div");
    div.className="tile";
    div.textContent=val==0?"":val;
    game.appendChild(div);
  });
}

function slide(row){
  row=row.filter(v=>v);
  for(let i=0;i<row.length-1;i++){
    if(row[i]==row[i+1]){
      row[i]*=2;
      score+=row[i];
      coins++;
      row[i+1]=0;
    }
  }
  row=row.filter(v=>v);
  while(row.length<size) row.push(0);
  return row;
}

function moveLeft(){
  board=board.map(r=>slide(r));
  addTile();
  update();
}

function update(){
  document.getElementById("score").textContent=score;
  if(score>best){
    best=score;
    localStorage.setItem("best",best);
    document.getElementById("best").textContent=best;
  }
  localStorage.setItem("coins",coins);
  document.getElementById("coins").textContent=coins;
  draw();
}

function removeTile(){
  if(coins<50) return alert("Недостаточно монет");
  coins-=50;
  for(let r=0;r<size;r++)
    for(let c=0;c<size;c++)
      if(board[r][c]>0){ board[r][c]=0; update(); return; }
}

function boostTile(){
  if(coins<30) return alert("Недостаточно монет");
  coins-=30;
  for(let r=0;r<size;r++)
    for(let c=0;c<size;c++)
      if(board[r][c]>0){ board[r][c]*=2; update(); return; }
}

function openLoot(){
  if(coins<100) return alert("Недостаточно монет");
  coins-=100;
  let r=Math.random();
  if(r<0.5){ coins+=50; alert("50 монет!"); }
  else{ lives++; alert("+1 жизнь!"); }
  localStorage.setItem("lives",lives);
  update();
}

function setTheme(theme){
  document.body.className=theme;
  localStorage.setItem("theme",theme);
}

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowLeft") moveLeft();
});

window.onload=()=>{
  let saved=localStorage.getItem("theme");
  if(saved) document.body.className=saved;
  createBoard();
}
