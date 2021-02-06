var svgWidth = 800;
var svgHeight = 450;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

function shotchart() {
    var player_id = 1628995
    var url =`api/shotchart/${player_id}`

    var svg = d3.select(".shotchart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
       

    d3.json(url).then(function(response){

        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(response, d => d.x))
            .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(response, d => d.y))
            .range([height, 0]);
    
        //Create Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(response)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.x))
            .attr("cy", d => yLinearScale(d.y))
            .attr("r", "3")
            .attr("fill", "orange")
            .attr("opacity", ".8");
        
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
              return (`${d.action_type}<br>
                    Distance: ${d.shot_distance}<br>
                    Home:${d.home} Away: ${d.away}
                    Quarter: ${d.quarter}<br>
                    Time:${d.minutes}:${d.seconds}<br>

                    `);
            });
      
          // Step 7: Create tooltip in the chart
          // ==============================
          chartGroup.call(toolTip);
      
          // Step 8: Create event listeners to display and hide the tooltip
          // ==============================
          circlesGroup.on("mouseover", function(response) {
            toolTip.show(response, this);
          })
            // onmouseout event
            .on("mouseout", function(response, index) {
              toolTip.hide(response);
            });
        
        //console.log(response)
        // var trace1 = {
        //     x: response.map(d => d.x),
        //     y: response.map(d => d.y),
        //     mode: 'markers',
        //     type: 'scatter',
        //     text: response.map(d => d.action_type),
        // }
        // var data = [trace1];

        // Plotly.newPlot('shotchart', data)
        });
        };  
shotchart();