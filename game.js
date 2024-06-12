var canvas, g;
var player, enemy;
var score;
var scene;
var frameCount;
var bound;
var particles;
var next;
var moon;
var castle;
// シーンの定義
const Scenes = {
  GameStart: "GameStart",
  GameMain: "GameMain",
  GameOver: " GameOver",
};

onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();

  // 入力処理の指定
  document.onkeydown = keydown;
  document.onkeyup = keyup;
  document.onmousedown = keydown;
  document.onmouseup = keyup;
  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  // ゲーム管理データの初期化
  score = 0;
  frameCount = 0;
  bound = false;
  scene = Scenes.GameMain;

  // 自キャラ初期化
  player = new Player(100, 400, 16, "./player.png", 0, 0);

  // 敵キャラ初期化
  enemy = [];
  next = 10;

  // パーティクル初期化
  particles = [];

  // 月
  moon = new Sprite();
  moon.posx = 100;
  moon.posy = 100;
  moon.image = new Image();
  moon.image.src = "./moon.png";

  //木
  tree = new Sprite();
  tree.posx = 400;
  tree.posy = 296;
  tree.image = new Image();
  tree.image.src = "./tree.png";
}

var isKeyDown = false;
var startKey = false;
function keydown(e) {
  // ゲームプレイ中
  if (scene == Scenes.GameMain) {
    if (player.speed == 0) {
      player.speed = -18;
      player.acceleration = 1.0;
    }
    // ゲームオーバー中
  } else if (scene == Scenes.GameOver) {
    if (frameCount > 60) {
      init();
    }
  }
  isKeyDown = true;
  startKey = true;
}

function keyup(e) {
  if (player.speed < 0) {
    player.acceleration = 2.5;
  }
  isKeyDown = false;
}

function gameloop() {
  update();
  draw();
}

function update() {
  // ゲームプレイ中
  if (scene == Scenes.GameMain) {
    // 自キャラの状態更新
    player.update();

    // 敵キャラの状態更新
    enemy.forEach((e) => {
      e.update();
      // 端に到着でスコア増加
      if (e.posx < -100) {
        score += 100;
      }
    });

    // 端に到着した敵キャラを除外
    enemy = enemy.filter((e) => e.posx >= -100);

    // 敵キャラ生成
    if (frameCount == next) {
      generateNextEnemy();
    }
  
    // 当たり判定
    hitCheck();

    // ゲームオーバー中
  } else if (scene == Scenes.GameOver) {
    particles.forEach((p) => {
      p.update();
    });

    // 自キャラの状態更新
    if (player.posx < 20 || player.posx > 460) {
      bound = !bound;
    }
    if (bound) {
      player.posx = player.posx + 30;
    } else {
      player.posx = player.posx - 30;
    }

    // 敵キャラの状態更新
    enemy.forEach((e) => {
      e.update();
    });
  }

  // 背景の木の位置を動かす
  tree.posx -= 0.25;
  if (tree.posx < -100) tree.posx = 500;

  // 現在何フレーム目かをカウント
  frameCount++;
}

function draw() {
  g.imageSmoothingEnabled = false;

  if (startKey == false ) {
    drawGameStart(g);
  }
  else {
    // ゲームプレイ中 
    if (scene == Scenes.GameMain) {
      //背景描画
      drawBack(g);

      // キャラクタ描画
      player.draw(g);

      // 敵キャラクタ描画
      enemy.forEach((e) => {
        e.draw(g);
      });

      // スコア描画
      drawScore(g);

      // ゲームオーバー中
    } else if (scene == Scenes.GameOver) {
      // 背景描画
      drawBack(g);

      // キャラクタ描画
      if (frameCount < 120) {
        g.save();
        g.translate(player.posx, player.posy);
        g.rotate(((frameCount % 30) * Math.PI *2) / 30);
        g.drawImage(
          player.image,
          -player.image.width /2,
          -player.image.height /2,
          player.image.width + frameCount,
          player.image.height + frameCount
        );
        g.restore();
      }

      // パーティクル描画
      particles.forEach((p) => {
        p.draw(g);
      });

      // 敵キャラクタ描画
      enemy.forEach((e) => {
        e.draw(g);
      });

      // スコア描画
      drawScore(g);

      // ゲームオーバー表示
      drawGameOver(g);
    }
  }
}

function hitCheck() {
  enemy.forEach((e) => {
    var diffX = player.posx - e.posx;
    var diffY = player.posy - e.posy;
    var distance = Math.sqrt(diffX *  diffX + diffY * diffY);
    if (distance < player.r + e.r) {
      // 当たった時の処理
      scene = Scenes.GameOver;
      frameCount = 0;

      // パーティクル生成
      //for (var i = 0; i < 300; i++) {
      // particles.push(new Particle(player.posx, player.posy));
      //}
    }
  });
}

// 敵キャラ生成
function generateNextEnemy() {
  var newEnemy = new Enemy(
    600,
    400 - (Math.random() < 0.5 ? 0 : 50),
    12,
    "./enemy.png",
    4 + 5 * Math.random(),
    0
  );
  enemy.push(newEnemy);
  next = Math.floor(frameCount + 30 + 80 * Math.random());
}

// 背景の描画
function drawBack(g) {
  var interval = 16;
  var ration = 7;
  var center = 240;
  var baseLine = 360;
  // 画面を黒く塗りつぶして初期化する
  g.fillStyle = "rgb(0,0,0)";
  g.fillRect(0, 0, 480, 480);
  // 月と木を描画する
  moon.draw(g);
  tree.draw(g);
  // 地面のラインアート
  for (var i = 0; i < 480 / interval + 1; i++) {
    var x1 = i * interval - (frameCount % interval);
    var x2 = center + (x1 - center) * ration;
    g.strokeStyle = "#7b8d42";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(x1, baseLine);
    g.lineTo(x2, 480);
    g.stroke();
  }
}

// スコア描画
function drawScore(g) {
    g.fillStyle = "rgb(255,255,255)";
    g.font = "16pt Arial";
    var scoreLabel = "SCORE : " + score;
    var scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);
}

// ゲーム開始画面
function drawGameStart(g) {
  g.fillStyle = "rgb(0,0,0)";
  g.fillRect(0, 0, 480, 480);
  g.fillStyle = "rgb(255,255,255)"
  g.font = "48pt Arial";
  var textLabel = "RUN GAME";
  var textLabelWidth = g.measureText(textLabel).width;
  g.fillText(textLabel, 240 - textLabelWidth / 2, 240);
  g.font = "16pt Arial";
  var text = "> Press any key to start";
  var textWidth = g.measureText(text).width;
  g.fillText(text, 240 - textWidth / 2, 340);
}

// ゲームオーバー表示
function drawGameOver(g) {
  g.fillStyle = "rgb(255,0,0)";
  g.font = "48pt Arial";
  var scoreLabel = "GAME OVER";
  var scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, 240 - scoreLabelWidth / 2, 240);
}

// スプライトクラス
class Sprite {
  image = null;
  posx = 0;
  posy = 0;
  speed = 0;
  acceleration = 0;
  r = 0;

  // コンストラクタ
  constructor() {}

  // 状態更新
  update() {}

  // 描画処理
  draw(g) {
    g.drawImage (
      this.image,
      this.posx - this.image.width /2,
      this.posy - this.image.height / 2
    );
  } 
}

// パーティクルクラス
class Particle extends Sprite {
  baseLine = 0;
  acceleration = 0;
  speedy = 0;
  speedx = 0;

  constructor(x, y) {
    super();
    this.posx = x;
    this.posy = y;
    this.baseLine = 420;
    this.acceleration = 0.5;
    var angle = (Math.PI * 5) / 4 + (Math.PI / 2) * Math.random();
    this.speed = 5 + Math.random() * 20;
    this.speedx = this.speed * Math.cos(angle);
    this.speedy = this.speed * Math.sin(angle);
    this.r = 2;
  }

  update() {
    this.speedx *= 0.97;
    this.speedy += this.acceleration;
    this.posx += this.speedx;
    this.posy += this.speedy;
    if (this.posy > this.baseLine) {
      this.posy = this.baseLine;
      this.speedy = this.speedy * -1 * (Math.random() * 0.5 + 0.3);
    }
  }

  //draw(g) {
  //  g.fillStyle = "rgb(255, 50, 50)";
  //  g.fillRect(this.posx - this.r, this.posy - this.r, this.r * 2, this.r * 2);
  //}
}

// プレイヤークラス
class Player extends Sprite {
  baseLine = 400;

  constructor(posx, posy, r, imageUrl, speed, acceleration) {
    super();
    this.posx = posx;
    this.posy = posy;
    this.r = r;
    this.image = new Image();
    this.image.src = imageUrl;
    this.speed = speed;
    this.acceleration = acceleration;
  }

  update() {
    // 自キャラの状態更新
    this.speed = this.speed + this.acceleration;
    this.posy = this.posy + this.speed;
    if (this.posy > this.baseLine) {
      this.posy = this.baseLine;
      this.speed = 0;
      this.acceleration = 0;
    }
  }
}

// エネミークラス
class Enemy extends Sprite {
  constructor(posx, posy, r, imageUrl, speed, acceleration) {
    super();
    this.posx = posx;
    this.posy = posy;
    this.r = r;
    this.image = new Image();
    this.image.src = imageUrl;
    this.speed = speed;
    this.acceleration = acceleration;
  }

  update() {
    // 敵キャラの状態更新
    this.posx -= this.speed;
  }
}