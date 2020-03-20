
// DEFINE VARIABLES
  // Define size of map group
  // Full world map is 2:1 ratio
  // Using 12:5 because we will crop top and bottom of map
  w = 3000;
  h = 1250;
  // variables for catching min and max zoom factors
  var minZoom;
  var maxZoom;

  // DEFINE FUNCTIONS/OBJECTS
  // Define map projection
  var projection = d3
	.geoEquirectangular()
	.center([30, 15]) // set centre to further North as we are cropping more off bottom of map
	.scale([w / (0.9 * Math.PI)]) // scale to fit group width
	.translate([w / 3.8, h / 0.9]) // ensure centred in group
  ;

  // Define map path
  var pathM = d3
	.geoPath()
	.projection(projection)
  ;

  // Create function to apply zoom to countriesGroup
  function zoomed() {
	tM = d3
	  .event
	  .transform
	;
	countriesGroup
	  .attr("transform","translate(" + [tM.x, tM.y] + ")scale(" + tM.k + ")")
	;
  }

  // Define map zoom behaviour
  var zoom = d3
	.zoom()
	.on("zoom", zoomed)
  ;

  function getTextBox(selection) {
	selection
	  .each(function(dM) {
		dM.bbox = this
		  .getBBox();
		})
	;
  }

  // Function that calculates zoom/pan limits and sets zoom to default value 
  function initiateZoom() {
	// Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
	minZoom = Math.max($("#map-holder").width() / w, $("#map-holder").height() / h);
	// set max zoom to a suitable factor of this value
	maxZoom = 20 * minZoom;
	// set extent of zoom to chosen values
	// set translate extent so that panning can't cause map to move out of viewport
	zoom
	  .scaleExtent([minZoom, maxZoom])
	  .translateExtent([[0, 0], [w, h]])
	;
	// define X and Y offset for centre of map to be shown in centre of holder
	midX = ($("#map-holder").width() - minZoom * w) / 2;
	midY = ($("#map-holder").height() - minZoom * h) / 2;
	// change zoom transform to min zoom and centre offsets
	svgMap.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
  }

  // zoom to show a bounding box, with optional additional padding as percentage of box size
  function boxZoom(box, centroid, paddingPerc) {
	minXY = box[0];
	maxXY = box[1];
	// find size of map area defined
	zoomWidth = Math.abs(minXY[0] - maxXY[0]);
	zoomHeight = Math.abs(minXY[1] - maxXY[1]);
	// find midpoint of map area defined
	zoomMidX = centroid[0];
	zoomMidY = centroid[1];
	// increase map area to include padding
	zoomWidth = zoomWidth * (1 + paddingPerc / 100);
	zoomHeight = zoomHeight * (1 + paddingPerc / 100);
	// find scale required for area to fill svg
	maxXscale = $("svg").width() / zoomWidth;
	maxYscale = $("svg").height() / zoomHeight;
	zoomScale = Math.min(maxXscale, maxYscale);
	// handle some edge cases
	// limit to max zoom (handles tiny countries)
	zoomScale = Math.min(zoomScale, maxZoom);
	// limit to min zoom (handles large countries and countries that span the date line)
	zoomScale = Math.max(zoomScale, minZoom);
	// Find screen pixel equivalent once scaled
	offsetX = zoomScale * zoomMidX;
	offsetY = zoomScale * zoomMidY;
	// Find offset to centre, making sure no gap at left or top of holder
	dleft = Math.min(0, $("svg").width() / 2 - offsetX);
	dtop = Math.min(0, $("svg").height() / 2 - offsetY);
	// Make sure no gap at bottom or right of holder
	dleft = Math.max($("svg").width() - w * zoomScale, dleft);
	dtop = Math.max($("svg").height() - h * zoomScale, dtop);
	// set zoom
	svgMap
	  .transition()
	  .duration(500)
	  .call(
		zoom.transform,
		d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
	  );
  }
  
  





// on window resize
$(window).resize(function() {
	// Resize SVG
	svgMap
		.attr("width", $("#map-holder").width())
		.attr("height", $("#map-holder").height())
	;
	initiateZoom();
});

// create an SVG
var svgMap = d3
	.select("#map-holder")
	.append("svg")
	// set to the same size as the "map-holder" div
	.attr("width", $("#map-holder").width())
	.attr("height", $("#map-holder").height())
	// add zoom functionality
	.call(zoom)
;

var data;

manager.addListener('dataReady', function (e) {
  // get map data
  d3.json(
	"https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json",
	function(json) {
		
		data=map_getData();
		//Bind data and create one path per GeoJSON feature
		countriesGroup = svgMap.append("g").attr("id", "map");
		// add a background rectangle
		countriesGroup
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", w)
			.attr("height", h);

		// draw a path for each feature/country
		countriesM = countriesGroup
			.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", pathM)
			.attr("id", function(dM, i) {
			return "country" + dM.properties.iso_a3;
			})
			.attr("class", "country")
	//      .attr("stroke-width", 10)
	//      .attr("stroke", "#ff0000")
			// add a mouseover action to show name label for feature/country
			.on("mouseover", function(dM, i) {
				if (manager.compareMode){
					if (manager.place == undefined){
						place1Div.innerHTML = dM.properties.name;
					}
					else{
						if (dM.properties.name != manager.place)
							place2Div.innerHTML = dM.properties.name;
						else
							place2Div.innerHTML = "";

					}
				}
				else{
					place1Div.innerHTML = dM.properties.name;
					place2Div.innerHTML = "";
				}
				d3.select("#countryLabel" + dM.properties.iso_a3).style("display", "block");
			})
			.on("mouseout", function(dM, i) {
				if (manager.compareMode){
					if (manager.place == undefined){
						place1Div.innerHTML = "";
					}
					else if (manager.secondPlace == undefined){
						place1Div.innerHTML = manager.place;
					}
					else{
						place2Div.innerHTML = manager.secondPlace;
					}
				}
				else{
					if (manager.place == undefined){
						place1Div.innerHTML = "";
						place2Div.innerHTML = "";
					}
					else{
						place1Div.innerHTML = manager.place;
						place2Div.innerHTML = "";
					}
				}
				d3.select("#countryLabel" + dM.properties.iso_a3).style("display", "none");
			})
			// add an onclick action to zoom into clicked country
			.on("click", function(dM, i) {
				//	questo è l onclick buono
				
				if (manager.parallelFiltering){
					manager._updateDataFromYear();
					updatePoint2();
				}
				if (dM.properties.name != manager.place && dM.properties.name != manager.secondPlace){
					var selectedYear = yearSelector.value.split("-")[0];
				

					//
					if (!manager.compareMode) d3.selectAll(".country").classed("country-on", false);
					else if (manager.secondPlace != undefined) {
						d3.selectAll(".country").classed("country-on", function(d){
							if(d.properties.name == manager.place) return true;
							return false;
						});
					}
	
					manager.triggerPlaceFilterEvent(dM.properties.name, selectedYear);
	
					d3.select(this).classed("country-on", true);
					if(!manager.compareMode)boxZoom(pathM.bounds(dM), pathM.centroid(dM), 20);
					else{
						initiateZoom();
					}
					d3.selectAll("circle")
					.style("fill", function(d){
						if (d.place == manager.place) {return chooseColorByMag(d.mag, 1);}
						else if (d.place == manager.secondPlace) return chooseColorByMag(d.mag, 2);
						else return chooseColorByMag(d.mag, 0);
					});
	
					var x = document.getElementById("scatterPlot");		    
					var w = document.getElementById("barChart");    
					var y = document.getElementById("linePlot");
					var z = document.getElementById("radarChart");
					var k = document.getElementById("boxPlotMag");
					var ri = document.getElementById("boxPlotDepth");
	
					x.style.display="none";
					w.style.display="none";
					y.style.display="block";
					z.style.display="block";
					k.style.display="block";
					ri.style.display="block";
				}
				else{
					var selectedYear = yearSelector.value.split("-")[0];
					var x = document.getElementById("scatterPlot");		    
					var w = document.getElementById("barChart");		    
					var y = document.getElementById("linePlot");
					var z = document.getElementById("radarChart");
					var k = document.getElementById("boxPlotMag");
					var r = document.getElementById("boxPlotDepth");
					if(dM.properties.name == manager.place && manager.secondPlace != undefined){
						manager.place = manager.secondPlace;
						place1Div.innerHTML = manager.place;
						place2Div.innerHTML = "";
						manager.secondPlace = undefined;
						d3.selectAll(".country").classed("country-on", function(d){
							if(d.properties.name == manager.place) return true;
							return false;
						});
						d3.selectAll("circle")
						.style("fill", function(d){
							if (d.place == manager.place) {return chooseColorByMag(d.mag, 1);}
							else return chooseColorByMag(d.mag, 0);
						});
						var nameCountry = manager.place
						manager.place = undefined;
						place1Div.innerHTML = "";
						manager.triggerPlaceFilterEvent(nameCountry, selectedYear);
					}
					else if(dM.properties.name == manager.place && manager.secondPlace == undefined){
						manager.place = undefined;
						place1Div.innerHTML = "";
						d3.select(this).classed("country-on", false);
						manager.triggerYearFilterEvent(selectedYear);
						x.style.display="block";
						w.style.display="block";
						y.style.display="none";
						z.style.display="none";
						k.style.display="none";
						r.style.display="none";
						updatePoint();
						updatePoint2();
					}
					else if (dM.properties.name == manager.secondPlace){
						manager.secondPlace = undefined;
						place2Div.innerHTML = "";
						d3.selectAll(".country").classed("country-on", function(d){
							if(d.properties.name == manager.place) return true;
							return false;
						});
						d3.selectAll("circle")
						.style("fill", function(d){
							if (d.place == manager.place) {return chooseColorByMag(d.mag, 1);}
							else return chooseColorByMag(d.mag, 0);
						});
						var nameCountry = manager.place
						manager.place = undefined;
						manager.triggerPlaceFilterEvent(nameCountry, selectedYear);
					}
				}
						
				
			});
		// Add a label group to each feature/country. This will contain the country name and a background rectangle
		// Use CSS to have class "countryLabel" initially hidden
		
		
		circle=countriesGroup
			.selectAll(".circleMap")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","circleMap")
			.attr("cx", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[0]; })
			.attr("cy", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[1]; })
			.attr("r", 7)
			.style("fill", function(d){
				return chooseColorByMag(d.mag,0)
			})
			.style("stroke", "#000")
			
		
		countryLabels = countriesGroup
			.selectAll("g")
			.data(json.features)
			.enter()
			.append("g")
			.attr("class", "countryLabel")
			.attr("id", function(dM) {
			return "countryLabel" + dM.properties.iso_a3;
			})
			.attr("transform", function(dM) {
			return (
				"translate(" + pathM.centroid(dM)[0] + "," + pathM.centroid(dM)[1] + ")"
			);
			})
			// add mouseover functionality to the label
			.on("mouseover", function(dM, i) {
				if (manager.compareMode){
					if (manager.place == undefined){
						place1Div.innerHTML = dM.properties.name;
					}
					else{
						place2Div.innerHTML = dM.properties.name;
					}
				}
				else{
					place1Div.innerHTML = dM.properties.name;
				}
				d3.select(this).style("display", "block");
			})
			.on("mouseout", function(dM, i) {
				if (manager.compareMode){
					if (manager.place == undefined){
						place1Div.innerHTML = "";
					}
					else if (manager.secondPlace == undefined){
						place1Div.innerHTML = manager.place;
					}
					else{
						place2Div.innerHTML = manager.secondPlace;
					}
				}
				else{
					if (manager.place == undefined){
						place1Div.innerHTML = "";
					}
					else{
						place1Div.innerHTML = manager.place;
					}
				}
				d3.select(this).style("display", "none");
		})
			// add an onlcick action to zoom into clicked country
			.on("click", function(dM, i) {
				var selectedYear = yearSelector.value.split("-")[0];
				var x = document.getElementById("scatterPlot");		    
				var w = document.getElementById("barChart");		    
				var y = document.getElementById("linePlot");
				var z = document.getElementById("radarChart");
				var k = document.getElementById("boxPlotMag");
				var r = document.getElementById("boxPlotDepth");
				if(dM.properties.name == manager.place && manager.secondPlace != undefined){
					manager.place = manager.secondPlace;
					manager.secondPlace = undefined;
					d3.selectAll(".country").classed("country-on", function(d){
						if(d.properties.name == manager.place) return true;
						return false;
					});
					d3.selectAll("circle")
					.style("fill", function(d){
						if (d.place == manager.place) {return chooseColorByMag(d.mag, 1);}
						else return chooseColorByMag(d.mag, 0);
					});
					var nameCountry = manager.place
					manager.place = undefined;
					manager.triggerPlaceFilterEvent(nameCountry, selectedYear);
				}
				else if(dM.properties.name == manager.place && manager.secondPlace == undefined){
					manager.place = undefined;
					d3.select(this).classed("country-on", false);
					manager.triggerYearFilterEvent(selectedYear);
					x.style.display="block";
					w.style.display="block";
					y.style.display="none";
					z.style.display="none";
					k.style.display="none";
					r.style.display="none";
					updatePoint();
					updatePoint2();
				}
				else if (dM.properties.name == manager.secondPlace){
					manager.secondPlace = undefined;
					d3.selectAll(".country").classed("country-on", function(d){
						if(d.properties.name == manager.place) return true;
						return false;
					});
					d3.selectAll("circle")
					.style("fill", function(d){
						if (d.place == manager.place) {return chooseColorByMag(d.mag, 1);}
						else return chooseColorByMag(d.mag, 0);
					});
					var nameCountry = manager.place
					manager.place = undefined;
					manager.triggerPlaceFilterEvent(nameCountry, selectedYear);
				}

					

			});
		// add the text to the label group showing country name
		countryLabels
			.append("text")
			.attr("class", "countryName")
			.style("text-anchor", "middle")
			.attr("dx", 0)
			.attr("dy", 0)
			.text(function(dM) {
				return dM.properties.name;
			})
			.call(getTextBox);
		// add a background rectangle the same size as the text
		countryLabels
			.insert("rect", "text")
			.attr("class", "countryLabelBg")
			.attr("transform", function(dM) {
				return "translate(" + (dM.bbox.x - 2) + "," + dM.bbox.y + ")";
			})
			.attr("width", function(dM) {
				return dM.bbox.width + 4;
			})
			.attr("height", function(dM) {
				return dM.bbox.height;
			});
		initiateZoom();
		}
	);
});


  
function map_getData(){
	return manager.getDataFilteredByParallel();
}

function map_getDataMap(){
	return manager.getDataFilteredByMap();
}

manager.addListener('yearChanged', function (e) {
	updatePoint3()
})  

function setColorMapByScatterplot(d) {
  if (manager.filteringByScatterplot == undefined){ return chooseColorByMag(d.mag,0);}
  if (manager.filteringByScatterplot(d)){
    return "#006000"
  }
  else{
    return chooseColorByMag(d.mag,0);
  }
}



function updatePoint(){

	d3.json(
		"https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json",
		function(json) {

			countriesM = countriesGroup
				.selectAll("path")
				.data(json.features)
				.attr("id", function(dM, i) {
				  	d3.selectAll(".country").classed("country-on", false);
					boxZoom(pathM.bounds(dM), pathM.centroid(dM), 10);
				});
		}
	);
}

function updatePoint2(){
	newdataM = map_getData();

	circle=countriesGroup
	.selectAll(".circleMap")
	.remove()
	.exit();
			
			
	circle=countriesGroup
		.selectAll(".circleMap")
		.data(newdataM)
		.enter()
		.append("circle")
		.attr("class","circleMap")
		.attr("cx", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[0]; })
		.attr("cy", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[1]; })
		.attr("r", 7)
		.style("fill", function(d){
			return chooseColorByMag(d.mag,0) 
		})
		.style("stroke", "#000")
	
	d3.selectAll("circle")
		.style("fill", function(d){
			if (d.place == manager.place){ return chooseColorByMag(d.mag,1);}
			else return chooseColorByMag(d.mag,0);
		});
}

function updatePoint3(){
	newdataM = map_getDataMap().slice();

	appendData = map_getData();

	for (var i = 0; i < appendData.length; i++){
		newdataM.push(appendData[i]);
	}

	circle=countriesGroup
	.selectAll(".circleMap")
	.remove()
	.exit();
			
			
	circle=countriesGroup
		.selectAll(".circleMap")
		.data(newdataM)
		.enter()
		.append("circle")
		.attr("class","circleMap")
		.attr("cx", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[0]; })
		.attr("cy", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[1]; })
		.attr("r", 7)
		.style("fill", function(d){
			return chooseColorByMag(d.mag,0) 
		})
		.style("stroke", "#000")	
	
	d3.selectAll("circle")
		.style("fill", function(d){
			if (d.place == manager.place) return chooseColorByMag(d.mag,1);
			else if (d.place == manager.secondPlace) return chooseColorByMag(d.mag,2);
			else return chooseColorByMag(d.mag,0);
		});
}

function update() {
	d3.selectAll(".circleMap")
		.attr("cx", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[0]; })
		.attr("cy", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[1]; })
}

manager.addListener('scatterplotBrushing', function (e) {
	d3.selectAll(".circleMap")
	.data(map_getData())
	.transition()
	.duration(130)
	.style('fill', setColorMapByScatterplot)
	.attr("fill-opacity", 1)
});

manager.addListener('parallelBrushing', function (e) { 
	if (manager.place != undefined){
		updatePoint3();
	}
	else updatePoint2(); 
});
function map_getData(){
	return manager.getDataFilteredByParallel();
}
