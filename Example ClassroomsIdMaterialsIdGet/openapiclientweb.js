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
						for(i; i < 8; i++) {
							row.insertCell();
						}
						i = 0;
						row.cells[0].innerHTML = response.classrooms[iter].id;
						row.cells[1].innerHTML = response.classrooms[iter].title;
						row.cells[2].innerHTML = response.classrooms[iter].fatherId;
						row.cells[3].innerHTML = response.classrooms[iter].color;
						row.cells[4].innerHTML = response.classrooms[iter].assignments;
						row.cells[5].innerHTML = response.classrooms[iter].code;
						row.cells[6].innerHTML = response.classrooms[iter].shortTitle;	
						row.cells[7].innerHTML = '<button onclick="getMaterialL('+response.classrooms[iter].id+')">getMaterialsfromClass'+iter+'</button>';						
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

function getMaterialL(cid){
	$('div.authenticated').hide();
	$('div.getMaterialL').show();
	$('span.cid').text(cid);
	$.ajax({
			url: apiHost + '/classrooms/'+cid+'/materials?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaMaterialL");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 4; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Id</b>";
					firstrow.cells[1].innerHTML = "<b>Type</b>";
					firstrow.cells[2].innerHTML = "<b>Title</b>";
					firstrow.cells[3].innerHTML = "<b>Url</b>";
					iter = 0;
					var i = 0;
					while (iter < response.materials.length){
						var row = table.insertRow(-1);
						for(i; i < 5; i++) {
							row.insertCell();
						}
						i = 0;
						row.cells[0].innerHTML = response.materials[iter].id;
						row.cells[1].innerHTML = response.materials[iter].type;
						row.cells[2].innerHTML = response.materials[iter].title;
						row.cells[3].innerHTML = response.materials[iter].url;	
						row.cells[4].innerHTML = '<button onclick="getMaterial('+response.materials[iter].id+')">getMaterialsfromClass'+iter+'</button>';
						iter = iter + 1;
					}
				}
			}
		});
}

function getMaterial(mid){
	$('div.getMaterialL').hide();
	$('div.getMaterial').show();
	$('span.mid').text(mid);
    /*STARTUOCAPIEXAMPLE*/	
	$.ajax({
			/* UOCAPICALL /api/v1/classrooms/{domain_id}/materials/{id} GET*/
			url: apiHost + '/classrooms/'+$('span.token').text()+'/materials/'+mid+'?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("taulaMaterial");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 4; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>Id</b>";
					firstrow.cells[1].innerHTML = "<b>Type</b>";
					firstrow.cells[2].innerHTML = "<b>Title</b>";
					firstrow.cells[3].innerHTML = "<b>Url</b>";
					iter = 0;
					var i = 0;
					var row = table.insertRow(-1);
					for(i; i < 4; i++) {
						row.insertCell();
					}
					i = 0;
					row.cells[0].innerHTML = response.materials[iter].id;
					row.cells[1].innerHTML = response.materials[iter].type;
					row.cells[2].innerHTML = response.materials[iter].title;
					row.cells[3].innerHTML = response.materials[iter].url;					
				}
			}
		});
}
/*ENDUOCAPIEXAMPLE*/

function displayClassL(){
	$('div.getMaterialL').hide();
	$('div.authenticated').show();
}

function displayMaterialL(){
	$('div.getMaterial').hide();
	$('div.getMaterialL').show();
}