function makeResponsive() {
  
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
  };

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
  var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the data.csv with d3.csv function
  d3.csv("assets/data/data.csv").then(function(censusData) {
    // console.log(censusData);

    // Parse data to numerical values
    censusData.forEach(function(d) {
        d.age = +d.age;
        d.smokes = +d.smokes;
        d.abbr = +d.abbr;
      });
    
    // Configure the x-axis scale for the horizontal axis
    var xAgeScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.age) - 1, d3.max(censusData, d => d.age) + 3])
    .range([0, chartWidth]);

    // Configure the y-axis for the smoking data
    var yLinearScale = d3.scaleLinear()
    .domain([9, d3.max(censusData, d => d.smokes) + 2])
    .range([chartHeight, 0]);

    // Pass the scales as arguments
    var bottomAxis = d3.axisBottom(xAgeScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes
    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xAgeScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("class", "stateCircle")
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".75")
  
    var textGroup = chartGroup.selectAll(".stateText")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xAgeScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .text(d => d.abbr)
    .attr("class", "stateText")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    // Initialise tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>State: ${d.age}<br>Smoking %: ${d.smokes}`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 4)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 8})`)
      .attr("class", "axisText")
      .text("Age (median)");
  }).catch(function(error) {
    console.log(error);
});
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);