// https://codepen.io/zakariachowdhury/pen/OWdyjq
var data = d3.csv("data/gu272.csv", function(data) {
	// console.log(data)
	var maleCount = 0,
			femaleCount = 0,
			adultFemale = 0,
			adultMale = 0,
			child = 0;

	for (var i = 0; i < data.length; i++) {
		if (data[i].gender == 'male') {
			maleCount++;
			if (data[i].age >= 21) {
				adultMale++; 
			} else {
				child++;
			}
		}
		else if (data[i].gender == 'female') {
			femaleCount++;
			if (data[i].age >= 21) {
				adultFemale++; 
			} else {
				child++;
			}
		}
	}

	var totalCount = adultFemale + adultMale + child;

	// console.log(maleCount + " " + femaleCount)
	genderData = [{"gender": "Male", "value": maleCount}, {"gender": "Female", "value": femaleCount}];
	famData = [{"member": "Father", "value":adultMale/totalCount}, {"member": "Mother", "value": adultFemale/totalCount},
	{"member": "Child", "value":child/totalCount}];
	// console.log(famData)

	// var width = 200;
	// var height = 200;

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 250 - margin.left - margin.right,
	    height = 255 - margin.top - margin.bottom;

	var thickness = 40;
	var duration = 750;
	var padding = 10;
	var opacity = .8;
	var opacityHover = 1;
	var otherOpacityOnHover = .8;
	var tooltipMargin = 13;

	var radius = Math.min(width-padding, height-padding) / 2;
	// var color = d3.scaleOrdinal(d3.schemeCategory10);
	var color = d3.scaleOrdinal(["rgb(31, 119, 180)", "rgb(214, 39, 40)"]);

	var svg = d3.select("#pie")
	.append('svg')
	.attr('class', 'pie')
	.attr('width', width)
	.attr('height', height);

	var g = svg.append('g')
	.attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

	var arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius);

	var pie = d3.pie()
	.value(function(d) { return d.value; })
	.sort(null);

	var path = g.selectAll('path')
	  .data(pie(genderData))
	  .enter()
	  .append("g")  
	  .append('path')
	  .attr('class', 'pie')
	  .attr('d', arc)
	  .attr('fill', (d,i) => color(i))
	  .style('opacity', opacity)
	  .style('stroke', 'white')
	  .on("mouseover", function(d) {
	      d3.selectAll('path')
	        .style("opacity", otherOpacityOnHover);
	      d3.select(this) 
	        .style("opacity", opacityHover);

	      let g = d3.select("svg")
	        .style("cursor", "pointer")
	        .append("g")
	        .attr("class", "tooltip")
	        .style("opacity", 0);
	 
	      g.append("text")
	        .attr("class", "gender-text")
	        .text(`${d.data.gender} (${d.data.value})`)
	        .attr('text-anchor', 'middle');
	    
	      let text = g.select("text");
	      let bbox = text.node().getBBox();
	      let padding = 2;
	      g.insert("rect", "text")
	        .attr("x", bbox.x - padding)
	        .attr("y", bbox.y - padding)
	        .attr("width", bbox.width + (padding*2))
	        .attr("height", bbox.height + (padding*2))
	        .style("fill", "white")
	        .style("opacity", 0.75);
	    })
	  .on("mousemove", function(d) {
	        let mousePosition = d3.mouse(this);
	        let x = mousePosition[0] + width/2;
	        let y = mousePosition[1] + height/2 - tooltipMargin;
	    
	        let text = d3.select('.tooltip text');
	        let bbox = text.node().getBBox();
	        if(x - bbox.width/2 < 0) {
	          x = bbox.width/2;
	        }
	        else if(width - x - bbox.width/2 < 0) {
	          x = width - bbox.width/2;
	        }
	    
	        if(y - bbox.height/2 < 0) {
	          y = bbox.height + tooltipMargin * 2;
	        }
	        else if(height - y - bbox.height/2 < 0) {
	          y = height - bbox.height/2;
	        }
	    
	        d3.select('.tooltip')
	          .style("opacity", 1)
	          .attr('transform',`translate(${x}, ${y})`);
	    })
	  .on("mouseout", function(d) {   
	      d3.select("svg")
	        .style("cursor", "none")  
	        .select(".tooltip").remove();
	    d3.selectAll('path')
	        .style("opacity", opacity);
	    })
	  .on("touchstart", function(d) {
	      d3.select("svg")
	        .style("cursor", "none");    
	  })
	  .each(function(d, i) { this._current = i; });

		let legend = d3.select("#pie").append('div')
					.attr('class', 'legend');

		let keys = legend.selectAll('.key')
					.data(genderData)
					.enter().append('div')
					.attr('class', 'key')
					.style('display', 'flex')
					.style('align-items', 'center')
					.style('margin-right', '20px');

				keys.append('div')
					.attr('class', 'symbol')
					.style('height', '10px')
					.style('width', '10px')
					.style('margin', '5px 5px')
					.style('background-color', (d, i) => color(i));

				keys.append('div')
					.attr('class', 'name')
					.text(d => `${d.gender} (${d.value})`);

				keys.exit().remove();

// Bar chart

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 225 - margin.left - margin.right,
    height = 225 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "bar")
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain(famData.map(function(d) { return d.member; }));
  y.domain([0, d3.max(famData, function(d) { return d.value; })]);

	// var color = d3.scaleOrdinal(["rgb(31, 119, 180)", "rgb(214, 39, 40)", "#7b6888"]);
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  
  // console.log(color)

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(famData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.member); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", (d,i) => color(i));

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

// Scatterplot

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "scatter")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.age; }));
  y.domain([d3.min(data, function(d) { return d.birthdate; }), d3.max(data, function(d) { return d.birthdate; })]);
      
  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 1)
      .attr("cx", function(d) { return x(d.age); })
      .attr("cy", function(d) { return y(d.birthdate); });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});

