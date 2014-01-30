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
		var table = document.getElementById("taulaResource");
		var iter = 0;
		table.innerHTML = "";
		var firstrow = table.insertRow();
		for(iter; iter < 6; iter++) {
			firstrow.insertCell();
		}
		firstrow.cells[0].innerHTML = "<b>Id</b>";
		firstrow.cells[1].innerHTML = "<b>Type</b>";
		firstrow.cells[2].innerHTML = "<b>Subtype</b>";
		firstrow.cells[3].innerHTML = "<b>Title</b>";
		firstrow.cells[4].innerHTML = "<b>Code</b>";
		firstrow.cells[5].innerHTML = "<b>DomainId</b>";
		iter = 0;
		var row = table.insertRow(-1);
		for(iter; iter < 6; iter++) {
			row.insertCell();
		}
		row.cells[0].innerHTML = "545844";
		row.cells[1].innerHTML = "Conversation";
		row.cells[2].innerHTML = "WKGRP_FO";
		row.cells[3].innerHTML = "Fòrum";
		row.cells[4].innerHTML = "uoc_demo_011_01_f01";
		row.cells[5].innerHTML = "308959";
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

function getClassL(){
	$('div.authenticated').hide();
	$('div.getClassL').show();
	$.ajax({
		url: apiHost + '/classrooms?access_token='+$('span.token').text(),
		type: "GET",
		dataType: "json",
		success: function(response) {
			var table = document.getElementById("taulaClassL");
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
					row.cells[7].innerHTML = '<button onclick="postResource('+response.classrooms[iter].id+')">getResourcefromClass'+iter+'</button>';						
					iter = iter + 1;
				}
			}
		}
	});
}

function postResource(cid){
	$('div.getClassL').hide();
	$('div.getResourceL').show();
	$('span.cid').text(cid);
    /*STARTUOCAPIEXAMPLE*/	
	
	var postData = {};
	var tableElem = document.getElementById("taulaResource");
	postData['id'] = tableElem.rows[1].cells[0].innerHTML;
	postData['type'] = tableElem.rows[1].cells[1].innerHTML;
	postData['subtype'] = tableElem.rows[1].cells[2].innerHTML;
	postData['title'] = tableElem.rows[1].cells[3].innerHTML;
	postData['code'] = tableElem.rows[1].cells[4].innerHTML;
	postData['domainId'] = tableElem.rows[1].cells[5].innerHTML;
	$.ajax({
			/* UOCAPICALL /api/v1/classrooms/{id}/resources POST*/
			url: apiHost + '/classrooms/'+cid+'/resources?access_token='+$('span.token').text(),
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(postData),
			processData: false,
			success: function(response) {
			  $.ajax({
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
						firstrow.cells[1].innerHTML = "<b>Type</b>";
						firstrow.cells[2].innerHTML = "<b>Subtype</b>";
						firstrow.cells[3].innerHTML = "<b>Title</b>";
						firstrow.cells[4].innerHTML = "<b>Code</b>";
						firstrow.cells[5].innerHTML = "<b>DomainId</b>";
						iter = 0;
						var i = 0;
						while (iter < response.resources.length){
							var row = table.insertRow(-1);
							for(i; i < 6; i++) {
								row.insertCell();
							}
							i = 0;
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
			},
			error: function(){
				$('span.errorResourceL').text('There was an error in the connexion');
			}
	});
}
/*ENDUOCAPIEXAMPLE*/

function displayClassL(){
	$('div.getResourceL').hide();
	$('div.authenticated').show();
}