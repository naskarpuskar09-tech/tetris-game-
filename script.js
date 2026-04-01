// const grid = document.getElementById("grid");
// const scoreEl = document.getElementById("score");
// const levelEl = document.getElementById("level");
// const startBtn = document.getElementById("start");
// const pauseBtn = document.getElementById("pause");

// const width = 20;
// const height = 20;

// let cells = [];
// let board = [];
// let current;
// let pos = 9;
// let interval;
// let score = 0;
// let level = 1;
// let running = false;

// /* SOUND */
// const clearSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");

// /* CREATE GRID */
// function createGrid() {
//   grid.innerHTML = "";
//   cells = [];
//   board = [];

//   for (let i = 0; i < width * height; i++) {
//     let d = document.createElement("div");
//     d.classList.add("cell");
//     grid.appendChild(d);
//     cells.push(d);
//     board.push(0);
//   }
// }

// /* SHAPES */
// const shapes = [
//   [1, width+1, width*2+1, 2],
//   [0,1,width,width+1],
//   [1,width+1,width*2+1,width*3+1]
// ];

// function newPiece() {
//   current = shapes[Math.floor(Math.random()*shapes.length)];
//   pos = 9;
// }

// /* DRAW */
// function draw() {
//   current.forEach(i => cells[pos+i].classList.add("block"));
// }
// function undraw() {
//   current.forEach(i => cells[pos+i].classList.remove("block"));
// }

// /* MOVE */
// function moveDown() {
//   if(!running) return;

//   undraw();
//   pos += width;

//   if (collision()) {
//     pos -= width;
//     draw();
//     freeze();
//     newPiece();
//   }

//   draw();
// }

// /* COLLISION */
// function collision() {
//   return current.some(i => {
//     let next = pos + i;
//     return next >= width*height || board[next] === 1;
//   });
// }

// /* FREEZE */
// function freeze() {
//   current.forEach(i => board[pos+i] = 1);
//   clearRows();
// }

// /* MOVE SIDE */
// function moveLeft() {
//   undraw();

//   const isAtLeftEdge = current.some(i => (pos + i) % width === 0);

//   if (!isAtLeftEdge) pos--;

//   if (collision()) pos++;

//   draw();
// }

// function moveRight() {
//   undraw();

//   const isAtRightEdge = current.some(i => (pos + i) % width === width - 1);

//   if (!isAtRightEdge) pos++;

//   if (collision()) pos--;

//   draw();
// }

// /* CONTROLS */
// document.addEventListener("keydown", e => {
//   if(e.key==="ArrowLeft") moveLeft();
//   if(e.key==="ArrowRight") moveRight();
//   if(e.key==="ArrowDown") moveDown();
// });

// /* CLEAR ROW */
// function clearRows() {
//   for(let i=0;i<height;i++){
//     let row = board.slice(i*width, i*width+width);

//     if(row.every(x=>x===1)){
//       clearSound.play();

//       for(let j=0;j<width;j++){
//         cells[i*width+j].classList.add("clear");
//       }

//       setTimeout(()=>{
//         board.splice(i*width,width);
//         board.unshift(...Array(width).fill(0));

//         score += 20;
//         scoreEl.textContent = score;

//         if(score % 100 === 0){
//           level++;
//           levelEl.textContent = level;
//           speedUp();
//         }

//         render();
//       },300);
//     }
//   }
// }

// /* RENDER */
// function render() {
//   cells.forEach((c,i)=>{
//     c.className = "cell";
//     if(board[i]===1) c.classList.add("block");
//   });
// }

// /* SPEED */
// function speedUp(){
//   clearInterval(interval);
//   interval = setInterval(moveDown, 500 - level*30);
// }

// /* START */
// startBtn.onclick = ()=>{
//   createGrid();
//   newPiece();
//   draw();
//   running = true;
//   speedUp();
// };

// /* PAUSE */
// pauseBtn.onclick = ()=>{
//   running = !running;
// };



const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");

const width = 20;
const height = 20;

let cells = [];
let board = [];

let current;
let currentRotation = 0;
let position = 9;

let interval;
let score = 0;
let level = 1;
let running = false;

/* SOUND */
const clearSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");

/* CREATE GRID */
function createGrid() {
  grid.innerHTML = "";
  cells = [];
  board = [];

  for (let i = 0; i < width * height; i++) {
    let d = document.createElement("div");
    d.classList.add("cell");
    grid.appendChild(d);
    cells.push(d);
    board.push(0);
  }
}

/* SHAPES WITH ROTATIONS */
const shapes = [
  // T
  [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ],

  // LINE
  [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ],

  // SQUARE
  [
    [0,1,width,width+1]
  ]
];

/* NEW PIECE */
function newPiece() {
  current = shapes[Math.floor(Math.random() * shapes.length)];
  currentRotation = 0;
  position = 9;
}

/* DRAW */
function draw() {
  current[currentRotation].forEach(i => {
    cells[position + i].classList.add("block");
  });
}

function undraw() {
  current[currentRotation].forEach(i => {
    cells[position + i].classList.remove("block");
  });
}

/* COLLISION */
function collision() {
  return current[currentRotation].some(i => {
    let next = position + i;
    return (
      next >= width * height ||
      board[next] === 1
    );
  });
}

/* MOVE DOWN */
function moveDown() {
  if (!running) return;

  undraw();
  position += width;

  if (collision()) {
    position -= width;
    draw();
    freeze();
    newPiece();
  }

  draw();
}

/* FREEZE */
function freeze() {
  current[currentRotation].forEach(i => {
    board[position + i] = 1;
  });
  clearRows();
}

/* LEFT FIXED */
function moveLeft() {
  undraw();

  const isEdge = current[currentRotation].some(i => (position + i) % width === 0);

  if (!isEdge) position--;

  if (collision()) position++;

  draw();
}

/* RIGHT FIXED */
function moveRight() {
  undraw();

  const isEdge = current[currentRotation].some(i => (position + i) % width === width - 1);

  if (!isEdge) position++;

  if (collision()) position--;

  draw();
}

/* ROTATION */
function rotate() {
  undraw();

  let nextRotation = (currentRotation + 1) % current.length;

  const isInvalid = current[nextRotation].some(i => {
    let posCheck = position + i;
    return (
      posCheck % width === 0 ||
      posCheck % width === width - 1 ||
      board[posCheck] === 1
    );
  });

  if (!isInvalid) {
    currentRotation = nextRotation;
  }

  draw();
}

/* CONTROLS */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === "ArrowDown") moveDown();
  if (e.key === "ArrowUp") rotate();
});

/* CLEAR ROW */
function clearRows() {
    // board.fill(1);
  for (let i = 0; i < height; i++) {
    let row = board.slice(i * width, i * width + width);

     if (row.every(x => x === 1)) {
      clearSound.play();

      for (let j = 0; j < width; j++) {
        cells[i * width + j].classList.add("clear");
      }

      setTimeout(() => {
        board.splice(i * width, width);
        board.unshift(...Array(width).fill(0));

        score += 20;
        scoreEl.textContent = score;

        if (score % 100 === 0) {
          level++;
          levelEl.textContent = level;
          speedUp();
        }

        render();
      }, 300);
    }
  }
}

/* RENDER */
function render() {
  cells.forEach((c, i) => {
    c.className = "cell";
    if (board[i] === 1) c.classList.add("block");
  });
}

/* SPEED */
function speedUp() {
  clearInterval(interval);
  interval = setInterval(moveDown, 500 - level * 30);
}

/* START */
startBtn.onclick = () => {
  createGrid();
  newPiece();
  draw();
  running = true;
  speedUp();
};

/* PAUSE */
pauseBtn.onclick = () => {
  running = !running;
};


// const restartBtn = document.getElementById("restartBtn");

// restartBtn.addEventListener("click", () => {
    
    
//     score = 0;

   
//     document.getElementById(".score").innerText = score;

    
//     const gameArea = document.querySelector(".game-area");
//     gameArea.innerHTML = "";

    
//     startGame(); 
// });


const restartBtn = document.getElementById("restartBtn");

restartBtn.addEventListener("click", () => {
  clearInterval(interval);

  score = 0;
  level = 1;

  scoreEl.textContent = score;
  levelEl.textContent = level;

  createGrid();
  newPiece();
  draw();

  running = true;
  speedUp();
});