var viewportWidth = $(window).width()/2;
var viewportHeight = $(window).height();
var width = viewportWidth;
var height = viewportHeight;
var shuffledPersons;

// D3 Projection
var projection = d3.geoAlbersUsa()
    .translate([-25, height * 0.35])           
    .scale([width*1.35 + height*1.35]);        

// Define path generator
var path = d3.geoPath()         
    .projection(projection);

$(document).ready(function() {
    scaleMap()
    // Load GeoJSON data and merge with states data
    d3.json("./data/us-se-map.json", function(mapData) {
        var viewportWidth = $(window).width()/2;
        var viewportHeight = $(window).height();
        var width = viewportWidth;
        var height = viewportHeight;
        var shuffledPersons;

        // D3 Projection
        projection = d3.geoAlbersUsa()
            .translate([-25, height * 0.35])             
            .scale([width*1.35 + height*1.35]);         

        // Define path generator
        path = d3.geoPath()         
            .projection(projection);

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

    });

    d3.json("./data/plantation-location.json", function(plantationData) {
        d3.json("./data/person-location.json", function(personData){

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
                .attr("stroke", function(d, i) { return "white";})
                .attr("fill", function(d, i) { return colors[d.name];})

            var person = svg.selectAll('g')
                .data(personData)
                .enter()
                .append("g")

            person.append("circle")
                .attr("id", function(d) {return d.pid })
                .attr("class", "person")
                .attr("cx", function(d) { return projection([d.longitude, d.lat])[0]; })
                .attr("cy", function(d) { return projection([d.longitude, d.lat])[1]; })
                .attr("r", 4)
                .attr("fill", function(d, i) { return colors[d.name]; })

            var legend = svg.append("g")
                .attr("class", "map-legend")
                .attr("width", "50px")
                .attr("height", "20px")
                .attr("transform", function(d) {
                    return "translate(" + projection([-77.787300, 32.671992]) + ")";
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
    var l = route.node().getTotalLength();
    point.transition()
        .duration(1500)
        .attrTween("transform", delta(point, route.node()))
        .attr("fill", function(d) {
            if (d.dest == "chathamplantation") {
                return colors["Chatham Plantation"]
            }
            return colors["West Oak Plantation"]
        });
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

function myLoop(i){
    setTimeout(function() {
        $(shuffledPersons[i]).css("color", function() {return colors[$(shuffledPersons[i])[0].__data__.name]})
        if ($(shuffledPersons[i])[0].__data__.name_id != undefined) {
            var plantation = $(shuffledPersons[i])[0].__data__.name_id
            var dest = $(shuffledPersons[i])[0].__data__.dest
            var id = $(shuffledPersons[i])[0].__data__.pid
            if (dest != "") {
                var route = plantation + "2" + dest
                transition(d3.select("#" + id), d3.select("#" + route))
            }
            i++;
            myLoop(i)  
        }
    }, 100);
}

function animateMap() {
    var persons = $(".person")
    shuffledPersons = shuffleElements(persons)
    var i = 0
    myLoop(i)
}

function scaleMap() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    console.log(w)
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    console.log(h)
}
