function test(){
var url ="/api/stats"
d3.json(url).then(function(response){
    console.log(response)
})
}
test();

function dropdown(){
    var url ="/api/stats"
    var dropdownone = d3.select("#selstatone")
    var dropdowntwo = d3.select("#selstattwo")

    d3.json(url).then(function(response){
        console.log(Object.keys(response[0]))
        var keys = Object.keys(response[0])

        keys.forEach((key)=>{
            dropdownone.append("option").text(key).property("value",key)
        });
        keys.forEach((key)=>{
            dropdowntwo.append("option").text(key).property("value",key)
        });
    })
}
dropdown()

function buildChart(){
    

}