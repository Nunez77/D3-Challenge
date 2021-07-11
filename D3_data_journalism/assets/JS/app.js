// @TODO: YOUR CODE HERE!

// Using the D3 techniques we taught you in class,
// create a scatter plot that represents each state with circle elements.
// You'll code this graphic in the app.js file of your homework directory—make sure
// you pull in the data from data.csv by using the d3.csv function.
// Your scatter plot should ultimately appear like the image at the top of this section.

// - Include state abbreviations in the circles.
// - Create and situate your axes and labels to the left and bottom of the chart.
// - Note: You'll need to use python -m http.server to run the visualization.
//   This will host the page at localhost:8000 in your web browser.

// STEP 1:  Set up the chart ***********
// Set SVG dimensions and borders
var svgW = 960
var svgH = 620
var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
};
//  var width = svgWidth * .75;
// var height = svgHeight * .75;

// Determine chart's dimensions
var chartW = svgW - margin.right - margin.left;
var chartH = svgH - margin.top - margin.bottom;

// STEP 2: Create the SVG wrapper ************
// Append SVG wrapper and group that will hold chart
let svg = d3
    .select(".chart")
    // .select("#scatter")
    .append("svg")
    .attr("class","chart")
    .attr("width",svgW)
    .attr("height",svgH);

let chartGroup = svg.append("g") // The ‘g’ element is a container element for grouping together related graphics elements.
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

// STEP 3: Import data *******************
// Open file and assign values to x and y axis.
d3.csv("assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    data.forEach(function(data) {
        data.income = +data.income;        // Select Income
        data.smokes = +data.smokes;        // Select Smokes
    });

    // Scale y to chart height
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataArray)])
        .range([chartH, 0]);
    // Scale x to chart width
    var xScale = d3.scaleLinear()
        .range([0, chartW]);

    // Create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    // Create variable variables
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(data, function (data) {
        return data.income;
    });

    xMax = d3.max(data, function (data) {
        return data.income;
    });

    yMin = d3.min(data, function (data) {
        return data.smokes;
    });

    yMax = d3.max(data, function (data) {
        return data.smokes;
    });

    var xScale = xScale.domain([xMin, xMax]);
    var yScale = yScale.domain([yMin, yMax]);

    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.income +2))
        .attr("cy", d => yScale(d.smokes +1))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".3")
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.abbr}`);
        });

    chartGroup.call(toolTip);

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })

        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    chartGroup.append("text")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(data)
        .enter()
        .append("tspan")
            .attr("x", function (data) {
                return xScale(data.income + 1.5);
            })
            .attr("y", function (data) {
                return yScale(data.smokes + .5);
            })
            .text(function (data) {
                return data.abbr
            });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "text")
        .text("Annual Income ($USD)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 1.5}, ${height + margin.top + 40})`)
        .attr("class", "text")
        .text("Smokes (%)");
});
    

