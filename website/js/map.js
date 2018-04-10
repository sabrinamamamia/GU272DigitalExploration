var width = d3.select("#history")._groups[0][0].clientWidth * 0.50;
var height = d3.select("#history")._groups[0][0].clientHeight / 3;

// var width = height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
	 .translate([width * .05, height/3.5])    // translate to center of screen
   .scale([1800]);          // scale things down so see entire US

// Define path generator
var path = d3.geoPath()         // path generator that will convert GeoJSON to SVG paths
	.projection(projection);  // tell path generator to use albersUsa projection

// Load GeoJSON data and merge with states data
d3.json("data/us-se-map.json", function(mapData) {

	console.log(mapData)
		//Width and height of map
		var width = d3.select("#history")._groups[0][0].clientWidth * 0.50;
		var height = d3.select("#history")._groups[0][0].clientHeight / 3;

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
			.attr("class", "state")
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", "#e1e1e1");

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
	console.log(plantationData)
	var svg = d3.select(".map")

	var enterSelection = d3.select(".map")
		.selectAll('g')
		.data(plantationData)
		.enter()
		.append("g")
		.attr("display", "none")
		.attr("id", function(d) {
			return d.name.replace(/[\s\.\']/g, '').toLowerCase()
		});
	
	var x = -20,
	 		y = -20;

	var colors = ["#41b6c4","#2c7fb8","#253494","#7fcdbb","#ffffcc","#c7e9b4"];

	enterSelection
		.append("text")
		.text(function(d) {
			return d.name
		}) 
		.attr("class", "location")
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
			if (i % 2 == 0) {
				return projection([d.lon, d.lat])[0] + 50;
			}
			return projection([d.lon, d.lat])[0] - 50;
		})
		.attr("y", function(d, i) {
			if (i <= 2) {
				return projection([d.lon, d.lat])[1] - 30;
			}
			return projection([d.lon, d.lat])[1] + 30;
		})

	enterSelection
		.append("circle")
		.attr("class", "location")
		.attr("cx", function(d) {
			return projection([d.lon, d.lat])[0]
		})
		.attr("cy", function(d) {
			return projection([d.lon, d.lat])[1];
		})
		.attr("r", function(d) {
			return d.count * 0.08;
		})
		.attr("fill", function(d, i) {
			return colors[i % colors.length];
		})

	var imgWidth = 20,
			imgHeight = 24;

	// enterSelection
	// 	.append("svg:image")
	// 	.attr("class", "location")
	// 	// .attr("class", function(d) {
	// 	// 	if (d.name == "White Marsh" || d.name == "White Marsh" || 
	// 	// 		d.name == "St. Thomas's Manor" || d.name == "Newtown" || 
	// 	// 		d.name == "St. Inigoes") {
	// 	// 		return "plantation"
	// 	// 	}
	// 	// })
	// 	.attr("x", function(d) {
	// 		return projection([d.lon, d.lat])[0] - imgWidth / 2.3;
	// 	})
	// 	.attr("y", function(d) {
	// 		return projection([d.lon, d.lat])[1] - imgHeight;
	// 	})
	// 	.attr('width', imgWidth)
	// 	.attr('height', imgHeight)
	// 	.attr("xlink:href", "images/pin.svg")
	// 	// .attr("display", "none")

});

