// append the svg object to the body of the page
var svgDepth = d3.select("#boxPlotDepth")
.append("svg")
  .attr("width", widthDepth + marginDepth.left + marginDepth.right)
  .attr("height", heightDepth + marginDepth.top + marginDepth.bottom)
.append("g")
  .attr("transform",
        "translate(" + (20 + marginDepth.left) + "," + marginDepth.top + ")");
        
var svgDepth2 = d3.select("#boxPlotDepth")
.append("svg")
	.attr("width", widthDepth2 + marginDepth2.left2 + 15 + marginDepth2.right2)
	.attr("height", heightDepth2 + marginDepth2.top2 + marginDepth2.bottom2)
.append("g")
	.attr("transform",
		"translate(" + 25 + "," + marginDepth2.top2 + ")")
		.style("display", "none");


manager.addListener('dataReady', function (e) {
  	via2();
});
manager.addListener('yearChanged', function (e) {
	cambio=true;
	updateBoxDepth();
});
manager.addListener('placeChanged', function (e) {
	cambio=true;
	updateBoxDepth();
});
manager.addListener('parallelBrushing', function (e) {
    updateBoxDepth();
});

function getData_boxDepth(){
	return manager.getDataFilteredByParallel();
}

function via2(){

	// create dummy data
	var dataDepth = getData_boxDepth();
	var vett2=[];
	k="depth";
	dataDepth.forEach(element => {
		   
		vett2.push((element[k]/10));
			
	});

	// Compute summary statistics used for the Depth:
	var data_sorted2 = vett2.sort(d3.ascending)
	var q1D = d3.quantile(data_sorted2, .25)
	var medianD = d3.quantile(data_sorted2, .5)
	var q3D = d3.quantile(data_sorted2, .75)
	var interQuantileRange = q3D - q1D
	var minD = q1D - 1.5 * interQuantileRange
	var maxD = q1D + 1.5 * interQuantileRange
	
	if (minD<0) minD=0;
	// Show the Y scale
var yBoxD = d3.scaleLinear()
		  .domain([minD-100,maxD+100])
		  .range([heightDepth, 0]);
		svgDepth.call(d3.axisLeft(yBoxD))
	
	


	// a few features for the Depth
	var centerD = 100
	var widthD = 50

	// Show the main vertical line
	svgDepth
	.append("line")
	  .attr("x1", centerD)
	  .attr("x2", centerD)
	  .attr("y1", yBoxD(minD) )
	  .attr("y2", yBoxD(maxD) )
	  .attr("stroke", "black")

	svgDepth.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y",  -40)
	  .attr("x", 0-(heightDepth/2))
	  .attr("dy", "1em")
	  .style("text-anchor", "middle")
	  .attr("fill", "black")
	  .text("Depth"); 

	// Show the Depth
	svgDepth
	.append("rect")
	  .attr("x", centerD - widthD/2)
	  .attr("y", yBoxD(q3D) )
	  .attr("height", (yBoxD(q1D)-yBoxD(q3D)) )
	  .attr("width", widthD )
	  .attr("stroke", "black")
	  .style("fill", "#69b3a2")

	// show median, min and max horizontal lines
	svgDepth
	.selectAll("toto")
	.data([minD, medianD, maxD])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD-widthD/2)
	  .attr("x2", centerD+widthD/2)
	  .attr("y1", function(d){ return(yBoxD(d))} )
	  .attr("y2", function(d){ return(yBoxD(d))} )
	  .attr("stroke", "black")
	  
/////////////////////////////////
// Compute summary statistics used for the Depth:
	var data_sorted22 = vett2.sort(d3.ascending)
	var q1D2 = d3.quantile(data_sorted22, .25)
	var medianD2 = d3.quantile(data_sorted22, .5)
	var q3D2 = d3.quantile(data_sorted22, .75)
	var interQuantileRange2 = q3D2 - q1D2
	var min2D2 = q1D2 - 1.5 * interQuantileRange2
	var max2D2= q1D2 + 1.5 * interQuantileRange2
	


	// a few features for the box
	var centerD2 = 100
	var widthD2 = 50

	// Show the main vertical line
	svgDepth2
	.append("line")
	  .attr("x1", centerD2)
	  .attr("x2", centerD2)
	  .attr("y1", yBoxD(min2D2) )
	  .attr("y2", yBoxD(max2D2) )
	  .attr("stroke", "black")
.style("display", "none");
	// Show the Depth
	svgDepth2
	.append("rect")
	  .attr("x", centerD2 - widthD2/2)
	  .attr("y", yBoxD(q3D2) )
	  .attr("height", (yBoxD(q1D2)-yBoxD(q3D2)) )
	  .attr("width", widthD2 )
	  .attr("stroke", "black")
	  .style("fill", "#69b3a2")
.style("display", "none");

	// show median, min and max horizontal lines
	svgDepth2
	.selectAll("toto")
	.data([min2D2, medianD2, max2D2])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD2-widthD2/2)
	  .attr("x2", centerD2+widthD2/2)
	  .attr("y1", function(d2){ return(yBoxD(d2))} )
	  .attr("y2", function(d2){ return(yBoxD(d2))} )
	  .attr("stroke", "black")
	  .style("display", "none");

}
function updateBoxDepth(){
	
  	


	  
	
  if (manager.secondPlace== undefined){
	  svgDepth2.style("display", "none");

	// create dummy data
	var data = getData_boxDepth();
	var vett2=[];
	k="depth";
	data.forEach(element => {
		   
		vett2.push(element[k]/10)
			
	});
	
	// Compute summary statistics used for the box:
	var data_sorted2 = vett2.sort(d3.ascending)
	var q1D = d3.quantile(data_sorted2, .25)
	var medianD = d3.quantile(data_sorted2, .5)
	var q3D = d3.quantile(data_sorted2, .75)
	var interQuantileRange = q3D - q1D
	var min2D = q1D - 1.5 * interQuantileRange
	var max2D= q1D + 1.5 * interQuantileRange
	
	if (min2D<0){ min2D=0;
	// Show the Y scale
		var yBoxD = d3.scaleLinear()
		  .domain([0,max2D+10])
		  .range([heightDepth, 0]);
		svgDepth.call(d3.axisLeft(yBoxD))
	}else{
		var yBoxD = d3.scaleLinear()
		  .domain([min2D-10,max2D+10])
		  .range([heightDepth, 0]);
		svgDepth.call(d3.axisLeft(yBoxD))
	}
	// a few features for the box
	var centerD = 30
	var widthD = 50
	var boxes1D=svgDepth.selectAll("line").remove();

	// Show the main vertical line
	svgDepth.append("line")
	svgDepth
	.append("line")
	  .attr("x1", centerD)
	  .attr("x2", centerD)
	  .attr("y1", yBoxD(min2D) )
	  .attr("y2", yBoxD(max2D) )
	  .attr("stroke", "black")

	

	// Show the box
	svgDepth
	.select("rect")
	  .attr("x", centerD - widthD/2)
	  .attr("y", yBoxD(q3D) )
	  .attr("height", (yBoxD(q1D)-yBoxD(q3D)) )
	  .attr("width", widthD )
	  .attr("stroke", "black")
	  .style("fill", "#69b3a2")
	  
    var boxesD = svgDepth.selectAll(".lineBox").data([min2D,medianD,max2D])
    boxesD.exit().remove();
	// show median, min and max horizontal lines
	svgDepth
	.selectAll("toto")
	.data([min2D, medianD, max2D])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD-widthD/2)
	  .attr("x2", centerD+widthD/2)
	  .attr("y1", function(d){ return(yBoxD(d))} )
	  .attr("y2", function(d){ return(yBoxD(d))} )
	  .attr("stroke", "black")
	  
	svgDepth.selectAll(".lineBox")
        .data([min2D,medianD,max2D]).transition().duration(500)
		  .attr("x1", centerD-widthD/2)
		  .attr("x2", centerD+widthD/2)
		  .attr("y1", function(d){ return(yBoxD(d))} )
		  .attr("y2", function(d){ return(yBoxD(d))} )
		  .attr("stroke", "black")
   }else
   {
	   
	   
	   // a few features for the box
	var centerD2 = 30
	var widthD2 = 50
////////////////////////////////////////////////////

	
	// a few features for the box
	var centerD = 30
	var widthD = 50
	var data = getData_boxDepth();
	var vett2=[];
	var vett22=[];
	k="depth";
	data.forEach(element => {
		if(element.place==manager.secondPlace) {
					vett22.push(element[k]/10)

		}else
		vett2.push(element[k]/10)
			
	});
	var data_sorted22 = vett22.sort(d3.ascending)
	var q1D2 = d3.quantile(data_sorted22, .25)
	var medianD2 = d3.quantile(data_sorted22, .5)
	var q3D2 = d3.quantile(data_sorted22, .75)
	var interQuantileRange2 = q3D2 - q1D2
	var min2D2 = q1D2 - 1.5 * interQuantileRange2
	var max2D2= q1D2 + 1.5 * interQuantileRange2
	
	var data_sorted2 = vett2.sort(d3.ascending)
	var q1D = d3.quantile(data_sorted2, .25)
	var medianD = d3.quantile(data_sorted2, .5)
	var q3D = d3.quantile(data_sorted2, .75)
	var interQuantileRange = q3D - q1D
	var min2D = q1D - 1.5 * interQuantileRange
	var max2D= q1D + 1.5 * interQuantileRange
///////////////////////////////////////////////	


	
	
if(vett2.length==0 && vett22.length!=0){
	console.log("ww")
	var boxes1D=svgDepth.selectAll("line").remove();
	var boxesD = svgDepth.selectAll(".lineBox").data([min2D,medianD,max2D])
    boxesD.exit().remove();
    svgDepth
	.select("rect")

	  .attr("stroke", "white")
	  .style("fill", "white")
    svgDepth2.style("display", "block");


	var boxes1D2=svgDepth2.selectAll("line").remove();
	
	if (min2D2<0){ min2D2=0;
	// Show the Y scale
		var yBoxD = d3.scaleLinear()
		  .domain([min2D2,max2D2])
		  .range([heightDepth2, 0]);

	}else{
		var yBoxD = d3.scaleLinear()
		  .domain([min2D2,max2D2])
		  .range([heightDepth2, 0]);

	}
	if (min2D2<0) min2D2=0;
			svgDepth.call(d3.axisLeft(yBoxD))
			        svgDepth.style("display", "block");


	// Show the main vertical line
	svgDepth2.append("line")
	svgDepth2
	.append("line")
	  .attr("x1", centerD2)
	  .attr("x2", centerD2)
	  .attr("y1", yBoxD(min2D2) )
	  .attr("y2", yBoxD(max2D2) )
	  .attr("stroke", "black")
	  	  .style("display", "block");


	// Show the box
	svgDepth2
	.select("rect")
	  .attr("x", centerD2 - widthD2/2)
	  .attr("y", yBoxD(q3D2) )
	  .attr("height", (yBoxD(q1D2)-yBoxD(q3D2)) )
	  .attr("width", widthD2 )
	  .attr("stroke", "black")
	  .style("fill", "#6F257F")
	  	  	  .style("display", "block");

	  
       var boxesD2 = svgDepth2.selectAll(".lineBox").data([min2D2,medianD2,max2D2])
    boxesD2.exit().remove();
	// show median, min and max horizontal lines
	svgDepth2
	.selectAll("toto")
	.data([min2D2, medianD2, max2D2])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD2-widthD2/2)
	  .attr("x2", centerD2+widthD2/2)
	  .attr("y1", function(d2){ return(yBoxD(d2))} )
	  .attr("y2", function(d2){ return(yBoxD(d2))} )
	  .attr("stroke", "black")
	  	  	  .style("display", "block");

	  
	svgDepth2.selectAll(".lineBox")
        .data([min2D2,medianD2,max2D2]).transition().duration(500)
		  .attr("x1", centerD2-widthD2/2)
		  .attr("x2", centerD2+widthD2/2)
		  .attr("y1", function(d2){ return(yBoxD(d2))} )
		  .attr("y2", function(d2){ return(yBoxD(d2))} )
		  .attr("stroke", "black")
		  	  	  .style("display", "block");


	
	
}else if(vett2.length!=0 && vett22.length==0){
		    svgDepth.style("display", "block");

	svgDepth2.style("display", "none");

	var boxes1D2=svgDepth2.selectAll("line").remove();
	var boxesD2 = svgDepth2.selectAll(".lineBox").data([min2D2,medianD2,max2D2])
    boxesD2.exit().remove();
    
    
    if (min2D<0){ min2D=0;
	// Show the Y scale
		var yBoxD = d3.scaleLinear()
		  .domain([min2D,max2D])
		  .range([heightDepth2, 0]);

	}else{
		var yBoxD = d3.scaleLinear()
		  .domain([min2D,max2D])
		  .range([heightDepth2, 0]);

	}
			svgDepth.call(d3.axisLeft(yBoxD))

	
    var boxes1D=svgDepth.selectAll("line").remove();

	// Show the main vertical line
	svgDepth.append("line")
	svgDepth
	.append("line")
	  .attr("x1", centerD)
	  .attr("x2", centerD)
	  .attr("y1", yBoxD(min2D) )
	  .attr("y2", yBoxD(max2D) )
	  .attr("stroke", "black")

	// Show the box
	svgDepth
	.select("rect")
	  .attr("x", centerD - widthD/2)
	  .attr("y", yBoxD(q3D) )
	  .attr("height", (yBoxD(q1D)-yBoxD(q3D)) )
	  .attr("width", widthD )
	  .attr("stroke", "black")
	  .style("fill", "#69b3a2")
	  
    var boxesD = svgDepth.selectAll(".lineBox").data([min2D,medianD,max2D])
    boxesD.exit().remove();
	// show median, min and max horizontal lines
	svgDepth
	.selectAll("toto")
	.data([min2D, medianD, max2D])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD-widthD/2)
	  .attr("x2", centerD+widthD/2)
	  .attr("y1", function(d){ return(yBoxD(d))} )
	  .attr("y2", function(d){ return(yBoxD(d))} )
	  .attr("stroke", "black")
	  
	svgDepth.selectAll(".lineBox")
        .data([min2D,medianD,max2D]).transition().duration(500)
		  .attr("x1", centerD-widthD/2)
		  .attr("x2", centerD+widthD/2)
		  .attr("y1", function(d){ return(yBoxD(d))} )
		  .attr("y2", function(d){ return(yBoxD(d))} )
		  .attr("stroke", "black")
	
	
} else if (vett2.length!=0 && vett22.length!=0){
	    svgDepth.style("display", "block");

	if (min2D<=min2D2){
		scalamin=min2D;
		
	}else{
		scalamin=min2D2;
	}
	
	if (max2D>max2D2){
		scalamax=max2D;
		
	}else{
		scalamax=max2D2;
	}
	
	if (min2D<0){ min2D=0; min2D2=0;
	// Show the Y scale
		var yBoxD = d3.scaleLinear()
		  .domain([0,scalamax])
		  .range([heightDepth2, 0]);

	}else{
		var yBoxD = d3.scaleLinear()
		  .domain([scalamin,scalamax])
		  .range([heightDepth2, 0]);

	}
			svgDepth.call(d3.axisLeft(yBoxD))

	
		var centerD = 30
	var widthD = 50
	var boxes1D=svgDepth.selectAll("line").remove();

	// Show the main vertical line
	svgDepth.append("line")
	svgDepth
	.append("line")
	  .attr("x1", centerD)
	  .attr("x2", centerD)
	  .attr("y1", yBoxD(min2D) )
	  .attr("y2", yBoxD(max2D) )
	  .attr("stroke", "black")

	// Show the box
	svgDepth
	.select("rect")
	  .attr("x", centerD - widthD/2)
	  .attr("y", yBoxD(q3D) )
	  .attr("height", (yBoxD(q1D)-yBoxD(q3D)) )
	  .attr("width", widthD )
	  .attr("stroke", "black")
	  .style("fill", "#69b3a2")
	  
    var boxesD = svgDepth.selectAll(".lineBox").data([min2D,medianD,max2D])
    boxesD.exit().remove();
	// show median, min and max horizontal lines
	svgDepth
	.selectAll("toto")
	.data([min2D, medianD, max2D])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD-widthD/2)
	  .attr("x2", centerD+widthD/2)
	  .attr("y1", function(d){ return(yBoxD(d))} )
	  .attr("y2", function(d){ return(yBoxD(d))} )
	  .attr("stroke", "black")
	  
	svgDepth.selectAll(".lineBox")
        .data([min2D,medianD,max2D]).transition().duration(500)
		  .attr("x1", centerD-widthD/2)
		  .attr("x2", centerD+widthD/2)
		  .attr("y1", function(d){ return(yBoxD(d))} )
		  .attr("y2", function(d){ return(yBoxD(d))} )
		  .attr("stroke", "black")
		  
		  
		  
		  
		   svgDepth2.style("display", "block");

	var boxes1D2=svgDepth2.selectAll("line").remove();
	
	
	
	// Show the main vertical line
	svgDepth2.append("line")
	svgDepth2
	.append("line")
	  .attr("x1", centerD2)
	  .attr("x2", centerD2)
	  .attr("y1", yBoxD(min2D2) )
	  .attr("y2", yBoxD(max2D2) )
	  .attr("stroke", "black")
	  	  .style("display", "block");


	// Show the box
	svgDepth2
	.select("rect")
	  .attr("x", centerD2 - widthD2/2)
	  .attr("y", yBoxD(q3D2) )
	  .attr("height", (yBoxD(q1D2)-yBoxD(q3D2)) )
	  .attr("width", widthD2 )
	  .attr("stroke", "black")
	  .style("fill", "#6F257F")
	  	  	  .style("display", "block");

	  
       var boxesD2 = svgDepth2.selectAll(".lineBox").data([min2D2,medianD2,max2D2])
    boxesD2.exit().remove();
	// show median, min and max horizontal lines
	svgDepth2
	.selectAll("toto")
	.data([min2D2, medianD2, max2D2])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD2-widthD2/2)
	  .attr("x2", centerD2+widthD2/2)
	  .attr("y1", function(d2){ return(yBoxD(d2))} )
	  .attr("y2", function(d2){ return(yBoxD(d2))} )
	  .attr("stroke", "black")
	  	  	  .style("display", "block");

	  
	svgDepth2.selectAll(".lineBox")
        .data([min2D2,medianD2,max2D2]).transition().duration(500)
		  .attr("x1", centerD2-widthD2/2)
		  .attr("x2", centerD2+widthD2/2)
		  .attr("y1", function(d2){ return(yBoxD(d2))} )
		  .attr("y2", function(d2){ return(yBoxD(d2))} )
		  .attr("stroke", "black")
		  	  	  .style("display", "block");
	
	
	
	
	
}else {
	
	var boxes1D=svgDepth.selectAll("line").remove();
	var boxesD = svgDepth.selectAll(".lineBox").data([min2D,medianD,max2D])
    boxesD.exit().remove();
    
    svgDepth.style("display", "none");

    
    svgDepth2.style("display", "none");

	var boxes1D2=svgDepth2.selectAll("line").remove();
	var boxesD2 = svgDepth2.selectAll(".lineBox").data([min2D2,medianD2,max2D2])
    boxesD2.exit().remove();
	
	
}

	
	
///////////////////////////////////////////////////


////////////////////////////////////////////////

	
   }
}
