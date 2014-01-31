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
						row.cells[7].innerHTML = '<button onclick="getResourceL('+response.classrooms[iter].id+')">getResourcefromClass'+iter+'</button>';						
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

function getResourceL(cid){
	$('div.authenticated').hide();
	$('div.getResourceL').show();
    /*STARTUOCAPIEXAMPLE*/	
	$.ajax({
			/* UOCAPICALL /api/v1/classrooms/{id}/resources GET*/
			url: apiHost + '/classrooms/'+cid+'/resources?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaResourceL");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 6; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Id</b>";
					firstrow.cells[1].innerHTML = "<b>type</b>";
					firstrow.cells[2].innerHTML = "<b>subtype</b>";
					firstrow.cells[3].innerHTML = "<b>title</b>";
					firstrow.cells[4].innerHTML = "<b>code</b>";
					firstrow.cells[5].innerHTML = "<b>domainId</b>";
					iter = 0;
					var i = 0;
					while (iter < response.resources.length){
						var row = table.insertRow(-1);
						for(i=0; i < 6; i++) {
							row.insertCell();
						}
						row.cells[0].innerHTML = response.resources[iter].id;
						row.cells[1].innerHTML = response.resources[iter].type;
						row.cells[2].innerHTML = response.resources[iter].subtype;
						row.cells[3].innerHTML = response.resources[iter].title;
						row.cells[4].innerHTML = response.resources[iter].code;
						row.cells[5].innerHTML = response.resources[iter].domainId;	
						iter = iter + 1;
					}
				}
			}
		});
}
/*ENDUOCAPIEXAMPLE*/

function displayClassL(){
	$('div.getResourceL').hide();
	$('div.authenticated').show();
}