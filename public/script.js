var socket = io.connect();
function addMessage(msg, pseudo) {
    if (pseudo === "Me") {
        $("#chatEntries").append('<div class="message self">' + '<strong>' + pseudo + ':</strong> ' + msg + '</div>');
    }
    else {
        $("#chatEntries").append('<div class="message">' + '<strong>' + pseudo + ':</strong> ' + msg + '</div>');
    }
}
function sentMessage() {
    if ($('#messageInput').val() != "") {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
        $('#messageInput').focus();
    }
}
function setPseudo() {
    if ($("#pseudoInput").val() != "") {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
}

socket.on('message', function (data) {
    addMessage(data['message'], data['pseudo']);
});
socket.on('joined_left', function (data) {
    var pseudo = data['pseudo'];
    if (data['action'] === "joined") {
        $("#chatEntries").append('<div class="message joined">' + '<strong>\'' + pseudo + '\' has joined.</strong></div>');
    }
    else if (data['action'] === "left") {
        $("#chatEntries").append('<div class="message joined">' + '<strong>\'' + pseudo + '\' has left.</strong></div>');
    }
});

// and the magic happens right here
$(document).ready(function () {
    var nameset = false;
    $("#chatControls").hide();
    //set name
    $("#pseudoInput").focus();
    $("#pseudoSet").click(function () {
        setPseudo();
        if ($("#pseudoInput").val() != ""){
            nameset = true;
        }
    });
    //send message
    $("#submit").click(function () {
        sentMessage();
    });
    $(document).keypress(function (event) {
        if (nameset === false) {
            $('#pseudoInput').focus();
        } 
        else{
            $('#messageInput').focus();
        }
        if (event.which === 13) {
            if (nameset === false) {
                $('#pseudoSet').click();
            } 
            else{
                $('#submit').click();
            }
        }
    });
});