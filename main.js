var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var missed = document.querySelector('#missed');
var catched = document.querySelector('#catched');
var greetings = document.querySelector('#greetings');
var lev1 = document.querySelector('#beginner');
var lev2 = document.querySelector('#medium');
var lev3 = document.querySelector('#high');
var rules = document.querySelector('#rules');
var rulesText = document.querySelector('#rulesText');
var backBtn = document.querySelector('.back');
var ballNum;
var catchedNum = 0;
var missedNum = 0;
var width = canvas.width = window.innerWidth/2;
var height = canvas.height = window.innerHeight*0.94;
var ballSizeOne;
var ballSizeTwo;
var cameOverCount;
var cameOver = document.querySelector('#gameOver');
var score = document.querySelector('#score');
var playAgain = document.querySelector('.playAgain');

//function to generate random number
function random(min,max) {
 var num = Math.floor(Math.random()*(max-min)) + min;
 return num;
}

//------------------------------------------------------------------------

window.onload = function () {
 greetings.style.display = 'block';
} 

rules.onclick = function () {
  greetings.style.display = 'none';
  rulesText.style.display = 'block';
}

backBtn.onclick = function () {
  rulesText.style.display = 'none';
  greetings.style.display = 'block';
}

lev1.onclick = function() {
 ballNum = 5;
 greetings.style.display = 'none';
 ballSizeOne = 20;
 ballSizeTwo = 30;
 cameOverCount = 70;
 loop();
}

lev2.onclick = function() {
 ballNum = 6;
 greetings.style.display = 'none';
 ballSizeOne = 15;
 ballSizeTwo = 25;
 cameOverCount = 50;
 loop();
}

lev3.onclick = function() {
 ballNum = 10;
 greetings.style.display = 'none';
 ballSizeOne = 10;
 ballSizeTwo = 20;
 cameOverCount = 40;
 loop();
}

playAgain.onclick = function () {
  cameOver.style.display ='none';
  window.location.reload(true);
}

//----------------------------------------------------------------------------

function Shape(x, y, velX, velY, notCrossing) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.notCrossing = notCrossing;
}

function Ball (x, y, velX, velY, notCrossing, color, size) {
 Shape.call(this, x, y, velX, velY, notCrossing);
 
 this.color = color;
 this.size = size;
}


Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    if (((this.x + this.size) - this.velX) >= width) {
      this.x -= 20;
    }
    this.velX = -(this.velX);
  }
  if ((this.x - this.size) <= 0) {
    if (((this.x - this.size) - this.velX) <= 0) {
      this.x += 20;
    }
    this.velX = -(this.velX);
  }
  if ((this.y + this.size) >= height) {
    this.y = (10 + this.size);
    missedNum++;
  }
  if ((this.y - this.size) <= 0) {
    if (((this.y - this.size) - this.velY) <= 0) {
      this.y += 20;
    }
    this.velY = -(this.velY);
  }
  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= this.size + balls[j].size && this.notCrossing === true && balls[j].notCrossing === true) {
        if ((this.velX > 0 && balls[j].velX < 0) || (this.velX < 0 && balls[j].velX > 0)) {
			this.velX = -(this.velX);
			balls[j].velX = -(balls[j].velX);
			
		}
        
		if ((this.velY > 0 && balls[j].velY < 0) || (this.velY < 0 && balls[j].velY > 0)) {
			this.velY = -(this.velY);
			balls[j].velY = -(balls[j].velY);
		}
		
		this.notCrossing = false;
		balls[j].notCrossing = false;
		balls[j].color  
           = 'rgb(' + random(0, 255) + ',' 
                    + random(0, 255) + ',' 
                    + random(0, 255) +')';
        this.color 
           = 'rgb(' + random(0, 255) + ',' 
                    + random(0, 255) + ',' 
                    + random(0, 255) +')';
      }
	  
	  if (distance > this.size + balls[j].size && this.notCrossing === false && balls[j].notCrossing === false) {
		this.notCrossing = true;
		balls[j].notCrossing = true;
	  }
    }
  }
} 

var balls = [];

//-----------------------------------------------------------------------------

function Desk (a,b, leng, thik, color, move) {
 this.a = a;
 this.b = b;
 this.leng = leng;
 this.thik = thik;
 this.color = color;
 this.move = move;
}

Desk.prototype.draw = function () {
 ctx.fillStyle = this.color;
    ctx.fillRect(this.a, this.b, this.leng, this.thik);
}

Desk.prototype.checkBounds = function() {
  if ((this.a + this.leng) >= width) {
    this.a = width - this.leng;
  }
  if ((this.a) <= 0) {
    this.a = 0;
  }
}

Desk.prototype.setControls = function() {
var _this = this;
window.onkeydown = function(e) {
    if (e.keyCode === 37) {
      _this.a -= _this.move;
    } else if (e.keyCode === 39) {
      _this.a += _this.move;
  }
}
}

Desk.prototype.collisionDet = function () {
  for (var j = 0; j < balls.length; j++) {
    if ((balls[j].y + balls[j].size) >= this.b && ((balls[j].x + balls[j].size) >= this.a && (balls[j].x - balls[j].size) <= (this.a + this.leng))) {
      if (((balls[j].y + balls[j].size) - balls[j].velY) >= this.b) {
        balls[j].y -= 100;
      }
      
      balls[j].velY = -(balls[j].velY);
      catchedNum++;
    }
  }
}

var BottomDesk = new Desk(((width/2)-150), (height-15), 300, 20, 'white', 60);

//-----------------------------------------------------------------------------

function loop() {
  ctx.fillStyle = 'rgba(2, 30, 71, 0.7)';
  ctx.fillRect(0, 0, width, height);

  BottomDesk.draw();
  BottomDesk.setControls();
  BottomDesk.checkBounds();
  BottomDesk.collisionDet();

  while (balls.length < ballNum) {
    var ball = new Ball(
      random(0,width),
      random(0,height),
      random(1,7),
      random(1,7),
   true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(ballSizeOne, ballSizeTwo)
    );
    balls.push(ball);
  }
  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
 balls[i].collisionDetect();
  }
  
  missed.innerHTML = missedNum;
  catched.innerHTML = catchedNum;
  
  
  if (missedNum === cameOverCount) {
    cancelAnimationFrame(loop);
    gameOver.style.display = 'block';
    score.innerHTML = catchedNum;
  } else {
    requestAnimationFrame(loop);
  }
}

