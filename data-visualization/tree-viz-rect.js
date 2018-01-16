/*
* Tree diagram derived from: 
* https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd 
*/

var margin = {top: 40, right: 50, bottom: 150, left: 80},
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//Append svg and g elements to body
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,							//node id increment factor 
		duration = 700;			//duration of transition

//Load data 
var data = d3.json('/data/filtered-gu272-data.json', function(error, json) {
	if (error) return console.error(error);	
	// console.log(json);

	//Bind json objects to g elements 
	var trees = svg.selectAll('g.tree')
		.data(json)
		.enter()
		.append('g')
			.attr('class', 'tree')
			//Tree id used in update() to bind data to correct g element
			.attr('id', function(d) { return 't' + d.id; }) 
      .attr("transform", function(d) {
        var x,y;
        if (i <= 3) y = 0;
        else if (i > 3 && i < 8) y = 200;
        else y = 400;
        return "translate(" + (((i++ % 4) * 325))+ "," + y + ")"
      });
			// .attr("transform", function(d) {
			// 	var x = y = i++;
			// 	return "translate(" + (((x % 4) * 325))+ "," + (y % 3) * 200 + ")"
			// });

	//Call chart function for every JSON objecct
	trees.call(chart);

	//Generate tree
	function chart(selection) {
		selection.each(function(data) {
			var root = d3.hierarchy(data);

			root.x0 = height/2;
			root.y0 = 0;

			var tree = d3.tree().size([height/2.5, width/2.5]);

			update(root);
			function update(source) {
			  var treeData = tree(root);
			  var g = d3.select('#t' + root.data.id);

			  // Compute the new tree layout
			  var nodes = treeData.descendants();
			  
			  //Normalize for fixed depth
			  nodes.forEach(function(d){ 
			    d.y = d.depth * 110;
			  });

			  // Declare node element and id
			  var node = g.selectAll('g.node')
			  	.data(nodes, function(d) {
			  		return d.id || (d.id = ++i)})
			 		.attr('id', function(d) {
						return 'n' + d.data.id;
					});

			  //Enter new nodes at parent's previous position
			  var nodeEnter = node.enter().append('g')
			  	.attr('class', 'node')
			  	.attr('transform', function(d) {
			  		return "translate(" + source.y0 + "," + source.x0 + ")";
			  	})
			  	.on('click', click);

			  //Add rects for the nodes
			  // nodeEnter.append('rect')
			  // 	.attr('class', 'node')
			  // 	.attr("x", -70)
			  // 	.attr("y", -8.5)
			  //   .attr('width', 70)
			  //   .attr('height', 17)
		   //    .style("fill", function(d) {
		   //        return d._children ? "lightsteelblue" : "#fff";
		   //    });

				nodeEnter.append('rect')
					.attr('class', 'node')
					.attr("x", function(d) {
						return d.parent ? 0 : -d.data.first_name.length * 7;
					})
					.attr("y", -8.5)
					.attr("width", function(d) {
						return d.data.first_name.length * 7;
					})
					.attr('height', 17)
		      .style("fill", function(d) {
		          return d._children ? "lightsteelblue" : "#fff";
		      });


			  // Add labels for the nodes
			  nodeEnter.append('text')
			      .attr("dy", ".35em")
			      .attr("x", function(d) {
			      		return 3;
			        //   return d.children || d._children ? -13 : 13;
			      })
			      .attr("text-anchor", function(d) {
			      		return d.parent ? "start" : "end";
			          // return d.children || d._children ? "end" : "start";
			      })
			      .text(function(d) { return d.data.first_name;});

			  var nodeUpdate = nodeEnter.merge(node);

			  // Transition to the proper position for the node
			  nodeUpdate.transition()
			    .duration(duration)
			    .attr("transform", function(d) { 
		        // return "translate(" + d.x + "," + d.y + ")";
		        return "translate(" + d.y + "," + d.x + ")";        
			     });

			  // Update the node attributes and style
			  nodeUpdate.select('rect.node')
			    .style("fill", function(d) {
			        return d._children ? "lightsteelblue" : "#fff";
			    })
			    .attr('cursor', 'pointer');

			  // Remove any exiting nodes
			  var nodeExit = node.exit().transition()
			      .duration(duration)
			      .attr("transform", function(d) {
			          return "translate(" + source.y + "," + source.x + ")";
			      })
			      .remove();

			  // On exit reduce the node rects size to 0
			  nodeExit.select('rect')
			    .attr('width', 0)
			    .attr('height', 0);

			  // On exit reduce the opacity of text labels
			  nodeExit.select('text')
			    .style('fill-opacity', 1e-6);

			  var links = treeData.descendants().slice(1);

			  // Update the links
			  var link = g.selectAll('path.link')
			      .data(links, function(d) { return d.id; });

			  // Enter any new links at the parent's previous position
			  var linkEnter = link.enter().insert('path', "g")
			      .attr("class", "link")
			      .attr('d', function(d){
			        var o = {x: source.x0, y: source.y0}
			        // console.log(diagonal(o, o));
			        return diagonal(o, o)
			      });

			  // Update
			  var linkUpdate = linkEnter.merge(link);

			  // Transition back to the parent element position
			  linkUpdate.transition()
			      .duration(duration)
			      .attr('d', function(d){ return diagonal(d, d.parent) });

			  // Remove any exiting links
			  var linkExit = link.exit().transition()
			      .duration(duration)
			      .attr('d', function(d) {
			        var o = {x: source.x, y: source.y}
			        return diagonal(o, o)
			      })
			      .remove();

			  // Store the old positions for transition
			  nodes.forEach(function(d){
			    d.x0 = d.x;
			    d.y0 = d.y;
			  });

			  // Creates a curved path from parent to the child nodes
			  function diagonal(s, d) {
		    path = `M ${s.y} ${s.x}
		            C ${(s.y + d.y) / 2} ${s.x},
		              ${(s.y + d.y) / 2} ${d.x},
		              ${d.y} ${d.x}`
			    return path
			  }

			  // Toggle children on click
			  function click(d) {
			  	console.log(d)
			  	d
			    if (d.children) {
			        d._children = d.children;
			        d.children = null;
			      } else {
			        d.children = d._children;
			        d._children = null;
			      }
			    update(d);
			  }
			}
		});
	}
});