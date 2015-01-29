/**
 * Created by Omar on 16.1.2015.
 */

function Shape() {
	// prototype class
}

function Rect(x, y, w, h, color, fill, lineWidth) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
	this.fill = fill;
	this.lineWidth = lineWidth;

	this.edit = function(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	this.draw = function() {
		var context = state.context;

		context.beginPath();

		if(this.fill === true) {
			context.fillStyle = this.color;
			context.rect(this.x, this.y, this.w, this.h);
			context.fill();
		}	
		else{
			context.strokeStyle = this.color;
			context.lineWidth = this.lineWidth;
			context.rect(this.x, this.y, this.w, this.h);
			context.stroke();
		}
		
	}
}

function Text(text, x, y, color, size, font) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.size = size;
	this.text = text;

	this.draw = function() {
		var context = state.context;

		context.font = size + "px " + font;
		context.fillStyle = this.color;
		context.fillText(this.text, this.x, this.y);
	}
}

function Circle(x, y, w, color, fill, lineWidth) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.color = color;
	this.fill = fill;
	this.lineWidth = lineWidth;

	this.edit = function(w) {
		this.w = w;
	}

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		

		if(this.fill === true) {
			context.fillStyle = this.color;
			context.arc(this.x, this.y, this.w/2, 0, 2*Math.PI, false); 
			context.fill();
		}
		else {
			context.strokeStyle = this.color;
			context.lineWidth = this.lineWidth;
			context.arc(this.x, this.y, this.w/2, 0, 2*Math.PI, false);
			context.stroke();
		}

	}	
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Pen(lineWidth, color) {
	this.lineWidth = lineWidth;
	this.color = color;
	this.points = [];

	// adds new point at x,y
	this.edit = function(x, y) {
		this.points.push(new Point(x, y));
	}

	this.draw = function() {
		if(this.points.length > 0) {
			var context = state.context;
			var points = this.points;

			context.beginPath();
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color;
			context.moveTo(points[0].x, points[0].y);
			for(var i = 1; i < points.length; i++) {
				context.lineTo(points[i].x, points[i].y);
				context.moveTo(points[i].x, points[i].y);
			}
			context.stroke();
		} 
	}
}

function Line(x0, y0, lineWidth, color) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x0;
	this.y1 = y0;
	this.lineWidth = lineWidth;
	this.color = color;

	this.edit = function(x1, y1) {
		this.x1 = x1;
		this.y1 = y1;
	}

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		context.strokeStyle = this.color;
		context.lineWidth = this.lineWidth;
		context.moveTo(this.x0, this.y0);
		context.lineTo(this.x1, this.y1);
		context.stroke();
	}
}

// inheritance
Text.prototype = new Shape();
Rect.prototype = new Shape();
Circle.prototype = new Shape();
Pen.prototype = new Shape();
Line.prototype = new Shape();
Point.prototype = new Shape();

///////////////////////////////////////////////////////////////////////


function State(canvas) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.width = canvas.width;
	this.height = canvas.height;
	this.valid = false;
	this.shapes = [];
	this.undone = [];
	//this.nextObject = "pen";
	//this.nextColor = "#000000";
	this.dragging = false;
	//this.fill = true;
	this.selection = null;
}

function Tools() {
	this.nextObject = "pen";
	this.nextColor = "#000000";
	this.fill = true;
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
var tools = new Tools(document.getElementById("myCanvas"));

$(document).ready(function() {
    var startX = 0;
    var startY = 0;

    setInterval(function() {  state.drawAll(); }, 10);

    $("#myCanvas").mousedown( function(e) {
    	startX = e.pageX - this.offsetLeft;
    	startY = e.pageY - this.offsetTop;
    	var lineWidth = $("#lineWidth").val();

    	switch(tools.nextObject) {
    		case "text":
	    		// TODO: make text area appear and create new shape
	    		var text = $("#textInput").val();
	    		var size = $("#textSize").val();
	    		var font = $("#font").val();

	    		state.shapes.push(new Text(text, startX, startY,  tools.nextColor, size, font));
	    		state.dragging = false;
	    		state.valid = false;
	    		return;
	    	case "pen":
	    		state.shapes.push(new Pen(lineWidth, tools.nextColor));
	    		break;
	    	case "rect":
	    		state.shapes.push(new Rect(startX, startY, 0, 0, tools.nextColor, tools.fill, lineWidth));
	    		break;
	    	case "circle":
	    		state.shapes.push(new Circle(startX, startY, 0, tools.nextColor, tools.fill, lineWidth));
	    		break;
	    	case "line":
	    		state.shapes.push(new Line(startX, startY, lineWidth, tools.nextColor));
	    		break;
    	}

    	state.undone = []; //empty undone array
    	state.dragging = true;
    	state.valid = false;
    });

    $("#myCanvas").mousemove( function(e) {
    	if(state.dragging) {
    		var currX = e.pageX - this.offsetLeft;
    		var currY = e.pageY - this.offsetTop;
    		var len = state.shapes.length;

    		switch(tools.nextObject) {
    			case "pen":
    				state.valid = false;
    				state.shapes[len - 1].edit(currX, currY);
    				break;
    			case "rect":
    				state.valid = false;

			    	var x = (startX < currX) ? startX : currX;
			    	var y = (startY < currY) ? startY : currY;

			    	var width = Math.abs(startX - currX);
			    	var height = Math.abs(startY - currY);

			    	state.shapes[len - 1].edit(x, y, width, height);
			    	break;
			    case "circle":
			    	state.valid = false;

			    	var width = Math.abs(startX - currX);

			    	state.shapes[len - 1].edit(width);
			    	break;
			    case "line":
			    	state.valid = false;

		    		state.shapes[len - 1].edit(currX, currY);
		    		break;
    		}
	    }
    });

    $("#myCanvas").mouseup( function(e) {
    	state.dragging = false;
    });


	$("#colorPicker").on('change', function() {
		tools.nextColor = this.value;
	});
	
});

$("#undo").click(function() {
	if(state.shapes.length > 0) {
		var shape = state.shapes.pop();
		state.undone.push(shape);
		state.valid = false;
	}
});

$("#redo").click(function() {
	if(state.undone.length > 0) {
		var shape = state.undone.pop();
		state.shapes.push(shape);
		state.valid = false;
	}
});

$(".object").click(function(e) {
	tools.nextObject = $(this).data("tool");
	$('#objects button').addClass('active').not(this).removeClass('active')

});

$("#fill").click(function() {
	if(tools.fill === true){
		tools.fill = false;
		$('#right button').removeClass('active');
	}
	else {
		tools.fill = true;
		$('#right button').addClass('active');
	}
			
});