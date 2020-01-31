let xhr = new XMLHttpRequest();
let groupID = window.location.hash.split('/')[2];
let data;
xhr.open("GET",`http://1know.net/private/group/${groupID}/task`);
xhr.onload = function(){
    data = JSON.parse(xhr.responseText);
};
xhr.send();

let div = document.createElement('div');
div.innerText = data;
document.getElementsByClassName("collection-title")[0].appendChild(div);
//titleArea = document.getElementsByClassName("collection-title")[0];



//javascript:(function(){let js=document.createElement("script");window.bookmarkletOptions={};a.src="https://sharteeya.github.io/1KD/js/bmFetcher.js";document.body.appendChild(js)})();
