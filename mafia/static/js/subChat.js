// 관련 변수 들고 오기
const subChatText = document.querySelector(".sub_chat_text");
const subChatSend = document.querySelector(".sub_chat_send");

// 스크롤 밑으로 
function gotoBottom(cls){
	const element = document.querySelector(cls);
	element.scrollTop = element.scrollHeight-element.clientHeight;
}

// 엔터로 메시지 보내기
function keySendSubMessage(key){
	if(key.keyCode==13){
		sendSubMessage();
	}
}

function sendSubMessage(event){
	// 메시지 가져오기
	const message = subChatText.value;
	// 메시지를 적었을 때만 전송 가능
	if(message!=""){
		// 내가 전송한 메시지 채팅창에 표시
		const chatWindow = document.querySelector('.sub_chat');
		const chatLine = document.createElement('div');
		const node = document.createTextNode(`나 : ${message}`);

		chatLine.classList.add('my')
		chatLine.appendChild(node);
		chatWindow.appendChild(chatLine);

		// // 스크롤 밑으로
		gotoBottom('.sub_chat');

		// 서버로 메시지와 필요 데이터 전달
		socket.emit('sendMsg', {type: 'subMsg', message: message});

		// 입력창 비우기
		document.querySelector('.sub_chat_text').value="";
	}

	

}
// 메시지 받아서 표시
socket.on('subMsg', (data)=>{
	const chatWindow = document.querySelector('.sub_chat');
	const chatLine = document.createElement('div');
	const node = document.createTextNode(`${data.name} : ${data.message}`);

	chatLine.classList.add('other');
	chatLine.appendChild(node);
	chatWindow.appendChild(chatLine);
})

// 시민은 서브채팅 못써
socket.on('cannotSubSend', (data)=>{
	console.log(data);
	if(data=='citizen'){
		
		// 메시지 내용이 있을 때만 보내지니까 input을 닫아버리자. 
		subChatText.disabled =true;
	}else {
		subChatText.disabled =false;
	}
});

socket.on('resetChat', (data)=>{
	if(data=='reset'){
		const subWindow = document.querySelector('.sub_chat');
		while(subWindow.hasChildNodes()){
			subWindow.removeChild(subWindow.firstChild);
		}
	}
})

function init(){
	subChatText.addEventListener('keydown',keySendSubMessage);
	subChatSend.addEventListener('click',sendSubMessage);
}

init();