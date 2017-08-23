//Module
const mongojs = require('mongojs')
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const response = require('response');

//Connect Db
const db = mongojs('node', ['contents']);

//Check db connection
db.contents.find(function (error, results) {
    console.log(results);
    var myJson = JSON.stringify(results);

});

//  Execute server
const app = express();

// Set port
const PORT = 3000;

// Set path
app.use(express.static(__dirname + '/public'));

// Add middle ware
app.use(bodyParser.urlencoded({ extend: false }));

// Listen Server event
app.listen(PORT, function () {
    console.log('Express server started on port ' + PORT + '!');
});


// Route
//REST Get (Send all data in database to client)
app.get('/httpPage', function (request, response) {
    db.contents.find(function (error, results) {
        response.send(results);
    });
});

//REST Post (Add the data to database)
app.post('/httpPage', function (request, response) {

    //Declare variable
    const body = request.body;   

    // Handle error events  
    if (body.words == null) { return response.send('Send content'); }
    if (body.endTime == null) { return response.send('Check Input time'); }

    // Get value    
    const contents = body.words;
    const endTime = body.endTime;   

    // Word count
    const temp = contents.split(' ');
    const countWord = temp.length;

    // Word per time
    const wordPerTime = Math.round(countWord / endTime * 6000, 2);  

    // Word compare
    var string = contents;

    // word split
    var wordSplit = string.replace(/[.]/g, '').split(/\s/); 

    var freqMap = {};

    // Count same word
    wordSplit.forEach(function (w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    // Find top frequent word
    var compare = 0;
    for (var k in freqMap) {
        if (freqMap.hasOwnProperty(k)) {
            if (compare < freqMap[k]) {
                result = k;
                compare = freqMap[k];
            }
        }
    }

    //Current Time
    var currentTime = new Date();
    var saveTime = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

    // Save data
    var wordPer;    
    db.contents.save({
        time: saveTime,
        wordNumber: countWord,
        wordPerMin: wordPerTime,
        wordCompare: result,
        content: contents
    }, function (error, result) {

        if (error) {
            response.send(error);
        } else {
            var myJson = JSON.stringify(result);
            response.send(myJson);
        }

    });

});

//REST GET by id (Send data by id to client)
app.get('/httpPage/:id', function (request, response) {

    // Declare variable    
    const id = request.params.id;   

    // Find data
    db.contents.findOne({
        _id: mongojs.ObjectId(id)
    }, function (error, result) {
        if (error) {
            response.send('Error');
        } else {
            var myJson = JSON.stringify(result);
            console.log(myJson);
            response.send(myJson);
        }
    });
});

//REST Put by id(Update data by id) 
app.put('/httpPage/:id', function (request, response) {
    // Declare variable
    const id = request.params.id;
    // Find data
    db.contents.findOne({
        _id: mongojs.ObjectId(id)
    }, function (error, result) {
        if (request.body.content) {
            result.content = request.body.content;
        }
        // Save data
        db.contents.save(result, function (error, result) {
            // Response
            response.send(error || result);
        });
    });
});

//REST Put by id(Delete data by id) 
app.delete('/httpPage/:id', function (request, response) {
    const id = request.params.id;

    // Delete data
    db.contents.remove({
        _id: mongojs.ObjectId(id)
    }, function (error) {
        response.send('Deleted')

    });
});




