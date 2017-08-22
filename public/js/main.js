
//$(document).on("pagebeforeshow", "#words", function() {
//    console.log("in page home");
//    // .ajax call
//    $.ajax({
//        type: "POST", url: "/httpPage", dataType: "json", success: getData
//    });

//    function getData(data) {
//        console.log("in getData");
//        $('#checkWords').html(data  + '/400');
//        console.log(data);
//         }

//   $(function() {
//        $.getJSON("/htmlPage", function(){
//            console.log("success");
//        }).done(function(data){
//            $.each(data, function(i, item){
//                console.log(data.wordCount);
//            });
//        });
//    });


//});

var timer = 0;
var checkTimer = 0;
var secInrease;
var checkWordTime;
var submitContents;
//var reciveData;

//
$(document).ready(function () {

    

    $('#textArea').on('keyup', function () {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
    });

  

    $(function wordCount() {

        $('#textArea').keyup(function (e) {
            var content = $(this).val().split(' ');

            $('#counter').html(content.length - 1 + '/300');
        });
        $('#content').keyup();

        //return content;
    });

    // find top frequent word
    $(function checkWords() {
        $('#textArea').keyup(function (e) {
            var string = $(this).val();

            var words = string.replace(/[.]/g, '').split(/\s/); // word split

            var freqMap = {};

            // count same word
            words.forEach(function (w) {
                if (!freqMap[w]) {
                    freqMap[w] = 0;
                }
                freqMap[w] += 1;
            });

            // find top frequent word
            var compare = 0;
            for (var k in freqMap) {
                if (freqMap.hasOwnProperty(k)) {
                    if (compare < freqMap[k]) {
                        result = k;
                        compare = freqMap[k];
                        $('#checkWords').html(compare + '/300');
                        $('#checkWords').keyup();
                    }
                }
            }
        });

        //  return result;
    });


    

    $('#textArea').on('keyup', function () {
        console.log('key test!!!!!')
        timer = 0;
        clearInterval(secInrease);
        setTimer();
    });

  
           //Share data  
    $('#share').submit(function (e) {

              clearInterval(secInrease);

            e.preventDefault();
            var contentData = $('#textArea').val();

            $.ajax({
                type: 'POST',
                data: { 'words': contentData },
                url: '/httpPage',
                success: function (dbData) {
                    console.log(dbData);
                    getCode(dbData);
                },
                error: function (error) {
                    console.log(error);
                }

            });
            // return false;
            getCurretData();
        });
          
});/**
 * Created by GiL on 2017-08-19.
 */


// Set Timer
function setTimer() {

    secInrease = setInterval(function () {
        timer += 1;
        console.log(timer);
        if (timer >= 5) {
            clearInterval(secInrease);

            var contentData = $('#textArea').val();
           
            $.ajax({
                type: 'POST',
                //dataType: 'json',
               data: { 'words': contentData},

                url: '/httpPage',
                success: function (dbData) {
                    console.log(dbData);
                    getCode(dbData);
                },
                error: function (error) {
                    console.log(error);
                }

            });
            getCurretData();
        }

    }, 1000);

}


function checkTimer() {

    checkWordTime = setInterval(function () {
        checkTimer += 1;        

    }, 1000);
}


function getCode(data) {
    checkTimer = 0;
    clearInterval(checkWordTime);
    console.log(JSON.parse(data));
    var jsonData = JSON.parse(data);
    $('input[name="code-out"]').val(jsonData._id);

}

function getCurretData() {

    $.ajax({
        type: 'GET',        
        url: '/httpPage',
        success: function (dbData) {
            console.log(dbData);
            makeList(dbData);
        },
        error: function (error) {
            console.log(error);
        }

    });

    function makeList(dbData) {

        $("tbody").empty();
        $(dbData).each(function () {
            $("tbody").append("<tr>");

            $("tbody").append(
                "<td>" +
                    this.time +
                "</td>" +
                "<td>" +
                this.wordNumber +
                "</td>" +
                "<td>" +
                this.wordCompare +
                "</td>" 

            );

            $("tbody").append("</tr>");
        });
       
         
     
    }

} 

