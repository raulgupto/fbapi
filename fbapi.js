var FB = require('fb');
var os = require('os');
var request = require("request");
var fs      = require("fs");
var file    = fs.createWriteStream("test1.txt");
var count   = 0;
FB.setAccessToken('<your_access_token>');
FB.api(
    '/your_conversation_id/comments',
    'GET',
    {"limit":"100","until":"<optional/remove until>"},
    function(response) {
        // Insert your code here
        console.log(JSON.stringify(response));
        var limit = 10000;
        var url = response['paging']['next'];
        for(var j=0; j<response.data.length; j++){
            if(response.data[j].from){
                    file.write("FROM: " + JSON.stringify(response.data[j].from )+ os.EOL);
                    console.log("FROM: " + JSON.stringify(response.data[j].from));
                }
                file.write("message: " + JSON.stringify(response.data[j].message)+ os.EOL);
                console.log("message:" + JSON.stringify(response.data[j].message));
                file.write("time: " + JSON.stringify(response.data[j]['created_time'])+ os.EOL);
                console.log("time: " + JSON.stringify(response.data[j]['created_time']));
                count++;
        }
        getData(url) ;


    }
);

function getData(url) {
    request(url , function (err, response) {
        if(err){
            console.log(err) ;
        }
        try{
            var result = JSON.parse(response.body) ;
            if(!result.data.length){
                console.log("<><><><><><><><>Count of message: <><><><><><><><><>", count);
                file.close();
                return;
            }
            for(var i = 0; i< result.data.length; i++){
                if(result.data[i].from){
                    file.write("FROM: " + JSON.stringify(result.data[i].from)+ os.EOL);
                    console.log("FROM: " + JSON.stringify(result.data[i].from));
                }
                file.write("message: " +JSON.stringify(result.data[i].message)+ os.EOL);
                console.log("message: " +JSON.stringify(result.data[i].message));
                file.write("time: " + JSON.stringify(result.data[i]['created_time'])+ os.EOL);
                console.log("time: " + JSON.stringify(result.data[i]['created_time']));
                count++;
            }
            url = result['paging']['next'] ;
        }
        catch(err){
            console.log(err.message);
        }
        if(url){
            getData(url) ;
        }
    });
}
