var socket = io.connect("http://localhost:3000", {
    extraHeaders: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6InRoaWVudHJpLjEyM0BnbWFpbC5jb20iLCJpYXQiOjE2OTMxNjEyMzgsImV4cCI6MTY5Mzc2NjAzOH0.Nq7r3E8QOWCUfiMdR0Jfa-mlCPKmOlSaqBbsLHZfJSs`,
    },
});

socket.on("newMessage", (message) => {
    $("#chatMessages").append(`<div>${message.un}: ${message.ms}</div>`);
});
socket.on("allOldMessages", (payload) => {
    $("#chatMessages").append(`<div>${payload.sendID}: ${payload.msg}</div>`);
});

$("#users").ready(async () => {
    const res = await fetch(`http://localhost:3000/user`, {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6InRoaWVudHJpLjEyM0BnbWFpbC5jb20iLCJpYXQiOjE2OTMxNjEyMzgsImV4cCI6MTY5Mzc2NjAzOH0.Nq7r3E8QOWCUfiMdR0Jfa-mlCPKmOlSaqBbsLHZfJSs`,
        },
    });
    const us = await res.json();
    us.map(async (r) => {
        $("#users").append(
            `<div class="user" value="${r.id}">${r.userName} </div>`
        );  
    });
});

$(document).ready(function () {
    let roomName = null;
    let idReceiver = null;
    let idMe = null
    $("#users").each(function () {
        $(this).click(async function (data) {
            const res = await fetch(`http://localhost:3000/user/me`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6InRoaWVudHJpLjEyM0BnbWFpbC5jb20iLCJpYXQiOjE2OTMxNjEyMzgsImV4cCI6MTY5Mzc2NjAzOH0.Nq7r3E8QOWCUfiMdR0Jfa-mlCPKmOlSaqBbsLHZfJSs`,
                },
            });
            const me = await res.json();
            idMe = me.id;
            socket.emit("leaveRoom", roomName)
            $("#chatMessages").html("");
            idReceiver = Number(data.target.getAttribute("value"));
            $("#repUser").html("");
            $("#repUser").append(`<h3>${data.target.textContent}</h3>`);
            roomName = room(idMe,idReceiver);
            console.log("join room: ", roomName);
            socket.emit("joinRoom", roomName);
            socket.emit("oldMessages", { idMe, idReceiver });
        });
    });
    $("#sendPrivateMessage").click( function () {
        const msg = $("#messageInput").val();
        console.log(msg);
        socket.emit("sendMessage", { roomName, idMe, idReceiver, msg });
        $("#messageInput").val("");
    });
});

function room(idMe,idReceiver){
    return idMe <= idReceiver
    ? `${idMe}-${idReceiver}`
    : `${idReceiver}-${idMe}`;
}
