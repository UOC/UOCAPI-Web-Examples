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
			/* UOCAPICALL /api/v1/user GET*/
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
