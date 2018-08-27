// var mapData = {mapSVG: null, plantationData: null, plantationSelection: null, projection: null};
var mapData = {mapSourcePlantation: null, mapDestinationPlantation: null};
function mapMain() {
    //calculate initial widths and heights of div
    var mapSourcePlantation = "";
    var mapDestinationPlantation = "";
    var d3JsonCalled = false;

    var mapSVG;
    var plantationData;
    var plantationSelection = null;

    var width = d3.select("#pathwaysHistory")._groups[0][0].clientWidth * 0.50;
    var height = d3.select("#pathwaysHistory")._groups[0][0].clientHeight / 3;

    // D3 Projection
    var projection = d3.geoAlbersUsa()
        .translate([width * .05, height/3.5])    // translate to center of screen
        .scale([1800]);          // scale things down so see entire US
    mapData.projection = projection;

    // Define path generator
    var path = d3.geoPath()         // path generator that will convert GeoJSON to SVG paths
        .projection(projection);  // tell path generator to use albersUsa projection

    var callD3JSON = function () {
        // Load GeoJSON data and merge with states data
        d3.json("data/us-se-map.json", function(mapData) {
            d3JsonCalled = true;
            //Width and height of map
            var width = d3.select("#pathwaysHistory")._groups[0][0].clientWidth;
            var height = d3.select("#pathwaysHistory")._groups[0][0].clientHeight;
            // Bind the data to the SVG and create one path per GeoJSON feature
            var svg = d3.select("#pathwaysMap")
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
                .style("stroke", "#fff")
                .style("stroke-width", "1")
                .style("fill", "#b6babd");
            continueSetup();
        });
    };
    callD3JSON();

    var continueSetup = function() {
        console.log("continue");
        d3.json("data/plantation-location.json", function(data) { //load map data
            plantationData = data;
            plantationData = plantationData.map(function(d) { d.originalName = d.name; d.name = cleanName(d.name); return d}); //get plantation names
            mapSVG = d3.select(".map");
            plantationSelection = d3.select(".map") //hide anything that is not a plantation (i.e. Georgetown)
                .selectAll('g')
                .data(plantationData)
                .enter()
                .append("g")
                .attr("class", function(d) {
                    return "not_plantation";
                })
                // .attr("display", "none")
                .attr("id", function(d) {
                    return d.name.replace(/[\s\.\']/g, '').toLowerCase()
                });

            var x = -20,
                y = -20;

            var colors = ["#FF8000","#0077C5","#FFDC12","#008380","#D52B1E","#53B447"]; //colors for plantations

            plantationSelection //create plantations
                .append("text")
                .text(function(d) {
                    return d.originalName;
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

            var imgWidth = 20,
                imgHeight = 24;
            plantationSelection
                .append("circle")
                .attr("class", "location plantation-center")
                .attr("cx", function(d) {
                    return projection([d.lon, d.lat])[0]
                })
                .attr("cy", function(d) {
                    return projection([d.lon, d.lat])[1];
                })
                .attr("r", 5)
                .attr("stroke", function(d, i) {
                    return "white";})
                .attr("fill", function(d, i) {
                    return colors[i % colors.length];
                })
                .append("svg:image")
                .attr("class", function(d) {
                    if (d.name !== "GeorgetownUniversity") {
                        return "plantation";
                    }
                })
                .attr("x", function(d) {
                    return projection([d.lon, d.lat])[0] - imgWidth / 2.3;
                })
                .attr("y", function(d) {
                    return projection([d.lon, d.lat])[1] - imgHeight;
                })
                .attr('width', imgWidth)
                .attr('height', imgHeight)
                .attr("xlink:href", "images/pin.svg");

            mapData.mapSVG = mapSVG;
            mapData.plantationData = plantationData;
            mapData.plantationSelection = plantationSelection;

            mapData.updateMap();
        });
    }

    mapData.updateMap = function() {

        if (!d3JsonCalled) {
            console.log("d3false");
            callD3JSON();
        }
        else if (mapData.mapSourcePlantation == "" || mapData.mapDestinationPlantation == "") {
            return;
        }
        else {
            // console.log("d3Finished");
            var colors = ["#FF8000","#0077C5","#FFDC12","#008380","#D52B1E","#53B447"]; //colors for map
            mapSourcePlantation = mapData.mapSourcePlantation;
            mapDestinationPlantation = mapData.mapDestinationPlantation;

            mapSVG.selectAll("#migrationPath").remove(); //remove old path between source and destination
            mapSVG.selectAll("#migrationPathPortions").remove(); //remove multiple pieces used to construct path between source and destination

            if (mapDestinationPlantation != null) {
                d3.select("#mapOtherLabel").classed("hidden-other-label", true); //hide warning messages
                d3.select('#noMapData').classed("hidden-other-label", true);

                var destination = plantationData.find(function (d) {
                    if (mapDestinationPlantation === "HenryJohnson") { //Adjust names from buyers to plantation names
                        mapDestinationPlantation = "ChathamPlantation";
                    }
                    else if (mapDestinationPlantation === "JesseBatey") {
                        mapDestinationPlantation = "WestOakPlantation";
                    }
                    if (d.name === mapDestinationPlantation) {
                        return d;
                    }
                });
                var source = plantationData.find(function (d) { //find plantation with correct name
                    if (d.name === mapSourcePlantation) {
                        return d;
                    }
                });
                var destinationIndex = plantationData.indexOf(destination);
                var sourceIndex = plantationData.indexOf(source);

                plantationSelection.attr("class", function(d) {
                    if (d.name !== "GeorgetownUniversity" && d.name === mapDestinationPlantation || d.name === mapSourcePlantation) { //exclude Georgetown
                        return "plantation";
                    }
                    else {
                        return "not_plantation";
                    }
                });
                var lineGenerator = d3.line() //start line drawing between two points
                    .curve(d3.curveCardinal);

                // if (mapSourcePlantation != null && mapDestinationPlantation != null) {
                var points = mapData.getCoordinatesForPath(mapSourcePlantation, mapDestinationPlantation); //get coordinates to draw points thorugh
                points = points.map(function (p) {
                    return projection(p)
                });        
                
                //
                // Draw Gradient line
                //
                var pathData = lineGenerator(points);
                // }



                

                //Gradient line functions
                // Compute stroke outline for segment p12.
                function lineJoin(p0, p1, p2, p3, width) {
                    var u12 = perp(p1, p2),
                        r = width / 2,
                        a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
                        b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
                        c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
                        d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];
                    if (p0) { // clip ad and dc using average of u01 and u12
                        var u01 = perp(p0, p1), e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
                        a = lineIntersect(p1, e, a, b);
                        d = lineIntersect(p1, e, d, c);
                    }
                    if (p3) { // clip ab and dc using average of u12 and u23
                        var u23 = perp(p2, p3), e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
                        b = lineIntersect(p2, e, a, b);
                        c = lineIntersect(p2, e, d, c);
                    }
                    return "M" + a + "L" + b + " " + c + " " + d + "Z";
                }
                // Compute intersection of two infinite lines ab and cd.
                function lineIntersect(a, b, c, d) {
                    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3,
                        y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
                        ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
                    return [x1 + ua * x21, y1 + ua * y21];
                }
                // Compute unit vector perpendicular to p01.
                function perp(p0, p1) {
                    var u01x = p0[1] - p1[1], u01y = p1[0] - p0[0],
                        u01d = Math.sqrt(u01x * u01x + u01y * u01y);
                    return [u01x / u01d, u01y / u01d];
                }
                // Sample the SVG path uniformly with the specified precision.
                function samples(path, precision) {
                    var n = path.getTotalLength(), t = [0], i = 0, dt = precision;
                    while ((i += dt) < n) t.push(i);
                    t.push(n);
                    return t.map(function(t) {
                        var p = path.getPointAtLength(t), a = [p.x, p.y];
                        a.t = t / n;
                        return a;
                    });
                }
                // Compute quads of adjacent points [p0, p1, p2, p3].
                function quads(points) {
                    return d3.range(points.length - 1).map(function(i) {
                        var a = [points[i - 1], points[i], points[i + 1], points[i + 2]];
                        a.t = (points[i].t + points[i + 1].t) / 2;
                        return a;
                    });
                }
                function gradientColor(d, color1, color2) {
                    return d3.interpolate(color1, color2)(d);
                }

                //Begin drawing line
                mapSVG.append('path').attr("id", "migrationPath").style("fill", "none").style("stroke-width", "2")
                    .attr('d', pathData);

                var path = mapSVG.select("#migrationPath").remove();

                if (path && path.node()) {
                    //draw gradient through a bunch of small lines that are connected
                    mapSVG.selectAll("#migrationPathPortions").data(quads(samples(path.node(), 8)))

                        .enter().append("svg:path").attr("id", "migrationPathPortions")
                        .style("fill", function(d) { return gradientColor(d.t, colors[sourceIndex % colors.length], colors[destinationIndex % colors.length]); })
                        .style("stroke", function(d) { return gradientColor(d.t, colors[sourceIndex % colors.length], colors[destinationIndex % colors.length]); })
                        .attr("d", function(d) { return lineJoin(d[0], d[1], d[2], d[3], 2); });
                }
                //bring plntation to front
                plantationSelection.bringElementAsTopLayer();
            }
            else { //desintation and source not both given
                if (mapSourcePlantation) { //draw source if has one
                    plantationSelection.attr("class", function(d) {
                        if (d.name !== "GeorgetownUniversity" && d.name === mapSourcePlantation) {
                            return "plantation";
                        }
                        else {
                            return "not_plantation";
                        }
                    });
                    d3.select("#mapOtherLabel").classed("hidden-other-label", false);
                    d3.select('#noMapData').classed("hidden-other-label", true);
                }
                else { //show warning messages for no source or destination
                    d3.select("#mapOtherLabel").classed("hidden-other-label", true);
                    plantationSelection.attr("class", function(d) {
                        return "not_plantation";
                    });
                    d3.select('#noMapData').classed("hidden-other-label", false);
                }
            }
        }
    };
}
d3.selection.prototype.bringElementAsTopLayer = function() { //make sure something is at front of div
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

mapData.getCoordinatesForPath = function(source, destination) { //coordinates to draw path through based on source and destination
    if (source === "WhiteMarsh" && destination === "WestOakPlantation") {
        return [[-76.79814,38.98305],
            [-76.42385,38.15042],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.51955, 30.4913]]
    }
    if (source === "WhiteMarsh" && destination === "ChathamPlantation") {
        return [[-76.79814,38.98305],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.05949, 30.18697]]
    }
    if (source === "StThomassManor" && destination === "WestOakPlantation") {
        return [[-77.0237,38.46552],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.51955, 30.4913]]
    }
    if (source === "StThomassManor" && destination === "ChathamPlantation") {
        return     [[-77.0237,38.46552],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.05949, 30.18697]]
    }
    if (source === "Newtown" && destination === "WestOakPlantation") {
        return [[-76.69998,38.25569],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.51955, 30.4913]]
    }
    if (source === "Newtown" && destination === "ChathamPlantation") {
        return [[-76.69998,38.25569],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.05949, 30.18697]]
    }
    if (source === "StInigoes" && destination === "WestOakPlantation") {
        return [[-76.42385,38.15042],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.51955, 30.4913]]
    }
    if (source === "StInigoes" && destination === "ChathamPlantation") {
        return [[-76.42385,38.15042],
            [-76.11328, 37.68382],
            [-75.94848, 37.0464],
            [-75.66284, 36.52729],
            [-74.68505, 35.31736],
            [-75.56396, 34.16181],
            [-77.14599, 33.21111],
            [-78.88183, 31.69078],
            [-79.67285, 30.37287],
            [-79.10156, 27.95559],
            [-79.23339, 25.40358],
            [-81.0791, 24.28702],
            [-83.18847, 26.11598],
            [-84.59472, 28.61345],
            [-87.62695, 29.45873],
            [-90.08789, 28.38173],
            [-91.58203, 29.19053],
            [-91.05949, 30.18697]]
    }
};
mapMain();