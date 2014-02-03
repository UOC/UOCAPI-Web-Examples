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
						row.cells[7].innerHTML = '<button onclick="getPeopleL('+response.classrooms[iter].id+')">getPeoplefromClass'+iter+'</button>';						
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

function getPeopleL(cid){
	$('div.authenticated').hide();
	$('div.getPeopleL').show();
    /*STARTUOCAPIEXAMPLE*/	
	$.ajax({
			/* UOCAPICALL /api/v1/classrooms/{id}/people/teachers GET*/
			url: apiHost + '/classrooms/'+cid+'/people/teachers?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaPeopleL");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 9; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Photo</b>";
					firstrow.cells[1].innerHTML = "<b>Id</b>";
					firstrow.cells[2].innerHTML = "<b>UserName</b>";
					firstrow.cells[3].innerHTML = "<b>Name</b>";
					firstrow.cells[4].innerHTML = "<b>Number</b>";
					firstrow.cells[5].innerHTML = "<b>FullName</b>";
					firstrow.cells[6].innerHTML = "<b>Language</b>";
					firstrow.cells[7].innerHTML = "<b>SessionId</b>";
					firstrow.cells[8].innerHTML = "<b>Email</b>";
					iter = 0;
					var i = 0;
					while (iter < response.users.length){
						var row = table.insertRow(-1);
						for(i=0; i < 9; i++) {
							row.insertCell();
						}
						row.cells[0].innerHTML = '<img src="' + response.users[iter].photoUrl + '">';
						row.cells[1].innerHTML = response.users[iter].id;
						row.cells[2].innerHTML = response.users[iter].username;
						row.cells[3].innerHTML = response.users[iter].name;
						row.cells[4].innerHTML = response.users[iter].number;
						row.cells[5].innerHTML = response.users[iter].fullName;
						row.cells[6].innerHTML = response.users[iter].language;
						row.cells[7].innerHTML = response.users[iter].sessionId;
						row.cells[8].innerHTML = response.users[iter].email;	
						iter = iter + 1;
					}
				}
			}
		});
}
/*ENDUOCAPIEXAMPLE*/

function displayClassL(){
	$('div.getPeopleL').hide();
	$('div.authenticated').show();
}