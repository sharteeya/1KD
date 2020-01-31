let xhr = new XMLHttpRequest();
let groupID = window.location.hash.split('/')[2];
let data;
xhr.open("GET",`http://1know.net/private/group/${groupID}/task`);
xhr.onload = function(){
    data = JSON.parse(xhr.responseText);
};
xhr.send();
