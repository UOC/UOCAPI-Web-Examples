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
		
		
		$.ajax({
			url: apiHost + '/classrooms?access_token='+token,
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
					while (iter < response.classrooms.length){
						var row = table.insertRow(-1);
						for(i=0; i < 8; i++) {
							row.insertCell();
						}
						row.cells[0].innerHTML = response.classrooms[iter].id;
						row.cells[1].innerHTML = response.classrooms[iter].title;
						row.cells[2].innerHTML = response.classrooms[iter].fatherId;
						row.cells[3].innerHTML = response.classrooms[iter].color;
						row.cells[4].innerHTML = response.classrooms[iter].assignments;
						row.cells[5].innerHTML = response.classrooms[iter].code;
						row.cells[6].innerHTML = response.classrooms[iter].shortTitle;	
						row.cells[7].innerHTML = '<button onclick="getBoardL('+response.classrooms[iter].id+')">getBoardsfromClass'+iter+'</button>';						
						iter = iter + 1;
					}
				}
				$('span.token').text(token);
				$('div.authenticated').show();
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
	$('span.cid').text(cid);
	$.ajax({
			url: apiHost + '/classrooms/'+cid+'/boards?access_token='+$('span.token').text(),
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
						row.cells[7].innerHTML = '<button onclick="getMessageL('+(iter+1)+')">getMessagesfromBoard'+iter+'</button>';
						iter++;
					}
				}
				$('div.authenticated').hide();
				$('div.getBoardL').show();
			}
		});
}

function getMessageL(index){
	$('span.bid').text(document.getElementById("taulaBoardL").rows[index].cells[0].innerHTML);
    /*STARTUOCAPIEXAMPLE*/	
	$.ajax({
			/* UOCAPICALL /api/v1/classrooms/{domain_id}/boards/{id}/messages/unread GET*/
			url: apiHost + '/classrooms/'+$('span.cid').text()+'/boards/'+$('span.bid').text()+'/messages/unread?access_token='+$('span.token').text(),
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
						for(i=0; i < 10; i++) {
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
						iter = iter + 1;
					}
				}
				$('div.getBoardL').hide();
				$('div.getMessageL').show();
			}
		});
}
/*ENDUOCAPIEXAMPLE*/

function displayClassL(){
	$('div.getBoardL').hide();
	$('div.authenticated').show();
}

function displayBoardL(){
	$('div.getMessageL').hide();
	$('div.getBoardL').show();
}