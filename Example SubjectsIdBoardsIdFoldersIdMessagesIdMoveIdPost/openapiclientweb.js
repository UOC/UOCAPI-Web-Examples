var setting = {
		'host': "http://oslo.uoc.es:8080/webapps/uocapi",
		'clientId': "EUI3WhtdZMjwOLxwFyzUcLUUXeE0ACmB6See1HWRjoCSIgGJ1If8EI8EPorzSWFRRnw1fxkOvIqkBI1d91GGKKG6nFnD35OY6VOEx4LcFLQIW3Z2jGsTaYey4bUcbR4K"
	};
	
var apiHost = setting.host + "/api/v1";

$(function() {
	var extractToken = function(hash) {
			var match = hash.match(/access_token=([\w-]+)/);
			return !!match && match[1];
	};
	
	var authorizeHost = setting.host + "/oauth/authorize";

	var getCode = function() {
		var authUrl = authorizeHost + 
			"?response_type=token" + 
			"&scope=READ READ_MAIL READ_BOARD SEND_MAIL SEND_BOARD WRITE" + 
			"&client_id=" + setting.clientId + 
			"&state=estado" + 
			"&redirect_uri=http://" + window.location.host + window.location.pathname;

		$('a.connect').attr("href", authUrl);
		$('.authenticate').show();
	};

	var getData = function(token) {
		$('span.token').text(token);
		$('div.authenticated').show();
		
		$.ajax({
			url: apiHost + '/subjects?access_token='+token,
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaClass");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 7; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Id</b>";
					firstrow.cells[1].innerHTML = "<b>Title</b>";
					firstrow.cells[2].innerHTML = "<b>FatherId</b>";
					firstrow.cells[3].innerHTML = "<b>Color</b>";
					firstrow.cells[4].innerHTML = "<b>Assignments</b>";
					firstrow.cells[5].innerHTML = "<b>Code</b>";
					firstrow.cells[6].innerHTML = "<b>ShortTitle</b>";
					iter = 0;
					var i = 0;
					while (iter < response.subjects.length){
						var row = table.insertRow(-1);
						for(i=0; i < 8; i++) {
							row.insertCell();
						}
						row.cells[0].innerHTML = response.subjects[iter].id;
						row.cells[1].innerHTML = response.subjects[iter].title;
						row.cells[2].innerHTML = response.subjects[iter].fatherId;
						row.cells[3].innerHTML = response.subjects[iter].color;
						row.cells[4].innerHTML = response.subjects[iter].assignments;
						row.cells[5].innerHTML = response.subjects[iter].code;
						row.cells[6].innerHTML = response.subjects[iter].shortTitle;	
						row.cells[7].innerHTML = '<button onclick="getBoardL('+response.subjects[iter].id+')">getBoardsfromSubj'+iter+'</button>';						
						iter = iter + 1;
					}
				}
			}
		});
	};
	

	var token = extractToken(document.location.hash);
	if (token) {
		// put access token as a request header for all AJAX requests
		$.ajaxSetup({
			headers: {
				"Authorization": "Bearer " + token
			}
		});
		getData(token);
	} else {
		getCode();
	};
	
	
});

function getBoardL(cid){
	$('div.authenticated').hide();
	$('div.getBoardL').show();
	$('span.cid').text(cid);
	$.ajax({
			url: apiHost + '/subjects/'+cid+'/boards?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaBoardL");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 7; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Id</b>";
					firstrow.cells[1].innerHTML = "<b>Subtype</b>";
					firstrow.cells[2].innerHTML = "<b>Title</b>";
					firstrow.cells[3].innerHTML = "<b>Code</b>";
					firstrow.cells[4].innerHTML = "<b>DomainId</b>";
					firstrow.cells[5].innerHTML = "<b>UnreadMessages</b>";
					firstrow.cells[6].innerHTML = "<b>TotalMessages</b>";
					iter = 0;
					var i = 0;
					while (iter < response.boards.length){
						var row = table.insertRow(-1);
						for(i=0; i < 8; i++) {
							row.insertCell();
						}
						row.cells[0].innerHTML = response.boards[iter].id;
						row.cells[1].innerHTML = response.boards[iter].subtype;
						row.cells[2].innerHTML = response.boards[iter].title;
						row.cells[3].innerHTML = response.boards[iter].code;
						row.cells[4].innerHTML = response.boards[iter].domainId;
						row.cells[5].innerHTML = response.boards[iter].unreadMessages;
						row.cells[6].innerHTML = response.boards[iter].totalMessages;
						row.cells[7].innerHTML = '<button onclick="getFolderL('+(iter+1)+')">getFoldersfromBoard'+iter+'</button>';
						iter++;
					}
				}
			}
		});
}

function getFolderL(index){
	$('div.getBoardL').hide();
	$('div.getFolderL').show();
	$('span.bid').text(document.getElementById("taulaBoardL").rows[index].cells[0].innerHTML);
	$.ajax({
			url: apiHost + '/subjects/'+$('span.cid').text()+'/boards/'+$('span.bid').text()+'/folders?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaFolderL");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 4; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Id</b>";
					firstrow.cells[1].innerHTML = "<b>Name</b>";
					firstrow.cells[2].innerHTML = "<b>UnreadMessages</b>";
					firstrow.cells[3].innerHTML = "<b>TotalMessages</b>";
					iter = 0;
					var i = 0;
					while (iter < response.folders.length){
						var row = table.insertRow(-1);
						for(i=0; i < 5; i++) {
							row.insertCell();
						}
						row.cells[0].innerHTML = response.folders[iter].id;
						row.cells[1].innerHTML = response.folders[iter].name;
						row.cells[2].innerHTML = response.folders[iter].unreadMessages;
						row.cells[3].innerHTML = response.folders[iter].totalMessages;
						row.cells[4].innerHTML = '<button onclick="getMessageL('+(iter+1)+')">getMessagesfromFolder'+iter+'</button>';
						iter = iter + 1;
					}
				}
			}
		});
}

function getMessageL(index){
	$('span.fid').text(document.getElementById("taulaFolderL").rows[index].cells[0].innerHTML);
	$.ajax({
			url: apiHost + '/subjects/'+$('span.cid').text()+'/boards/'+$('span.bid').text()+'/folders/'+$('span.fid').text()+'/messages?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaMessageL");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 10; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Id</b>";
					firstrow.cells[1].innerHTML = "<b>Subject</b>";
					firstrow.cells[2].innerHTML = "<b>Snippet</b>";
					firstrow.cells[3].innerHTML = "<b>Date</b>";
					firstrow.cells[4].innerHTML = "<b>Color</b>";
					firstrow.cells[5].innerHTML = "<b>Status</b>";
					firstrow.cells[6].innerHTML = "<b>From</b>";
					firstrow.cells[7].innerHTML = "<b>To</b>";
					firstrow.cells[8].innerHTML = "<b>Cc</b>";
					firstrow.cells[9].innerHTML = "<b>Body</b>";
					iter = 0;
					var i = 0;
					while (iter < response.messages.length){
						var row = table.insertRow(-1);
						for(i=0; i < 11; i++) {
							row.insertCell();
						}
						row.cells[0].innerHTML = response.messages[iter].id;
						row.cells[1].innerHTML = response.messages[iter].subject;
						row.cells[2].innerHTML = response.messages[iter].snippet;
						row.cells[3].innerHTML = response.messages[iter].date;
						row.cells[4].innerHTML = response.messages[iter].color;
						row.cells[5].innerHTML = response.messages[iter].status;
						row.cells[6].innerHTML = response.messages[iter].from;
						row.cells[7].innerHTML = response.messages[iter].to;
						row.cells[8].innerHTML = response.messages[iter].cc;
						row.cells[9].innerHTML = response.messages[iter].body;
						row.cells[10].innerHTML = '<button onclick="getFolders('+(iter+1)+')">getMessages'+iter+'</button>';
						iter = iter + 1;
					}
				}
				$('div.getFolderL').hide();
				$('div.getMessageL').show();
			}
		});
}

function getFolders(mid){
	$.ajax({
			url: apiHost + '/subjects/'+$('span.cid').text()+'/boards/'+$('span.bid').text()+'/folders?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaDesti");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 5; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[1].innerHTML = "<b>id</b>";
					firstrow.cells[2].innerHTML = "<b>name</b>";
					firstrow.cells[3].innerHTML = "<b>unreadMessages</b>";
					firstrow.cells[4].innerHTML = "<b>totalMessages</b>";
					iter = 0;
					var i = 0;
					while (iter < response.folders.length){
						var row = table.insertRow(-1);
						for(i; i < 5; i++) {
							row.insertCell();
						}
						i = 0;
						row.cells[1].innerHTML = response.folders[iter].id;
						row.cells[2].innerHTML = response.folders[iter].name;
						row.cells[3].innerHTML = response.folders[iter].unreadMessages;
						row.cells[4].innerHTML = response.folders[iter].totalMessages;
						row.cells[0].innerHTML = '<button onclick="moveMessage('+mid+','+(iter+1)+')">MoveMessage '+iter+'</button>';
						iter = iter + 1;
					}
				}
				$('div.getMessageL').hide();
				$('div.getdestination').show();
			}
		});
}

function moveMessage(indexm, indexd){
	var mid = document.getElementById("taulaMessageL").rows[indexm].cells[0].innerHTML;
	var did = document.getElementById("taulaDesti").rows[indexd].cells[1].innerHTML;
    /*STARTUOCAPIEXAMPLE*/
    var missatge = '{}'
	$.ajax({
			/* UOCAPICALL /api/v1/subjects/{domain_id}/boards/{board_id}/folders/{source_id}/messages/{id}/move/{destination_id} POST*/
			url: apiHost + '/subjects/'+$('span.cid').text()+'/boards/'+$('span.bid').text()+'/folders/'+$('span.fid').text()+'/messages/'+mid+'/move/'+did+'?access_token='+$('span.token').text(),
			type: "POST",
			dataType: "json",
			data:"",
			contentType:"application/json",
			success: function(response) {
				var table = document.getElementById("taulaMove");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 4; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>id</b>";
					firstrow.cells[1].innerHTML = "<b>name</b>";
					firstrow.cells[2].innerHTML = "<b>unreadMessages</b>";
					firstrow.cells[3].innerHTML = "<b>totalMessages</b>";

					iter = 0;
					var i = 0;
					var row = table.insertRow(-1);
					for(i; i < 4; i++) {
						row.insertCell();
					}
					row.cells[0].innerHTML = response.id;
					row.cells[1].innerHTML = response.name;
					row.cells[2].innerHTML = response.unreadMessages;
					row.cells[3].innerHTML = response.totalMessages;

				}
				$('div.getdestination').hide();
				$('div.movemessage').show();			
			}
		});
}
/*ENDUOCAPIEXAMPLE*/

function displayClassL(){
	$('div.getBoardL').hide();
	$('div.authenticated').show();
}

function displayBoardL(){
	$('div.getFolderL').hide();
	$('div.getBoardL').show();
}

function displayFolderL(){
	$('div.getMessageL').hide();
	$('div.movemessage').hide();
	$('div.getFolderL').show();
}

function displayMessageL(){
	$('div.getdestination').hide();
	$('div.getMessageL').show();
}