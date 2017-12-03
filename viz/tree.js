//Set dimensions of the graph
var margin = {top: 40, right: 0, bottom: 50, left: -40},
    width = 1000 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

//Append svg object to body of page 
//Append group element to svg object 
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
	g = svg.append("g")
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Declare tree layout and assign size
var tree = d3.tree()
	.size([height, width]);

//Load JSON data 
var json = d3.json("slaveTree.json", function(error, json) {
	if (error) {
		throw error;
	}

//Assign data to hierarchy using parent-child relationships
var nodes = d3.hierarchy(json);

nodes = tree(nodes);

//Add links between nodes
var link = g.selectAll(".link")
	.data(nodes.links())
	.enter().append("path")
	.attr("class", "link")
	.attr("d", d3.linkVertical()
	    .x(function(d) { return d.x; })
	    .y(function(d) { return d.y / 2; }));

//Add each node as a group
var node = g.selectAll(".node")
	.data(nodes.descendants())
	.enter().append("g")
	.attr("class", function(d) {
		return "node" + (d.children? " node-internal" : " node-leaf"); })
	.attr("transform", function(d) {
		return "translate(" + d.x  + "," + d.y / 2 + ")";
	})

//Add circle to node
node.append("circle")
	.attr("r", 10);

//Add text to node
node.append("text")
	.attr("y", function(d) {
		return (d.children? -20 : 20); 
	})
	.style("text-anchor", "middle")
	.text(function(d) {
		return d.data.full_name;
	});

})



