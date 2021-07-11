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

// Determine chart's dimensions
var chartW = svgW - margin.right - margin.left;
var chartH = svgH - margin.top - margin.bottom;

// STEP 2: Create the SVG wrapper ************
// Append SVG wrapper and group that will hold chart
let svg = d3
    .select(".chart")
    .select("#scatter")
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