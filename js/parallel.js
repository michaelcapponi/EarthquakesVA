var svgParallel = d3.select(".parallel_area").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .append("g")
  .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");
  

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}
var cambio=false;

function cancelSelection() {
  key = this.__data__.key;
  children = this.childNodes;
  hide = false;
  for (i = 0; i < children.length; i++) {
    if (children[i].__data__.type == 'selection' && children[i].y.animVal.value == 0) hide = true;
  }
  if (!hide) return;
  for (i in dimensions) {
    if (key == dimensions[i].key) {
      extents[i] = [0, 0];
      brushParallel()
    }
  }
}

function parallelFiltering(d) {
  var rangeC = y["place"].range();
  var rangeT = y["magType"].range();
  var rangePointsC = d3.range(rangeC[0], rangeC[1], y["place"].step());
  var rangePointsT = d3.range(rangeT[0], rangeT[1], y["magType"].step());
  value = dimensions.every(function (p, i) {
    if (extents[i][0] == 0 && extents[i][1] == 0) {
      return true;
    }
    if (p.key == "place") {
      if (country_selection == undefined) return true;
      dValue = rangePointsC[countries.indexOf(d[p.key])];
      return dValue >= country_selection[0] && dValue <= country_selection[1];
    }
    else if (p.key == "magType") {
      if (type_selection == undefined) return true;
      dValue = rangePointsT[types.indexOf(d[p.key])];
      return dValue >= type_selection[0] && dValue <= type_selection[1];
    }
    else if (p.key == "time") {
      date = conv(d[p.key]);
      return extents[i][1] <= date && date <= extents[i][0];
    }
    else {
      return extents[i][1] <= d[p.key] && d[p.key] <= extents[i][0];
    }

  });
  return value;
}

function brushParallel() {
  for (i in dimensions) {
    if (d3.event.target == y[dimensions[i].key].brush) {
      if (dimensions[i].key == "place") {
        country_selection = d3.event.selection;
        extents[i] = d3.event.selection.map(scalePointInverseC, y[dimensions[i].key]);
      }
      else if (dimensions[i].key == "magType") {
        type_selection = d3.event.selection;
        extents[i] = d3.event.selection.map(scalePointInverseT, y[dimensions[i].key]);
      }
      else {
        extents[i] = d3.event.selection.map(y[dimensions[i].key].invert, y[dimensions[i].key]);
      }
    }
  }
  manager.notifyParallelBrushing();
  foreground.style("display", function (d) {
      value = parallelFiltering(d);
      if (value) {
        return null;
      }
      return "none";
  });


}

function scalePointInverseC(pos) {
  var xPos = pos;
  var domainC = y["place"].domain();
  var rangeC = y["place"].range();
  var rangePointsC = d3.range(rangeC[0], rangeC[1], y["place"].step());
  var inverseC = domainC[d3.bisect(rangePointsC, xPos)];
  return inverseC;
}

function scalePointInverseT(pos) {
  var xPos = pos;
  var domainT = y["magType"].domain();
  var rangeT = y["magType"].range();
  var rangePointsT = d3.range(rangeT[0], rangeT[1], y["magType"].step());
  var inverseT = domainT[d3.bisect(rangePointsT, xPos)];
  return inverseT;
}

function path(d) {
  points = [];
  for (i in dimensions) {
    n = dimensions[i].name;
    r = dimensions[i].key;
    if (r == "time") {
      date = conv(d[r]);
      points.push([x(n), y[r](date)]);
    }
    else {
      points.push([x(n), y[r](d[r])]);
    }

  }
  return d3.line()(points);
}


function conv(input) {
  hP = input.substring(0,2);
  mm = input.substring(3,4);
  ss=input.substring(4,6);
  date = new Date();
  date.setHours(hP);
    date.setMinutes(mm);

  

  return date;
}

var background;
var foreground;
var country_selection;
var type_selection;

var y = {};
var names = [];
function parallel_getData(){
	
	  return manager.getDataFilteredByParallel();
}

function start(){

  data = parallel_getData();

  dimensions = [
    {
        name: "Place",
        key: "place"
      },
      {
        name: "Mag",
        key: "mag"
      },
      {
        name: "MagType",
        key: "magType"
      },      
      {
        name: "Latitude",
        key: "latitude"
      },
      {
        name: "Depth",
        key: "depth"
      },
          {
        name: "Time",
        key: "time"
      },
           
    ];


  for (i in dimensions) {
    j = dimensions[i].key;
    names.push(dimensions[i].name);
    if (j == "place") {
      countries = [" "];
      data.forEach(element => {
        if (!countries.includes(element[j])) {
          countries.push(element[j])
        }
      });
      countries.sort();
      countries.push("  ");
      y[j] = d3.scalePoint()
        .domain(countries)
        .range([0, height_parallel]);
        
    }else if (j == "time") {
      var low = conv("0000");
      var high = conv("2359");
      y[j] = d3.scaleTime().domain([low, high]).range([height_parallel, 0]);

    }
    else if (j == "mag"){
      var low = d3.extent(data, function(d) { return +d.mag; })[0];
      var high = d3.extent(data, function(d) { return +d.mag; })[1];
  
      y[j] = d3.scaleLinear().domain([low - 1, high + 1]).range([height_parallel, 0]);
      
    }else if (j == "magType"){
      types = [" "];
      data.forEach(element => {
        if (!types.includes(element[j])) {
          types.push(element[j])
        }
      });
      types.push("  ");
      y[j] = d3.scalePoint()
        .domain(types)
        .range([0, height_parallel]);
      
    }else if (j == "latitude") {
      var low = d3.extent(data, function(d) { return +d.latitude; })[0];
      var high = d3.extent(data, function(d) { return +d.latitude; })[1];
      y[j] = d3.scaleLinear().domain([low - 10, high + 10]).range([height_parallel, 0]);
      
    }else if (j == "depth") {
      var low = d3.extent(data, function(d) { return +d.depth; })[0];
      var high = d3.extent(data, function(d) { return +d.depth; })[1];
      y[j] = d3.scaleLinear().domain([Math.max(0,low -100), high + 100]).range([height_parallel, 0]);

    }
  
  
   x = d3.scalePoint()
      .range([0, width_parallel])
      .padding(1)
      .domain(names);
}

    
    extents = dimensions.map(function (p) { return [0, 0]; });
    background = svgParallel.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("d", path)
      .attr("class", "path_background")
      .style("stroke", "#FFFFFF");
      
    foreground = svgParallel.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .attr('class', 'path_foreground path_normal')
      .style("stroke", function(d){
        if(manager.compareMode){
          if (d.place == manager.place) {return chooseColorByMag(d.mag,1);}
          else if (d.place == manager.secondPlace) return chooseColorByMag(d.mag,2);
          else return chooseColorByMag(d.mag, 0);
        }
        else if (d.place == manager.place) {return chooseColorByMag(d.mag,1);}
        return chooseColorByMag(d.mag, 0);
      });

    svgParallel.selectAll('.path_highlighted').raise();

  var gP = svgParallel.selectAll("axis")
      .data(dimensions)
      .enter().append("g")
      .attr("class", "axis")
      .attr("transform", function (d) { return "translate(" + x(d.name) + ")"; })

    gP.append("g")
      .attr("class", "axis")
      .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d.key])); })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function (d) { return d.name; })
      .style("fill", "black");
      
      
      gP.append("g")
      .attr("class", "brushParallel")
      .each(function (d) {
        d3.select(this).call(y[d.key].brush = d3.brushY().extent([[-8, 0], [8, height_parallel]]).
          on("start", brushstart).
          on("brush", brushParallel)).
          on("click", cancelSelection)
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
      
      manager.filteringByParallel = parallelFiltering;
        
   
}

manager.addListener('dataReady', function (e) {
  	start();
});


manager.addListener('scatterplotBrushing', function (e) {
  svgParallel.selectAll('.path_foreground')
  .style("stroke", setColorByScatterplot)
  .attr('class', setClass)
  .style("opacity", setOpacityByScatterplot);
  svgParallel.selectAll('.path_highlighted').raise();
});

manager.addListener('yearChanged', function (e) {
	cambio=false;
  d3.select(".parallel_area").select("svg").remove();
  svgParallel = d3.select(".parallel_area").append("svg")
    .attr("width", width_parallel + margin_parallel.left + margin_parallel.right)
    .attr("height", height_parallel + margin_parallel.top + margin_parallel.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");
	start();
	
});

function updateParallel(){
  d3.select(".parallel_area").select("svg").remove();
  svgParallel = d3.select(".parallel_area").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .append("g")
  .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");
  start()
}

function setColorByScatterplot(d){
  if (manager.filteringByScatterplot == undefined) return chooseColorByMag(d.mag, 0);
  value = manager.filteringByScatterplot(d);
  if (value) {
    return chooseColorByMag(d.mag, 1)
  }
  return chooseColorByMag(d.mag, 0);
}

function setOpacityByScatterplot(d){
  if (manager.filteringByScatterplot == undefined) return 1;
  value = manager.filteringByScatterplot(d);
  if (value) {
    return 1
  }
  return 0.6;
}

function setClass(d) {
  if (manager.filteringByScatterplot == undefined) return 'path_foreground path_normal';
  value = manager.filteringByScatterplot(d);
  if (value){
    return 'path_foreground path_highlighted';
  }
  else return 'path_foreground path_normal';
}
manager.addListener('placeChanged', function (e) {
	  cambio=true;
	  updateParallel();
});
