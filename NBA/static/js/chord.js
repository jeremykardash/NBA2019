// adapted from http://bl.ocks.org/SkiWether/f2afd0b8a8bacb4f24c8
// and Mike Bostock's chord diagram examples and others.

// Data: Shared players betweeen teams for the 2018-19 NBA season
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

// Team name abbreviations in propper order
var array = ['ATL', 'BOS', 'NOP', 'CHI', 'DAL', 'DEN', 'HOU', 'LAC', 'LAL', 'MIA', 'MIL', 'MIN', 'BKN', 'NYK', 'ORL', 'IND', 'PHI', 'PHX', 'POR', 'SAC', 'SAS', 'OKC', 'TOR', 'UTA', 'MEM', 'WAS', 'DET', 'CHA', 'CLE', 'GSW']

// team colours pulled from local .js file
var colours1 = team_colours.map(elmt => elmt.hexcode1);
var colours2 = team_colours.map(elmt => elmt.hexcode2);

// set chord diagram params
var chord_options = {
    "gnames": array,
    "colors": colours1
};

// define function that draws chord diagram
function Chord(options, matrix) {

    // initialize the chord configuration variables
    var config = {
        width: 1000,
        height: 1000,
        rotation: 0,
        textgap: 20,
        colors: colours1
    };
    
    // add options to the chord configuration object
    if (options) {
        extend(config, options);
    }
    
    // set chord visualization variables from the configuration object
    var offset = Math.PI * config.rotation,
        width = config.width,
        height = config.height,
        textgap = config.textgap,
        colors = config.colors;
    
    // set viewBox and aspect ratio to enable a resize of the visual dimensions 
    var viewBoxDimensions = "0 0 " + width + " " + height,
        aspect = width / height;
    
    if (config.gnames) {
        gnames = config.gnames;
    } else {
        // make a list of names
        gnames = [];
        for (var i=97; i<matrix.length; i++) {
            gnames.push(String.fromCharCode(i));
        }
    }

    // D3 chord drawing
    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    // Def circle size
    var innerRadius = Math.min(width, height) * .31,
        outerRadius = innerRadius * 1.05;


    // 
    var fill = d3.scale.ordinal()
        .domain(d3.range(matrix.length-1))
        .range(colors);

    // 
    var svg = d3.select("#chord-chart").append("svg")
        .attr("id", "visual")
        .attr("viewBox", viewBoxDimensions)
        .attr("preserveAspectRatio", "xMinYMid")    // add viewBox and preserveAspectRatio
        .attr("width", width)
        .attr("height", width/aspect)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // create layer for chord diagram
    var g = svg.selectAll("g.group")
        .data(chord.groups)
      .enter().append("svg:g")
        .attr("class", "group");

    // Add arcs for each team
    g.append("svg:path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", "black")
        .attr("id", function(d, i) { return "group" + d.index; })
        .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(startAngle).endAngle(endAngle))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    // Add labels to perimeter of circle
    g.append("svg:text")
        .each(function(d) {d.angle = ((d.startAngle + d.endAngle) / 2) + offset; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (outerRadius + textgap) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
          })
        .text(function(d) { return gnames[d.index]; });

    // Draw chords between arcs
    svg.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .attr("d", d3.ribbon()
        .radius(innerRadius)
      )
        .style("fill", "lightgrey")
        .style("stroke", "white")
        .style("opacity", 1)
      .append("svg:title")
        .text(function(d) { 
            return  d.source.value + "  " + gnames[d.source.index] + " shared with " + gnames[d.target.index]; 
        });

    // helper functions
    function startAngle(d) {
        return d.startAngle + offset;
    }

    // 
    function endAngle(d) {
        return d.endAngle + offset;
    }
    
    // 
    function extend(a, b) {
        for( var i in b ) {
            a[ i ] = b[ i ];
        }
    }

    // Returns an event handler for fading a given chord group.
    function fade(opacity) {
        return function(g, i) {
            svg.selectAll(".chord path")
                .filter(function(d) { return d.source.index != i && d.target.index != i; })
                .transition()
                .style("opacity", opacity);
        };
    }
    
    // window resize helper
    window.onresize = function() {
        var targetWidth = d3.select("#chord-holder").node().width;
        
        var svg = d3.select("#visual")
            .attr("width", targetWidth)
            .attr("height", targetWidth / aspect);
    }

    
}

// Call Chord on window load
window.onload = function() {
    Chord(chord_options, matrix);
}

d3.select(self.frameElement).style("height", "600px");
console.log("Chord Chart")

