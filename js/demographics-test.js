d3.csv("./data/gu272.csv", function(data) {
	d3.csv("./data/age-height-data.csv", function(ageHeightData) {
		// Data Preprocessing 
		var maleCount = femaleCount = adultFemale = adultMale = childMale = childFemale = 0;
		for (var i = 0; i < data.length; i++) {
			if (data[i].gender == "male") {
				maleCount++;
				if (data[i].age >= 21) {
					adultMale++; 
				} else {
					childMale++;
				}
			}
			else if (data[i].gender == "female") {
				femaleCount++;
				if (data[i].age >= 21) {
					adultFemale++; 
				} else {
					childFemale++;
				}
			}
		}
		var totalCount = adultFemale + adultMale + childMale + childFemale;
		genderData = [{"gender": "Male", "count": maleCount, "percent": Math.round(maleCount/totalCount*100)}, 
			{"gender": "Female", "count": femaleCount-1, "percent": Math.round(femaleCount/totalCount*100)}];
		familyData = [{"member": "Men", "percent":adultMale/totalCount}, 
			{"member": "Women", "percent": adultFemale/totalCount},
			{"member": "Boys", "percent":childMale/totalCount},
			{"member": "Girls", "percent":childFemale/totalCount}];

		var width = $(".graphContainer").width();
		var height = width;	
		var titleSize = "calc(8px + 0.9vh)";
		var axisTickSize = "calc(8px + 0.5vh)";	
		var opacity = 0.8;

		// Pie Chart
		var outerWidth = width * 0.9;
		var donutWidth = outerWidth * 0.2;
		var radius = outerWidth / 2;
		var pieColor = d3.scaleOrdinal(["rgb(31, 119, 180)", "rgb(214, 39, 40)"]);
		var legendRectSize = radius * 0.1;
		var legendSpacing = legendRectSize * 0.2;

		d3.select("#pie")
			.append("text")
			.text("Gender")
			.attr("class", "chart-title");
		var arc = d3.arc()
			.outerRadius(radius - 10)
			.innerRadius(radius - donutWidth);
		var pie = d3.pie()
			.value(function(d) { return d.count;})
			.sort(null);
		var svg = d3.select("#pie")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
		var tooltip = d3.select("#pie")
				.append("div")
				.attr("class", "tooltip");
			tooltip.append("div")
				.attr("class", "gender");
			tooltip.append("div")
				.attr("class", "count");
			tooltip.append("div")
				.attr("class", "percent");
			var g = svg.selectAll(".arc")
		      .data(pie(genderData))
		    	.enter().append("g")
		      .attr("class", "arc");
		 	var path = g.append("path")
		 		.attr("d", arc)
		 		.style("fill", (d,i) => pieColor(i))
		 		.style("opacity", opacity)
		  	.style("stroke", "white")
		  	.style("stroke-width", "5px")
		  	.style("cursor", "pointer");

			path.on("mouseover", function(d) {
				tooltip.select(".gender").html(d.data.gender).style("font-weight", "bold");
				tooltip.select(".count").html(d.data.count + " people");
				tooltip.select(".percent").html(d.data.percent + "%");
				tooltip.style("display", "block")
				tooltip.style("opacity", 1);
			});
			path.on("mousemove", function(d) {
				tooltip.style("top", (d3.event.layerY + 10) + "px")
				.style("left", (d3.event.layerX - 25) + "px");
			});
			path.on("mouseout", function() {
				tooltip.style("display", "none");
				tooltip.style("opacity", 0);
			});
		  var legend = svg.selectAll(".legend")
				.data(genderData)
				.enter()
				.append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) {
					var height = legendRectSize + legendSpacing;
					var offset =  height * genderData.length / 2;
					var horz = -3 * legendRectSize;
					var vert = i * height - offset;
					return "translate(" + horz + "," + vert + ")";
				});
			legend.append("rect")
				.attr("width", legendRectSize)
				.attr("height", legendRectSize)
				.style("fill", (d,i) => pieColor(i))
				.style("stroke", (d,i) => pieColor(i))
			legend.append("text")
				.attr("x", legendRectSize + legendSpacing)
				.attr("y", legendRectSize - legendSpacing)
				.text(d => `${d.gender} - ${d.percent}%`)
				.style("font-size", titleSize);

		// Bar Chart
		var barMargin = {top: height * 0.15, right: width * 0.15, bottom: height * 0.15, left: width * 0.15};;
		var barWidth = width - barMargin.left - barMargin.right;
		var barHeight = height - barMargin.top - barMargin.bottom;
		var barColor = d3.scaleOrdinal(d3.schemeCategory20);
		var x = d3.scaleBand()
		  .range([0, barWidth])
		  .padding(0.1)
		  .domain(familyData.map(function(d) { return d.member; }));
		var y = d3.scaleLinear()
			.range([barHeight, 0])
			.domain([0, d3.max(familyData, function(d) { return d.percent; })]);

		d3.select("#bar")
			.append("text")
			.text("Age")
			.attr("class", "chart-title");
			
		svg = d3.select("#bar")
			.append("svg")
		  .attr("width", barWidth + barMargin.left + barMargin.right)
		  .attr("height", barHeight + barMargin.top + barMargin.bottom)
		  .attr("class", "bar")
		  .append("g")
		  .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

		svg.selectAll(".bar")
			.data(familyData)
		  .enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.member); })
		  .attr("width", x.bandwidth())
		  .attr("y", function(d) { return y(d.percent); })
		  .attr("height", function(d) { return barHeight - y(d.percent); })
		  .attr("fill", (d,i) => barColor(i))
		  .style("opacity", opacity);

		svg.append("g")
		  .attr("transform", "translate(0," + barHeight + ")")
		  .call(d3.axisBottom(x))
		  .style("font-size", titleSize);
		svg.append("g")
		  .call(d3.axisLeft(y)
		    .ticks(20)
		    .tickFormat(function(d) { return Math.round(d * 100)+ "%"; }))
		  .style("font-size", axisTickSize);
    svg.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("x", 0 - barHeight/2)
    	.attr("y", 0 - barMargin.left*0.7)
      .style("text-anchor", "middle")
      .style("font-size", titleSize)
      .text("Proportion");

		var scatterMargin = {top: height * 0.15, right: width * 0.15, bottom: height * 0.15, left: width * 0.15};
		var scatterWidth = width - scatterMargin.left - scatterMargin.right;
		var scatterHeight = height - scatterMargin.top - scatterMargin.bottom;
		var x = d3.scaleLinear().range([0, scatterWidth]);
		var y = d3.scaleLinear().range([scatterHeight, 0]);

		x.domain( d3.extent(ageHeightData, function(d) { return parseInt(d.age); }));
		y.domain( [d3.min(ageHeightData, function(d) { 
		  	var feet = parseInt(d.height.split("-")[0])
		    var inches = parseInt(d.height.split("-")[1])
		  	return feet + (inches / 12); 
		  }), d3.max(ageHeightData, function(d) {
		  	var feet = parseInt(d.height.split("-")[0])
		    var inches = parseInt(d.height.split("-")[1])
		  	return feet + (inches / 12); 
		  })]);

		// Scatter plot 
		d3.select("#scatter")
			.append("text")
			.text("Age v. Height")
			.attr("class", "chart-title");

		svg = d3.select("#scatter")
			.append("svg")
		  .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
		  .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
		  .attr("class", "scatter")
		  .append("g")
		  .attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
 		
 		var scatterTooltip = d3.select("#scatter").append("div").attr("class", "tooltip");
 		scatterTooltip.append("div").attr("class", "name")
		scatterTooltip.append("div").attr("class", "age")
		scatterTooltip.append("div").attr("class", "height")

	  var point = svg.selectAll("dot")
	  	.data(ageHeightData)
	    .enter().append("circle")
      .attr("r", scatterHeight/60)
      .attr("cx", function(d) { 
      	if (d.age != "") {
      		return x(parseInt(d.age)); 
      	}
      })
      .attr("cy", function(d) { 
      	if (d.height != "") {
      	var feet = parseInt(d.height.split("-")[0])
      	var inches = parseInt(d.height.split("-")[1])
      		return y(feet + (inches / 12))
      	}
      })
      .attr("fill", "darkgrey")
      .attr("stroke", "#666666")
      .attr("opacity", opacity)
      .style("cursor", "pointer");

		point.on("mouseover", function(d) {
			scatterTooltip.select(".name").html(d.first_name + " " + d.last_name).style("font-weight", "bold");
			scatterTooltip.select(".age").html(d.age + " years old");
			scatterTooltip.select(".height").html(d.height.split("-")[0] + "'" + d.height.split("-")[1] + "\"");
			scatterTooltip.style("display", "block")
			scatterTooltip.style("opacity", 1);
		});
		point.on("mousemove", function(d) {
			scatterTooltip.style("top", (d3.event.layerY + 10) + "px")
				.style("left", (d3.event.layerX - 25) + "px");
		});
		point.on("mouseout", function() {
			scatterTooltip.style("display", "none");
			scatterTooltip.style("opacity", 0);
		});

    // X Axis
	  svg.append("g")
      .attr("transform", "translate(0," + scatterHeight + ")")
      .call(d3.axisBottom(x))
      .style("font-size", axisTickSize)
    svg.append("text")
    	.attr("transform", "translate(" + scatterWidth/2 + "," + (scatterHeight + scatterMargin.bottom*0.7) + ")")
      .style("font-size", titleSize)
      .text("Age");

    //Y Axis
	  svg.append("g")
	  	.call(d3.axisLeft(y)
	  	.ticks(20)
	  	.tickFormat(function(d) { 
	  		//Map decimal back to feet/inches 
	  		if (d % 1 == 0) {
	  			return d + "'";
	  		} else {
	  			var feet = d - (d % 1).toString();
	  			var inches = Math.round(((Math.round((d % 1) * 10)) * 12 / 10)).toString()
	  			return feet + "'" + inches + "\"";
	  	}}))
		  .style("font-size", axisTickSize);
    svg.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("x", 0 - scatterHeight/2)
    	.attr("y", 0 - scatterMargin.left*0.7)
      .style("text-anchor", "middle")
      .style("font-size", titleSize)
      .text("Height");

  });
});