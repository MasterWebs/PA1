/**
 * Created by Omar on 16.1.2015.
 */

$(document).ready(function() {
	var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    
    var color =  "#000000";
    var shape = "pen";

    var drawing = false;

    $("#myCanvas").mousedown( function(e) {
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
    });


	$("#colorPicker").on('change', function() {
		color = this.value; 
		context.fillStyle = color;
	});


});
