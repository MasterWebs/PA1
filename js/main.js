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
		context.fillStyle = color;
		context.rect(x, y, w, h);
		context.fill();
	}
}

function Text(text, x, y, font, color) {
	this.x = x;
	this.y = y;
	this.color = color;

	this.draw = function() {
		var context = state.context;

		context.font = font;
		context.fillStyle = color;
		context.fillText(text, x, y);
	}
}

function Circle(x, y, w, color) {
	this.x = x;
	this.y = y;
	this.color = color;

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		context.fillStyle = color;
		context.arc(x, y, w/2, 0, 2*Math.PI, false); 
		context.fill();
	}	
}

function Line(x0, y0, x1, y1, linewidth, color) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
	this.linewidth = linewidth;
	this.color = color;

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		context.strokeStyle = this.color;
		context.lineWidth = this.linewidth;
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.stroke();
	}
}

Text.prototype = new Shape();
Rect.prototype = new Shape();
Circle.prototype = new Shape();
Line.prototype = new Shape();

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

var state = new State(document.getElementById("myCanvas"));

$(document).ready(function() {
    var startX = 0;
    var startY = 0;

    setInterval(function() {  state.drawAll(); }, 30);

    $("#myCanvas").mousedown( function(e) {
    	if(state.nextObject === "text") {
    		// TODO: make text area appear and create new shape
    		var text = $("#textinput").val();
    		var x = e.pageX - this.offsetLeft;
    		var y = e.pageY - this.offsetTop;

    		state.shapes.push(new Text(text, x, y, state.nextColor));
    		state.dragging = false;
    		state.valid = false;
    		return;
    	}

    	state.dragging = true;
    	state.valid = false;

    	startX = e.pageX - this.offsetLeft;
    	startY = e.pageY - this.offsetTop;
    });

    $("#myCanvas").mousemove( function(e) {
    	if(state.dragging) {
    		if(state.nextObject === "rect") {
		    	state.shapes.pop();
		    	state.valid = false;

			    var currX = e.pageX - this.offsetLeft;
		    	var currY = e.pageY - this.offsetTop;

		    	var x = (startX < currX) ? startX : currX;
		    	var y = (startY < currY) ? startY : currY;

		    	var width = Math.abs(startX - currX);
		    	var height = Math.abs(startY - currY);


		    	state.shapes.push(new Rect(x, y, width, height, state.nextColor));
		    }
		    else if(state.nextObject === "circle") {
		    	state.shapes.pop();
		    	state.valid = false;

		    	var currX = e.pageX - this.offsetLeft;
		    	var currY = e.pageY - this.offsetTop;

		    	var width = Math.abs(startX - currX);
		    	var height = Math.abs(startY - currY);

		    	state.shapes.push(new Circle(startX, startY, width, state.nextColor));

		    } else if(state.nextObject === "line") {
		    	state.shapes.pop();
		    	state.valid = false;

		    	var linewidth = $("#linewidth").val();
		    	var currX = e.pageX - this.offsetLeft;
		    	var currY = e.pageY - this.offsetTop;

		    	state.shapes.push(new Line(startX, startY, currX, currY, linewidth, state.nextColor));
		    }
	    }
    });

    $("#myCanvas").mouseup( function(e) {
    	state.dragging = false;

    	var endX = e.pageX - this.offsetLeft;
    	var endY = e.pageY - this.offsetTop;

    	var width = Math.abs(startX - endX);
		var height = Math.abs(startY - endY);

    	if(state.nextObject === "rect") {
    		var x = (startX < endX) ? startX : endX;
    		var y = (startY < endY) ? startY : endY;
			state.shapes.push(new Rect(x, y, width, height, state.nextColor));
    	}
    	else if(state.nextObject === "circle") {
	    	state.shapes.push(new Circle(startX, startY, width, state.nextColor));
    	} else if(state.nextObject === "line") {
    		state.shapes.push(new Line(startX, startY, endX, endY, state.nextColor));
    	}
		
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
		state.nextColor = this.value;
	});
	
});

$("#circle").click(function() {
	state.nextObject = "circle";
});

$("#rect").click(function() {
	state.nextObject = "rect";
});

$("#line").click(function() {
	state.nextObject = "line";
});

$("#text").click(function() {
	state.nextObject = "text";
});

$("#pen").click(function() {
	state.nextObject = "pen";
});

$("#clear").click(function() {
	state.context.clearRect(0, 0, state.width, state.height);
	state.shapes = [];
});