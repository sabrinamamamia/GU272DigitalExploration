var data;

var width = 2000;
var height = 1000; 

var boxWidth = 150,
    boxHeight = 40;

// Setup zoom and pan
var zoom = d3.behavior.zoom()
  .scaleExtent([.1,1])
  .on('zoom', function(){
    svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
  })
  // Offset so that first pan and zoom does not jump back to the origin
  .translate([150, 200]);

var svg = d3.select("body")	
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.call(zoom)
			.append('g')
			// Left padding of tree so that the whole root node is on the screen.
			.attr("transform", "translate(150,200)")
			

var tree = d3.layout.tree()
			
			.nodeSize([100, 200])
			.children(function(d) {return d.children; })
			 // By default, cousins are drawn further apart than siblings.
  			// By returning the same value in all cases, we draw cousins
  			// the same distance apart as siblings.
			.separation(function(){
			    return .5;
			})

d3.json('slave.json', function(error, json) {
	if (error) {
		return console.error(error);
	}

	// Start with only the first few generations showing
	json.children.forEach(function(gen2) {
		if (gen2.children.length != 0) {
			collapse(gen2.children);
		}
		// gen2.children.forEach(function(gen3) {
		// 	collapse(gen3);
		// });
	});

	data = json;

	draw();

});

function draw() {
	var nodes = tree.nodes(data),
		links = tree.links(nodes);

	var node = svg.selectAll("g.person")
		      // The function we are passing provides d3 with an id
		      // so that it can track when data is being added and removed.
		      // This is not necessary if the tree will only be drawn once
		      // as in the basic example.
		      .data(nodes, function(person){ return person.id; });

	// Add any new nodes
	var nodeEnter = node.enter()
		.append("g")
		.attr("class", "person")
		.on('click', togglePerson);

	//Style nodes
	// var node = svg.selectAll("g.person")
	// 	.data(nodes)
	// 	.enter()
	// 	.append("g")
	// 	.attr("class", "person")
	// 	// What does this do?
	// 	.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	// Draw the rectangle person boxes
	nodeEnter.append("rect")
		.attr({
			x: -(boxWidth/2),
			y: -(boxHeight/2),
			width: boxWidth,
			height: boxHeight
		});

	//Draw person's name and position inside box
	nodeEnter.append("text")
		.attr("dx", -(boxWidth/2) + 10)
		.attr("dy", 0)
	    .attr("text-anchor", "start")
	  	.attr('class', 'name')
	  	.text(function(d) { 
	    	return d.full_name; 
	  	});

	// Update the position of both old and new nodes
	node.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	// Remove nodes we aren't showing anymore
	node.exit().remove();

	// Update links
	var link = svg.selectAll("path.link")
	  
	// The function we are passing provides d3 with an id
	// so that it can track when data is being added and removed.
	// This is not necessary if the tree will only be drawn once
	// as in the basic example.
	.data(links, function(d){ return d.target.id; });
  
  	// Add new links    
  	link.enter()
  		.append("path")
    	.attr("class", "link");
  
	// Remove any links we don't need anymore
	// if part of the tree was collapsed
	link.exit().remove();
  
	// Update the links positions (old and new)
	link.attr("d", elbow);
}

/**
 * Update a person's state when they are clicked.
 */
function togglePerson(person){
  if(person.collapsed){
    person.collapsed = false;
  } else {
    collapse(person);
  }
  draw();
}

/**
 * Collapse person (hide their ancestors). We recursively
 * collapse the ancestors so that when the person is
 * expanded it will only reveal one generation. If we don't
 * recursively collapse the ancestors then when
 * the person is clicked on again to expand, all ancestors
 * that were previously showing will be shown again.
 * If you want that behavior then just remove the recursion
 * by removing the if block.
 */
function collapse(person){
  person.collapsed = true;
  if(person.children){
    person.children.forEach(collapse);
  }
}

/**
 * Custom path function that creates straight connecting lines.
 */
function elbow(d) {
  var sourceX = d.source.x,
      sourceY = d.source.y + (boxWidth / 2),
      targetX = d.target.x,
      targetY = d.target.y - (boxWidth / 2);
      
  return "M" + sourceY + "," + sourceX
    + "H" + (sourceY + (targetY-sourceY)/2)
    + "V" + targetX 
    + "H" + targetY;
}