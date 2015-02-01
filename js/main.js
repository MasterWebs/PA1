/**
 * Created by Omar on 16.1.2015.
 */

function Shape() {
	// prototype class
}

function loadShape(startPoint, endPoint) {
	var context = state.context;
	context.rect

	var w = Math.abs(this.startPoint.x - this.endPoint.x);
	var h = Math.abs(this.startPoint.y - this.endPoint.y);
	context.rect(this.startPoint.x, this.startPoint.y, w, h);
	context.fill();
}

function Rect(x, y, color, strokeColor, fill, lineWidth) {
	this.startPoint = new Point(x, y);
	this.endPoint = new Point(x, y);
	this.color = color;
	this.strokeColor = strokeColor;
	this.fill = fill;
	this.lineWidth = lineWidth;

	this.edit = function(x, y) {
		if(state.startPoint.x < x) {
			this.endPoint.x = x;
		} else {
			this.endPoint.x = state.startPoint.x;
			this.startPoint.x = x;
		}

		if(state.startPoint.y < y) {
			this.endPoint.y = y;
		} else {
			this.endPoint.y = state.startPoint.y;
			this.startPoint.y = y;
		}
	}

	this.draw = function() {
		var context = state.context;
		var w = Math.abs(this.startPoint.x - this.endPoint.x);
		var h = Math.abs(this.startPoint.y - this.endPoint.y);

		context.beginPath();

		if(this.fill === true) {
			context.fillStyle = this.color;
			context.strokeStyle = this.strokeColor;
			context.rect(this.startPoint.x, this.startPoint.y, w, h);
			context.fill();
			context.stroke();
		}	
		else{
			context.strokeStyle = this.strokeColor;
			context.lineWidth = this.lineWidth;
			context.rect(this.startPoint.x, this.startPoint.y, w, h);
			context.stroke();
		}
	}

	this.move = function(x, y) {
		var xDif = this.startPoint.x - (x - state.offsetDrag.x);
		var yDif = this.startPoint.y - (y - state.offsetDrag.y);

		this.startPoint.x -= xDif;
		this.startPoint.y -= yDif;

		this.endPoint.x -= xDif;
		this.endPoint.y -= yDif;
	}

	this.isAt = function(x, y) {
		var context = state.context;
		var w = Math.abs(this.startPoint.x - this.endPoint.x);
		var h = Math.abs(this.startPoint.y - this.endPoint.y);

		context.beginPath();
		context.rect(this.startPoint.x, this.startPoint.y, w, h);
		var contains = context.isPointInPath(x, y);
		context.closePath();
		if(contains === true) {
			state.offsetDrag.x = x - this.startPoint.x;
			state.offsetDrag.y = y - this.startPoint.y;
		}
		return contains;
	}
}

function Text(text, x, y, color, strokeColor, size, font) {
	this.point = new Point(x, y); // point is at lower left corner
	this.color = color;
	this.strokeColor = strokeColor;
	this.size = size;
	this.font = font;
	this.text = text;

	this.draw = function() {
		var context = state.context;

		context.font = size + "px " + this.font;
		context.fillStyle = this.color;
		context.strokeStyle = this.strokeColor;
		context.fillText(this.text, this.point.x, this.point.y);
		context.strokeText(this.text, this.point.x, this.point.y);
	}

	this.isAt = function(x, y) {
		var context = state.context;
		var w = context.measureText(this.text).width;
		var h = this.size;

		context.beginPath();
		context.rect(this.point.x, this.point.y - h, w, h);
		var contains = context.isPointInPath(x, y);
		context.closePath();
		if(contains === true) {
			state.offsetDrag.x = x - this.point.x;
			state.offsetDrag.y = y - this.point.y;
			console.log("found text!");
		}
		return contains;
	}

	this.move = function(x, y) {
		var xDif = this.point.x - (x - state.offsetDrag.x);
		var yDif = this.point.y - (y - state.offsetDrag.y);

		this.point.x -= xDif;
		this.point.y -= yDif;
	}
}

function Circle(x, y, w, color, strokeColor, fill, lineWidth) {
	this.point = new Point(x, y);
	this.w = w;
	this.color = color;
	this.strokeColor = strokeColor;
	this.fill = fill;
	this.lineWidth = lineWidth;

	this.edit = function(x, y) {
		this.w = Math.max(Math.abs(this.point.x - x),
						  Math.abs(this.point.y - y));
	}

	this.draw = function() {
		var context = state.context;

		context.beginPath();

		if(this.fill === true) {
			context.fillStyle = this.color;
			context.strokeStyle = this.strokeColor;
			context.arc(this.point.x, this.point.y, this.w, 0, 2*Math.PI, false); 
			context.fill();
			context.stroke();
		}
		else {
			context.strokeStyle = this.strokeColor;
			context.lineWidth = this.lineWidth;
			context.arc(this.point.x, this.point.y, this.w, 0, 2*Math.PI, false);
			context.stroke();
		}
	}

	this.isAt = function(x, y) {
		var context = state.context;
		
		context.beginPath();
		context.arc(this.point.x, this.point.y, this.w, 0, 2*Math.PI, false);
		var contains = context.isPointInPath(x, y);
		context.closePath();
		if(contains === true) {
			state.offsetDrag.x = x - this.point.x;
			state.offsetDrag.y = y - this.point.y;
		}
		return contains;
	}

	this.move = function(x, y) {
		var xDif = this.point.x - (x - state.offsetDrag.x);
		var yDif = this.point.y - (y - state.offsetDrag.y);

		this.point.x -= xDif;
		this.point.y -= yDif;
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
	this.selectedPoint = new Point(0, 0);

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

	this.isAt = function(x, y) {
		var highestX = -1;
		var lowestX = 999999999;
		var highestY = -1;
		var lowestY = 999999999;
		var context = state.context;

		for(var i = 0; i < this.points.length; i++) {
			highestX = Math.max(this.points[i].x, highestX);
			lowestX = Math.min(this.points[i].x, lowestX);
			highestY = Math.max(this.points[i].y, highestY);
			lowestY = Math.min(this.points[i].y, lowestY);
		}

		var w = Math.abs(highestX - lowestX);
		var h = Math.abs(highestY - lowestY);

		context.beginPath();
		context.rect(lowestX, lowestY, w, h);
		var contains = context.isPointInPath(x, y);
		context.closePath();
		if(contains === true) {
			this.selectedPoint.x = x;
			this.selectedPoint.y = y;
		}
		return contains;
	}

	this.move = function(x, y) {
		var xDif = this.selectedPoint.x - x;
		var yDif = this.selectedPoint.y - y;

		this.selectedPoint.x -= xDif;
		this.selectedPoint.y -= yDif;

		for(var i = 0; i < this.points.length; i++) {
			this.points[i].x -= xDif;
			this.points[i].y -= yDif;
		}
	}
}

function Line(x, y, lineWidth, color, strokeColor) {
	this.startPoint = new Point(x, y);
	this.endPoint = new Point(x, y);
	this.lineWidth = lineWidth;
	this.color = color;
	this.strokeColor = strokeColor;

	this.edit = function(x, y) {
		this.endPoint.x = x;
		this.endPoint.y = y;
	}

	this.draw = function() {
		var context = state.context;

		context.beginPath();
		context.fillStyle = this.color;
		context.strokeStyle = this.strokeColor;
		context.lineWidth = this.lineWidth;
		context.moveTo(this.startPoint.x, this.startPoint.y);
		context.lineTo(this.endPoint.x, this.endPoint.y);
		context.fill();
		context.stroke();
	}

	this.isAt = function(x, y) {
		var context = state.context;
		var w = Math.abs(this.startPoint.x - this.endPoint.x);
		var h = Math.abs(this.startPoint.y - this.endPoint.y);
		var start = new Point(Math.min(this.startPoint.x, this.endPoint.x),
							  Math.min(this.startPoint.y, this.endPoint.y));

		if(w === 0) {
			// if the line is vertical
			w = 2;
		} else if(h === 0) {
			// if the line is horizontal
			h = 2;
		}

		context.beginPath();
		context.rect(start.x, start.y, w, h);
		var contains = context.isPointInPath(x, y);
		context.closePath();
		if(contains === true) {
			state.offsetDrag.x = x - this.startPoint.x;
			state.offsetDrag.y = y - this.startPoint.y;
		}
		return contains;
	}

	this.move = function(x, y) {
		var xDif = this.startPoint.x - (x - state.offsetDrag.x);
		var yDif = this.startPoint.y - (y - state.offsetDrag.y);

		this.startPoint.x -= xDif;
		this.startPoint.y -= yDif;

		this.endPoint.x -= xDif;
		this.endPoint.y -= yDif;
	}
}

// inheritance
Text.prototype = new Shape();
Rect.prototype = new Shape();
Circle.prototype = new Shape();
Pen.prototype = new Shape();
Line.prototype = new Shape();

///////////////////////////////////////////////////////////////////////


function State(canvas) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.width = canvas.width;
	this.height = canvas.height;
	this.valid = false;
	this.shapes = [];
	this.undone = [];
	this.dragging = false;
	this.selected = 0;		// index of item selected when moving
	this.startPoint = new Point(0, 0); // to keep track of starting point (mousedown)
	this.offsetDrag = new Point(0, 0); // store the offset from the top left corner
	this.loggedIn = false;

}

function Tools() {
	this.nextObject = "pen";
	this.nextColor = "#000000";
	this.strokeColor = "#000000";
	this.fill = true;
	this.template = false;
	this.colorSelect = $("#colorSelect").val();
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

// method to move items in array
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

var state = new State(document.getElementById("myCanvas"));
var tools = new Tools(document.getElementById("myCanvas"));

$(document).ready(function() {
    setInterval(function() {  state.drawAll(); }, 10);
    $("#textForm").hide();
    $("#saveForm").hide();
    $("#logError").hide();
    $("#savedDraws").hide();

    $("#myCanvas").mousedown( function(e) {
    	state.startPoint.x = e.pageX - this.offsetLeft;
    	state.startPoint.y = e.pageY - this.offsetTop;
    	var lineWidth = $("#lineWidth").val();

    	switch(tools.nextObject) {
    		case "text":
	    		// TODO: make text area appear and create new shape
	    		var text = $("#textInput").val();
	    		var size = $("#textSize").val();
	    		var font = $("#font").val();

	    		state.shapes.push(new Text(text, state.startPoint.x, state.startPoint.y, tools.nextColor, tools.strokeColor, size, font));
	    		state.valid = false;
	    		return;
	    	case "pen":
	    		var pen = new Pen(lineWidth, tools.nextColor);
	    		pen.edit(state.startPoint.x, state.startPoint.y);
	    		state.shapes.push(pen);
	    		break;
	    	case "rect":
	    		state.shapes.push(new Rect(state.startPoint.x,
	    								state.startPoint.y, 
	    								tools.nextColor, 
	    								tools.strokeColor, 
	    								tools.fill, 
	    								lineWidth
	    							));
	    		console.log(state.shapes);
	    		break;
	    	case "circle":
	    		state.shapes.push(new Circle(state.startPoint.x, state.startPoint.y, 0, tools.nextColor, tools.strokeColor, tools.fill, lineWidth));
	    		break;
	    	case "line":
	    		state.shapes.push(new Line(state.startPoint.x, state.startPoint.y, lineWidth, tools.nextColor, tools.strokeColor));
	    		break;
	    	case "move":
	    		for(var i = state.shapes.length - 1; i >= 0; i--) {
	    			if(state.shapes[i].isAt(state.startPoint.x, state.startPoint.y)) {
	    				state.selected = i;
	    				state.shapes.move(i, state.shapes.length - 1);
	    				break;
	    			}

	    			if(i === state.shapes.length - 1) {
	    				// if we haven't found anything at current point
	    				state.selected = -1;
	    			}
    			}
    			break;
    		}

    	state.undone = []; //empty undone array
    	state.dragging = true;
    	state.valid = false;
    });

    $("#myCanvas").mousemove( function(e) {
    	if(state.dragging === true) {
	    	var currX = e.pageX - this.offsetLeft;
	    	var currY = e.pageY - this.offsetTop;

	    	if(tools.nextObject === "move") {
	    		if(state.selected != -1) {
	    			// we only move an object if we have found one
	    			state.shapes[state.shapes.length - 1].move(currX, currY);
	    			state.valid = false;
	    		}
	    	} else if(tools.nextObject != "text") {
	    		var len = state.shapes.length;

	    		state.shapes[len - 1].edit(currX, currY);
	    		state.valid = false;
		    }
		}
    });

    $("#myCanvas").mouseup( function(e) {
    	state.dragging = false;
    });


	$(".colors").click(function(e) {
		
		if($("#colorSelect").val() == "Fill") 
			tools.nextColor = $(this).data("tool");
		else 
			tools.strokeColor = $(this).data("tool");
	});

	/*$(".colorsStroke").click(function(e) {
		tools.strokeColor = $(this).data("tool");
		console.log("stroke " + tools.strokeColor);
	});*/
	
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
	
	if(tools.nextObject === "text") {
		console.log("yup");
		$("#textForm").show();
		$("#lineForm").hide();
	}
	else {
		console.log("nat");
		$("#textForm").hide();
		$("#lineForm").show();
	}

});


$("#fill").click(function() {
	if(tools.fill === true){
		tools.fill = false;
		$('#fill').css("background-color", "#FFFFFF");
	}
	else {
		tools.fill = true;
		$('#fill').css("background-color", "#00BFFF");
	}
});

$("#template").click(function() {
	if(tools.template === true) {
		tools.template = false;
		$('#template').css("background-color", "#FFFFFF");
	}
	else {
		tools.template = true;
		$('#template').css("background-color", "#00BFFF");
	}
});

$("#saveButton").click(function() {

	var username = $("#username").val();
	var title = $("#title").val();
	var stringifiedArray = JSON.stringify(state.shapes);
	var param = {
		"user": username,
		"name": title,
		"content": stringifiedArray,
		"template": false
	};
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: "http://whiteboard.apphb.com/Home/Save",
		data: param,
		dataType: "jsonp",
		crossDomain: true,
	success: function (data) {
		console.log("success");
	},
	error: function (xhr, err) {
		console.log("error");
	}
	});
});

$("#loadButton").click(function() {
	var param = {
		"user": "omar13",//$("#username").val(),
		"title": "recta", //$("#title").val(),
		"template": false
	}

	$.ajax({
		type: "GET",
		contentType: "application/json; charset=utf-8",
		url: "http://whiteboard.apphb.com/Home/GetList",
		data: param,
		dataType: "jsonp",
		crossDomain: true,
	success:function(data) {
		var found = false;
		for(var i = 0; i < data.length; i++) {
			console.log("data " + data[i]);
			
			var tableContent = "";
			$.each(data, function(i, item) {
				tableContent += "<tr><td>" + item.WhiteboardTitle + "</tr></td>";
			});		
			$("#recentDraws").append(tableContent);

			var c = data[i].WhiteboardContents.startPoint.x;
			console.log("c " + c);
			console.log(c.startPoint);
		}
		

	
	},
	error: function(xhr, err) {
		console.log("error");
	}
	});

});

$("#login").click(function() {
	if(!state.loggedIn) {
		if($("#username").val() != "") {
			state.loggedIn = true;
			$("#username").val("");
			$("#logForm").hide();
			$("#savedDraws").show();
			$("#saveForm").show();
		}
		else {
			$("#logError").show();
		}
	}
	else
		$("#logError").show();
});

$("#logOut").click(function() {
	if(state.loggedIn) {
		state.loggedIn = false;
		$("#logForm").show();
		$("#saveForm").hide();
		$("#savedDraws").hide();
	}
});