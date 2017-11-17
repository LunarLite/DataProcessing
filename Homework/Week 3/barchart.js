// Homework Week 3
// Name: Mick Tozer
// Collaborators: 
//
// This draws out a barchart spanning across a year.
// It shows both positive and negative temperatures and a date when hovering over.


// D3.json function to GET data
d3.json("jsondata.json", function(json){
	// add the loaded json data into var-data
	UseData(json);
});

// Function for actually using said data through callback
function UseData(data) {

	// add a tooltip object
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Date:</strong> <span style='color:red'>" + datify(d.Date) +"</span><br>" + 
			"<strong>Temperature:</strong> <span style='color:red'>" + d.Temp/10 + "°C</span>";
		})
		
	// convert data into a valid date
	function datify(input){
		var year = input.substring(0,4);
		var month = input.substring(4,6);
		var day = input.substring(6,8);
		var date = new Date(year, month, day);
		date = String(date).substring(0,10);
		return date;
	}

	// select the svg to work in
	var svg = d3.select(".chart svg")
	svg.call(tip);
	var selection = svg.selectAll("rect")
		.data(data)

	// add a new bar based on json data
	selection.enter().append("rect")
		.attr("class", function (d, i) { return d.Temp>0 ? "bar hotbar" : "bar coldbar"})
		.attr("x",  function(d, i) {return i * 3})
		.attr("y", function(d, i) {return d.Temp>0 ? 500 - d.Temp*2 : 500})
		.attr("width", 3)
		.attr("height", function(d, i) {return d.Temp>0 ? d.Temp * 2 : -d.Temp * 3})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		
	// basic points for x-axis line
	var points = [
		{ x: 0, y: 500 },
		{ x: 1100, y: 500 }
	]
	
	// return line positions
	var lineFn = d3.svg.line()
		.x(function(d) { return d.x })
		.y(function(d) { return d.y })
		//.interpolate("cardinal")
	
	// add path ("line")
	svg.append("path")
		.style("fill", "none")
		.style("stroke", "grey")
		.style("stroke-width", 3)
		.attr("d", lineFn(points))	
}