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

function drawcourt(){
    
}

function remove_shotchart(){
    d3.select("svg").remove()
}

function shotchart(player_id) {

    remove_shotchart()

    var url =`api/shotchart/${player_id}`

    var svg = d3.select(".shotchart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

    d3.json(url).then(function(response){

        var xLinearScale = d3.scaleLinear()
            .domain([-240,240])
            .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
            .domain([0,300])
            .range([height, 0]);
    
        //Create Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(response)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.x))
            .attr("cy", d => yLinearScale(d.y))
            .attr("r", "3.5")
            .attr("fill", "orange")
            .attr("stroke", "grey")
            .attr("opacity", "1");
        
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
              return (`<strong>${d.home} v ${d.away} Q${d.quarter} ${d.minutes}:${d.seconds}</strong><br>
                    ${d.day}/${d.month}/${d.year} <br>
                    ${d.action_type}<br>
                    ${d.shot_distance}ft. ${d.shot_type}`);
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
        });
        };  

function getInfo(player_id) {
    var url = `api/playerinfo/${player_id}`
    d3.json(url).then(data=> {
        
        var data = data[0]
        //Select the metadata area to input
        var playerInfo = d3.select('#player-info');

        //Clear output
        playerInfo.html('')
        
        //
        Object.entries(data).forEach((key) => {   
            playerInfo.append("p").text(key[0].toUpperCase().replace("_", " ") + ": " + key[1] + "\n");    
        });
    })
};

function getStats(player_id) {
    var url = `api/playerstats/${player_id}`
    d3.json(url).then(data=> {

        var data = data[0]
        //Select the metadata area to input
        var playerStats = d3.select('#player-stats');

        //Clear output
        playerStats.html('')
        
        //
        Object.entries(data).forEach((key) => {   
            playerStats.append("p").text(key[0].toUpperCase().replace("_", " ") + ": " + key[1] + "\n");    
        });
    })
};


function init() {
    // select dropdown menu item
    var dropdown_team = d3.select("#teamID");
    var dropdown_player = d3.select("#playerID");

    // read the data 
    var teams_url = "api/teams"
    d3.json(teams_url).then((response)=> {

        //Append the id data to the dropdwown menu
        response.forEach(function(team) {
             dropdown_team.append("option").text(team.nickname).attr("value", team.id);
            });

        dropdown_team.on("change", function(){
            dropdown_player.selectAll("option").remove()
            // get value of selection
            var input_value = this.value;
        
            var players_url = 'api/players'
            d3.json(players_url).then(response =>{
                response.forEach(function(player){
                        if (player.team_id == input_value) {
                        dropdown_player.append("option").text(player.player_name).attr("value", player.player_id)}
                
                })
        dropdown_player.on("change", function(){
            var player_value = this.value
            shotchart(player_value);
            getInfo(player_value);
            getStats(player_value);
            
        })

            })
        })

    });
};

init();

