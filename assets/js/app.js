// @TODO: YOUR CODE HERE!
// set width and height of the graph
var svgWidth = 960;
var svgHeight = 500;

//set the margin for the graph
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper, and group that holds the chart together

var svg = d3
.select("#scatter")
.append('svg')
.attr('width',svgWidth)
.attr('height',svgHeight);


var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parameters

var chosenXAxis = "age";
var chosenYAxis = "healthcare";

// function to update x axis and variable

function xScale(data, chosenXAxis) {

  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
  d3.max(data, d => d[chosenXAxis]) * 1.1
  ])
  .range([0,width]);
  
  return xLinearScale;
}

// function to update y axis and variable

function yScale(data, chosenYAxis) {

  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d[chosenYAxis]) *.85,
  d3.max(data, d => d[chosenYAxis]) *1.1
])
.range([height,0])
return yLinearScale;
}

// function to update x axis with click

function renderAxes(newXScale,xAxis) {

  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return(xAxis);

}

// update y axis with click
function renderAxesY(newYScale,yAxis) {

  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  
  return(yAxis);

}

// update circle group (x) with a transition

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
  .duration(1000)
  .attr("cx", d => newXScale(d[chosenXAxis]));


  return circlesGroup;

}

// render circle with change y

function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
  .duration(1000)
  .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;

}

// render states abbr

function renderText(stateLabels,newXScale,chosenXAxis) {

  stateLabels.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenXAxis]));


  return stateLabels;


}

//state y label
function renderTextY(stateLabels,newYScale,chosenYAxis) {

  stateLabels.transition()
  .duration(1000)
  .attr("y", d => newYScale(d[chosenYAxis]));


  return stateLabels;


}




// function used for updating the cricles

function updateToolTip(chosenXAxis, circlesGroup, chosenYAxis) {

   if ((chosenXAxis === "age") && (chosenYAxis === "healthcare")) {

    var xlabel = "Age (Median)";
    var ylabel = "Healthcare %";
   }
// console.log(chosenYAxis,chosenXAxis)
   else if ((chosenXAxis === "poverty") && (chosenYAxis === "healthcare")) {
     var xlabel = "Poverty %";
     var ylabel = "Healthcare %";
   }

   else if ((chosenXAxis === "income") && (chosenYAxis === "healthcare")) {

     var xlabel = "Income (Median)";
     var ylabel = "Healthcare %";
   }

   else if ((chosenXAxis === "age") && (chosenYAxis === "smokes")) {

    var xlabel = "Age (Median)";
    var ylabel = "Smoking %";
   }

   else if (chosenXAxis === "poverty" && chosenYAxis === "smokes") {

    var xlabel = "Poverty %";
    var ylabel = "Smoking %";
   }

   else if (chosenXAxis === "income" && chosenYAxis === "smokes") {

    var xlabel = "Income (Median)";
    var ylabel = "Smoking %";
   }

   var toolTip = d3.tip()
   .attr("class", "d3-tip")
   .offset([50,-90])
   .html(function(d){
     return (`${d.state} <br> ${xlabel} : ${d[chosenXAxis]} <br> ${ylabel}: ${d[chosenYAxis]} `);
   });

circlesGroup.call(toolTip);
//mouse in
circlesGroup.on("mouseover", function(L,index,element){
  toolTip.show(L,element[index]);
})

// mouse out

.on("mouseout", function(L,index) {

  toolTip.hide(L);

});

return circlesGroup;

}




// get CSV

d3.csv("assets/data/data.csv")
.then(function(data) {

  //if (err) throw err;
  //console.log(err);

  // go throught the data

  data.forEach(function(datas) {

    datas.poverty = +datas.poverty;
    datas.healthcare = +datas.healthcare;
    datas.income = +datas.income;
    datas.age = +datas.age;
    datas.obesity = +datas.obesity;
    datas.smokes = +datas.smokes;

  });

//  xyLinearScale

var xLinearScale = xScale(data,chosenXAxis);
var yLinearScale = yScale(data,chosenYAxis);
// var yLinearScale = d3.scaleLinear()
// .domain([0, d3.max(data, d => d.healthcare)])
// .range([height,0]);

// axis functions

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append xaxis and yaxis

var xAxis = chartGroup.append("g")
.classed("x-axis",true)
.attr("transform", `translate(0,${height})`)
.call(bottomAxis);

var yAxis = chartGroup.append("g")
.classed("y-axis",true)
.call(leftAxis);

// append initial circles

var circlesGroup = chartGroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr('r',10)
.attr('fill','#008B8B')
.attr('opacity', '.5');

// get state labels

var stateLabels = chartGroup.selectAll("lol")
.data(data)
.enter()
.append("text")
.attr("x", d => xLinearScale(d[chosenXAxis]))
.attr("y", d => yLinearScale(d[chosenYAxis]))
.text(d => d.abbr)
.attr("font-size", "9px")
.attr( "text-anchor","middle")
.attr("fill", "white");




// Create group for 3 xaxis labels

var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width/2}, ${height + 20})`);

// age median
var ageLabel = labelsGroup.append("text")
.attr("x",0)
.attr("y",20)
.attr("value", "age")
.classed("active",true)
.text("Age");

// poverty %
var povertyLabel = labelsGroup.append("text")
.attr("x",0)
.attr("y",40)
.attr("value","poverty")
.classed("inactive", true)
.text("Poverty %");

// income
var incomeLabel = labelsGroup.append("text")
.attr("x",0)
.attr("y",60)
.attr("value","income")
.classed("inactive", true)
.text("Income (Median)");



// append the y axis
var ylabelsGroup = chartGroup.append("g")
.attr("transform", "rotate(-90)")
.attr("x", 0-(height/2));

var healthcareLabel = ylabelsGroup.append("text")
.attr("x", 0-(height/2))
.attr('y',20-margin.left)
.attr('value', 'healthcare')
.classed("axis-text",true)
.classed("active", true)
.text("Healthcare %");

var smokeLabel = ylabelsGroup.append("text")
.attr("x", 0-(height/2))
.attr('y',40-margin.left)
.attr('value', 'smokes')
.classed("axis-text",true)
.classed("inactive", true)
.text("Smoking %");

var obesityLabel = ylabelsGroup.append("text")
.attr("x", 0-(height/2))
.attr('y',60-margin.left)
.attr('value', 'obesity')
.classed("axis-text",true)
.classed("inactive", true)
.text("Obesity %");




//toolTip update

var circlesGroup = updateToolTip(chosenXAxis,circlesGroup,chosenYAxis);


// y axis event listener

ylabelsGroup.selectAll("text")
.on("click", function() {
  // getting value

  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    chosenYAxis = value;

    yLinearScale = yScale(data,chosenYAxis);
    yAxis = renderAxesY(yLinearScale, yAxis);
    stateLabels = renderTextY(stateLabels,yLinearScale,chosenYAxis);
    circlesGroup = renderCirclesY(circlesGroup,yLinearScale,chosenYAxis);
    circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

    // change to bold

    if (chosenYAxis === "healthcare") {

      healthcareLabel
      .classed("active", true)
      .classed("inactive", false);

      smokeLabel
      .classed("active", false)
      .classed("inactive",true);

      obesityLabel
      .classed("active", false)
      .classed("inactive",true)
      
    }
    
    else if (chosenYAxis === "smokes") {
      healthcareLabel
      .classed("active", false)
      .classed("inactive", true);

      smokeLabel
      .classed("active", true)
      .classed("inactive",false);

      obesityLabel
      .classed("active", false)
      .classed("inactive",true)

    }

    else {
      healthcareLabel
      .classed("active", false)
      .classed("inactive", true);

      smokeLabel
      .classed("active", false)
      .classed("inactive",true);

      obesityLabel
      .classed("active", true)
      .classed("inactive",false)


    }

  }
})


// x axis event listener

labelsGroup.selectAll("text")
.on("click", function() {
  // getting value

  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    chosenXAxis = value;

    xLinearScale = xScale(data,chosenXAxis);
    xAxis = renderAxes(xLinearScale, xAxis);
    stateLabels = renderText(stateLabels,xLinearScale,chosenXAxis);
    circlesGroup = renderCircles(circlesGroup,xLinearScale,chosenXAxis);
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // change to bold

    if (chosenXAxis === "age") {

      ageLabel
      .classed("active", true)
      .classed("inactive", false);

      povertyLabel
      .classed("active", false)
      .classed("inactive",true);

      incomeLabel
      .classed("active", false)
      .classed("inactive",true)
      
    }
    
    else if (chosenXAxis === "poverty") {
      povertyLabel
      .classed("active", true)
      .classed("inactive", false);

      ageLabel
      .classed("active", false)
      .classed("inactive",true);

      incomeLabel
      .classed("active", false)
      .classed("inactive",true)

    }

    else {
      povertyLabel
      .classed("active", false)
      .classed("inactive", true);

      ageLabel
      .classed("active", false)
      .classed("inactive",true);

      incomeLabel
      .classed("active", true)
      .classed("inactive",false)



    }

  }
})




});