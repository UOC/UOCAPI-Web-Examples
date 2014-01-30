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
			url: apiHost + '/mail/folders?access_token='+token,
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaFolders");

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
					while (iter < response.folders.length){
						var row = table.insertRow(-1);
						for(i; i < 5; i++) {
							row.insertCell();
						}
						i = 0;
						row.cells[0].innerHTML = response.folders[iter].id;
						row.cells[1].innerHTML = response.folders[iter].name;
						row.cells[2].innerHTML = response.folders[iter].unreadMessages;
						row.cells[3].innerHTML = response.folders[iter].totalMessages;
						row.cells[4].innerHTML = '<button onclick="getMailFoldersMessages('+(iter+1)+')">Unread '+iter+'</button>';						
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

function getMailFoldersMessages(cid){
	var tableElement = document.getElementById("taulaFolders");
	var id = tableElement.rows[cid].cells[0].innerHTML;
    /*STARTUOCAPIEXAMPLE*/	
	$.ajax({
			/* UOCAPICALL /api/v1/mail/folders/{id}/messages/unread GET*/
			url: apiHost + '/mail/folders/'+id+'/messages/unread?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaFoldersMessagesUnread");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 10; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>id</b>";
					firstrow.cells[1].innerHTML = "<b>subject</b>";
					firstrow.cells[2].innerHTML = "<b>snippet</b>";
					firstrow.cells[3].innerHTML = "<b>date</b>";
					firstrow.cells[4].innerHTML = "<b>color</b>";
					firstrow.cells[5].innerHTML = "<b>status</b>";
					firstrow.cells[6].innerHTML = "<b>from</b>";
					firstrow.cells[7].innerHTML = "<b>to</b>";
					firstrow.cells[8].innerHTML = "<b>cc</b>";
					firstrow.cells[9].innerHTML = "<b>body</b>";
					iter = 0;
					var i = 0;
					while (iter < response.messages.length){
						var row = table.insertRow(-1);
						for(i; i < 10; i++) {
							row.insertCell();
						}
						i = 0;
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
				$('div.authenticated').hide();
				$('div.getfoldersMessagesUnread').show();			
			}
		});
	
}
/*ENDUOCAPIEXAMPLE*/

function displayFolders(){
	$('div.getfoldersMessagesUnread').hide();
	$('div.authenticated').show();
}