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
						row.cells[4].innerHTML = '<button onclick="getMailFolder('+(iter+1)+')">getFolder '+iter+'</button>';						
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

function getMailFolder(cid){
	var tableElement = document.getElementById("taulaFolders");
	var id = tableElement.rows[cid].cells[0].innerHTML;
    /*STARTUOCAPIEXAMPLE*/	
	$.ajax({
			/* UOCAPICALL /api/v1/mail/folders/{id} GET*/
			url: apiHost + '/mail/folders/'+id+'?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaFoldersOne");

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
				$('div.authenticated').hide();
				$('div.getfolder').show();			
			}
		});
	
}
/*ENDUOCAPIEXAMPLE*/

function displayFolders(){
	$('div.getfolder').hide();
	$('div.authenticated').show();
}