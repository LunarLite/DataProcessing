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

    //useData("data_schiphol.tsv");
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
			.text("Hoogste/Laagste/Gemiddelde Windsnelheid Schiphol/Maastricht");
		  
		// Axis setups
		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y))
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.attr("fill", "#000")
				.text("windsnelheidgem (0.1 M/S)");

		// Manipulate all .wind class elements
		var wind = g.selectAll(".wind")
			.data(winds)
			.enter().append("g")
				.attr("class", "wind")

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
			 
		/*
		 .on('mouseover', function(d){
				console.log(d);
			})
		*/
	});

	function type(d, _, columns) 
	{
	  d.date = parseTime(d.date);
	  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
	  return d;
	}
}