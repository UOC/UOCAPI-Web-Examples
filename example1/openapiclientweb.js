$(function() {
	var extractToken = function(hash) {
			var match = hash.match(/access_token=([\w-]+)/);
			return !!match && match[1];
	};

	var setting = {
		'host': "http://oslo.uoc.es:8080/webapps/uocapi",
		'clientId': "EUI3WhtdZMjwOLxwFyzUcLUUXeE0ACmB6See1HWRjoCSIgGJ1If8EI8EPorzSWFRRnw1fxkOvIqkBI1d91GGKKG6nFnD35OY6VOEx4LcFLQIW3Z2jGsTaYey4bUcbR4K"
	};
	
	var authorizeHost = setting.host + "/oauth/authorize";
	var apiHost = setting.host + "/api/v1";

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
		var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
		if(iOS){
			var paramtoken = 'ejemplo1://?access_token='+token;
			$('a.iOSlaunch').attr("href",paramtoken);
		}
		//aqui es podria mirar si es un dispositiu android var android = (navigator.userAgent.match(/Android/i) ? true : false);
		else{
			$('a.iOSlaunch').hide();	
		}
		
		$.ajax({
			url: apiHost + '/user?access_token='+token,
			type: "GET",
			dataType: "json",
			success: function(response) {
				var container = $('span.user');
				var fncont = $('span.fullName');
				var emcont = $('span.email');
				var numcont = $('span.number');
				var photoURL = $('span.photoUrl');
				var ncont = $('span.name');
				if (response) {
					container.text(response.username);
					fncont.text(response.fullName);
					emcont.text(response.email);
					numcont.text(response.number);
					ncont.text(response.name);
					var urlimage = '<img src="' + response.photoUrl + '">';
					photoURL.html(urlimage);
				} else {
					container.text("An error occurred.");
					fncont.text("An error occurred.");
					emcont.text("An error occurred.");
					numcont.text("An error occurred.");
					ncont.text("An error occurred.");
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

function displayProfiles(){
	alert("Under construction");
}

function displaySettings(){
	alert("Under construction");
}
/*STARTUOCAPIEXAMPLE*/
function displayTutors(){
	var token = $('span.token').text();	
	$('span.token2').text(token);
	$('div.tutors').show();
	$('div.authenticated').hide();
	var setting = {
		'host': "http://oslo.uoc.es:8080/webapps/uocapi",
		'clientId': "EUI3WhtdZMjwOLxwFyzUcLUUXeE0ACmB6See1HWRjoCSIgGJ1If8EI8EPorzSWFRRnw1fxkOvIqkBI1d91GGKKG6nFnD35OY6VOEx4LcFLQIW3Z2jGsTaYey4bUcbR4K"
	};
	
	var authorizeHost = setting.host + "/oauth/authorize";
	var apiHost = setting.host + "/api/v1";

	$.ajax({
			/* UOCAPICALL /api/v1/user/tutors GET*/
			url: apiHost + '/user/tutors?access_token='+token,
			type: "GET",
			dataType: "json",
			success: function(response) {
				if (response) {
					var iter = 0;
					var table = document.getElementById("taulaTutors");
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 6; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Photo</b>";
					firstrow.cells[1].innerHTML = "<b>UserName</b>";
					firstrow.cells[2].innerHTML = "<b>Name</b>";
					firstrow.cells[3].innerHTML = "<b>Number</b>";
					firstrow.cells[4].innerHTML = "<b>FullName</b>";
					firstrow.cells[5].innerHTML = "<b>Email</b>";
					iter = 0;
					var i = 0;
					while (iter < response.users.length){
						var row = table.insertRow();
						for(i; i < 6; i++) {
							row.insertCell();
						}
						i = 0;
						row.cells[0].innerHTML = '<img src="' + response.users[iter].photoUrl + '">';
						row.cells[1].innerHTML = response.users[iter].username;
						row.cells[2].innerHTML = response.users[iter].name;
						row.cells[3].innerHTML = response.users[iter].number;
						row.cells[4].innerHTML = response.users[iter].fullName;
						row.cells[5].innerHTML = response.users[iter].email;	
						iter = iter + 1;
					}
				}
			}
		});
}
/*ENDUOCAPIEXAMPLE*/
function displayUser(){
	$('div.tutors').hide();
	$('div.authenticated').show();
}