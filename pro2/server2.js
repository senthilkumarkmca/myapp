var cluster = require('cluster');

var expres=require('express');
 
if (cluster.isMaster) {

 // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
// Code to run if we're in a worker process
}
else{

var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');
var app = express();
app.use(bp.json());
var taskID=1;

app.use(express.static('public'));
var pending =[]
app.get('/getmypendings/:id', (req, res)=>
{
    console.log(req.params)
    var newid=parseInt(req.params.id);
    
    console.log("ID "+newid)

    var matchedTodo = _.findWhere(pending, {id:newid});
    res.json(matchedTodo)
    console.log(matchedTodo)
})

app.delete('/deleting/:id', (req, res)=>
{
    console.log(req.params)
    var newid=parseInt(req.params.id);
    
    console.log("ID "+newid)

    var matchedTodo = _.findWhere(pending, {id:newid});
    if(!matchedTodo){
        res.status(404).json({"error":"id not found"})
    }
    else{
        pending = _.without(pending, matchedTodo);
        res.json(pending);
    }
    res.json(matchedTodo)
    console.log(matchedTodo)
})

app.get('/getmypendings', (req, res)=>
{
    res.json(pending)
})

app.post('/postmypendings', (req, res)=>
{
    var data = req.body;
    data.id = taskID++;
    pending.push(data);
    res.json(data);   
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
})

app.listen(3000, ()=>{
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
})

}