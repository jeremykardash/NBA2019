// creating dropdown menu items
var url ="/api/stats"
var dropdownone = d3.select("#x-stat")
    var dropdowntwo = d3.select("#y-stat")

d3.json(url).then(function(response){
    console.log(Object.keys(response[0]))
    var keys = Object.keys(response[0])

    keys.forEach((key)=>{
        dropdownone.append("option").text(key).property("value",key).attr("id",key)
    });
    keys.forEach((key)=>{
        dropdowntwo.append("option").text(key).property("value",key).attr("id",key)
    });

})


//select dropdown items and set as initial axes 
var xSelection ="Points";
var ySelection ="Assists";

//function to make xaxis interactive with dropdown menu 
function reportX(stat) {
  if (stat=="") return; 
xSelection = stat;

redraw();
} 
//function to make yaxis interactive with dropdown menu 
function reportY(stat) {
  if (stat=="") return; 
ySelection = stat;

redraw();
} 

var svgWidth = 990;
    
var svgHeight = 600;


var margin = {top: 20, right: 50, bottom: 70, left: 100};
        
var width = svgWidth - margin.left - margin.right;

var height = svgHeight - margin.top - margin.bottom;

// function to redraw the graph after selecting new axes for chart 
function redraw(){
    var url ="/api/stats"
// load data
d3.json(url).then(function(data) {

  // change string into number format
  data.forEach(function(d) {
    d[ySelection] = +d[ySelection];
    d[xSelection] = +d[xSelection];
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)*.1, d3.max(data, xValue)]);
  yScale.domain([d3.min(data, yValue)*.1, d3.max(data, yValue)]);


chartGroup.selectAll("g").remove();
chartGroup.selectAll("text").remove();
  
// x-axis
var xaxis = chartGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
// add x-label
    chartGroup.append("text")
      .attr("x", width-400)
      .attr("y", height+50)
      .attr("font-size","15")
      .attr("font-weight","bold")
      .text(xSelection);

  // y-axis
  var yaxis = chartGroup.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    //add y-label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", height-570)
      .attr("x", width-1150) //controls height 
      .attr("font-size","15")
      .attr("font-weight","bold")
      .attr("dy", ".71em")
      .text(ySelection);

  // draw circles 
  var circlegroup = chartGroup.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));});
    
      
  var toolTip = d3.tip()
      .attr("class", "tooltip-bubble")
      .html(function(d) {
        return (`${d.Player_name} <br> ${xSelection}: ${d[xSelection]} <br> ${ySelection}: ${d[ySelection]}`);
        });

    // Create Tooltip in the Chart
    circlegroup.call(toolTip);
  // Create Event Listeners to Display and Hide the Text Tooltip
    circlegroup.on("mouseover", function(data) {
      toolTip.show(data, this);
       })
        .on("mouseout", function(data) {
           toolTip.hide(data);
                  });
             
//transition for circles when select new axes
  chartGroup.selectAll("circle")
                       .data(data)
                       .transition()
                       .duration(1000)
                       .attr("cx", xMap)
                        .attr("cy", yMap);

  // draw legend
  var legend = chartGroup.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("id",function(d){return d;})
      .attr("transform", function(d, i) { return "translate(10," + (i+15) * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 5)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 11)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});

    //remove extra legend labels
    // d3.select("#PF-SF").remove();
    // d3.select("#SF-SG").remove();
    // d3.select("#SG-PF").remove();
    // d3.select("#C-PF").remove();
    // d3.select("#SG-SF").remove();

//remove unncessary dropdown menu items
d3.selectAll("#Player_name").remove();
d3.selectAll("#Player_id").remove();
d3.selectAll("#Position").remove();
});
};

// setup x 
//return the value of xselection
var xValue = function(d) { return d[xSelection];}; // data -> value
//setup xscale
var xScale = d3.scaleLinear().range([0, width]);// value -> display
//map the xvalue on graph
var xMap = function(d) { return xScale(xValue(d));}; // data -> display
//create xaxis
var xAxis = d3.axisBottom(xScale);

// setup y
//return the value of yselection
var yValue = function(d) { return d[ySelection];}; // data -> value
//setup yscale
var yScale = d3.scaleLinear().range([height, 0]); // value -> display
// map the yvalue on the graph 
var yMap = function(d) { return yScale(yValue(d));}; // data -> display
// create yaxis 
var yAxis = d3.axisLeft(yScale);
// fill color of circles by position
var cValue = function(d) { return d.Position;},
color = d3.scaleOrdinal(d3.schemeCategory10);

 // Create an SVG wrapper, append an SVG group that will hold our chart,
 // and shift the latter by left and top margins.
var svg = d3.select("#bubble").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
var chartGroup= svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// for initial page, load data
d3.json(url).then(function(data) {

  // change string into number format
  data.forEach(function(d) {
    d[ySelection] = +d[ySelection];
    d[xSelection] = +d[xSelection];
// console.dir (d);
  });
  console.log(data)

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)*.1, d3.max(data, xValue)]);
  yScale.domain([d3.min(data, yValue)*.1, d3.max(data, yValue)]);


  // x-axis
  var xaxis = chartGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
//add x label
      chartGroup.append("text")
      .attr("x", width-400)
      .attr("y", height+50)
      .attr("font-size","15")
      .attr("font-weight","bold")
      .text(xSelection);

  // y-axis
    var yaxis =chartGroup.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  // add y label
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", height-570)
      .attr("x", width-1150)
      .attr("font-size","15")
      .attr("dy", ".71em")
      .attr("font-weight","bold")
      .text(ySelection);


  // draw circles
  var circlegroup = chartGroup.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));});

    //tooltip on circle group
    var toolTip = d3.tip()
        .attr("class", "tooltip-bubble")
        .html(function(d) {
             return (`${d.Player_name} <br> ${xSelection}: ${d[xSelection]} <br> ${ySelection}: ${d[ySelection]}`);
        });
        
    // Create Tooltip in the Chart
      circlegroup.call(toolTip);
      // Create Event Listeners to Display and Hide the Text Tooltip
      circlegroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
          .on("mouseout", function(data) {
            toolTip.hide(data);
            });
        
  // draw legend
  var legend = chartGroup.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("id",function(d){return d})
      .attr("transform", function(d, i) { return "translate(10," + (i+15) * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width -5)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width -11)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { 
        return d;})

//remove extra legend labels 
    // d3.select("#PF-SF").remove();
    // d3.select("#SF-SG").remove();
    // d3.select("#SG-PF").remove();
    // d3.select("#C-PF").remove();
    // d3.select("#SG-SF").remove();

//remove unncessary dropdown menu items
d3.selectAll("#Player_name").remove();
d3.selectAll("#Player_id").remove();
d3.selectAll("#Position").remove(); 
});










