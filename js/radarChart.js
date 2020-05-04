var RadarChart = {
  draw: function(id, d, options, plID){
    var cfg = {
     radius: 5,
     w: 200,
     h: 20,
     factor: 1,
     factorLegend: .65,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.6,
     ToRight: 5,
     TranslateX: 52,
     TranslateY: 80,
     ExtraWidthX: 50,
     ExtraWidthY: 100,
     color2: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"]),
     color1: d3.scaleOrdinal().range(["#035e00", "#059400"])
    };
    
    if('undefined' !== typeof options){
      for(var i in options){
          if('undefined' !== typeof options[i]){
            cfg[i] = options[i];
          }
      }
    }
    
    var maxValue = computeMaxLevels();
    
    var allAxis = (d[0].map(function(i, j){return i.area}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    var g;
    if (plID != 2){
      d3.select(id).select("svg").remove();

      g = d3.select(id)
          .append("svg")
          .attr("width", cfg.w+cfg.ExtraWidthX)
          .attr("height", cfg.h+cfg.ExtraWidthY)
          .append("g")
          .attr("class", "svgRadar")
          .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        var tooltip;
    }
    else{
      g = d3.select(".svgRadar");
    }
    
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "black")
       .style("stroke-opacity", "1")
       .style("stroke-width", "0.9px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d + computeValue(d)})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){
        if (d == "depth" || d == "rms") {
          return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total) - 9.5;
        }
        return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);
      });

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
      .data(y, function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
      });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
             .data([dataValues])
             .enter()
             .append("polygon")
             .attr("class", "radar-chart-serie"+plID)
             .style("stroke-width", "2px")
             .style("stroke", function(d){               
                if (plID == 1) return cfg.color1(series);
                else return cfg.color2(series)
             })
             .attr("points",function(d) {
               var str="";
               for(var pti=0;pti<d.length;pti++){
                  if (!Number.isNaN(d[pti][0])){
                    str=str+d[pti][0]+","+d[pti][1]+" ";
                  }
                  else
                    str = str + "0,0 ";
               }
               return str;
              })
             .style("fill", function(j, i){
                if (plID == 1) return cfg.color1(series);
                else return cfg.color2(series)
              })
             .style("fill-opacity", function(j, i){
                if (plID == 1) return cfg.opacityArea;
                else return cfg.opacityArea - 0.15;
              })
             .on('mouseover', function (d){
                      z = "polygon."+d3.select(this).attr("class");
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", 0.1); 
                      g.selectAll(z)
                       .transition(200)
                       .style("fill-opacity", .7);
                      })
             .on('mouseout', function(){
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", cfg.opacityArea);
             });
      series++;
    });
    series=0;
    if (!Number.isNaN(d[0][0].value)){
      d.forEach(function(y, x){
        g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie"+series)
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          if (Number.isNaN(j.value)) return 0;
          dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.cos(i*cfg.radians/total))
            ]);
            return cfg.w/2*(1-(Math.max(j.value, 0)/maxValue[i])*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          if (Number.isNaN(j.value)) return 0;
          return cfg.h/2*(1-(Math.max(j.value, 0)/maxValue[i])*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.area})
        .style("fill", "white")
        .style("stroke-width", "2px")
        .style("stroke", function(d){               
          if (plID == 1) return cfg.color1(series);
          else return cfg.color2(series)
       })
        .style("fill-opacity", .5)
        
        .append("svg:title")
        .style("cursor", "pointer")
        .text(function(j){return Math.max(j.value, 0)});
  
        series++;
      });
    }

    svgRadar.select(".radar-chart-serie1").raise();
    
    //Tooltip
    tooltip = g.append('text')
           .style('opacity', 0)
           .style('font-family', 'sans-serif')
           .style('font-size', '13px');
    }
};


// Config for the Radar chart
var config = {
  w: widthRadar,
  h: heightRadar,
  maxValue: 100,
  levels: 5,
  ExtraWidthX: 300
}

function getDataRadar(){
  return manager.getDataFilteredByParallel();
}

manager.addListener('placeChanged', function (e) {
  var data = getDataRadar();
  if (manager.secondPlace == undefined){
    data = processData(data);
    RadarChart.draw("#radarChart", data, config, 1);
  }
  else{
    var data1 = [], data2 = [];
    data.forEach(el => {
      if (el.place == manager.place) data1.push(el)
      else data2.push(el)
    })
    data1 = processData(data1);
    RadarChart.draw("#radarChart", data1, config, 1)
    data2 = processData(data2);
    RadarChart.draw("#radarChart", data2, config, 2)
  }
    
});

manager.addListener('parallelBrushing', function (e) {
  var data = getDataRadar();
  if (manager.secondPlace == undefined){
    data = processData(data);
    RadarChart.draw("#radarChart", data, config, 1);
  }
  else{
    var data1 = [], data2 = [];
    data.forEach(el => {
      if (el.place == manager.place) data1.push(el)
      else data2.push(el)
    })
    data1 = processData(data1);
    RadarChart.draw("#radarChart", data1, config, 1)
    data2 = processData(data2);
    RadarChart.draw("#radarChart", data2, config, 2)
  }
});

manager.addListener('yearChanged', function (e) {
  var data = getDataRadar();
  if (manager.secondPlace == undefined){
    data = processData(data);
    RadarChart.draw("#radarChart", data, config, 1);
  }
  else{
    var data1 = [], data2 = [];
    data.forEach(el => {
      if (el.place == manager.place) data1.push(el)
      else data2.push(el)
    })
    data1 = processData(data1);
    RadarChart.draw("#radarChart", data1, config, 1)
    data2 = processData(data2);
    RadarChart.draw("#radarChart", data2, config, 2)
  }
  
});

function processData(data){
  newData = [[]]
  mag = getVal(d3.max(data, function(d) { return d.mag; }), 0);
  depth = getVal(d3.max(data, function(d) { return d.depth; }), 1);
  nst = getVal(d3.max(data, function(d) { return d.nst; }), 2);
  gap = getVal(d3.max(data, function(d) { return d.gap; }), 3);
  rms = getVal(d3.max(data, function(d) { return d.rms; }), 4);
  
  newData[0].push({area: "mag", value: mag})
  newData[0].push({area: "depth", value: depth})
  newData[0].push({area: "nst", value: nst})
  newData[0].push({area: "gap", value: gap})
  newData[0].push({area: "rms", value: rms})
  return newData;
}

function computeMaxLevels(){
  var maxLev = [];
  var dataMax = manager.dataOriginal;
  maxLev.push(d3.max(dataMax, function(d) { return d.mag; }));
  maxLev.push(d3.max(dataMax, function(d) { return d.depth; }));
  maxLev.push(d3.max(dataMax, function(d) { return d.nst; }));
  maxLev.push(d3.max(dataMax, function(d) { return d.gap; }));
  maxLev.push(d3.max(dataMax, function(d) { return d.rms; }));
  return maxLev;
}

function getVal(str,i){
  var ml = computeMaxLevels();
  if (str === "") return 0;
  str = parseFloat(str);
  if (str > ml[i]) str = ml[i];
  return str;
}

function computeValue(feature){
  var dMax = manager.dataOriginal;
  return " [" + d3.max(dMax, function(d) { return d[feature]; }) + "]";
}

var svgRadar = d3.select('#radarChart')
.selectAll('svg')
.append('svg')
.attr("width", widthRadar)
.attr("height", heightRadar);