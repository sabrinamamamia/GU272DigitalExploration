var width = d3.select("#history")._groups[0][0].clientWidth * 0.5;
var height = d3.select("#history")._groups[0][0].clientHeight / 4;

// var width = height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
	 .translate([-50, height/3.5])    // translate to center of screen
   .scale([2000]);          // scale things down so see entire US

// Define path generator
var path = d3.geoPath()         // path generator that will convert GeoJSON to SVG paths
	.projection(projection);  // tell path generator to use albersUsa projection

// Load GeoJSON data and merge with states data
d3.json("data/us-se-map.json", function(mapData) {
		//Width and height of map
		var width = d3.select("#history")._groups[0][0].clientWidth * 0.5;
		var height = d3.select("#history")._groups[0][0].clientHeight / 4;

		// Bind the data to the SVG and create one path per GeoJSON feature
		var svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "map");

		svg.selectAll("path")
			.data(mapData.features)
			.enter()
			.append("path")
			.attr("d", path)
			.attr("id", function(d) {
				return d.properties.name.replace(/\s/g, '').toLowerCase()
			})
			.attr("class", function(d) {
				if (d.properties.class == "Route") { 
					return "route"
				} 
				return "state"
			})
			.style("stroke", function(d) {
				if (d.properties.class != "Route") { 
					return "#fff"
				}
				return "none"
			})
			.style("stroke-width", "1")
			.style("fill", function(d) {
				if (d.properties.class != "Route") { 
					return "#e1e1e1"
				}
				return "none"
			});

		// svg.selectAll("text")
		// 	.data(mapData.features)
		// 	.enter()
		// 	.append("text")
		// 	.text(function(d) { 
		// 		if (d.properties.name == "Transport") { 
		// 			console.log(d.geometry.coordinates)
		// 			return d.geometry.coordinates;
		// 		}
		// 	})
		// 	.attr("transform", function(d,i) { 
		// 		if (d.properties.name == "Transport") { 
		// 			console.log(d)

		// 			return "translate(" + projection(d.geometry.coordinates[0])[0] +","+ projection(d.geometry.coordinates[0])[1] + ")"
		// 		}
		// 	});

		// svg.selectAll("circle")
		// 	.data(plantationData)
		// 	.enter()
		// 	.append("circle")
		// 	.attr("cx", function(d) {
		// 		return projection([d.lon, d.lat])[0];
		// 	})
		// 	.attr("cy", function(d) {
		// 		return projection([d.lon, d.lat])[1];
		// 	})`
	// });
});

d3.json("data/plantation-location.json", function(plantationData) {
	d3.json("data/person-location.json", function(personData){
		console.log(plantationData)

		// var colors = {"#41b6c4","#2c7fb8","#253494","#7fcdbb","#ffffcc","#c7e9b4"];
		var colors = {"Georgetown University": "#41b6c4", "White Marsh": "#2c7fb8", "St. Thomas's Manor": "#253494", "Newtown": "#7fcdbb", "St. Inigoes": "#ffffcc","West Oak Plantation": "#c7e9b4", "Chatham Plantation": "red"}
		var svg = d3.select(".map")

		var locations = svg.selectAll('g')
			.data(plantationData)
			.enter()
			.append("g")

		locations.append("circle")
			.attr("id", function(d) { return d.name_id })
			.attr("class", "location")
			.attr("cx", function(d) {return projection([d.lon, d.lat])[0]})
			.attr("cy", function(d) {return projection([d.lon, d.lat])[1];})
			.attr("r", 5)
			.attr("stroke", function(d, i) {
				return "white";})
			.attr("fill", function(d, i) {
				return colors[d.name];})

		var person = svg.selectAll('g')
			.data(personData)
			.enter()
			.append("g")

		person.append("circle")
			.attr("id", function(d) {return d.pid})
			.attr("class", "person")
			.attr("cx", function(d) {
				return projection([d.longitude, d.lat])[0]
			})
			.attr("cy", function(d) {
				return projection([d.longitude, d.lat])[1];
			})
			.attr("r", 4)
			// .attr("stroke", function(d, i) {
			// 	return "white";
			// })
			.attr("fill", function(d, i) {
				return colors[d.name];
			})

		var legend = svg.append("g")
			.attr("class", "map-legend")
			.attr("width", "50px")
			.attr("height", "20px")
			.attr("transform", function(d) {
				var map = d3.select('.map').node();
				var mapHeight = map.getBoundingClientRect().height
				return "translate("+ width * 0.425 + ", "+ mapHeight * 0.55 +")"
		});

		legend.selectAll("text")
			.data(plantationData)
			.enter()
			.append("text")
			.attr("class", "map-legend")
			.text(function(d) { return d.name; })
			.attr("transform", function(d,i) { 
				return "translate(0,"+ i * 20 + ")"
			})

		legend.selectAll("rect")
			.data(plantationData)
			.enter()
			.append("rect")
			.attr("class", "map-legend")
			.attr("width", "10px")
			.attr("height", "10px")
			.attr("fill", function(d, i) {
				return colors[d.name];
			})
			.attr("transform", function(d,i) { 
				y = i * 20 - 9
				return "translate(-15,"+ y + ")"
			});
	});
});

var colors = {"Georgetown University": "#41b6c4", "White Marsh": "#2c7fb8", "St. Thomas's Manor": "#253494", "Newtown": "#7fcdbb", "St. Inigoes": "#ffffcc","West Oak Plantation": "#c7e9b4", "Chatham Plantation": "red"}

function shuffleElements(array) {
	for (var i=0; i < array.length; i++) {
		var randomIndex = Math.floor(Math.random() * array.length)
		var temp = array[i]
		array[i] = array[randomIndex]
		array[randomIndex] = temp
	}
	return array
}

function transition(point, route) {
	// console.log(point)
	// console.log(route)
	// setTimeout(function() {
	  var l = route.node().getTotalLength();
	  point.transition()
	       .duration(2000)
	       .attrTween("transform", delta(point, route.node()))
	       .attr("fill", function(d) {
	       	if (d.dest == "chathamplantation") {
	       		return colors["Chatham Plantation"]
	       	}
	       	return colors["West Oak Plantation"]
	       });
		// transition(point, route)
	// }, 50);
}
  
function delta(point, path) {
  var l = path.getTotalLength();
  return function(i) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      var x = p.x - parseFloat(point.attr("cx"))
      var y = p.y  - parseFloat(point.attr("cy"))
      return "translate(" + x + "," + y + ")";
    }
  }
}

function myLoop(){
	setTimeout(function() {
		$(shuffledPersons[i]).css("color", function() {return colors[$(shuffledPersons[i])[0].__data__.name]})
		plantation = $(shuffledPersons[i])[0].__data__.name_id
		dest = $(shuffledPersons[i])[0].__data__.dest
		id = $(shuffledPersons[i])[0].__data__.pid
		if (dest != "") { 
			route = plantation + "2" + dest
			console.log(route)
			transition(d3.select("#" + id), d3.select("#" + route))
		}
		myLoop()
		i++
	}, 100);
}

function animateMap() {
	var persons = $(".person")
	shuffledPersons = shuffleElements(persons)
	var i = 0
	myLoop()

}
