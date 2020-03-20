// append the svg object to the body of the page
var svgBox = d3.select("#boxPlotMag")
.append("svg")
  .attr("width", widthBox + marginBox.left + marginBox.right)
  .attr("height", heightBox + marginBox.top + marginBox.bottom)
.append("g")
  .attr("transform",
        "translate(" +  (marginBox.left + 20) + "," + marginBox.top + ")");
// append the svg object to the body of the page
var svgBox23 = d3.select("#boxPlotMag")
.append("svg")
  .attr("width", widthBox2 + marginBox2.left2 + 15 + marginBox2.right2)
  .attr("height", heightBox2 + marginBox2.top2 + marginBox2.bottom2)
.append("g")
  .attr("transform",
        "translate(" + 20 + "," + marginBox2.top2 + ")")
        	  	  .style("display", "none");

   
manager.addListener('dataReady', function (e) {
  	via();
});

manager.addListener('placeChanged', function (e) {
	cambio=true;
	updateBox();
});

function getData_box(){
	  return manager.getDataFilteredByParallel();
}
manager.addListener('parallelBrushing', function (e) {
    updateBox();
});

manager.addListener('yearChanged', function (e) {
	cambio=true;
	updateBox();
});

function via(){

	// create dummy data
	var data = getData_box();
	var vett12=[];
	k="mag";
	data.forEach(element => {
		   
		vett12.push((element[k]));
			
	});
	// Compute summary statistics used for the box:
	var data_sorted = vett12.sort(d3.ascending)
	var q1 = d3.quantile(data_sorted, .25)
	var median = d3.quantile(data_sorted, .5)
	var q3 = d3.quantile(data_sorted, .75)
	var interQuantileRange = q3 - q1
	var min = q1 - 1.5 * interQuantileRange
	var max = q1 + 1.5 * interQuantileRange

	// Show the Y scale
	var yBox = d3.scaleLinear()
	  .domain([3,10])
	  .range([heightBox, 0])
	
	svgBox.call(d3.axisLeft(yBox))

	// a few features for the box
	var centerD = 30
	var widthD = 50

	// Show the main vertical line
	svgBox
	.append("line")
	  .attr("x1", centerD)
	  .attr("x2", centerD)
	  .attr("y1", yBox(min) )
	  .attr("y2", yBox(max) )
	  .attr("stroke", "black")
	
	svgBox.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y",  -40)
	  .attr("x", 0-(heightBox/2))
	  .attr("dy", "1em")
	  .style("text-anchor", "middle")
	  .attr("fill", "black")
	  .text("Mag"); 

	// Show the box
	svgBox
	.append("rect")
	  .attr("x", centerD - widthD/2)
	  .attr("y", yBox(q3) )
	  .attr("height", (yBox(q1)-yBox(q3)) )
	  .attr("width", widthD )
	  .attr("stroke", "black")
	  .style("fill", "#69b3a2")

	// show median, min and max horizontal lines
	svgBox
	.selectAll("toto")
	.data([min, median, max])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD-widthD/2)
	  .attr("x2", centerD+widthD/2)
	  .attr("y1", function(d){ return(yBox(d))} )
	  .attr("y2", function(d){ return(yBox(d))} )
	  .attr("stroke", "black")
/////////////////////////////////////////////
var data_sorted3 = vett12.sort(d3.ascending)
	var q13 = d3.quantile(data_sorted3, .25)
	var median3 = d3.quantile(data_sorted3, .5)
	var q33 = d3.quantile(data_sorted3, .75)
	var interQuantileRange3 = q33 - q13
	var min3 = q13 - 1.5 * interQuantileRange3
	var max3 = q13 + 1.5 * interQuantileRange3

	// Show the Y scale
	var yBox3 = d3.scaleLinear()
	  .domain([3,10])
	  .range([heightBox, 0])
	 

	// a few features for the box
	var centerD3 = 30
	var widthD3 = 50

	// Show the main vertical line
	svgBox23
	.append("line")
	  .attr("x1", centerD3)
	  .attr("x2", centerD3)
	  .attr("y1", yBox3(min3) )
	  .attr("y2", yBox3(max3) )
	  .attr("stroke", "black")
	  	  .style("display", "none");


	// Show the box
	svgBox23
	.append("rect")
	  .attr("x", centerD3 - widthD3/2)
	  .attr("y", yBox3(q33) )
	  .attr("height", (yBox3(q13)-yBox3(q33)) )
	  .attr("width", widthD3 )
	  .attr("stroke", "black")
	  .style("fill", "#69b3a2")
	  	  .style("display", "none");


	// show median, min and max horizontal lines
	svgBox23
	.selectAll("toto")
	.data([min3, median3, max3])
	.enter()
	.append("line")
	  .attr("class", "lineBox")
	  .attr("x1", centerD3-widthD3/2)
	  .attr("x2", centerD3+widthD3/2)
	  .attr("y1", function(d3){ return(yBox3(d3))} )
	  .attr("y2", function(d3){ return(yBox3(d3))} )
	  .attr("stroke", "black")
	  	  .style("display", "none");

}
function updateBox(){
	
	// Show the Y scale
	var yBox = d3.scaleLinear()
	.domain([3,10])
	.range([heightBox, 0])
	
     if (manager.secondPlace== undefined){
		 	svgBox23.style("display", "none");


		// create dummy data
		var data = getData_box();
		var vett12=[];
		k="mag";
		data.forEach(element => {
			
			vett12.push(parseFloat(element[k]))
				
		});
		// Compute summary statistics used for the box:
		var data_sorted = vett12.sort(d3.ascending)
		var q1 = d3.quantile(data_sorted, .25)
		var median = d3.quantile(data_sorted, .5)
		var q3 = d3.quantile(data_sorted, .75)
		var interQuantileRange = q3 - q1
		var min2 = q1 - 1.5 * interQuantileRange
		var max2= q1 + 1.5 * interQuantileRange
		

		svgBox.call(d3.axisLeft(yBox))

		// a few features for the box
		var centerD = 30
		var widthD = 50
		
		var boxes1=svgBox.selectAll("line").remove();

		// Show the main vertical line
		svgBox.append("line")
		svgBox
		.append("line")
		.attr("x1", centerD)
		.attr("x2", centerD)
		.attr("y1", yBox(min2) )
		.attr("y2", yBox(max2) )
		.attr("stroke", "black")

		// Show the box
		svgBox
		.select("rect")
		.attr("x", centerD - widthD/2)
		.attr("y", yBox(q3) )
		.attr("height", (yBox(q1)-yBox(q3)) )
		.attr("width", widthD )
		.attr("stroke", "black")
		.style("fill", "#69b3a2")
		
		var boxes = svgBox.selectAll(".lineBox").data([min2,median,max2])
		boxes.exit().remove();
		// show median, min and max horizontal lines
		svgBox
		.selectAll("toto")
		.data([min2, median, max2])
		.enter()
		.append("line")
		.attr("class", "lineBox")
		.attr("x1", centerD-widthD/2)
		.attr("x2", centerD+widthD/2)
		.attr("y1", function(d){ return(yBox(d))} )
		.attr("y2", function(d){ return(yBox(d))} )
		.attr("stroke", "black")
		
		svgBox.selectAll(".lineBox")
			.data([min2,median,max2]).transition().duration(500)
			.attr("x1", centerD-widthD/2)
			.attr("x2", centerD+widthD/2)
			.attr("y1", function(d){ return(yBox(d))} )
			.attr("y2", function(d){ return(yBox(d))} )
			.attr("stroke", "black")
	}else{
		console.log("fdgdfd")
		var data = getData_boxDepth();
		var vett12=[];
		var vett3=[];
		k="mag";
		data.forEach(element => {
			if(element.place==manager.secondPlace) {
						vett3.push(parseFloat(element[k]))

			}else
			vett12.push(parseFloat(element[k]))
			
		});

		var data_sorted = vett12.sort(d3.ascending)
		var q1 = d3.quantile(data_sorted, .25)
		var median = d3.quantile(data_sorted, .5)
		var q3 = d3.quantile(data_sorted, .75)
		var interQuantileRange = q3 - q1
		var min2 = q1 - 1.5 * interQuantileRange
		var max2= q1 + 1.5 * interQuantileRange
		
		var data_sorted3 = vett3.sort(d3.ascending)
		var q13 = d3.quantile(data_sorted3, .25)
		var median23 = d3.quantile(data_sorted3, .5)
		var q33 = d3.quantile(data_sorted3, .75)
		var interQuantileRange3 = q33 - q13
		var min23 = q13 - 1.5 * interQuantileRange3
		var max23= q13 + 1.5 * interQuantileRange3
		
		if(vett12.length==0 && vett3!=0){
					var boxes1=svgBox.selectAll("line").remove();
					var boxes = svgBox.selectAll(".lineBox").data([min2,median,max2])
					boxes.exit().remove();
					
					svgBox
					.select("rect")

					  .attr("stroke", "white")
					  .style("fill", "white")
					  
					  // a few features for the box
		var centerD3 = 30
		var widthD3 = 50
		svgBox23.style("display", "block");
		svgBox.style("display", "block");

		var boxes13=svgBox23.selectAll("line").remove();
	
		// Show the main vertical line
		svgBox23.append("line")
		svgBox23
		.append("line")
		.attr("x1", centerD3)
		.attr("x2", centerD3)
		.attr("y1", yBox(min23) )
		.attr("y2", yBox(max23) )
		.attr("stroke", "black")
						.style("display", "block");


		// Show the box
		svgBox23
		.select("rect")
		.attr("x", centerD3 - widthD3/2)
		.attr("y", yBox(q33) )
		.attr("height", (yBox(q13)-yBox(q33)) )
		.attr("width", widthD3 )
		.attr("stroke", "black")
		.style("fill", "#6F257F")
						.style("display", "block");

		
		var boxes13 = svgBox23.selectAll(".lineBox").data([min23,median23,max23])
		boxes13.exit().remove();
		// show median, min and max horizontal lines
		svgBox23
		.selectAll("toto")
		.data([min23, median23, max23])
		.enter()
		.append("line")
		.attr("class", "lineBox")
		.attr("x1", centerD3-widthD3/2)
		.attr("x2", centerD3+widthD3/2)
		.attr("y1", function(d3){ return(yBox(d3))} )
		.attr("y2", function(d3){ return(yBox(d3))} )
		.attr("stroke", "black")
						.style("display", "block");

		
		svgBox23.selectAll(".lineBox")
			.data([min23,median23,max23]).transition().duration(500)
			.attr("x1", centerD3-widthD3/2)
			.attr("x2", centerD3+widthD3/2)
			.attr("y1", function(d3){ return(yBox(d3))} )
			.attr("y2", function(d3){ return(yBox(d3))} )
			.attr("stroke", "black")
							.style("display", "block");			
		}else if (vett12.length!=0 && vett3==0){
								svgBox.style("display", "block");	

			
					var boxes13=svgBox23.selectAll("line").remove();
					var boxes13 = svgBox23.selectAll(".lineBox").data([min23,median23,max23])
		boxes13.exit().remove();
		svgBox23.style("display", "none");	
		var centerD = 30
		var widthD = 50
		
		var boxes1=svgBox.selectAll("line").remove();

		// Show the main vertical line
		svgBox.append("line")
		svgBox
		.append("line")
		.attr("x1", centerD)
		.attr("x2", centerD)
		.attr("y1", yBox(min2) )
		.attr("y2", yBox(max2) )
		.attr("stroke", "black")

		// Show the box
		svgBox
		.select("rect")
		.attr("x", centerD - widthD/2)
		.attr("y", yBox(q3) )
		.attr("height", (yBox(q1)-yBox(q3)) )
		.attr("width", widthD )
		.attr("stroke", "black")
		.style("fill", "#69b3a2")
		
		var boxes = svgBox.selectAll(".lineBox").data([min2,median,max2])
		boxes.exit().remove();
		// show median, min and max horizontal lines
		svgBox
		.selectAll("toto")
		.data([min2, median, max2])
		.enter()
		.append("line")
		.attr("class", "lineBox")
		.attr("x1", centerD-widthD/2)
		.attr("x2", centerD+widthD/2)
		.attr("y1", function(d){ return(yBox(d))} )
		.attr("y2", function(d){ return(yBox(d))} )
		.attr("stroke", "black")
		
		svgBox.selectAll(".lineBox")
			.data([min2,median,max2]).transition().duration(500)
			.attr("x1", centerD-widthD/2)
			.attr("x2", centerD+widthD/2)
			.attr("y1", function(d){ return(yBox(d))} )
			.attr("y2", function(d){ return(yBox(d))} )
			.attr("stroke", "black")

			
			
			
			
		}else if (vett12.length==0 && vett3==0){
					svgBox.style("display", "none");	

		svgBox23.style("display", "none");	

		}else if (vett12.length!=0 && vett3!=0){
			// a few features for the box
		var centerD = 30
		var widthD = 50
		
		var boxes1=svgBox.selectAll("line").remove();
								svgBox.style("display", "block");	

		// Show the main vertical line
		svgBox.append("line")
		svgBox
		.append("line")
		.attr("x1", centerD)
		.attr("x2", centerD)
		.attr("y1", yBox(min2) )
		.attr("y2", yBox(max2) )
		.attr("stroke", "black")

		// Show the box
		svgBox
		.select("rect")
		.attr("x", centerD - widthD/2)
		.attr("y", yBox(q3) )
		.attr("height", (yBox(q1)-yBox(q3)) )
		.attr("width", widthD )
		.attr("stroke", "black")
		.style("fill", "#69b3a2")
		
		var boxes = svgBox.selectAll(".lineBox").data([min2,median,max2])
		boxes.exit().remove();
		// show median, min and max horizontal lines
		svgBox
		.selectAll("toto")
		.data([min2, median, max2])
		.enter()
		.append("line")
		.attr("class", "lineBox")
		.attr("x1", centerD-widthD/2)
		.attr("x2", centerD+widthD/2)
		.attr("y1", function(d){ return(yBox(d))} )
		.attr("y2", function(d){ return(yBox(d))} )
		.attr("stroke", "black")
		
		svgBox.selectAll(".lineBox")
			.data([min2,median,max2]).transition().duration(500)
			.attr("x1", centerD-widthD/2)
			.attr("x2", centerD+widthD/2)
			.attr("y1", function(d){ return(yBox(d))} )
			.attr("y2", function(d){ return(yBox(d))} )
			.attr("stroke", "black")
	/////////////////////////////////////////////



		// a few features for the box
		var centerD3 = 30
		var widthD3 = 50
		svgBox23.style("display", "block");

		var boxes13=svgBox23.selectAll("line").remove();
	
		// Show the main vertical line
		svgBox23.append("line")
		svgBox23
		.append("line")
		.attr("x1", centerD3)
		.attr("x2", centerD3)
		.attr("y1", yBox(min23) )
		.attr("y2", yBox(max23) )
		.attr("stroke", "black")
						.style("display", "block");


		// Show the box
		svgBox23
		.select("rect")
		.attr("x", centerD3 - widthD3/2)
		.attr("y", yBox(q33) )
		.attr("height", (yBox(q13)-yBox(q33)) )
		.attr("width", widthD3 )
		.attr("stroke", "black")
		.style("fill", "#6F257F")
						.style("display", "block");

		
		var boxes13 = svgBox23.selectAll(".lineBox").data([min23,median23,max23])
		boxes13.exit().remove();
		// show median, min and max horizontal lines
		svgBox23
		.selectAll("toto")
		.data([min23, median23, max23])
		.enter()
		.append("line")
		.attr("class", "lineBox")
		.attr("x1", centerD3-widthD3/2)
		.attr("x2", centerD3+widthD3/2)
		.attr("y1", function(d3){ return(yBox(d3))} )
		.attr("y2", function(d3){ return(yBox(d3))} )
		.attr("stroke", "black")
						.style("display", "block");

		
		svgBox23.selectAll(".lineBox")
			.data([min23,median23,max23]).transition().duration(500)
			.attr("x1", centerD3-widthD3/2)
			.attr("x2", centerD3+widthD3/2)
			.attr("y1", function(d3){ return(yBox(d3))} )
			.attr("y2", function(d3){ return(yBox(d3))} )
			.attr("stroke", "black")
							.style("display", "block");

		}


		
		
		
	}
}
