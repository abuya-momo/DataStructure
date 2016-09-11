var query = window.location.search;
query = query.slice(1);
query = query.split('&');

var userID = 0;

for(var i=0; i<query.length; i++){
    var content = query[i].split('=');
    var key = content[0];
    var value = content[1];
    if(key == 'userID'){
        userID = value;
    }
}

addNev(userID);