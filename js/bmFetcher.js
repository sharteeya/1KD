
function getAnalysisData(tid, uid){
    let link = `http://1know.net/private/group/task/${tid}/analytics/unit/${uid}`;
    let uxhr = new XMLHttpRequest();
    let data;
    let arr = [];
    uxhr.open("GET",link);
    uxhr.onload = async function(){
        data = await JSON.parse(uxhr.responseText);
        if(data.unit.unit_type!="video"){
            alert("這不是觀看影片的單元");
            return;
        }
        let students = {};
        for(let i = 0 ; i < data.members.length ; i++){
            students[data.members[i].uqid] = data.members[i].full_name;
        }
        arr.push(["姓名", "開始時間", "結束時間", "影片開始時間", "影片結束時間"]);
        for(let i = 0 ; i < data.shs.length ; i++){
            let d = data.shs[i];
            arr.push([students[d.uqid], d.real_time_s, d.real_time_e, d.video_time_s, d.video_time_e]);
        }
        let csvContent = "data:text/csv;charset=utf-8,";

        arr.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `1Know資料統計_${data.unit.name}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click();
    }
    uxhr.send();
}


let styles = document.createElement("style");
styles.innerHTML = `#KD_DIV{
                        border: 1px solid black;
                        padding: 10px 0px 10px 0px;
                        background-color: lightgrey;
                        font-family: 微軟正黑體;
                    }
                    
                    .KD_HR{
                        border-top: 1px solid black;
                    }
                    `;
document.getElementsByClassName("collection-title")[0].appendChild(styles);
let xhr = new XMLHttpRequest();
let groupID = window.location.hash.split('/')[2];
let data;
let html = "";
xhr.open("GET",`http://1know.net/private/group/${groupID}/task`);
xhr.onload = async function(){
    data = await JSON.parse(xhr.responseText);
    let div = document.createElement('div');
    div.id = "KD_DIV";
    for(let i = 0 ; i < data.length ; i++){
        html += `<h4>${data[i].name}</h4><ul>`;//(${data[i].uqid})
        for(let j = 0 ; j < data[i].units.length ; j++){
            html += `<li>${data[i].units[j].name} <button type="button" onclick="getAnalysisData('${data[i].uqid}','${data[i].units[j].uqid}')">下載統計資料</button></li>`
        }//(${data[i].units[j].uqid})
        html += `</ul>`;
        html += `<hr class="KD_HR">`;
    }
    div.innerHTML = html;
    document.getElementsByClassName("collection-title")[0].appendChild(div);
};
xhr.send();

//titleArea = document.getElementsByClassName("collection-title")[0];

//javascript:(function(){let js=document.createElement("script");window.bookmarkletOptions={};js.src="https://sharteeya.github.io/1KD/js/bmFetcher.js";document.body.appendChild(js)})();
