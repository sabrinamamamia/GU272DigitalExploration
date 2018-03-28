
var svg = d3.select("#demographics").append("svg")

var data = d3.csv("gu272.csv", function(data) {
	console.log(data)
});