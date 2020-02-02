
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
        arr.push(["\ufeff姓名", "開始時間", "結束時間", "花費時間", "影片開始時間", "影片結束時間", "影片觀看時間"]);
        for(let i = 0 ; i < data.shs.length ; i++){
            let d = data.shs[i];
            let r_time_s = new Date(d.real_time_s);
            let r_time_e = new Date(d.real_time_e);
            arr.push([students[d.uqid], r_time_s, r_time_e, d.real_time_d, d.video_time_s, d.video_time_e, d.video_time_d]);
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


if(window.location.host != "1know.net"){
    alert("這不是1know網站");
}else if(window.location.hash.split("/")[2] === undefined ){
    alert("無法獲得群組ID");
}else if(document.getElementById('KD_LOAD')){
    alert("正在讀取中");
}else if(document.getElementById('KD_DIV')){
    alert("下載列表已經讀取過了");
}else{
    let styles = document.createElement("style");
    styles.innerHTML = `#KD_DIV{
                            border: 1px solid grey;
                            background-color: white;
                            font-family: 微軟正黑體;
                            box-shadow: 1px 2px 2px 2px grey;
                        }
                        
                        .KD_HR{
                            border-top: 1px solid black;
                        }

                        .KD_BTN{
                            font-family: 微軟正黑體;
                            background-color: #037bfc;
                            border: none;
                            margin-left: 10px;
                            font-weight: bold;
                            margin-right: 10px;
                            border-radius: 5px;
                            color: white;
                            padding: 3px 8px 3px 8px;
                        }

                        .KD_BTN:hover{
                            background-color: #0057b5;
                        }

                        .KD_LI{              
                            font-weight: bolder;
                            margin-bottom: 10px;
                            padding-bottom: 2px;
                            display: block;
                            padding-left: 15px;
                            border-bottom: 1px gray dotted;
                        }

                        .KD_H4{
                            font-weight: bold;
                            padding-left: 5px;
                            margin-top: 20px;
                        }

                        #KD_LOAD{
                            padding: 15px 0px 15px 0px;
                            font-famliy: 微軟正黑體;
                        }
                        `;
    let loadDiv = document.createElement('div');
    loadDiv.id = "KD_LOAD";
    loadDiv.innerText = "讀取資料中...請耐心等候";
    document.getElementsByClassName("collection-title")[0].appendChild(styles);
    document.getElementsByClassName("collection-title")[0].appendChild(loadDiv);
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
            html += `<h4 class="KD_H4">【${data[i].name}】</h4>`;//(${data[i].uqid})
            for(let j = 0 ; j < data[i].units.length ; j++){
                if(data[i].units.unit_type != "video") continue;
                html += `<div class="KD_LI">${data[i].units[j].name} <button type="button" title="下載為CSV檔" onclick="getAnalysisData('${data[i].uqid}','${data[i].units[j].uqid}')" class="KD_BTN">CSV</button></div>`
            }
        }
        div.innerHTML = html;
        document.getElementsByClassName("collection-title")[0].appendChild(div);
        document.getElementsByClassName("collection-title")[0].removeChild(document.getElementById("KD_LOAD"));
    };
    xhr.send();
}