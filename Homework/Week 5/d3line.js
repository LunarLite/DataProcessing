/* Homework Week 5
/  Name: Mick Tozer
/  Collaborators: 
/ 
/  This draws out a linegraph showing lowest/highest/average windspeed around Schiphol and Maastricht.
/  You can switch between either linegraphs using the buttons.
/
/  IN PROGRESS: You can hover the mouse over the line to see the exact data in the form of a tooltip of sorts.
*/

function init()
{
    //setup our ui
    d3.select("#data1")
        .on("click", function(d,i) {
            useData("data_schiphol.tsv");
        })   
    d3.select("#data2")
        .on("click", function(d,i) {
            useData("data_maastricht.tsv");
        })   

    useData("data_schiphol.tsv");
}

function useData(dataName)
{
	// Setup the base svg
	var svg = d3.select("svg"),
		margin = {top: 20, right: 100, bottom: 30, left: 100},
		width = svg.attr("width") - margin.left - margin.right,
		height = svg.attr("height") - margin.top - margin.bottom;
		
	// Clear SVG before next dataset
	d3.selectAll("svg > *").remove();
	
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// Store a timeparsing function
	var parseTime = d3.timeParse("%Y%m%d");

	// Set axis types
	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	// Create line function basics
	var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.windsnelheidgem); });

	// Load in the default dataset (Schiphol)
	d3.tsv(dataName, type, function(error, data) 
	{
	  if (error) throw error;		  
		  
		var color = d3.scale.category10();
		// Store data, starting from 3rd (0-1-2) column, thus storing only the wind.
		var winds = data.columns.slice(2).map(function(id) 
		{
			return {
				id: id,
				values: data.map(function(d) 
				{
					return {date: d.date, windsnelheidgem: d[id]};
				})
			};
		});

		// Setup for domains
		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([
			d3.min(winds, function(c) { return d3.min(c.values, function(d) { return d.windsnelheidgem; }); }),
			d3.max(winds, function(c) { return d3.max(c.values, function(d) { return d.windsnelheidgem; }); })
		]);
		z.domain(winds.map(function(c) { return c.id; }));

		// Title
		g.append("text")
			.attr("x", 50)
			.attr("fill", "#000")
			.text("Hoogste/Laagste/Gemiddelde Windsnelheid from: " + dataName.slice(5, -4).toUpperCase());
		  
		// Axis setups
		g.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		g.append("g")
			.call(d3.axisLeft(y))
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.attr("fill", "#000")
				.text("windsnelheid (0.1 M/S)");

		// Manipulate all .wind class elements
		var wind = g.selectAll(".wind")
			.data(winds)
			.enter().append("g")

		// Draw path
		wind.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return z(d.id); })
			
		// Add text at the end
		wind.append("text")
			.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.windsnelheidgem) + ")"; })
			.attr("x", 3)
			.attr("dy", "0.35em")
			.style("font", "10px sans-serif")
			.text(function(d) { return d.id; });

		// Create mouse object
		var mouseG = svg.append("g")
			.attr("class", "mouse-over-effects");
			
		mouseG.append("path") // this is the black vertical line to follow mouse
			.attr("class", "mouse-line")
			.style("stroke", "black")
			.style("stroke-width", "1px")
			.style("opacity", "0");
			
		var lines = document.getElementsByClassName('line');

		var mousePerLine = mouseG.selectAll('.mouse-per-line')
			.data(winds)
			.enter()
				.append("g")
				.attr("class", "mouse-per-line");
			
		mousePerLine.append("circle")
			.attr("r", 7)
			.style("stroke", function(d) {
				return color(d.name);
			})
			.style("fill", "none")
			.style("stroke-width", "1px")
			.style("opacity", "0");

		mousePerLine.append("text")
			.attr("transform", "translate(10,3)");
	  
		mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
			.attr('width', width) // can't catch mouse events on a g element
			.attr('height', height)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('mouseout', function() 
			{ // on mouse out hide line, circles and text
				d3.select(".mouse-line")
					.style("opacity", "0");
				d3.selectAll(".mouse-per-line circle")
					.style("opacity", "0");
				d3.selectAll(".mouse-per-line text")
					.style("opacity", "0");
			})
			.on('mouseover', function() 
			{ // on mouse in show line, circles and text
				d3.select(".mouse-line")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line circle")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line text")
					.style("opacity", "1");
			})
			.on('mousemove', function() 
			{ // mouse moving over canvas
				var mouse = d3.mouse(this);
				d3.select(".mouse-line")
					.attr("d", function() 
					{
						var d = "M" + mouse[0] + "," + height;
						d += " " + mouse[0] + "," + 0;
						return d;
					})
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				d3.selectAll(".mouse-per-line")
				.attr("transform", function(d, i) 
				{
					var xDate = x.invert(mouse[0]),
					bisect = d3.bisector(function(d) 
					{ return d.date; }).right;
					idx = bisect(d.values, xDate);
            
					var beginning = 0,
					end = lines[i].getTotalLength(),
					target = null;

					while (true){
					  target = Math.floor((beginning + end) / 2);
					  pos = lines[i].getPointAtLength(target);
					  if ((target === end || target === beginning) && pos.x !== mouse[0]) {
						  break;
					  }
					  if (pos.x > mouse[0])      end = target;
					  else if (pos.x < mouse[0]) beginning = target;
					  else break; //position found
					}
            
					d3.select(this).select('text')
					  .text(y.invert(pos.y).toFixed(2));
					
					return "translate(" + (mouse[0] + margin.left) + "," + pos.y + ")";
				});
      });
	});

	function type(d, _, columns) 
	{
	  d.date = parseTime(d.date);
	  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
	  return d;
	}
}
