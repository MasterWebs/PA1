/**
 * Created by Omar on 16.1.2015.
 */

$(document).ready(function() {

	var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    context.font = '40pt Calibri';
	context.fillStyle = 'blue';
	context.fillText('Hello World', 150, 100);
});

function yep() {
	alert("works");
}