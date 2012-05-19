$(function(){

var ctx = document.getElementById("mapboard").getContext("2d");
var isWall = false;
var isPlayerPosition = false;
function Point(){
	this.x=0;
	this.y=0;
}
function Rect(){
	this.x =null;
	this.y=null;
	this.height=null;
	this.width=null;
}
var map =[];
var playerPosition = [];

var currentPoint = null;
var prevPoint = null;

$(document).keydown(function(e){
		if(e.which =='27'){
			currentPoint=null;
			prevPoint=null;
		}
		if(e.which=='83'){
			console.log('{ walls:'+ JSON.stringify(map));
			
			console.log( ' ,  playerPosition :'+JSON.stringify(playerPosition)+',time:60}');
		}
		if(e.which=='87'){
			isWall=!isWall;
		}
		if(e.which=='80'){
			isPlayerPosition=!isPlayerPosition;
		}
});
	
$("#mapboard").mouseup(function(e) {
		var canvasPosition = $(this).offset();
		var mouseX = e.offsetX|| 0;
		var mouseY = e.offsetY || 0;
		var point = new Point();
		point.x=mouseX;
		point.y = mouseY;
		if(isPlayerPosition){
			var rect = new Rect();
			rect.x= point.x;
			rect.y=point.y;
			rect.height = 50;
			rect.width = 50;
			playerPosition.push(rect);
			ctx.rect(rect.x , rect.y , rect.width , rect.height);
			ctx.fillStyle = '#9AD964';
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.stroke();
			currentPoint=null;
			prevPoint=null;
		}
		if(currentPoint!=null){
			prevPoint = currentPoint;
		}
		currentPoint = point;
		if(currentPoint!=null && prevPoint!=null){
			drawLine(prevPoint , currentPoint);
		}
	});

function drawLine( a , b){

	var width =0;
	var height =0;
	
	if( Math.abs(a.x - b.x) < 20){
		height= Math.abs(a.y - b.y);
		width = 1;
		if(isWall){
			width=width+10;
		}
	}
	if( Math.abs(a.y - b.y) <20){
		width= Math.abs(a.x - b.x);
		height = 1;
		if(isWall){
			height=height+10;
		}
	}
	ctx.beginPath();
	var x = 0;
	var y = 0;
	if(a.x > b.x){
		x=b.x;
	}else{
		x=a.x;
	}
	if(a.y > b.y){
		y=b.y;
	}else{
		y=a.y;
	}
	
	var rect = new Rect();
	rect.x= x;
	rect.y=y;
	rect.height = height;
	rect.width = width;
	map.push(rect);
	ctx.rect(x , y , width, height);
	ctx.fillStyle = '#8ED6FF';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
	ctx.stroke();
}
	
});