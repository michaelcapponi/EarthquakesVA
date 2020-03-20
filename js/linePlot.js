// append the svg object to the body of the page
var svgLine = d3.select("#linePlot")
    .append("svg")
    .attr("width", "99%")
    .attr("height", "100%")
    .append("g")
    .attr("transform",
            "translate(" + marginLine.left + "," + marginLine.top + ")");

var lineColors = ['#035e00', '#6F257F']

manager.addListener('dataReady', function (e) {
	    var dataLine = getDataLine();
	    initialize(dataLine);
});

function initialize(data){
	

    dataLine=data
    var fqcsLine = computeRelativeFrequency(dataLine);
    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d[1];})
        .entries(fqcsLine);

    // Add X axis --> it is a date format
    var xLine = d3.scalePoint()
        .domain(months)
        .range([ 0, widthLine ]);
        svgLine.append("g")
        .attr("class", "x-axisLine")
        .attr("transform", "translate(0," + (heightLine - 50) + ")")
        .call(d3.axisBottom(xLine).ticks(20));

    // Add Y axis
    var yLine = d3.scaleLinear()
        .domain([0, d3.max(fqcsLine, function(fcy) { return fcy[2]; })])
        .range([ heightLine, 0 ]);
        svgLine.append("g")
        .attr("class", "y-axisLine")
        .call(d3.axisLeft(yLine));

    svgLine.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10 - marginLine.left)
        .attr("x",0 - (heightLine / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frequency");
        
    svgLine.append("text")             
        .attr("transform",
            "translate(" + ((widthLine + marginLine.right + marginLine.left)/2 - 50) + " ," + 
                            (heightLine + marginLine.top + marginLine.bottom -20)+ ")")
        .style("text-anchor", "middle")
        .text("Months");
    

    svgLine.selectAll(".lineCircle")
        .data(fqcsLine)
        .enter()
        .append("circle")
        .attr("class", "lineCircle")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "white")
        .attr("cx", function(d) { return xLine(d[0]); })
        .attr("cy", function(d) { return yLine(+parseInt(d[2])); })
        .attr("r", 3)

}

function computeRelativeFrequency(data){
    d = {};
    cts = [];
    for (i = 0; i < data.length; i++) {
        month = months[parseInt(data[i].date.split("-")[1])-1];
        country = data[i].place;
        if (!cts.includes(country)) cts.push(country)
        pair = [month, country]
        if (d[pair] != undefined){
            d[pair] += 1;
        }
        else{
            d[pair] = 1;
        }
    }


    for (var i = months.length -1; i >= 0; i--){
        for (var j = 0; j < cts.length; j++){
            pair = [months[i], cts[j]]
            if (d[pair] == undefined) d[pair] = 0;
        }
    }



    var items = Object.keys(d).map(function (pair) {
        month = pair.split(",")[0];
        country = pair.split(",")[1];
        return [month, country, parseInt(d[pair])];
    });

    var ordItems = []

    

    for (var i = 0; i < months.length; i++){
        for (var j = 0; j < items.length; j++){
            if (items[j][0] == months[i]){
                ordItems.push(items[j]);
            }
        }
    }

    return ordItems;

    
}

function computeFrequencyLine(data){
    frequencyLine = {};
    for (i = 0; i < data.length; i++) {
        country = data[i].place;
        if (frequencyLine[country] != undefined){
            frequencyLine[country] += 1;
        }
        else{
            frequencyLine[country] = 1;
        }
    }

    var itemsLine = Object.keys(frequencyLine).map(function (country) {
        return [country, frequencyLine[country]];
    });

    // Sort the array based on the earthquake frequency 
    itemsLine.sort(function(first, second) {
        return second[1] - first[1];
    });


    return itemsLine.slice(0,1);
}



function getDataLine(){
  return manager.getDataFilteredByParallel();
}

/*
manager.addListener('scatterplotBrushing', function (e) {
    updateLine(manager.getDataFilteredByScatter());
});*/

function updateLine(){
    var dataLine = getDataLine();

    var fqcsLine = computeRelativeFrequency(dataLine);
    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d[1];})
        .entries(fqcsLine);


    // Add X axis --> it is a date format
    var xLine = d3.scalePoint()
        .domain(months)
        .range([ 0, widthLine ]);
    
    svgLine.select(".x-axisLine")
        .attr("transform", "translate(0," + (heightLine) + ")")
        .call(d3.axisBottom(xLine).ticks(10));

    // Add Y axis
    var yLine = d3.scaleLinear()
        .domain([0, d3.max(fqcsLine, function(fcy) { return fcy[2]; })])
        .range([ heightLine, 0 ]);
    
    svgLine.select(".y-axisLine")
        .call(d3.axisLeft(yLine));


    svgLine.selectAll(".linePath").data(sumstat).exit().remove();
    svgLine.selectAll(".lineCircle").data(sumstat).exit().remove();

    // Draw the line
    svgLine.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", "linePath")
        .attr("fill", "none")
        .attr("stroke", function(d){ 
            if(d.key == manager.place) return lineColors[0];
            return lineColors[1];
         } )
        .attr("stroke-width", 2)
        .attr("cx", function(d) { return xLine(d[0]); })
        .attr("cy", function(d) { return yLine(+parseInt(d[2])); })
        .attr("r", 3)

    svgLine.selectAll(".linePath")
        .data(sumstat)
        .transition()
        .duration(200)
        .attr("d", function(d){
            return d3.line()
            .x(function(d) { return xLine(d[0]); })
            .y(function(d) { return yLine(+parseInt(d[2])); })
            (d.values)
        })
    
    svgLine.selectAll(".linePath")
        .attr("stroke", function(d){
            if(d.key == manager.secondPlace) return lineColors[1];
            else return lineColors[0];
        });

    // Draw the circle
    svgLine.selectAll(".lineCircle")
        .data(fqcsLine)
        .enter()
        .append("circle")
        .attr("class", "lineCircle")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("cx", function(d) {return xLine(d[0]); })
        .attr("cy", function(d) { return yLine(+parseInt(d[2])); })
        .attr("r", 3)
    
        
    
    svgLine.selectAll(".lineCircle")
        .data(sumstat)
        .transition()
        .duration(200)
        .attr("fill", "white")
        .attr("cx", function(d) { return xLine(d.values[0][0]); })
        .attr("cy", function(d) { return yLine(+parseInt(d.values[0][2])); })
        .attr("r", 3)
    


}

manager.addListener('parallelBrushing', function (e) {
    updateLine();
});

manager.addListener('placeChanged', function (e) {
	updateLine();
});

manager.addListener('yearChanged', function (e) {
	updateLine();
});
