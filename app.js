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
  //  console.log(typeof(results));
var myJson = JSON.stringify(results);
   // console.log(typeof(myJson));

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
   if (body.words == null) { return response.send('Send content'); }
   if (body.endTime == null) { return response.send('Check Input time'); }

   // Get value
   //const id = body.id;
   const contents = body.words;
   const endTime = body.endTime;
   console.log(endTime);
   console.log(contents);

     // Word count
     const temp = contents.split(' ');
     const countWord = temp.length;

     // Word per time
     const wordPerTime = Math.round(countWord / endTime * 6000, 2);
     console.log(wordPerTime);

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

   //Current Time
     var currentTime = new Date();
     var saveTime = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

     var wordPer;
   // Save data
   db.contents.save({
       time : saveTime,
       wordNumber: countWord,
       wordPerMin: wordPerTime,
       wordCompare: result,
       content: contents
   },  function (error, result) {

      /* $jSONerror = null;

       echo json_encode(array('errormsg' => $jSONerror, 'results' => result));*/
       if(error){
           response.send(error);
       }else {
           var myJson = JSON.stringify(result);
           response.send(myJson);
          
       }

   });

/*     db.contents.find(function (error,results) {
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
           console.log(result.toString('utf8'));
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




