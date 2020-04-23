var stompClient = null;

function setConnected(connected){
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	if (connected){
		$("#conversation").show();
	}else{
		$("#conversation").hide();
	}
	$("#userinfo").html("");
}

function connect() {
	var socket = new SockJS('/chat-messaging');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		setConnected(true);
		console.log("Connected: " + frame);
		stompClient.subscribe('/chat/messages', function(response) {
			var data = JSON.parse(response.body);
			draw("left", data.message);
		});
	});
}

function draw(side, text) {
	console.log("drawing...");
    var $message;
    $message = $($('.message_template').clone().html());
    $message.addClass(side).find('.text').html(text);
    $('.messages').append($message);
    return setTimeout(function () {
        return $message.addClass('appeared');
    }, 0);

}
function disconnect(){
	stompClient.disconnect();
}
function sendMessage(){
	stompClient.send("/app/message", {}, JSON.stringify({'message': $("#message_input_value").val()}));

}
