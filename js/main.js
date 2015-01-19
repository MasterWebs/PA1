/**
 * Created by Omar on 16.1.2015.
 */

function Shape() {
	// prototype class
}

function Rect(x, y, w, h, color) {
	this.x = x;
	this.y = y;
	this.color = color;

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		context.fillstyle = color;
		context.rect(x, y, w, h);
		context.fill();
	}
}

function State(canvas) {
this.canvas = canvas;
this.context = canvas.getContext("2d");
this.width = canvas.width;
this.height = canvas.height;
this.valid = false;
this.shapes = [];
this.nextObject = "pen";
this.nextColor = "#000000";
this.dragging = false;
this.selection = null;
}

State.prototype.clear = function() {
	this.context.clearRect(0, 0, this.width, this.height);
}

State.prototype.drawAll = function() {
	if(!this.valid) {
		var shapes = this.shapes;
		var context = this.context;
		this.clear();

		for(var i = 0; i < shapes.length; i++) {
			var shape = shapes[i];

			shapes[i].draw(context);
		}

		this.valid = true;
	}
}

Rect.prototype = new Shape();

var state = new State(document.getElementById("myCanvas"));

$(document).ready(function() {

    var startX = 0;
    var startY = 0;

    setInterval(function() {  state.drawAll(); }, 30);

    $("#myCanvas").mousedown( function(e) {
    	state.dragging = true;
    	state.valid = false;

    	startX = e.pageX - this.offsetLeft;
    	startY = e.pageY - this.offsetTop;
    });

    $("#myCanvas").mousemove( function() {
    	state.valid = false;
    })

    $("#myCanvas").mouseup( function(e) {
    	state.dragging = false;

    	var endX = e.pageX - this.offsetLeft;
    	var endY = e.pageY - this.offsetTop;

		var width = Math.abs(startX - endX);
		var height = Math.abs(startY - endY);

		state.shapes.push(new Rect(startX, startY, width, height));
    });



    /* $("#myCanvas").mousedown( function(e) {
    	drawing = true;
    	
    	var x = e.pageX - this.offsetLeft;
	    var y = e.pageY - this.offsetTop;
    	context.beginPath();

    	context.moveTo(x, y);
  
    });

    $("#myCanvas").mousemove( function(e) {
    	if(drawing === true) {
    		context.strokeStyle = color;

	    	var x = e.pageX - this.offsetLeft;
	    	var y = e.pageY - this.offsetTop;
	    	context.lineTo(x, y);
	    	context.stroke();
	    }
    });

    $("#myCanvas").mouseup( function() {
    	drawing = false;
    });

    $("#myCanvas").mouseleave( function(e) {
    	drawing = false;
    }); */


	$("#colorPicker").on('change', function() {
		color = this.value; 
		context.fillStyle = color;
	});

	$("#rect").click(function() {
		state.nextObject = "rect";
	});

	


});
