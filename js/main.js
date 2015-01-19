/**
 * Created by Omar on 16.1.2015.
 */

$(document).ready(function() {
	var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.fillStyle = "black";
    var shape = "pen";

    var drawing = false;

    $("#myCanvas").mousedown( function(e) {
    	drawing = true;
    	var x = e.pageX - this.offsetLeft;
	    var y = e.pageY - this.offsetTop;
    	context.beginPath();
    	context.moveTo(x, y);
    	console.log("mousedown");
    });

    $("#myCanvas").mousemove( function(e) {
    	if(drawing === true) {
    		console.log("mousemove");
	    	var x = e.pageX - this.offsetLeft;
	    	var y = e.pageY - this.offsetTop;
	    	context.lineTo(x, y);
	    	context.stroke();
	    }
    });

    $("#myCanvas").mouseup( function() {
    	drawing = false;
    });

    /* $("#circle").click( function() {
    	shape = "circle";
    });

    $("#rect").click( function() {
    	shape = "rect";
    });

    $("#line").click( function() {
    	shape = "line";
    });

    $("#text").click( function() {
    	shape = "text";
    });

    $("#pen").click( function() {
    	shape = "pen";
    }); */
  	
});
