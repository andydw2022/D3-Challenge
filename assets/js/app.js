// function to change Xaxis scale when new label is chosen by the user
function xScale(xdata, currentXAxis, width) {
  // create scales
  //console.log('xscale : xaxis , width', currentXAxis, width);
  console.log(xdata);
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(xdata, d => d[currentXAxis]) * .5,
    d3.max(xdata, d => d[currentXAxis]) * 1.5])
    .range([0, width]);
  return xLinearScale;
}
// function to change Yaxis scale when new label is chosen by the user
function yScale(ydata, currentYAxis, height) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(ydata, d => d[currentYAxis]) * .8,
    d3.max(ydata, d => d[currentYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  //console.log('newxScale', newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  //console.log('newYScale', newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}
// function used for updating data points as circles with a transition 
function renderCircles(circlesGroup, newXScale, newYScale, currentXAxis, currentYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentXAxis]))
    .attr("cy", d => newYScale(d[currentYAxis]));
  return circlesGroup;
}
// function used for updating text within data points as circles with a transition 
function renderdata(circletextdata, newXScale, newYScale, currentXAxis, currentYAxis) {
    circletextdata.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[currentXAxis]))
        .attr("y", d => newYScale(d[currentYAxis]));
    return circletextdata;
}
// function used for updating circles group with new tooltip
function updateToolTip(currentXAxis, currentYAxis, circles, circledata) {
  //console.log('updatetooltip', currentXAxis);
  //console.log('updatetooltip', currentYAxis);
  var xlabel;
  var ylabel;
  if (currentXAxis === "age") {
    xlabel = "Age (Median)";
  }
  else if (currentXAxis === "income") {
    xlabel = "Income (Median)";
  }
  else {
    xlabel = "Poverty (%)";
  }
  if (currentYAxis === "healthcare") {
    ylabel = "Healthcare (%)";
  }
  else if (currentXAxis === "smokes") {
    ylabel = "Smokers (%)";
  }
  else {
    ylabel = "Obesity (%)";
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10,-10])
    .attr("class", "d3-tip")
    .html(function (d) {
      return (`${d.state}<hr>${xlabel}${d[currentXAxis]}<br>${ylabel} ${d[currentYAxis]}`);
    });

  circles.call(toolTip);
    circles.
     on("mouseover", function (data) {
       toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  return circles;
}
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {
  // Select div by id.
  var svgArea = d3.select("#scatter").select("svg");
  // Clear SVG.
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  //SVG params.
  var svgHeight = window.innerHeight / 1.2;
  var svgWidth = window.innerWidth / 1.7;
  // Margins.
  var margin = {
    top:    50,
    right:  50,
    bottom: 100,
    left:   80
  };
  // Start with these axes on loading
  var currentXAxis = 'poverty';
  var currentYAxis = 'healthcare';

  //Define drawing area
  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;
  console.log('Height ', height);
  console.log('width ', width);
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  // Retrieve data from the CSV file, parse and execute everything below
  d3.csv("assets/data/data.csv").then(function (ushealthdata, err) {
    if (err) throw err;
    ushealthdata.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.abbr= data.abbr;
      data.smokes = +data.smokes;
      data.income = +data.income;
      data.obesity = data.obesity;
    });
    //display initial axes data as a check
    console.log('min poverty', d3.min(ushealthdata, d => d[currentXAxis]));
    console.log('min poverty', d3.min(ushealthdata, d => d[currentXAxis]));
    console.log('max healthcare', d3.max(ushealthdata, d => d[currentXAxis]));
    console.log('max healthcare', d3.max(ushealthdata, d => d[currentXAxis]));
    console.log('first plot ', currentXAxis, ' vs ', currentYAxis);

    //Define x/y scales
    var xLinearScale = xScale(ushealthdata, currentXAxis, width);
    var yLinearScale = yScale(ushealthdata, currentYAxis, height);
    // Create initial axis functions
    console.log('xLinearScale', xLinearScale);
    console.log('yLinearScale', yLinearScale);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(ushealthdata);
    // Bind data to circlesGroup
    var elemData = circlesGroup.enter();
    // These will be the circles of data to be plotted
    var circles = elemData.append("circle")
      .attr("cx", d => xLinearScale(d[currentXAxis]))
      .attr("cy", d => yLinearScale(d[currentYAxis]))
      .attr("r", 17)
      .classed("stateCircle", true);
    //Bind labels, values data text circles plotted above
    var circledata = elemData.append("text")
      .attr("x", d => xLinearScale(d[currentXAxis]))
      .attr("y", d => yLinearScale(d[currentYAxis]))
      .attr("dy", ".35em")
      .text(d => d.abbr)
      .classed("stateText", true);
    // updateToolTip function 
    var circlesGroup = updateToolTip(currentXAxis, currentYAxis, circles, circledata);
    // Create group for three x-axis labels
    var labelsGroupX = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var povertyLabel = labelsGroupX.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty(%)");
    var agelabel = labelsGroupX.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
    var incomelabel = labelsGroupX.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // Create group for three y-axis labels
    var labelsGroupY = chartGroup.append("g")
      .attr("transform", "rotate(-90)");
    var healthcarelabel = labelsGroupY.append("text")
      .attr("x", 0 - (height / 2))
      .attr("y", 40 - margin.left)
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks Health care (%)");
    var smokeslabel = labelsGroupY.append("text")
      .attr("x", 0 - (height / 2))
      .attr("y", 20 - margin.left)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");
    var obesitylabel = labelsGroupY.append("text")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obesity(%)");

    // X labels event listener.
    labelsGroupX.selectAll("text")
      .on("click", function () {
      // Grab selected label.
      currentXAxis = d3.select(this).attr("value");
      // Update xLinearScale.
      xLinearScale = xScale(ushealthdata, currentXAxis, width);
      // Render xAxis.
      xAxis = renderXAxes(xLinearScale, xAxis);
      // Switch active/inactive labels.
      if (currentXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        agelabel
          .classed("active", false)
          .classed("inactive", true);
        incomelabel
          .classed("active", false)
          .classed("inactive", true);
      } else if (currentXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        agelabel
          .classed("active", true)
          .classed("inactive", false);
        incomelabel
          .classed("active", false)
          .classed("inactive", true);
      } else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        agelabel
          .classed("active", false)
          .classed("inactive", true)
        incomelabel
          .classed("active", true)
          .classed("inactive", false);
      }
      // Update circles with new x values.
      circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
      // Update tool tips with new info.
      circlesGroup = updateToolTip(currentXAxis, currentYAxis, circle, circledata);
      // Update circles text with new values.
      circledata = renderdata(circledata, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
      });

      // Y Labels event listener.
      labelsGroupY.selectAll("text")
        .on("click", function () {
        // Select the new label
        currentYAxis = d3.select(this).attr("value");
        // Update yLinearScale.
        yLinearScale = yScale(ushealthdata, currentYAxis, height);
        // Update yAxis.
        yAxis = renderYAxes(yLinearScale, yAxis);
        // Changes classes to change bold text.
        if (currentYAxis === "healthcare") {
          healthcarelabel
            .classed("active", true)
            .classed("inactive", false);
          smokeslabel
            .classed("active", false)
            .classed("inactive", true);
          obesitylabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (currentYAxis === "smokes") {
            healthcarelabel
              .classed("active", false)
              .classed("inactive", true);
            smokeslabel
              .classed("active", true)
              .classed("inactive", false);
            obesitylabel
              .classed("active", false)
              .classed("inactive", true);
        } else {
            healthcarelabel
              .classed("active", false)
              .classed("inactive", true);
            smokeslabel
              .classed("active", false)
              .classed("inactive", true);
            obesitylabel
              .classed("active", true)
              .classed("inactive", false);
        }
        // Update circles with new y values.
        circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
        // Update tool tips with new info.
        circlesGroup = updateToolTip(currentXAxis, currentYAxis, circle, circledata);
        // Update circles text with new values.
        circledata = renderdata(circledata, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
        });
    }).catch(function (err) {
        console.log(err);
    });
}
makeResponsive();
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
