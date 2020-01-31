let xhr = new XMLHttpRequest();
let groupID = window.location.hash.split('/')[2];
let data;
xhr.open("GET",`http://1know.net/private/group/${groupID}/task`);
xhr.onload = async function(){
    data = await JSON.parse(xhr.responseText);
    let div = document.createElement('div');
    let html = "";
    for(let i = 0 ; i < data.length ; i++){
        html += `<ul>${data[i].name}(${data[i].uqid})`;
        for(let j = 0 ; j < data[i].units.length ; j++){
            html += `<li>${data[i].units[j].name}(${data[i].units[j].uqid})</li>`
        }
        html += `</ul>`;
    }
    div.innerHTML = html;
    document.getElementsByClassName("collection-title")[0].appendChild(div);
};
xhr.send();

//titleArea = document.getElementsByClassName("collection-title")[0];

//javascript:(function(){let js=document.createElement("script");window.bookmarkletOptions={};js.src="https://sharteeya.github.io/1KD/js/bmFetcher.js";document.body.appendChild(js)})();
