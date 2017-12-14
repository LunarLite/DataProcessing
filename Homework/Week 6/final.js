/* Homework Week 5
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
	
	//Bartchart showing Quality of Life ratings, sorted by rank for 28 EU countries.
	barSvg = parentSvg.append('svg')
		.attr('width', width/3)
		.attr('height', height)
		.classed("barSvg", true);
	
	// add a tooltip object
	var barTip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Rank:</strong> <span style='color:red'>" + d.Rank +"</span><br>" + 
			"<strong>Country:</strong> <span style='color:red'>" + d.Country + "</span>";
		})

	barSvg.call(barTip);
	var barSelection = barSvg.selectAll("rect")
		.data(qol)
	
	// add a new bar based on json data
	barSelection.enter().append("rect")
		.attr("x",  0)
		.attr("y", function(d, i) {return i*(height/28)})
		.attr("width", function(d, i) {return d.Quality_of_Life_Index})
		.attr("height", (height/28)-1)
		.classed("bar", true)
		.on('mouseover', barTip.show)
		.on('mouseout', barTip.hide);

		
	//Bartchart showing Quality of Life influences for 1 country from the EU (based on click)
	flowerSvg = parentSvg.append('svg')
		.data(qol_reasons)
		.attr('width', (width/3)*2)
		.attr('height', height)
		.attr('x', width/3)
		.classed("flowerSvg", true);
}