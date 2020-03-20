var x_Scatter = d3.scaleLinear().range([0, widthScatter]),
    y_Scatter = d3.scaleLinear().range([heightScatter, 0])

    var color = {
        "Mag 4.0":    '#FFC281',
        "Mag 4.5":  "#FF9F71",
        "Mag 5.0":    "#FF8141",
        "Mag 5.5":  "#FF421E",
        "Mag 6.0":    "#FF1F10",
        "Mag 6.5":  "#E12000",
        "Mag 7.0":    "#C21212",
        "Mag 7.5+":  "#600000",
    };



var xAxis = d3.axisBottom(x_Scatter);

var yAxis = d3.axisLeft(y_Scatter);

    
var brushTot=d3.brush()
    .extent([[0,0],[widthScatter, heightScatter]])
    .on("start brush", selected);
    
var focus;

var svgScatter = d3.select("#scatterPlot").append("svg")
    .attr("width", "99%")
    .attr("height", "100%")
  .append("g")
    .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

manager.addListener('dataReady', function (e) {

    data = scatter_getData();
    var minX = d3.extent(data, function(d) { return +d["PCA_component1"]; })[0] , maxX = d3.extent(data, function(d) { return +d["PCA_component1"]; })[1];
    var minY = d3.extent(data, function(d) { return +d["PCA_component2"]; })[0] , maxY = d3.extent(data, function(d) { return +d["PCA_component2"]; })[1];
    x_Scatter.domain([minX - 1 ,maxX + 1]);
    y_Scatter.domain([minY - 1,maxY + 1]);

    svgScatter.append("defs").append("clipPath")
        .attr("id", "clip")
    .append("rect")
        .attr("width", widthScatter)
        .attr("height", heightScatter);

        

    focus = svgScatter.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

    // append scatter plot to main chart area 
    var dots = focus.append("g")
                    .attr("class", "circleCont");
        dots.attr("clip-path", "url(#clip)");
        dots.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dot')
            .attr("r",3.5)
            .attr("fill","grey")
            .attr("opacity",".3")
            .attr("cx", function(d) { return x_Scatter(d["PCA_component1"]); })
            .attr("cy", function(d) { return y_Scatter(d["PCA_component2"]); })
            .style("fill", function(d) { return color[computeMag(d.mag)]; })
        
          
    focus.append("g")
        .attr("class", "x-axisScatter")
        .attr("transform", "translate(0," + heightScatter + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y-axisScatter")
        .call(yAxis);
        
    svgScatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - marginScatter.left)
        .attr("x",0 - (heightScatter / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("PCA Component 2");  

                
    svgScatter.append("text")             
        .attr("transform",
            "translate(" + ((widthScatter + marginScatter.right + marginScatter.left)/2) + " ," + 
                            (heightScatter + marginScatter.top + marginScatter.bottom - 30)+ ")")
        .style("text-anchor", "middle")
        .text("PCA Component 1");

    focus.append("g")
        .attr("class", "brushT")
        .call(brushTot);

    var legend = svgScatter.selectAll(".legend")
                    .data(["Mag 7.5+", "Mag 7.0", "Mag 6.5", "Mag 6.0", "Mag 5.5", "Mag 5.0", "Mag 4.5", "Mag 4.0"])
                .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { 
                        return "translate(50," + i * 20 + ")"; 
                    });

    legend.append("rect")
        .attr("x", widthScatter - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) { return color[d] });

    legend.append("text")
        .attr("x", widthScatter - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
           
    
});
    /**/

function updateScatter(){
    data = scatter_getData();
    var minX = d3.extent(data, function(d) { return +d["PCA_component1"]; })[0] , maxX = d3.extent(data, function(d) { return +d["PCA_component1"]; })[1];
    var minY = d3.extent(data, function(d) { return +d["PCA_component2"]; })[0] , maxY = d3.extent(data, function(d) { return +d["PCA_component2"]; })[1];
    x_Scatter.domain([minX - 1 ,maxX + 1]);
    y_Scatter.domain([minY - 1,maxY + 1]);

    focus.select(".x-axisScatter")
      .attr("transform", "translate(0," + heightScatter + ")")
      .transition().duration(100)
      .call(d3.axisBottom(x_Scatter));

    focus.select(".y-axisScatter")
      .transition().duration(100)
      .call(d3.axisLeft(y_Scatter));

    svgScatter.select('.focus')
            .select(".circleCont")
            .selectAll("circle").data(data).exit().remove();
        
    // append scatter plot to main chart area 
    var dots = focus.select("g").selectAll("circle").data(data)
    dots.exit().remove();
    dots.enter().append("circle")
        .attr('class', 'dot')
        .attr("r",3.5)
        .attr("fill","grey")
        .attr("opacity",".3")
        .attr("cx", function(d) { return x_Scatter(d["PCA_component1"]); })
        .attr("cy", function(d) { return y_Scatter(d["PCA_component2"]); })
        .style("fill", function(d) { return color[computeMag(d.mag)]; })
        .style("stroke", "#000")
        .merge(dots);

    focus.select("g").selectAll("circle")
        .data(data).transition().duration(500)
        .attr("r",3.5)
        .attr("fill","grey")
        .attr("opacity",".3")
        .attr("stroke","#000")
        .attr("cx", function(d) { return x_Scatter(d["PCA_component1"]); })
        .attr("cy", function(d) { return y_Scatter(d["PCA_component2"]); })
        .style("fill", function(d) { return color[computeMag(d.mag)]; })
        .attr('class', function (d) {
            if (filteringByScatterplot(d)) return 'selected'
            else return '';
        });
    
}


function computeMag(mag){
    if (mag < 4.5) return "Mag 4.0";
    else if (mag < 5.0) return "Mag 4.5";
    else if (mag < 5.5) return "Mag 5.0";
    else if (mag < 6.0) return "Mag 5.5";
    else if (mag < 6.5) return "Mag 6.0";
    else if (mag < 7.0) return "Mag 6.5";
    else if (mag < 7.5) return "Mag 7.0";
    else return "Mag 7.5+";
}

//create brush function redraw scatterplot with selection
function brushed() {
    var selection = d3.event.selection;
    focus.selectAll(".dot")
          .attr("cx", function(d) { return x_Scatter(d["PCA_component1"]); })
          .attr("cy", function(d) { return y_Scatter(d["PCA_component2"]); });
    focus.select(".x-axisScatter").call(xAxis);
}

var scatterplot_brushing_last;

function filteringByScatterplot(d) {
    brush_coords = scatterplot_brushing_last;
    if (brush_coords == undefined) return false;
    cx = x_Scatter(d["PCA_component1"]);
    cy = y_Scatter(d["PCA_component2"]);
    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}
manager.filteringByScatterplot = filteringByScatterplot;


function selected(){
    scatterplot_brushing_last = d3.event.selection;
    focus.selectAll("circle").data(scatter_getData).classed("selected", function (d) {
        if (filteringByScatterplot(d)){
            return true;
        }
        else return false;
    })
    manager.notifyScatterplotBrushing();
}

function scatter_getData(){
    return manager.getDataFilteredByParallel();
}

manager.addListener('yearChanged', function (e) {;
    updateScatter();
});

manager.addListener('parallelBrushing', function (e) {
    if (manager.filteringByYear)
        updateScatter();
});



