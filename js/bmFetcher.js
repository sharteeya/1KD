let xhr = new XMLHttpRequest();
let groupID = window.location.hash.split('/')[2];
let data;
xhr.open("GET",`http://1know.net/private/group/${groupID}/task`);
xhr.onload = function(){
    data = JSON.parse(xhr.responseText);
    let div = document.createElement('div');
    div.innerText = data+"123";
    document.getElementsByClassName("collection-title")[0].appendChild(div);
};
xhr.send();

//titleArea = document.getElementsByClassName("collection-title")[0];

//javascript:(function(){let js=document.createElement("script");window.bookmarkletOptions={};js.src="https://sharteeya.github.io/1KD/js/bmFetcher.js";document.body.appendChild(js)})();
