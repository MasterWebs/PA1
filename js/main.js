/**
 * Created by Omar on 16.1.2015.
 */

function Shape() {
	// prototype class
}

function Rect(x, y, w, h, color, fill) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
	this.fill = fill;

	this.edit = function(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	this.draw = function() {
		var context = state.context;

		context.beginPath();

		if(this.fill===true) {
			context.fillStyle = color;
			context.rect(this.x, this.y, this.w, this.h);
			context.fill();
		}	
		else{
			context.strokeStyle = color;
			context.rect(this.x, this.y, this.w, this.h);
			context.stroke();
		}
		
	}
}

function Text(text, x, y, font, color, size) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.size = size;

	this.draw = function() {
		var context = state.context;

		context.font = size + "px " + font;
		context.fillStyle = color;
		context.fillText(text, x, y);
	}
}

function Circle(x, y, w, color, fill) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.color = color;
	this.fill = fill;

	this.edit = function(w) {
		this.w = w;
	}

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		

		if(this.fill === true) {
			context.fillStyle = color;
			context.arc(this.x, this.y, this.w/2, 0, 2*Math.PI, false); 
			context.fill();
		}
		else {
			context.strokeStyle = color;
			context.arc(this.x, this.y, this.w/2, 0, 2*Math.PI, false);
			context.stroke();
		}

	}	
}

function Point(x, y, lineWidth, color) {
	this.x = x;
	this.y = y;
	this.lineWidth = lineWidth;
	this.color = color;

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.color;
		context.moveTo(x, y);
		context.lineTo(x, y);
		context.stroke();
		console.log("drawing point");
	}
}

function Pen(lineWidth, color) {
	this.x = x;
	this.y = y;
	this.lineWidth = lineWidth;
	this.color = color;
	this.points = [];

	this.addPoint = function(x, y) {
		this.points.push(new Point(x, y, this.lineWidth, this.color));
	}

	this.draw = function() {
		for(var i = 0; i < this.points.length; i++) {
			this.points[i].draw();
			console.log("idunno, drawing i guess");
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
	//this.textSize = 12;
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

    setInterval(function() {  state.drawAll(); }, 30);

    $("#myCanvas").mousedown( function(e) {
    	startX = e.pageX - this.offsetLeft;
    	startY = e.pageY - this.offsetTop;
    	var lineWidth = $("#lineWidth").val();
    	var textSize = $("#textSize").val();

    	switch(tools.nextObject) {
    		case "text":
	    		// TODO: make text area appear and create new shape
	    		var text = $("#textinput").val();

	    		state.shapes.push(new Text(text, startX, startY, tools.nextColor, textSize, tools.font));
	    		state.dragging = false;
	    		state.valid = false;
	    		return;
	    	case "pen":
	    		state.shapes.push(new Pen(lineWidth, tools.nextColor));
	    		break;
	    	case "rect":
	    		state.shapes.push(new Rect(startX, startY, 0, 0, tools.nextColor, tools.fill));
	    		break;
	    	case "circle":
	    		state.shapes.push(new Circle(startX, startY, 0, tools.nextColor, tools.fill));
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

    		if(tools.nextObject === "pen") {
    			state.valid = false;
    			state.shapes[len - 1].addPoint(currX, currY);
    		}
    		else if(tools.nextObject === "rect") {
		    	state.valid = false;

		    	var x = (startX < currX) ? startX : currX;
		    	var y = (startY < currY) ? startY : currY;

		    	var width = Math.abs(startX - currX);
		    	var height = Math.abs(startY - currY);

		    	state.shapes[len - 1].edit(x, y, width, height);
		    }
		    else if(tools.nextObject === "circle") {
		    	state.valid = false;

		    	var width = Math.abs(startX - currX);

		    	state.shapes[len - 1].edit(width);

		    } else if(tools.nextObject === "line") {
		    	state.valid = false;

		    	state.shapes[len - 1].edit(currX, currY);
		    }
	    }
    });

    $("#myCanvas").mouseup( function(e) {
    	state.dragging = false;

    	/* var endX = e.pageX - this.offsetLeft;
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
    	} */
		
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

$(".tool").click(function(e) {
	tools.nextObject = $(this).data("tool");
	$('#objects button').addClass('active').not(this).removeClass('active')

});

$("#fill").click(function() {
	if(tools.fill === true){
		tools.fill = false;
		$('#fill').removeClass('active').not('#objects button');
	}
	else {
		tools.fill = true;
		$('#fill').addClass('active').not('#objects button');
	}
			
});