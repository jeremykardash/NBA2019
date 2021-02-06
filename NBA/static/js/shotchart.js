function shotchart() {
    var player_id = 201142
    var url =`api/shotchart/${player_id}`
    d3.json(url).then(function(response){
        console.log(response)
        var trace1 = {
            x: response.map(d => d.LOC_X),
            y: response.map(d => d.LOC_Y),
            mode: 'markers',
            type: 'scatter',
            text: response.map(d => d.ACTION_TYPE),
        }
        var data = [trace1];

        Plotly.newPlot('shotchart', data)
        });
        };  
shotchart();