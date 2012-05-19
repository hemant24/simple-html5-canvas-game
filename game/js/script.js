
$(function(){

	var zombieLand = {};
	zombieLand.pressedKeys=[];
	zombieLand.assets=[];//assert must have x , y , height , width for collision detection
	zombieLand.level=0;
	
	function Asset(){
		this.x=0;
		this.y=0;
		this.height=0;
		this.width=0;
	}
	
	$(document).keydown(function(e){
		zombieLand.pressedKeys[e.which]=true;
	});
	$(document).keyup(function(e){
		zombieLand.pressedKeys[e.which]=false;
	});
	
	var KEYA = {
		UP: 38,
		DOWN: 40,
		LEFT:37,
		RIGHT:39
	}
	var KEYB = {
		UP: 87,
		DOWN: 83,
		LEFT:65,
		RIGHT:68
	}
	
	


	
	function Zombie(sprite , keyMap ){
		var self=this;
		self.x = 0;
		self.y = 0;
		self.spawn = null;
		self.width = 128;//must come fromsprite init
		self.height = 128;//must come fromsprite init
		self.keyMap=null;
		self.SPEED=5;//px
		self.isRunning = false;
		self.currentDirection=null;
		self.prevDirection=null;
		self.sprite={};
		self.sprite.sheet=null;
		self.sprite.loc={max:11 , cur:0, min:4};
		self.init=function( sprite,keyMap ){
			self.sprite.sheet = sprite;
			self.currentDirection=keyMap.RIGHT;
			self.keyMap=keyMap;
		}	
		self.update=function(pressedKeys){
			//console.log('>>>>'+self.x);
			self.isRunning = false;
			var newX = self.x ;
			var newY = self.y ;
			if(pressedKeys[keyMap.UP]){
				self.isRunning = true;
					self.prevDirection = self.currentDirection;
					self.currentDirection= keyMap.UP;
				
					newY= self.y-self.SPEED;
				
			}
			if(pressedKeys[keyMap.DOWN]){
				self.isRunning = true;
				self.prevDirection = self.currentDirection;
					self.currentDirection= keyMap.DOWN;
				
					newY = self.y+self.SPEED;
				
			}
			if(pressedKeys[keyMap.RIGHT]){
				self.isRunning = true;
				self.prevDirection = self.currentDirection;
				self.currentDirection= keyMap.RIGHT;
				newX = self.x+self.SPEED;
				
			}
			if(pressedKeys[keyMap.LEFT]){
				self.isRunning = true;
				self.prevDirection = self.currentDirection;
					self.currentDirection= keyMap.LEFT;
				
					newX = self.x-self.SPEED;
				
			}
			//checking collision detection
			var dx = 50;
			var dy = 50;
			var temp= { x:newX+dx , y:newY+dy+20 , width :self.width-2*dx, height: self.height-1.8*dy  };
			if(self.isRunning){
				if(!checkCollision(temp)){
					self.x = newX;
					self.y = newY;
				}
			}
			
			
		}
		self.draw=function(ctx){
				var spriteWidth=128;
				var spriteHeight=128;
				var row =0;
				//console.log(self.currentDirection);
				//console.log(self.keyMap.RIGHT);
				switch(self.currentDirection){
					
					case self.keyMap.RIGHT:
						row  = 4;
						break;
					case self.keyMap.LEFT:
						row  = 0;
						break;
					case self.keyMap.UP:
						row  = 2;
						break;
					case self.keyMap.DOWN:
						row  = 6;
						break;
				}
				
				if(self.sprite.loc.cur == self.sprite.loc.max){	
					self.sprite.loc.cur = self.sprite.loc.min;
				}else{
					self.sprite.loc.cur = self.sprite.loc.cur+1;
				}
				
				if(self.isRunning){
					ctx.drawImage(self.sprite.sheet, self.sprite.loc.cur * spriteWidth, row*spriteHeight, spriteWidth, spriteHeight, self.x, self.y, spriteWidth, spriteHeight);
				}
				else{
					
					ctx.drawImage(self.sprite.sheet, 0, row*spriteHeight, spriteWidth, spriteHeight, self.x, self.y, spriteWidth, spriteHeight);
				}
			
		}
		self.init(sprite,keyMap);
	}
	
	function gameloop(){
		update();
		draw();
		checkGameStatus();
	}
	
	function checkGameStatus(){
		if(zombieLand.isTimeUp){
			zombieLand.isTimeUp=!zombieLand.isTimeUp;
			clearInterval(zombieLand.timer);
			showNotification("Game Over!!");
			
			//initGame();//initialize with level one.
			
		}else{
			var a = { x: zombieLand.zombieA.x , y: zombieLand.zombieA.y , width : zombieLand.zombieA.width , height : zombieLand.zombieA.height};
			var b = { x: zombieLand.zombieB.x , y: zombieLand.zombieB.y , width : zombieLand.zombieB.width , height : zombieLand.zombieB.height};
			if( collides(zombieLand.zombieB.spawn,a ) &&   collides(zombieLand.zombieA.spawn,b )){
				zombieLand.level = zombieLand.level+1;
				if(levels[zombieLand.level]){
					clearInterval(zombieLand.timer);
					showNotification("Next Level. Get Ready");
					setTimeout(function(){$('#notification').fadeOut();}, 1000);
					setTimeout(function(){initGame(zombieLand.level);},1002);
					
				}else{
					clearInterval(zombieLand.timer);
					clearInterval(zombieLand.gameTimetimer);
					showNotification("Game finished congrats!!");
				}
			}
		}

	}
	
	function showNotification(text){
		$("#notification").fadeIn();
		var canvas = document.getElementById("notification");
        var context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
        var x = canvas.width / 2;
        var y = canvas.height / 2;

        context.font = "50pt Calibri";
        context.textAlign = "center";
        context.fillStyle = "blue";
        context.fillText(text, x, y);
	}
	
	function update(){
		zombieLand.zombieA.update(zombieLand.pressedKeys);
		zombieLand.zombieB.update(zombieLand.pressedKeys);
	}
	
	function draw(){
		zombieLand.ctx.clearRect(0, 0, zombieLand.width, zombieLand.height);
		zombieLand.zombieA.draw(zombieLand.ctx);
		zombieLand.zombieB.draw(zombieLand.ctx);
	}
	
	function collides(a, b) {
	  return a.x < b.x + b.width &&
			 a.x + a.width > b.x &&
			 a.y < b.y + b.height &&
			 a.y + a.height > b.y;
	}
	
	function checkCollision(obj){
		for(i in zombieLand.assets){
			asset = zombieLand.assets[i];
			if( collides(asset, obj)){
				zombieLand.gameTimeCollide=true;
				return true;
			}
		}
		
	}
	
	function loadMap(level){
		$("#levelinfo").html("Level "+(zombieLand.level+1));
		var canvas = document.getElementById("arenabk");
		var context =  canvas.getContext("2d");
		context.clearRect(0,0,canvas.width,canvas.height)
		if(zombieLand.assets.length>0){
			zombieLand.assets.length = 0;
		}
		for(x in boundary ){	
			var map = boundary[x];
			var asset = new Asset();
			asset.x = map.x;
			asset.y = map.y;
			asset.height = map.height;
			asset.width=map.width;
			zombieLand.assets.push(asset);
			context.beginPath();
			context.rect(asset.x , asset.y , asset.width, asset.height);
			context.fillStyle = '#8ED6FF';
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();
		}
		
		
		for(x in levels[level].walls ){	
			var map = levels[level].walls[x];
			var asset = new Asset();
			asset.x = map.x;
			asset.y = map.y;
			asset.height = map.height;
			asset.width=map.width;
			zombieLand.assets.push(asset);
			context.beginPath();
			context.rect(asset.x , asset.y , asset.width, asset.height);
			context.fillStyle = '#8ED6FF';
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();
		}
		
		
		
	}
	function loadPlayerPosition(level){
		var context =  document.getElementById("arenabk").getContext("2d");
	
			var position = levels[level].playerPosition[1];
			
			var asset = new Asset();
			asset.x = position.x;
			asset.y  = position.y;
			asset.width= position.width;
			asset.height = position.height;
			zombieLand.zombieA.x  = asset.x -40;
			zombieLand.zombieA.y = asset.y -60;
			context.beginPath();
			context.rect(asset.x , asset.y , asset.width, asset.height);
			context.fillStyle = '#9AD964';
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();
			
			zombieLand.zombieA.spawn = asset;
			
			position = levels[level].playerPosition[0];
			var asset2 = new Asset();
			asset2.x = position.x;
			asset2.y  = position.y;
			asset2.width= position.width;
			asset2.height = position.height;
			zombieLand.zombieB.x  = asset2.x -40;
			zombieLand.zombieB.y = asset2.y -60;
			context.beginPath();
			context.rect(asset2.x , asset2.y , asset2.width, asset2.height);
			context.fillStyle = '#9AD964';
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();
			
			zombieLand.zombieB.spawn  = asset2;

	}
	function initializeTime(level){
		if(zombieLand.gameTimetimer){
			clearInterval(zombieLand.gameTimetimer);
		}
		zombieLand.gameTime = levels[level].time;
		zombieLand.gameTimeCollide =false;
		zombieLand.isTimeUp=false;
		drawTime();
		zombieLand.gameTimetimer = setInterval(drawTime,1000);
	}
	function drawTime(){
		var diff=1;
		if(zombieLand.gameTimeCollide ){
			diff=3;
			zombieLand.gameTimeCollide=false;
		}
		zombieLand.gameTime = zombieLand.gameTime-diff;
		
		if(zombieLand.gameTime < 0){
			zombieLand.isTimeUp=true;
			$("#clockarea").html(0);
			clearInterval(zombieLand.gameTimetimer);
		}else{
			$("#clockarea").html(zombieLand.gameTime);
		}
	}
	function initGame(level){
		zombieLand.zombieA = new Zombie(document.getElementById("player1"), KEYA);
		zombieLand.zombieB = new Zombie(document.getElementById("player2"),KEYB);
		zombieLand.ctx = document.getElementById("arena").getContext("2d");
		//zombieLand.assets.push(zombieLand.zombieA);
		//zombieLand.assets.push(zombieLand.zombieB);
		zombieLand.height = $("#arena").height();
		zombieLand.width = $("#arena").width();
		loadMap(level);
		initializeTime(level);
		loadPlayerPosition(level);
		if(zombieLand.timer){
			clearInterval(zombieLand.timer);
		}
		zombieLand.timer = setInterval(gameloop,45);
	}
	
	
	initGame(zombieLand.level);
	
});