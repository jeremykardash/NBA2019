//Create SVG area
var svgWidth = 600;
var svgHeight = svgWidth/50*47;

//Margins for SVG
var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
};

//Calculate width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//Function for arcs in the court
function appendArcPath(base, radius, startAngle, endAngle) {
    var points = 30;

    var angle = d3.scaleLinear()
        .domain([0, points - 1])
        .range([startAngle, endAngle]);

    var line = d3.lineRadial()
        .radius(radius)
        .angle(function(d, i) { return angle(i); });

    return base.datum(d3.range(points))
        .attr("d", line);
}

//Function to remove existing shotchart
function remove_shotchart(){
    d3.select("svg").remove()
}

//Shotchart function takes player_ID as its argument
function shotchart(player_id) {

    //Clear SVG with function
    remove_shotchart()
    
    //URL uses argument to create API
    var url =`api/shotchart/${player_id}`

    //Append SVG to the class
    var svg = d3.select(".shotchart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    //Create chart group to plot circles
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    //Access the API
    d3.json(url).then(function(response){
        
        //Create scales, scales are from NBA API documentation
        var xLinearScale = d3.scaleLinear()
            .domain([-250,250])
            .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
            .domain([-45,420])
            .range([height, 0]);

        var Basket = chartGroup.append('circle');
        var Backboard = chartGroup.append('rect');
        var Outterbox = chartGroup.append('rect');
        var Innerbox = chartGroup.append('rect');
        var CornerThreeLeft = chartGroup.append('rect');
        var CornerThreeRight = chartGroup.append('rect');
        var OuterLine = chartGroup.append('rect');
        var RestrictedArea = chartGroup.append('path')
        var TopFreeThrow = chartGroup.append('path')
        var BottomFreeThrow = chartGroup.append('path')
        var ThreeLine = chartGroup.append('path')
        var CenterOuter = chartGroup.append('path')
        var CenterInner = chartGroup.append('path')

        var court_xScale = d3.scaleLinear()
            .domain([-25, 25])
            .range([0, width])
        var court_yScale = d3.scaleLinear()
            .domain([-4,43])
            .range([margin.top, height])
        
        Basket.attr('cx', court_xScale(0))
            .attr('cy', court_yScale(-0.75))
            .attr('r', court_yScale(0.75)-court_yScale(0))
            .style('fill', 'None')
            .style('stroke', 'black');
        
        Backboard.attr('x', court_xScale(-3))
            .attr('y', court_yScale(-1.5))
            .attr('width', court_xScale(3)-court_xScale(-3))
            .attr('height', 1)
            .style('fill', 'none')
            .style('stroke', 'black');
 
 
        Outterbox
                .attr('x', court_xScale(-8))
                .attr('y', court_yScale(-4))
                .attr('width', court_xScale(8)-court_xScale(-8))
                .attr('height', court_yScale(15)-court_yScale(-4))
                .style('fill', 'none')
                .style('stroke', 'black');
    
    
        Innerbox
                .attr('x', court_xScale(-6))
                .attr('y', court_yScale(-4))
                .attr('width', court_xScale(6)-court_xScale(-6))
                .attr('height', court_yScale(15)-court_yScale(-4))
                .style('fill', 'none')
                .style('stroke', 'black');
    
    
        CornerThreeLeft
                .attr('x', court_xScale(-22))
                .attr('y', court_yScale(-4))
                .attr('width', 1)
                .attr('height', court_yScale(10)-court_yScale(-4))
                .style('fill', 'none')
                .style('stroke', 'black');
    
        CornerThreeRight
                .attr('x', court_xScale(22))
                .attr('y', court_yScale(-4))
                .attr('width', 1)
                .attr('height', court_yScale(10)-court_yScale(-4))
                .style('fill', 'none')
                .style('stroke', 'black');
    
        OuterLine
                .attr('x', court_xScale(-25))
                .attr('y', court_yScale(-4))
                .attr('width', court_xScale(25)-court_xScale(-25))
                .attr('height', court_yScale(43)-court_yScale(-4))
                .style('fill', 'none')
                .style('stroke', 'black');
    
        appendArcPath(RestrictedArea, court_xScale(3)-court_xScale(0), (90)*(Math.PI/180), (270)*(Math.PI/180))
            .attr('fill', 'none')
            .attr("stroke", "black")
            .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(-0.75) +")");
    
    
        appendArcPath(TopFreeThrow, court_xScale(6)-court_xScale(0), (90)*(Math.PI/180), (270)*(Math.PI/180))
            .attr('fill', 'none')
            .attr("stroke", "black")
            .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(15) +")");
    
    
        appendArcPath(BottomFreeThrow, court_xScale(6)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
            .attr('fill', 'none')
            .attr("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))
            .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(15) +")");
    
    
        var angle = Math.atan((10-0.75)/(22))* 180 / Math.PI
        var dis = court_yScale(18);

        appendArcPath(ThreeLine, dis, (angle+90)*(Math.PI/180), (270-angle)*(Math.PI/180))
            .attr('fill', 'none')
            .attr("stroke", "black")
            .attr('class', 'shot-chart-court-3pt-line')
            .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(0) +")");
    
    
        appendArcPath(CenterOuter, court_xScale(6)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
            .attr('fill', 'none')
            .attr("stroke", "black")
            .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(43) +")");
    
        appendArcPath(CenterInner, court_xScale(2)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
            .attr('fill', 'none')
            .attr("stroke", "black")
            .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(43) +")");
            
        
        //Create Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(response)
            .enter()
            .append("circle")
            .attr("cx", (d => xLinearScale(d.x)*(-1)))
            .attr("cy", (d => height - yLinearScale(d.y)))
            .attr("r", "3.5")
            .attr("fill", "orange")
            .attr("stroke", "grey")
            .attr("opacity", "1");
        
        //Add tooltip on circles
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
              return (`<strong>${d.home} v ${d.away} Q${d.quarter} ${d.minutes}:${d.seconds}</strong><br>
                    ${d.day}/${d.month}/${d.year} <br>
                    ${d.action_type}<br>
                    ${d.shot_distance}ft. ${d.shot_type}`);
            });
      
          //Create tooltip in the chart
          chartGroup.call(toolTip);
      
          //Create event listeners to display and hide the tooltip
          circlesGroup.on("mouseover", function(response) {
            toolTip.show(response, this);
          })
            // onmouseout event
            .on("mouseout", function(response, index) {
              toolTip.hide(response);
            });
        });
        };  

//Function to get player info
function getInfo(player_id) {
    //Url calls argument from function
    var url = `api/playerinfo/${player_id}`

    //Access API
    d3.json(url).then(data=> {
        
        var data = data[0]
        //Select the metadata area to input
        var playerInfo = d3.select('#player-info');

        //Clear output
        playerInfo.html('')
        
        //Input entries
        Object.entries(data).forEach((key) => {   
            playerInfo.append("p").text(key[0].toUpperCase().replace("_", " ") + ": " + key[1] + "\n");    
        });
    })
};

//Function for player stats for 2018-2019 season
function getStats(player_id) {
    //Url calls argument from function
    var url = `api/playerstats/${player_id}`

    //access API
    d3.json(url).then(data=> {

        var data = data[0]
        //Select the metadata area to input
        var playerStats = d3.select('#player-stats');

        //Clear output
        playerStats.html('')
        
        //Inout entries
        Object.entries(data).forEach((key) => {   
            playerStats.append("p").text(key[0].toUpperCase().replace("_", " ") + ": " + key[1] + "\n");    
        });
    })
};

//Function to initialize the page
function init() {
    shotchart(2544);
    getInfo(2544);
    getStats(2544);
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
        
        //When the dropdown menu changes
        dropdown_team.on("change", function(){

            //Remove all existing dropdown options
            dropdown_player.selectAll("option").remove()
            // get value of selection of change
            var input_value = this.value;
            
            //Call players API
            var players_url = 'api/players'

            //Access API
            d3.json(players_url).then(response =>{

                //For each player check if they were on that team, and append the player to the dropdown
                response.forEach(function(player){
                        if (player.team_id == input_value) {
                        dropdown_player.append("option").text(player.player_name).attr("value", player.player_id)}
                
                })
        //When the dropdown menu changes
        dropdown_player.on("change", function(){
            //Get the value of the player from the player ID
            var player_value = this.value

            //Run shotchart, info and stats functions
            shotchart(player_value);
            getInfo(player_value);
            getStats(player_value);
            
        })

            })
        })

    });
};

init();

