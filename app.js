//Module

const mongojs = require('mongojs')

const bodyParser = require('body-parser');
const express = require('express');

const request = require('request');
const response = require('response');

var $ = require('jquery');




//Connect Db
const db = mongojs('node', ['contents']);


//Check db connection
db.contents.find(function (error,results) {
   console.log(results);
    console.log(typeof(results));
var myJson = JSON.stringify(results);
    console.log(typeof(myJson));

});

//  Execute server
const app = express();

// To use socket.io.js file from root

const PORT = 3000;



app.use(express.static(__dirname + '/public'));
//console.log(__dirname);


// Add middle ware
app.use(bodyParser.urlencoded({ extend : false }));
//app.use(bodyParser.json());
app.listen(PORT, function () {
    console.log('Express server started on port ' + PORT + '!');
});


// Route
 app.get('/httpPage', function (request, response) {
        db.contents.find(function (error,results) {
            response.send(results);
        });
    });



 app.post('/httpPage', function (request, response) {

    //Declare variable
   const body = request.body;
   console.log(body);
   console.log(typeof (body));

   // Handle error events
   //if(!body.id){ return response.send('send id '); }
   if(body.words == null){ return response.send('Send content'); }

   // Get value
   //const id = body.id;
     const contents = body.words;
     console.log(contents);

     // Word count
     const temp = contents.split(' ');
     const countWord = temp.length;

    // Word compare
     var  string =  contents;

     var wordSplit = string.replace(/[.]/g, '').split(/\s/); // word split

     var freqMap = {};

     // count same word
     wordSplit.forEach(function(w) {
         if (!freqMap[w]) {
             freqMap[w] = 0;
         }
         freqMap[w] += 1;
     });

     // find top frequent word
     var compare =0;
     for (var k in freqMap) {
         if (freqMap.hasOwnProperty(k)) {
             if(compare < freqMap[k]){
                 result = k;
                 compare = freqMap[k];
             }
         }
     }


   // Save data
   db.contents.save({
       wordcount: countWord,
       wordCompare: compare,
       content: contents
   },  function (error, result) {
       response.send(error || result);
   });

  /*   db.contents.find(function (error,results) {
         var myJson = JSON.stringify(results);
         response.send(myJson);
     });*/

});

 app.get('/httpPage/:id', function (request, response) {
   // Declare variable
    const id = request.params.id;

    db.contents.findOne({
        _id: mongojs.ObjectId(id)
    }, function (error, result) {
       if(error){
           response.send('Error');
       } else {
           response.send(result);
       }
    });
});

 app.put('/httpPage/:id', function (request, response) {
    // Declare variable
    const id = request.params.id;

    // Find data
    db.contents.findOne({
        _id: mongojs.ObjectId(id)
    }, function (error, result) {
        if(request.body.content){
            result.content = request.body.content;
        }

        // Save data
        db.contents.save(result, function (error, result) {

            // Response
            response.send(error || result);
        });
    });
});

 app.delete('/httpPage/:id', function (request, response) {
   const id = request.params.id;

   // Delete data
    db.contents.remove({
        _id: mongojs.ObjectId(id)
    },  function (error) {
    response.send('Deleted')

    });
});




