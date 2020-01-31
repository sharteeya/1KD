function getGroupTasks(){
    let link, groupID;
    try{
        link  = new URL(document.getElementById('groupUrl').value);
    }catch(e){
        Swal.fire({
            icon: 'error',
            title: 'Incorrent URL',
            text: 'This is not a URL',
        });
    }
    if(link.host != "1know.net"){
        Swal.fire({
            icon: 'error',
            title: 'Incorrent URL',
            text: 'This is not a 1know URL',
        });
    }
    groupID = link.hash.split('/')[2];
    //taskURL
    //http://1know.net/private/group/groupID/task
    document.getElementById('groupId').value = groupID;
    $.ajax({
        url: `http://1know.net/private/group/${groupID}/task`,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        error: function(xhr) {
          alert('Ajax request 發生錯誤');
        },
        headers: {
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        success: function(response) {
            console.log(response)
        }
    });
}