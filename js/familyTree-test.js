var div = d3.select("body").append("div")
    .attr("id","tree-tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

var i = 0,							//node id increment factor
    duration = 700;			        //duration of transition

//Load data
var data = d3.json("./data/filtered-gu272-data.json", function(error, json) {
    if (error) return console.error(error);

    //Bind json objects to g elements
    var svg = d3.selectAll(".treeContainer")
        .data(json)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", function(d) {return "svg" + d.id})
        .append("g")
        // Tree id used in update() to bind data to correct g element
        .attr("id", function(d) { return "t" + d.id; })
        .attr("class", "tree")
        // Transform along x axis based on name length
        .attr("transform", function(d) {
            var x = 10 + (d.first_name.length * 12);
            if (d.first_name == "Ned" || d.first_name == "Anny") {
                x += 7
            }
            return "translate(" + x + ", 0)";
        });

    //Call chart function for every JSON objecct
    var trees = d3.selectAll(".tree");
        trees.call(chart);

    //Generate tree
    function chart(selection) {
        selection.each(function(data) {

            var root = d3.hierarchy(data);
            var height = $("#svg" + data.id).height();
            var width = $("#svg" + data.id).width(); 

            root.x0 = height;
            root.y0 = 0;

            var tree = d3.tree().size([height, width]);
            update(root);

            function update(source) {
                var treeData = tree(root);
                var g = d3.select("#t" + root.data.id);

                // Compute the new tree layout
                var nodes = treeData.descendants();

                //Normalize for fixed depth
                nodes.forEach(function(d){
                    d.y = d.depth * 100;
                });

                // Declare node element and id
                var node = g.selectAll("g.person-node")
                    .data(nodes, function(d) {
                        return d.id || (d.id = ++i)})
                    .attr("id", function(d) {
                        return "n" + d.data.id;
                    });

                //Enter new nodes at parent"s previous position
                var nodeEnter = node.enter().append("g")
                    .attr("class", "person-node")
                    .attr("transform", function(d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on("click", function(d) {
                        mouseout();
                        click(d);
                    });

                //Add circles for the nodes
                nodeEnter.append("circle")
                    .attr("class", "person-node")
                    .attr("r", .5);

                // Add labels for the nodes
                nodeEnter.append("text")
                    .attr("class", "name")
                    .attr("dy", ".35em")
                    .attr("x", function(d) {
                        return d.children || d._children ? -13 : 13; })
                    .attr("text-anchor", function(d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function(d) { return d.data.first_name;})
                    .style("font-size", function(d) { if (d.data.first_name == "Anderson") {
                        return "calc(7px + 0.45vh)"
                    }})
                    .style("letter-spacing", function(d) { if (d.data.first_name == "Anderson") {
                        return "-0.3"
                    }})
                    .on("mouseover", function(d) { mouseover(d, g) })
                    .on("mouseout", mouseout);

                var nodeUpdate = nodeEnter.merge(node);

                // Transition to the proper position for the node
                nodeUpdate.transition()
                    .duration(duration)
                    .attr("transform", function(d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                // Update the node attributes and style
                nodeUpdate.select("circle.person-node")
                    .attr("r", 8)
                    .attr("cursor", "pointer")
                    .on('mouseover', function(d) { mouseover(d, g) })
                    .on('mouseout', mouseout);

                // Remove any exiting nodes
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .remove();

                // On exit reduce the node circles size to 0
                nodeExit.select('circle')
                    .attr('r', 1e-6);

                // On exit reduce the opacity of text labels
                nodeExit.select('text')
                    .style('fill-opacity', 1e-6);

                var links = treeData.descendants().slice(1);

                // Update the links
                var link = g.selectAll('path.family-link')
                    .data(links, function(d) { return d.id; });

                // Enter any new links at the parent's previous position
                var linkEnter = link.enter().insert('path', "g")
                    .attr("class", "family-link")
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
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }

                function mouseover(d, g) {
                    var tooltip = d3.select('#tree-tooltip');

                    tooltip.transition()
                        .duration(300)
                        .style('opacity', 0.8);
                    tooltip
                        .html('<b>' + (d.data.full_name) + '</b><br>' +
                            'Birthdate: ' + (d.data.birthdate) + '<br>' +
                            'Age: ' + (d.data.age) + '<br>')
                    tooltip.style('width', function() {
                        var maxLength = Math.max(Math.max(4 + d.data.age.length,
                            11 + d.data.birthdate.length), d.data.full_name.length);
                        return 8 * maxLength + 'px'})
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY) + 'px')
                        .attr("transform", "translate(" + d.y + "," + d.x + ")");
                }

                function mouseout() {
                    var tooltip = d3.select('#tree-tooltip')
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                }
            }
        });
    }
});