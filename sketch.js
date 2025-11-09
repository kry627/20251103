let table;
let questions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizState = 'start'; // 'start', 'playing', 'feedback', 'finished'
let selectedOption;
let feedbackMessage = '';
let currentOptions = []; // 用於儲存隨機排序後的選項
let wasCorrect = false; // 用於記錄當前回答是否正確

// 用於互動效果的粒子
let backgroundParticles = [];

// 用於結果畫面的特效粒子
let fireworks = [];
let bubbles = [];
let risingParticles = [];

// 在載入資源時執行
function preload() {
  // 載入CSV題庫檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

// 初始化設定
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
  textFont('sans-serif');

  // 將表格資料轉換為物件陣列
  for (let row of table.rows) {
    questions.push(row.obj);
  }

  // 初始化粒子效果
  for (let i = 0; i < 50; i++) {
    backgroundParticles.push(new BackgroundParticle());
  }
}

// 繪圖迴圈
function draw() {
  background(20, 30, 40); // 深藍色背景

  // 繪製粒子效果
  for (let p of backgroundParticles) {
    p.update();
    p.show();
  }

  // 根據測驗狀態顯示不同畫面
  if (quizState === 'start') {
    displayStartScreen();
  } else if (quizState === 'playing') {
    displayQuestion();
  } else if (quizState === 'feedback') {
    displayFeedback();
  } else if (quizState === 'finished') { 
    displayResult();
  }
}

// 顯示開始畫面
function displayStartScreen() {
  fill(255);
  textSize(40);
  text('歡迎來到 p5.js 互動測驗', width / 2, height / 2 - 50);
  textSize(24);
  text('點擊畫面任意處開始', width / 2, height / 2 + 20);
}

// 顯示問題
function displayQuestion() {
  if (quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length) {
    let q = quizQuestions[currentQuestionIndex];
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    // 讓問題文字在畫面上方置中對齊，並設定寬度以自動換行
    text(q.question, width / 2, height / 4, width - 100);

    // 顯示選項
    textSize(22);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < currentOptions.length; i++) {
      let row = floor(i / 2); // 0 或 1
      let col = i % 2;      // 0 或 1

      let w = 350; // 按鈕寬度
      let h = 60;  // 按鈕高度
      let x = width / 2 + (col === 0 ? -w/2 - 10 : w/2 + 10);
      let y = height / 2 + 40 + row * (h + 20);

      // 根據滑鼠懸停和選擇狀態改變樣式
      if (mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2) {
        fill(100, 150, 250); // 懸停時變色
      } else {
        fill(50, 80, 130);
      }
      rectMode(CENTER);
      rect(x, y, w, h, 10);
      fill(255);
      text(currentOptions[i], x, y);
    }
  }
}

// 顯示作答後的回饋
function displayFeedback() {
  let q = quizQuestions[currentQuestionIndex];
  
  // 顯示回饋文字 (答對/答錯)
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  if (wasCorrect) {
    text('答對了！', width / 2, height / 4);
  } else {
    text('答錯了！', width / 2, height / 4);
  }

  textSize(24);
  text(`正確答案是: ${q.answer}`, width / 2, height / 4 + 50);

  // 顯示選項並標示出正確與錯誤的選項
  textSize(22);
  for (let i = 0; i < currentOptions.length; i++) {
    let row = floor(i / 2);
    let col = i % 2;
    let w = 350, h = 60;
    let x = width / 2 + (col === 0 ? -w/2 - 10 : w/2 + 10);
    let y = height / 2 + 40 + row * (h + 20);

    // 根據答案正確性設定顏色
    if (currentOptions[i] === q.answer) fill(50, 200, 50); // 正確答案顯示綠色
    else if (currentOptions[i] === selectedOption) fill(200, 50, 50); // 錯誤選擇顯示紅色
    else fill(50, 80, 130); // 其他選項

    rectMode(CENTER);
    rect(x, y, w, h, 10);
    fill(255);
    text(currentOptions[i], x, y);
  }

  textSize(20);
  text('點擊畫面繼續', width / 2, height - 50);
}

// 顯示最終結果
function displayResult() {
  // 根據分數顯示不同的動畫和文字
  if (score === quizQuestions.length) {
    // 滿分：煙火效果
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].done()) {
        fireworks.splice(i, 1);
      }
    }
    if (random(1) < 0.05) { // 每隔一段時間隨機產生新的煙火
      fireworks.push(new Firework());
    }
  } else if (score >= quizQuestions.length / 2) {
    // 及格：泡泡效果
    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].update();
      bubbles[i].show();
      if (bubbles[i].isFinished()) {
        bubbles.splice(i, 1);
      }
    }
    if (random(1) < 0.1) { // 持續產生泡泡
      bubbles.push(new Bubble());
    }
  } else {
    // 待加強：上升光點效果
    for (let i = risingParticles.length - 1; i >= 0; i--) {
      risingParticles[i].update();
      risingParticles[i].show();
      if (risingParticles[i].isFinished()) {
        risingParticles.splice(i, 1);
      }
    }
     if (random(1) < 0.2) { // 持續產生光點
      risingParticles.push(new RisingParticle());
    }
  }

  // 繪製通用的結果文字
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(50);
  text(`測驗結束！`, width / 2, height / 3);
  textSize(40);
  text(`你的分數: ${score} / ${quizQuestions.length}`, width / 2, height / 3 + 60);

  textSize(28);
  text(feedbackMessage, width / 2, height / 2 + 40);

  textSize(20);
  text('點擊畫面重新開始', width / 2, height - 80);
}

// 滑鼠點擊事件處理
function mousePressed() {
  if (quizState === 'start') {
    startQuiz();
  } else if (quizState === 'playing') {
    handleAnswer();
  } else if (quizState === 'feedback') {
    // 從回饋畫面進入下一題或結束
    currentQuestionIndex++;
    if (currentQuestionIndex >= quizQuestions.length) finishQuiz();
    else setupQuestion(currentQuestionIndex);
  } else if (quizState === 'finished') {
    resetQuiz();
  }
}

// 開始測驗
function startQuiz() {
  selectRandomQuestions();
  if (quizQuestions.length > 0) {
    setupQuestion(0);
  }
}

// 處理答案選擇與提交
function handleAnswer() {
  if (currentQuestionIndex >= quizQuestions.length) return;

  for (let i = 0; i < currentOptions.length; i++) {
    let row = floor(i / 2);
    let col = i % 2;
    let w = 350, h = 60;
    let x = width / 2 + (col === 0 ? -w/2 - 10 : w/2 + 10);
    let y = height / 2 + 40 + row * (h + 20);

    if (mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2) {
      selectedOption = currentOptions[i];
      let q = quizQuestions[currentQuestionIndex];
      
      // 檢查答案
      if (selectedOption === q.answer) {
        score++;
        wasCorrect = true;
      } else {
        wasCorrect = false;
      }

      // 切換到回饋狀態
      quizState = 'feedback';
      break;
    }
  }
}

// 結束測驗
function finishQuiz() {
  quizState = 'finished';
  // 根據分數設定回饋用語
  if (score === quizQuestions.length) {
    feedbackMessage = '太棒了，完美的表現！';
    // 立即產生第一批煙火
    for(let i = 0; i < 5; i++) {
      fireworks.push(new Firework());
    }
  } else if (score >= quizQuestions.length / 2) {
    feedbackMessage = '不錯喔，繼續努力！';
    // 初始化泡泡
    for(let i = 0; i < 20; i++) {
      bubbles.push(new Bubble());
    }
  } else {
    feedbackMessage = '再加加油，你可以的！';
    // 初始化上升光點
    for(let i = 0; i < 30; i++) {
      risingParticles.push(new RisingParticle());
    }
  }


}

// 重置測驗
function resetQuiz() {
  quizState = 'start';
  currentQuestionIndex = 0;
  score = 0;
  quizQuestions = [];
  currentOptions = [];
  selectedOption = null;
  fireworks = [];
  bubbles = [];
  risingParticles = [];
}

// 從題庫中隨機抽取4題
function selectRandomQuestions() {
  let tempQuestions = [...questions]; // 複製一份題庫
  quizQuestions = [];
  for (let i = 0; i < 4; i++) {
    if (tempQuestions.length > 0) {
      let randomIndex = floor(random(tempQuestions.length));
      quizQuestions.push(tempQuestions.splice(randomIndex, 1)[0]);
    }
  }
}

// 設定指定索引的題目 (包含隨機排序選項)
function setupQuestion(index) {
  currentQuestionIndex = index;
  let q = quizQuestions[index];
  // 將四個選項放入陣列並隨機排序
  currentOptions = shuffle([q.optionA, q.optionB, q.optionC, q.optionD]);
  selectedOption = null;
  quizState = 'playing';
}

// 背景粒子類別
class BackgroundParticle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = random(255);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) {
      this.vx *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.vy *= -1;
    }
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    circle(this.x, this.y, 3);
  }
}

// --- 以下為結果畫面的特效類別 ---

// 煙火類別
class Firework {
  constructor() {
    this.firework = new Particle(random(width), height, true); // 主煙火粒子
    this.exploded = false;
    this.particles = []; // 爆炸後的粒子
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, -8)); // 向上發射
      this.firework.update();

      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, 0.1)); // 受重力影響
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      const p = new Particle(this.firework.pos.x, this.firework.pos.y, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (const p of this.particles) {
      p.show();
    }
  }
}

// 煙火粒子類別
class Particle {
  constructor(x, y, isFirework) {
    this.pos = createVector(x, y);
    this.isFirework = isFirework;
    this.lifespan = 255;
    this.hu = random(255);

    if (this.isFirework) {
      this.vel = createVector(0, random(-12, -8));
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 10));
    }
    this.acc = createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.isFirework) {
      this.vel.mult(0.95);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    colorMode(HSB);
    if (!this.isFirework) {
      strokeWeight(2);
      stroke(this.hu, 255, 255, this.lifespan);
    } else {
      strokeWeight(4);
      stroke(this.hu, 255, 255);
    }
    point(this.pos.x, this.pos.y);
    colorMode(RGB); // 還原色彩模式
  }
}

// 泡泡類別
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height + 50, height + 150);
    this.r = random(10, 40);
    this.alpha = random(100, 200);
  }
  update() {
    this.y -= random(1, 3);
    this.x += random(-1, 1);
  }
  isFinished() {
    return this.y < -this.r;
  }
  show() {
    noFill();
    stroke(255, this.alpha);
    strokeWeight(2);
    circle(this.x, this.y, this.r * 2);
  }
}

// 上升光點類別 (與背景粒子相似，但方向固定向上)
class RisingParticle extends BackgroundParticle {
  constructor() {
    super();
    this.y = random(height, height + 100);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, -2);
  }
  isFinished() {
    return this.y < 0;
  }
}
