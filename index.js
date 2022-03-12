const path =require('path');
const express = require('express');
const app = express();
const port = 8794;


app.use('/cake.js', function(req, res, next){

    res.sendFile(path.join(__dirname,'./dist/cake.js'));
});


app.use('/home',express.static('./test/route'));
app.use('/about/:id',express.static('./test/route'));
app.use('/about',express.static('./test/route'));

app.use('/asset/cake.js', function(req,res,next){
    res.sendFile(path.join(__dirname, './dist/cake.js'));
}); 

app.use('/asset/route.js', function(req,res,next){
    res.sendFile(path.join(__dirname, './test/route/route.js'));
}); 


app.use('/', express.static('./test/route'));




app.listen(port, function(err){
    if (err){
        console.log(err.message);
    } else {
        console.log('listening to port ',port);
    };
});