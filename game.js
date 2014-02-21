var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var verticalPoints = [];
var horizontalPoints = [];
var jumpCounter = 0;
var jumpLimit = false;
var jumpStarted = false;
var facingRight = true;

canvas.width = 812;
canvas.height = 480;
if (document.getElementById('game').appendChild(canvas)) {
    //console.log("true");
}

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "bg1.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
	//console.log("onload");
    heroReady = true;
};
heroImage.src = "hero.png";

var hero = {
	speed: 256 // movement in pixels per second
};

var setStart = function(){
	hero.x = (canvas.width/2) - 40;
	hero.y = 380;
}

var render = function() {
	//console.log("piirretään");
    if (bgReady) {
        //ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
    	//console.log("hero")
        //ctx.drawImage(heroImage, hero.x, hero.y);
        ctx.drawImage(heroImage, canvas.width/2-40, hero.y);
    }
};

// Update game objects
var update = function(modifier) {
    if (38 in keysDown && !jumpLimit) { // Player holding up
        if((jumpCounter+=1)<10){
        	hero.y -= hero.speed * modifier + 5;
        }else{
        	jumpLimit=true;
        }
    }
    /*
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }*/
    if (37 in keysDown && !checkCollisionsFromArray(verticalPoints,hero.x-(hero.speed*modifier),hero.y)) { // Player holding left
        hero.x -= hero.speed * modifier;
        heroImage.src = "hero2.png";
        facingRight = false;
    }
    if (39 in keysDown && !checkCollisionsFromArray(verticalPoints,hero.x+(hero.speed*modifier),hero.y)) { // Player holding right
        hero.x += hero.speed * modifier;
        heroImage.src = "hero.png";
        facingRight = true;
    }
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

var checkForGravity = function(){
	if(checkCollisionsFromArray(horizontalPoints,hero.x,hero.y)){
		jumpLimit = 0;
		jumpCounter = false;
		jumpStarted = false;
		return false;
	}
	if(hero.y<=380){
		hero.y+=15;
	}
	if(hero.y>380){
		hero.y=380;
	}
	if(hero.y==380){
		jumpLimit = 0;
		jumpCounter = false;
		jumpStarted = false;
	}
}

function checkCollisionsFromArray(arr,x,y){
	for (var i = 0; i < arr.length; i++) {
		if(arr[i].checkCollision(x,y)){
			return true;
		}
	};
	return false;
}

function collisionHorizontalPoint(x1,x2,y1,y2){
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;

	this.checkCollision = function(x,y){
		//console.log("y: " + y);
		//console.log(y1);
		if(y1-90>y && y>y1-110){
			//return true;
			if(x>x1 && x<x2){
				return true;	
			}
		}
		return false;
	}

	this.drawPath = function(){
		ctx.beginPath();
		ctx.moveTo(x1-hero.x+400,y1);
		ctx.lineTo(x2-hero.x+400,y2);
		ctx.stroke();
	}
}

function collisionVerticalPoint(x1,x2,y1,y2){
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;

	this.checkCollision = function(x,y){
		if(x<x1+25 && x>x1-25){
			if(y>y1 && y<y2){
				return true;	
			}
		}
		return false;
	}

	this.drawPath = function(){
		ctx.beginPath();
		ctx.moveTo(x1-hero.x+400,y1);
		ctx.lineTo(x2-hero.x+400,y2);
		ctx.stroke();
	}
}

//Clear the canvas
var clearCanvas = function(ctx){
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	// ctx.beginPath();
	// ctx.moveTo(800-hero.x,100);
	// ctx.lineTo(10000-hero.x,100);
	// ctx.stroke();
	var test = new collisionHorizontalPoint(0,1000,100,100);
	test.drawPath();

	var test2 = new collisionHorizontalPoint(700,1000,400,400);
	test2.drawPath();

	var cp = new collisionVerticalPoint(0,0,0,480);
	cp.drawPath();
	var cp2 = new collisionVerticalPoint(500,500,0,280);
	cp2.drawPath();
	//console.log(cp.checkCollision(hero.x,hero.y));
	
	horizontalPoints.push(test);
	horizontalPoints.push(test2);
	verticalPoints.push(cp);
	verticalPoints.push(cp2);

	//console.log(checkCollisionsFromArray(points,hero.x,hero.y));
	console.log(hero.x + ", " + hero.y);

	
}

var main = function() {
	//console.log("mainia kutsuttu")
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    checkForGravity();

    clearCanvas(ctx);

    render();
    then = now;
}

//onload suoritetaan vasta sivun lopussa
//ts render ei toimi kuin intervalilla atm

//console.log("reset");
setStart();
//console.log("main");
//main();
//render();
var then = Date.now();

setInterval(main,100);