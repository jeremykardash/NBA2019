
var margin = {top: 30, right: 25, bottom: 20, left: 25},
width = 650 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom,
innerRadius = Math.min(width, height) * .39,
outerRadius = innerRadius * 1.04;

// create the svg area
var svg = d3.select("#chord-chart")
  .append("svg")
    .attr("width", 1000)
    .attr("height", 1000)
  .append("g")
    .attr("transform", `translate(${width},${height})`)

var team_name = ['ATL', 'BOS', 'NOP', 'CHI', 'DAL', 'DEN', 'HOU', 'LAC', 'LAL', 'MIA', 'MIL', 'MIN', 'BKN', 'NYK', 'ORL', 'IND', 'PHI', 'PHX', 'POR', 'SAC', 'SAS', 'OKC', 'TOR', 'UTA', 'MEM', 'WAS', 'DET', 'CHA', 'CLE', 'GSW']




// create input data: a square matrix that provides flow between entities
var matrix = [
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 4, 0, 0, 0, 0, 0], 
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 4, 2, 0, 2, 0], 
  [0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 4, 6, 0, 0, 2, 2], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 2, 0, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0], 
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 4, 0, 0, 4, 2], 
  [0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 10, 2, 0, 0, 0, 2, 0, 0, 6, 2, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0], 
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0], 
  [2, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 6, 0], 
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 10, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 4, 2, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 2, 0, 0, 0, 0, 2, 10, 2, 0, 0, 10, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 2, 2, 2, 0, 2, 2, 6, 2, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 4, 0, 0, 2, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 6, 0], 
  [2, 0, 2, 0, 4, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0], 
  [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0], 
  [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 8, 2, 0, 0, 4, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0], 
  [4, 0, 2, 4, 0, 2, 2, 6, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 2, 2, 0], 
  [0, 0, 4, 6, 0, 0, 4, 2, 0, 0, 2, 0, 0, 4, 0, 0, 0, 4, 2, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0], 
  [0, 0, 2, 0, 0, 0, 0, 0, 4, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0], 
  [0, 0, 2, 2, 2, 2, 4, 0, 0, 2, 6, 0, 0, 0, 0, 0, 0, 2, 6, 2, 2, 0, 4, 4, 2, 2, 0, 0, 0, 0], 
  [0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


// give this matrix to d3.chord()
var res = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)
    (matrix)

// Add the links between groups
svg
  .datum(res)
  .append("g")
  .selectAll("path")
  .data(function(d) { return d; })
  .enter()
  .append("path")
    .attr("d", d3.ribbon()
      .radius(190)
    )
    .style("fill", "lightgrey")
    .style("stroke", "grey")
    .on("mouseover", fade(0.01))
    .on("mouseout", fade(1))

// this group object use each group of the data.groups object
var group = svg
  .datum(res)
  .append("g")
  .selectAll("g")
  .data(function(d) { return d.groups; })
  .enter()

// add the group arcs on the outer part of the circle
group.append("g")
    .append("path")
    .style("fill", "grey")
    .style("stroke", "black")
    .attr("d", d3.arc()
      .innerRadius(190)
      .outerRadius(200)
    )

// add labels to the arcs
group.append("svg:text")
  .each(function(d) {d.angle = (d.startAngle + d.endAngle) / 2;})
  .attr("dy", ".35em")
  .attr("class", "titles")
  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
  .attr("transform", function(d) {
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + (innerRadius) + ")"
		+ (d.angle > Math.PI ? "rotate(180)" : "");
  })
  .text(function(d,i) { return team_name[i]; })

// event listener
function fade(opacity) {
  return function(g, i) {
      svg.selectAll("path")
          .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
          .style("opacity", opacity);
  };
}

