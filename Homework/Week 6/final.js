/* Homework Week 6/7
/  Name: Mick Tozer
/  Collaborators: 
/ 
/  This draws out a linegraph showing lowest/highest/average windspeed around Schiphol and Maastricht.
/  You can switch between either linegraphs using the buttons.
/
/  IN PROGRESS: You can hover the mouse over the line to see the exact data in the form of a tooltip of sorts.
*/

// Setup the base svg
 var width = 960,
	height = 500;
 
var parentSvg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
	.classed("parentSvg", true);
 
queue()
	.defer(d3.json, 'countries_qol.json')
	.defer(d3.json, 'countries_qol_reasons.json')
	.await(DrawData);

function DrawData(error, qol, qol_reasons) {
	
	if (error) throw error;
	
	// Add a tooltip object
	var barTip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Rank:</strong> <span style='color:red'>" + d.Rank +"</span><br>" + 
			"<strong>Country:</strong> <span style='color:red'>" + d.Country + "</span><br>" +
			"<strong>Quality of life rating:</strong> <span style='color:red'>" + d.Quality_of_Life_Index + "</span>";
		});
	
	// BarChart showing Quality of Life ratings, sorted by rank for 28 EU countries.
	barSvg = parentSvg.append('svg')
		.attr('width', width/3)
		.attr('height', height)
		.classed("barSvg", true);
	
	barSvg.call(barTip);
	
	var axisText = barSvg.selectAll("text")
		.data(qol)
		.enter()
		.append("text")
			.attr("x",  10)
			.attr("y", function(d, i) {return (i*((height-50)/28)) + 53 + ((height-50)/28)/2})
			.text(function(d){return d.Rank + ". " + d.Country});
	
	var barSelection = barSvg.selectAll("rect")
		.data(qol)
	
	// Add a new bar based on json data
	barSelection.enter().append("rect")
		.attr("x",  120)
		.attr("y", function(d, i) {return (i*((height-50)/28)) + 50})
		.attr("width", function(d, i) {return d.Quality_of_Life_Index})
		.attr("height", ((height-50)/28)-1)
		.classed("bar", true)
		.on('mouseover', barTip.show)
		.on('mouseout', barTip.hide);
	
	var index = 1;
	
	var flowerData = [
	{legend:"Purchasing_Power_Index", value: qol_reasons[index].Purchasing_Power_Index},
	{legend:"Safety_Index", value: qol_reasons[index].Safety_Index},
	{legend:"Health_Care_Index", value: qol_reasons[index].Health_Care_Index},
    {legend:"Cost_of_Living_Index", value: qol_reasons[index].Cost_of_Living_Index},
    {legend:"Property_Price_to_Income_Ratio", value: qol_reasons[index].Property_Price_to_Income_Ratio},
    {legend:"Traffic_Commute_Time_Index", value: qol_reasons[index].Traffic_Commute_Time_Index},
    {legend:"Pollution_Index", value: qol_reasons[index].Pollution_Index},
	{legend: "Climate_Index", value:qol_reasons[index].Climate_Index}
	];

	// FlowerChart showing Quality of Life influences for 1 country from the EU (based on click)
	flowerSvg = parentSvg.append('svg')
		.data(flowerData)
		.attr('width', (width/3)*2)
		.attr('height', height)
		.attr('x', width/3)
		.classed("flowerSvg", true)

	var flowerWidth = (width / 3) * 2;
	var flowerHeight = height;
	var radius = Math.min(flowerWidth, flowerHeight) / 2 - 20;
	var donutWidth = 100;
	var legendRectSize = 18;
	var legendSpacing = 4;
	
	var g = flowerSvg.append('g')
		.attr('x', (width/6)*5)
		.attr('y', height/2)
		.attr('transform', 'translate(' + (flowerWidth / 2) +  ',' + (flowerHeight / 2) + ')');
		
	var color = d3.scale.category20b()
	
	var arc = d3.svg.arc()
		.innerRadius(radius - donutWidth)
		.outerRadius(radius);
		
	var pie = d3.layout.pie()
		.value(function(d) {return d.value; })
		.sort(null);
		
	var path = g.selectAll('path')
		.data(pie(flowerData))
		.enter()
		.append('path')
		.attr("class", "arc")
		.attr("id", function(d,i) { return "arc_"+i; })
		.attr('d', arc)
		.attr('fill', function(d) {return color(d.value);})
				
				
	//Append the month names to each slice
	g.selectAll(".arcText")
		.data(flowerData)
			.enter().append("text")
				.attr("class", "arcText")
			.append("textPath")
				.attr("xlink:href",function(d,i){return "#arc_"+i;})
				//.attr("x",function(d,i){return "#arc_"+i+"x";})
				.text(function(d){return d.legend;});	
	/* Adds text, but it's not visible?
	var text = path.append("text")
		.attr("text-anchor", "middle")
		.text(function(d) {return d.data.legend;});
	*/
	
	var legend = g.selectAll('.legend')
		.data(color.domain())
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', function(d, i) {
			var height = legendRectSize + legendSpacing;
			var offset =  height * color.domain().length / 2;
			var horz = -2 * legendRectSize;
			var vert = i * height - offset;
			return 'translate(' + horz + ',' + vert + ')';
		});
		
	legend.append('rect')
		.attr('width', legendRectSize)
		.attr('height', legendRectSize)
		.attr('x', -30)
		.style('fill', color)
		.style('stroke', color);
	legend.append('text')
		.data(flowerData)
		.attr('x', legendRectSize + legendSpacing - 30)
		.attr('y', legendRectSize - legendSpacing)
		.text(function(d) { return d.legend.replace(/_/g, " ");});
}





