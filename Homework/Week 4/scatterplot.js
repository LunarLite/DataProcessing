/* Homework Week 4
/  Name: Mick Tozer
/  Collaborators: 
/ 
/  This draws out a scatterplot showing the GDP for NLD, LUX ad BEL.
/  when hovering over either the legend or a dot, opacity gets changed for a majority of the dots.
/  hovering over shows the exact year and GDP for that year
/  The size of the dot shows the growth of that year, relative to the previous year.
*/


// Setting up the outlines of the plot
var margin = {top: 20, right: 20, bottom: 30, left: 60},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

	
// add a tooltip object
var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>" + d.LOCATION + "</strong><br>" + 
		"<strong>Year:</strong> <span style='color:red'>" + d.TIME +"</span><br>" + 
		"<strong>GDP:</strong> <span style='color:red'>$" + d.Value + "</span>";
	});
	
// setup the svg
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.classed("plot", true)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add tip to the svg
svg.call(tip);

// load the data in from the .tsv
d3.tsv("data.tsv", function(error, data) {
	if (error) {
		// report error if it failed
		svg.append("text")
			.attr("class", "label")
			.attr("x", width/3)
			.attr("y", height/2)
			.style("font-size", "20px")
			.style("font-weight", "bold")
			.text("Failed to load due to: " + error);
			throw error;
	}
	// set data variables for the axis
	data.forEach(function(d) {
		d.date = +d.TIME;
		d.value = +d.Value;
	});
	
// set axis domains based on data
x.domain(d3.extent(data, function(d) { return d.date; })).nice();
y.domain(d3.extent(data, function(d) { return d.value; })).nice();

// append g object to the axis, adding label
// x
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
  .append("text")
	.attr("class", "label")
	.attr("x", width)
	.attr("y", -6)
	.style("text-anchor", "end")
	.text("Period (p.year)");
// y	
svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
  .append("text")
	.attr("class", "label")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("Gross domestic product (Mln. USD)")

// create dots for each i in data
svg.selectAll(".dot")
	.data(data)
  .enter().append("circle")
	.attr("class", "dot")
	.attr("r", function(d, i) {
			if(i > 0){
				var prevLocation = data[i-1].LOCATION;
				var prevValue = data[i-1].Value;
				
				// determine required size of dots
				if(d.LOCATION == prevLocation){
					size = (d.value - prevValue);
					size /= prevValue;
					size *= 100; // this is the percentage growth;
					return Math.abs(1 * size);
				}
			}
			return 5;
		})
	.attr("cx", function(d) { return x(d.date); })
	.attr("cy", function(d) { return y(d.value); })
	.style("fill", function(d) { 
			// determine colour
			if(d.LOCATION == "BEL"){
				return "yellow";
			}
			else if(d.LOCATION == "LUX"){
				return "orange";
			}
			else{
				return "red";
			}
		})
	// fix opacity for all dots
	.on('mouseover', function(d){
			tip.show(d)
			svg.selectAll(".dot")
				.style("opacity", 0.2)
			d3.select(this)
				.style("opacity", 1);
		})
	.on('mouseout',  function(d) {
			tip.hide(d)
			svg.selectAll(".dot")
				.style("opacity", 1)
		});

// add options for legend
legendColours = ["NLD","BEL", "LUX"];
// add actual legend
var legend = svg.selectAll(".legend")
	.data(legendColours)
  .enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
// create legend boxes with colours
legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", function(d) { 
			if(d == "BEL"){
				legendLocation = "BEL";
				return "yellow";
			}
			else if(d == "LUX"){
				legendLocation = "LUX";
				return "orange";
			}
			else{
				legendLocation = "NLD";
				return "red";
			}
		})
	// make all dots have low opacity based on the legend item hovered over
	.on('mouseover', function(d){
			var con = d;
			svg.selectAll(".dot")
				.style("opacity", function(d){
					if(d.LOCATION == con){
						return 1;
					}
					else{
						return 0.2;
					}
				})
		})
	.on('mouseout',  function(d) {
			svg.selectAll(".dot")
				.style("opacity", 1)
		});

// add legend description from data array
legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { return d; });
});
