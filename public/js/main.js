
$(document).on("pagebeforeshow", "#words", function() {
    console.log("in page home");
    // .ajax call
    $.ajax({
        type: "GET", url: "...", dataType: "json", success: getData
    });

    function getData(data) {
        console.log("in getData");

         }


   });

//
$(document).ready(function () {

    $('#textArea').on('keyup',function(){
        $(this).css('height','auto');
        $(this).height(this.scrollHeight);
    });

    $(function wordCount() {

        $('#textArea').keyup(function (e){
          var content = $(this).val().split(' ');

            $('#counter').html(content.length - 1 + '/300');
        });
        $('#content').keyup();

        //return content;
    });

    // find top frequent word
    $(function checkWords(){
        $('#textArea').keyup(function (e){
        var  string =  $(this).val();

        var words = string.replace(/[.]/g, '').split(/\s/); // word split

        var freqMap = {};

        // count same word
        words.forEach(function(w) {
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
                    $('#checkWords').html(compare  + '/300');
                    $('#checkWords').keyup();
                }
            }
        }
        });

      //  return result;
    });
    $('#share').submit(function (e) {
           //  e.preventDefault();
        var contentData =  $('#textArea').val();

        $.ajax({
            url: 'http://127.0.0.1:3000/httpPage/',
            type: 'post',
            success: function(msg) {
                console.log("Sucess");
            },
            error:function (error) {
              console.log("Fail");
            },
            data: contentData
        });
    });



function resetTextArea() {
    $("textarea").val("");

}

});/**
 * Created by GiL on 2017-08-19.
 */
