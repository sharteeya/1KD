var MEMBER_DATA, STUDENT_ID_LIST = {}, TASK_LIST, GROUP_ID, GROUP_TABLE = {}, GROUP_NAME = {};
const PLUGIN_STYLE = `
    #KD_DIV{
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

    .KD_BTN_2{
        font-family: 微軟正黑體;
        background-color: orange;
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
    }`;

function getAnalysisData(tid, uid){
    let xhr = new XMLHttpRequest();
    if(window.location.host == "1know.net") xhr.open("GET", `http://1know.net/private/group/task/${tid}/analytics/unit/${uid}`);
    else xhr.open("GET", `http://www.1know.net/private/group/task/${tid}/analytics/unit/${uid}`);

    //GET DETAIL DATA

    xhr.onload = function(){
        let data = JSON.parse(xhr.responseText);
        if(data.unit.unit_type != "video"){
            alert("這不是觀看影片的單元");
            return;
        }

        let students = {}, arr = [];

        data.members.map((student, i) => {
            students[student.uqid] = student.full_name;
        });

        arr.push([
            "\ufeff姓名", 
            "學號", 
            "開始時間", 
            "結束時間", 
            "花費時間", 
            "影片開始時間", 
            "影片結束時間", 
            "影片觀看時間", 
            "影片名稱", 
            "影片長度"
        ]);

        data.shs.map((info, i) => {
            arr.push([
                students[info.uqid].replace(/\s/g, ''), 
                STUDENT_ID_LIST[students[info.uqid]], 
                new Date(info.real_time_s).toString(), 
                new Date(info.real_time_e).toString(), 
                Math.round(info.real_time_d * 10) / 10, 
                Math.round(info.video_time_s * 10) / 10, 
                Math.round(info.video_time_e * 10) / 10, 
                Math.round(info.video_time_d * 10) / 10,
                data.unit.name, 
                data.unit.content_time,
            ]);
        });

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
    xhr.send();
}

function whoDidntFinish(tid, uid){
    let xhr = new XMLHttpRequest();
    if(window.location.host == "1know.net") xhr.open('GET', `http://1know.net/private/group/task/${tid}/analytics/unit/${uid}`);
    else xhr.open('GET', `http://www.1know.net/private/group/task/${tid}/analytics/unit/${uid}`);
 
    xhr.onload = function(){
        let data = JSON.parse(xhr.responseText);
        let reading = "", unread = "";
        data.members.map((student, i) => {
            if(student.status === 2){
                reading += (student.full_name.split(' ')[0] + student.full_name.split(' ')[1] + ' ')
            }else if(student.status === 0 || student.status === null){
                unread += (student.full_name.split(' ')[0] + student.full_name.split(' ')[1] + ' ');
            }
        });

        if(reading == "") reading = "無";
        if(unread == "") unread = "無";
        alert(`未看完學生：${reading}\n完全未看學生：${unread}`);
    }
    xhr.send();
}

function checkIs1Know(){
    if(window.location.host != '1know.net' && window.location.host != 'www.1know.net'){
        alert('這不是1know網站');
        return false;
    }else if(window.location.hash.split('/')[2] === undefined ){
        alert('無法獲得群組ID');
        return false;
    }else if(document.getElementById('KD_LOAD')){
        alert('正在讀取中');
        return false;
    }else if(document.getElementById('KD_DIV')){
        alert('下載列表已經讀取過了');
        return false;
    }else if(window.location.host == '1know.net' || window.location.host == 'www.1know.net'){
        return true;
    }else{
        return false; //buy why?
    }
}

function getMember() {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    if(window.location.host == "1know.net") xhr.open("GET",`http://1know.net/private/group/${GROUP_ID}/member`);
    else xhr.open("GET",`http://www.1know.net/private/group/${GROUP_ID}/member`);
    xhr.onload = function() {
        let data = JSON.parse(xhr.responseText);
        MEMBER_DATA = data;
        data.map((student, i) => {
            STUDENT_ID_LIST[student.full_name] = student.email.split('@')[0];
            if(student.team){
                GROUP_TABLE[student.uqid] = student.team
            }
        });
    }
    xhr.send();
}

function getTasks() {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    if(window.location.host == "1know.net") xhr.open("GET", `http://1know.net/private/group/${GROUP_ID}/task`);
    else xhr.open("GET", `http://www.1know.net/private/group/${GROUP_ID}/task`);
    xhr.onload = function() {
        let data = JSON.parse(xhr.responseText);
        TASK_LIST = data;

        let listDiv = document.createElement('div'), listContent = "";
        listDiv.id = "KD_DIV";
        data.map((task, i) => {
            listContent += `<h4 class='KD_H4'>【${task.name}】</h4>`;
            task.units.map((unit, j) => {
                if(unit.unit_type == "video") {
                    listContent += `<div class='KD_LI' id = ${unit.uqid}>${unit.name} 
                    <button type="button" title="下載為CSV檔" onclick="getAnalysisData('${task.uqid}','${unit.uqid}')" class="KD_BTN">CSV</button>
                    <button type="button" title="查看誰沒看完影片" onclick="whoDidntFinish('${task.uqid}','${unit.uqid}')" class="KD_BTN_2">誰沒看完？</button>
                    <button type="button" title="查看統計圖表" onclick="getChart('${task.uqid}','${unit.uqid}')" class="KD_BTN_2">統計圖表</button>
                    </div>
                    `
                }
            });
        });
        listDiv.innerHTML = listContent;
        document.getElementsByClassName("collection-title")[0].appendChild(listDiv);
        document.getElementsByClassName("collection-title")[0].removeChild(document.getElementById("KD_LOAD"));
    };
    xhr.send();
}

function getGroup(){
    let xhr = new XMLHttpRequest();
    if(window.location.host == "1know.net") xhr.open("GET", `http://1know.net/private/group/${GROUP_ID}/member/team`);
    else xhr.open("GET", `http://www.1know.net/private/group/${GROUP_ID}/member/team`);
    xhr.onload = function(){
        let data = JSON.parse(xhr.responseText);
        data.map((g,i) => {
            GROUP_NAME[g.uqid] = g.name;
        });
    };
    xhr.send();
}

function getChart(tid, uid){
    dlBtn = document.createElement('button');
    dlBtn.innerText = "下載圖表"
    dlBtn.className = 'KD_BTN_2'
    dlBtn.onclick = function(uid){
        let link = document.createElement('a');
        can = this.parentNode.getElementsByTagName('canvas')[0]
        link.href = can.toBase64Image();
        link.download = `${can.id}_GroupWatchTime.png`;
        
        link.click();
    }
    document.getElementById(uid).appendChild(dlBtn);
    let chart = document.createElement('canvas');
    chart.id = `${uid}_canvas`;
    document.getElementById(uid).appendChild(chart);
    chart = document.getElementById(`${uid}_canvas`).getContext('2d');
    let xhr = new XMLHttpRequest();
    if(window.location.host == "1know.net") xhr.open("GET", `http://1know.net/private/group/task/${tid}/analytics/unit/${uid}`);
    else xhr.open("GET", `http://www.1know.net/private/group/task/${tid}/analytics/unit/${uid}`);
    xhr.onload = function(){
        let data = JSON.parse(xhr.responseText);
        if(data.unit.unit_type != "video"){
            alert("這不是觀看影片的單元");
            return;
        }
        let total_time = {}
        data.shs.map((record, i) => {
            if(!total_time[GROUP_TABLE[record.uqid].uqid]) total_time[GROUP_TABLE[record.uqid].uqid] = 0;
            total_time[GROUP_TABLE[record.uqid].uqid] += record.video_time_d;
        });
        let labs = [], times = [];
        for(let key in total_time){
            labs.push(GROUP_NAME[key]);
            times.push(Math.round(total_time[key]))
        }
        let c = new Chart(chart, {
            type: 'bar',
            data: {
                labels: labs,
                datasets: [{
                    label: '觀看秒數',
                    backgroundColor: 'rgb(255, 207, 102, 0.75)',
                    borderColor: 'rgb(255, 181, 18)',
                    data: times
                }]
            },
            options: {}
        });

    }
    xhr.send();
}

function init(){
    if(checkIs1Know() === true){
        // add init hint
        let styles = document.createElement('style'), loadDiv = document.createElement('div');
        styles.innerHTML = PLUGIN_STYLE;
        loadDiv.id = 'KD_LOAD';
        loadDiv.innerText = "讀取資料中...請耐心等候";
        document.getElementsByClassName("collection-title")[0].appendChild(styles);
        document.getElementsByClassName("collection-title")[0].appendChild(loadDiv);

        // init global variable
        GROUP_ID = window.location.hash.split('/')[2];
        try{
            getGroup();
        }catch(e){

        }
        getTasks();
        getMember();
        
    }else{
        console.log("URL VERIFY FAILED!");
    }
}

init();