function test(){
var url ="/api/stats"
d3.json(url).then(function(response){
    console.log(response)
})
}

test();