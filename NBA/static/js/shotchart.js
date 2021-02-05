function test(){
    var player_id = 201142
    var url =`api/stats`
    d3.json(url).then(function(response){
        console.log(response)
        })
    };  

test();