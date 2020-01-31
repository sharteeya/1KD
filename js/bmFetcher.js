
function getAnalysisData(tid, uid){
    let link = `http://1know.net/private/group/task/${tid}/analytics/unit/${uid}`;
    let uxhr = new XMLHttpRequest();
    let data;
    let arr = [];
    uxhr.open("GET",link);
    uxhr.onload = function(){
        data = JSON.parse(uxhr.responseText);
        let students = {};
        for(let i = 0 ; i < data.members.length ; i++){
            students[data.members[i].uqid] = data.members[i].full_name;
        }
        arr.push(["姓名", "開始時間", "結束時間", "影片開始時間", "影片結束時間"]);
        for(let i = 0 ; i < data.shs.length ; i++){
            let d = data.shs[i];
            arr.push([students[d.uqid], d.real_time_s, d.real_time_e, d.video_time_s, d.video_time_e]);
        }
        console.log(arr);
    }
    uxhr.send();
}

let xhr = new XMLHttpRequest();
let groupID = window.location.hash.split('/')[2];
let data;
let html = "";/*`<style>
                #1KD_DIV{
                    border: 1px solid black;
                    padding: 10px 0px 10px 0px;
                    background-color: lightgrey;
                }
            <style>`*/;
xhr.open("GET",`http://1know.net/private/group/${groupID}/task`);
xhr.onload = async function(){
    data = await JSON.parse(xhr.responseText);
    let div = document.createElement('div');
    div.id = "1KD_DIV";
    for(let i = 0 ; i < data.length ; i++){
        html += `<ul>${data[i].name}(${data[i].uqid})`;
        for(let j = 0 ; j < data[i].units.length ; j++){
            html += `<li>${data[i].units[j].name}(${data[i].units[j].uqid})<button type="button" onclick="getAnalysisData(${data[i].uqid},${data[i].units[j].uqid})">DL</button></li>`
        }
        html += `</ul>`;
    }
    div.innerHTML = html;
    document.getElementsByClassName("collection-title")[0].appendChild(div);
};
xhr.send();

//titleArea = document.getElementsByClassName("collection-title")[0];

//javascript:(function(){let js=document.createElement("script");window.bookmarkletOptions={};js.src="https://sharteeya.github.io/1KD/js/bmFetcher.js";document.body.appendChild(js)})();
