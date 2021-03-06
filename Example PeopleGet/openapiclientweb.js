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
/*STARTUOCAPIEXAMPLE*/
	var getData = function(token) {
		$('span.token').text(token);
		$('div.authenticated').show();
		
		$.ajax({
			/* UOCAPICALL /api/v1/people GET*/
			url: apiHost + '/people?access_token='+token,
			type: "GET",
			dataType: "json",
			success: function(response) {
				
				if (response) {
					var iter = 0;
					var table = document.getElementById("getpeople");
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 17; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>id</b>";
					firstrow.cells[1].innerHTML = "<b>username</b>";
					firstrow.cells[2].innerHTML = "<b>name</b>";
					firstrow.cells[3].innerHTML = "<b>surname1</b>";
					firstrow.cells[4].innerHTML = "<b>surname2</b>";
					firstrow.cells[5].innerHTML = "<b>email</b>";
					firstrow.cells[6].innerHTML = "<b>profiles</b>";
					firstrow.cells[7].innerHTML = "<b>userNumber</b>";
					firstrow.cells[8].innerHTML = "<b>hobbies</b>";
					firstrow.cells[9].innerHTML = "<b>skills</b>";
					firstrow.cells[10].innerHTML = "<b>about</b>";
					firstrow.cells[11].innerHTML = "<b>ngoes</b>";
					firstrow.cells[12].innerHTML = "<b>languages</b>";
					firstrow.cells[13].innerHTML = "<b>secondaryEmail</b>";
					firstrow.cells[14].innerHTML = "<b>blog</b>";
					firstrow.cells[15].innerHTML = "<b>personalSite</b>";
					firstrow.cells[16].innerHTML = "<b>lastUpdate</b>";
					iter = 0;
					var i = 0;
					while (iter < response.people.length){
						var row = table.insertRow(-1);
						for(i; i < 17; i++) {
							row.insertCell();
						}
						i = 0;
						row.cells[0].innerHTML = response.people[iter].id;
						row.cells[1].innerHTML = response.people[iter].username;
						row.cells[2].innerHTML = response.people[iter].name;
						row.cells[3].innerHTML = response.people[iter].surname1;
						row.cells[4].innerHTML = response.people[iter].surname2;
						row.cells[5].innerHTML = response.people[iter].email;
						row.cells[6].innerHTML = response.people[iter].profiles[0].id; // Mostro nomes l'id del profile 0 ja que els profiles es mostren en un a
						row.cells[7].innerHTML = response.people[iter].userNumber;
						row.cells[8].innerHTML = response.people[iter].hobbies;
						row.cells[9].innerHTML = response.people[iter].skills;
						row.cells[10].innerHTML = response.people[iter].about;
						row.cells[11].innerHTML = response.people[iter].ngoes;
						row.cells[12].innerHTML = response.people[iter].languages;
						row.cells[13].innerHTML = response.people[iter].secondaryEmail;
						row.cells[14].innerHTML = response.people[iter].blog;
						row.cells[15].innerHTML = response.people[iter].personalSite;
						row.cells[16].innerHTML = response.people[iter].lastUpdate;
						
						iter = iter + 1;
					}
				}
			}
		});
	};
/*ENDUOCAPIEXAMPLE*/
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
