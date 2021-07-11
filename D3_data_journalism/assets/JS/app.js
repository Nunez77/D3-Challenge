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

var svgW = 768;
var svgH = 496;

var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
};

// Determine chart's dimensions
var width = svgW - margin.right - margin.left;
var height = svgH - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var chart = d3
    .select("#scatter")
    .append("div")
    .classed("chart", true);

// Append an SVG group
var svg = chart.append("svg")
    .attr("width", svgW)
    .attr("height", svgH);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var Selected_X = "poverty";
var Selected_Y = "healthcare";

// Function used for updating x-scale var upon click on axis label
function xScale(DescriptiveData, Selected_X) {
    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(DescriptiveData, d => d[Selected_X]) * 0.8,
            d3.max(DescriptiveData, d => d[Selected_X]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

// Function used for updating y-scale var upon click on axis label
function yScale(DescriptiveData, Selected_Y) {
    // Create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(DescriptiveData, d => d[Selected_Y]) * 0.8,
            d3.max(DescriptiveData, d => d[Selected_Y]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

// Function used for updating x-axis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// Function used for updating y-axis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// Function used for updating circles group with a transition to new circles
// with new selections
function renderCircles(circlesGroup, newXScale, Selected_X, newYScale, Selected_Y) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[Selected_X]))
        .attr("cy", data => newYScale(data[Selected_Y]));

    return circlesGroup;
}

// Function to update state labels 
function renderText(textGroup, newXScale, Selected_X, newYScale, Selected_Y) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[Selected_X]))
        .attr("y", d => newYScale(d[Selected_Y]));

    return textGroup;
}
// Function used for updating styles according to variable
function styleX(value, Selected_X) {

    // Update style according to variable: Poverty
    if (Selected_X === 'poverty') {
        return `${value}%`;
    }
    // Update style according to variable: Household Income
    else if (Selected_X === 'income') {
        return `USD $${value}`;
    }
    // Update style according to variable: Age
    else {
        return `${value}`;
    }
}

// Function used for updating circles group with new tooltip
function updateToolTip(Selected_X, Selected_Y, circlesGroup) {

    //select x label
    //poverty percentage
    if (Selected_X === 'poverty') {
        var xLabel = "Poverty:";
    }
    //household income in dollars
    else if (Selected_X === 'income') {
        var xLabel = "Median Income:";
    }
    //age (number)
    else {
        var xLabel = "Age:";
    }

    //select y label
    //percentage lacking healthcare
    if (Selected_Y === 'healthcare') {
        var yLabel = "No Healthcare:"
    }
    //percentage obese
    else if (Selected_Y === 'obesity') {
        var yLabel = "Obesity:"
    }
    //smoking percentage
    else {
        var yLabel = "Smokers:"
    }

    //create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[Selected_X], Selected_X)}<br>${yLabel} ${d[Selected_Y]}%`);
        });

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}

//retrieve csv data and execute everything below
d3.csv("./assets/data/data.csv").then(function(DescriptiveData) {

    console.log(DescriptiveData);

    //parse data
    DescriptiveData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create first linear scales
    var xLinearScale = xScale(DescriptiveData, Selected_X);
    var yLinearScale = yScale(DescriptiveData, Selected_Y);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(DescriptiveData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[Selected_X]))
        .attr("cy", d => yLinearScale(d[Selected_Y]))
        .attr("r", 12)
        .attr("opacity", ".5");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(DescriptiveData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[Selected_X]))
        .attr("y", d => yLinearScale(d[Selected_Y]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    //create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Median)")

    var incomeLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Median)")

    //create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");

    //updateToolTip function with data
    var circlesGroup = updateToolTip(Selected_X, Selected_Y, circlesGroup);

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != Selected_X) {

                //replace Selected_X with value
                Selected_X = value;

                //update x scale for new data
                xLinearScale = xScale(DescriptiveData, Selected_X);

                //update x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, Selected_X, yLinearScale, Selected_Y);

                //update text with new x values
                textGroup = renderText(textGroup, xLinearScale, Selected_X, yLinearScale, Selected_Y);

                //update tooltips with new info
                circlesGroup = updateToolTip(Selected_X, Selected_Y, circlesGroup);

                //change classes to change bold text
                if (Selected_X === "poverty") {
                    povertyLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else if (Selected_X === "age") {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", true).classed("inactive", false);
                }
            }
        });

    //y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != Selected_Y) {

            //replace Selected_Y with value
            Selected_Y = value;

            //update y scale for new data
            yLinearScale = yScale(DescriptiveData, Selected_Y);

            //update x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            //update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, Selected_X, yLinearScale, Selected_Y);

            //update text with new y values
            textGroup = renderText(textGroup, xLinearScale, Selected_X, yLinearScale, Selected_Y)

            //update tooltips with new info
            circlesGroup = updateToolTip(Selected_X, Selected_Y, circlesGroup);

            //change classes to change bold text
            if (Selected_Y === "obesity") {
                obesityLabel.classed("active", true).classed("inactive", false);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else if (Selected_Y === "smokes") {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", true).classed("inactive", false);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", true).classed("inactive", false);
            }
        }
    });
    


    
});

