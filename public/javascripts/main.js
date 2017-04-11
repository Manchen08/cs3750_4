$(document).ready(function () {
    // let usersOnline = [];
    let socket = io.connect('http://localhost:3000');
    let chatForm = $('#chatForm');
    let message = $('#chatInput');
    let chatWindow = $('#chatWindow');
    let username = '';
    let usersul = $('#userList');
    let error = $('#error');
    let users = [];

    chatForm.on('submit', function(e){
            e.preventDefault(); // prevent actual form submission
            socket.emit('c2smsg', message.val());
                if(message.val().length == 0){
                    return false;
                }
            chatWindow.append('<strong>You:</strong> ' + message.val() + '<br>');
            chatWindow.animate({
                scrollTop: chatWindow[0].scrollHeight
            }, 1000);
            message.val('');
            return false;
    });

    $('.send_on_enter').keydown(function (event) {
        if (event.keyCode == 13) { // enter key has keyCode = 13
            if(message.val().length == 0){
                return false;
            }
            socket.emit('c2smsg', message.val());
            chatWindow.append('<strong>You:</strong> ' + message.val() + '<br>');
            chatWindow.animate({
                scrollTop: chatWindow[0].scrollHeight
            }, 1000);
            message.val('');
            return false;
        }
    });

    socket.on('whoami', data => {
        username = data.username;
    });

    socket.on('connect', function (data) {
        chatWindow.append('<strong>You</strong> joined the chatroom<br>');
        socket.emit('getUser');
        socket.emit('getUsers');
    });

    socket.on('s2cmsg', function (data) {
        chatWindow.append('<strong>' + data.person + ':</strong> ' + data.message + '<br>');
        scrollChatWindow();
    });

    socket.on('userList', function (data) {
        let html = '';
        data.sort();
        for(let i = 0; i < data.length; i++){
            while(data[i] == data[i+1] && i < data.length-1){ // this makes so that users are not listed twice
                i++;
            }
            html += '<h3 class="conversation padding" id="' + data[i] + '">' + data[i] + '</h3>';
        }
        // let i = 0;
        // for (let i = 0; i < data.length; i++) {
        //     html += '<h3 class="conversation padding" id="' + data[i] + '">' + data[i] + '</h3>';
        // }
        usersul.append(html);
    });

    socket.on('userLoggedOut', (data) => {
        chatWindow.append('<span class="pull-right logout"><strong>' + data + '</strong> left the chat room</span><br>');
        $("#" + data).remove();
        scrollChatWindow();
    });

    socket.on('userLoggedIn', (data) => {
        chatWindow.append('<span class="pull-right login"><strong>' + data + '</strong> joined the chat room</span><br>');
        usersul.append('<h3 class="conversation padding" id="' + data + '">' + data + '</h3>');
        scrollChatWindow();
    });

    function scrollChatWindow() {
        chatWindow.animate({
            scrollTop: chatWindow[0].scrollHeight
        }, 1000);
    }

});