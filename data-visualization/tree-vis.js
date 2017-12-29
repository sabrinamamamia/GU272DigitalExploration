/*
* Tree diagram derived from: 
* https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd 
*/

var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var i = 0;
var duration = 700;

var tree = d3.tree()
	.size([height, width]);

d3.json('gu272-data.json', function (error, json) {
	if (error) return console.error(error);	
	var root = d3.hierarchy(json[0], function(d) {
		for (var i in json[id].children) {
			json[id].children[i] = json[json[id].children[i] - 1];
			// console.log(id);
			// console.log(json[id].children[i]);
			// console.log(json[id].children[i].parent);
			// console.log(json[id]);
			json[id].children[i].parent = json[id];
			// if (json[id].children[i].children.length > 0) {
			// 	setChildren(json, json[id].children[i].id);
			// }
		}
	})
}

	