var setting = {
	'host': "http://oslo.uoc.es:8080/webapps/uocapi",
	'clientId': "EUI3WhtdZMjwOLxwFyzUcLUUXeE0ACmB6See1HWRjoCSIgGJ1If8EI8EPorzSWFRRnw1fxkOvIqkBI1d91GGKKG6nFnD35OY6VOEx4LcFLQIW3Z2jGsTaYey4bUcbR4K"
};

var authorizeHost = setting.host + "/oauth/authorize";
var apiHost = setting.host + "/api/v1";

$(function() {
	var extractToken = function(hash) {
			var match = hash.match(/access_token=([\w-]+)/);
			return !!match && match[1];
	};

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
			url: apiHost + '/calendar/events?access_token='+token,
			type: "GET",
			dataType: "json",
			success: function(response) {
				
				if (response) {
					var iter = 0;
					var table = document.getElementById("calendarEvents");
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 5; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>id</b>";
					firstrow.cells[1].innerHTML = "<b>url</b>";
					firstrow.cells[2].innerHTML = "<b>summary</b>";
					firstrow.cells[3].innerHTML = "<b>start</b>";
					firstrow.cells[4].innerHTML = "<b>end</b>";
					iter = 0;
					var i = 0;
					while (iter < response.events.length){
						var row = table.insertRow(-1);
						for(i; i < 6; i++) {
							row.insertCell();
						}
						i = 0;
						row.cells[0].innerHTML = response.events[iter].id;
						row.cells[1].innerHTML = response.events[iter].url;
						row.cells[2].innerHTML = response.events[iter].summary;
						row.cells[3].innerHTML = response.events[iter].start;
						row.cells[4].innerHTML = response.events[iter].end;
						row.cells[5].innerHTML = '<button onclick="getEvent('+(iter+1)+')"> Event '+iter+'</button>';
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

/*STARTUOCAPIEXAMPLE*/	
function getEvent(eid){
	var tableElement = document.getElementById("calendarEvents");
	var id = tableElement.rows[eid].cells[0].innerHTML;
	$.ajax({
			/* UOCAPICALL /api/v1/calendar/events/{id} GET*/
			url: apiHost + '/calendar/events/'+id+'?access_token='+$('span.token').text(),
			type: "GET",
			dataType: "json",
			success: function(response) {
				var table = document.getElementById("calendarEventsId");

				if (response) {
					var iter = 0;
					table.innerHTML = "";
					var firstrow = table.insertRow();
					for(iter; iter < 5; iter++) {
					  firstrow.insertCell();
					}
					firstrow.cells[0].innerHTML = "<b>id</b>";
					firstrow.cells[1].innerHTML = "<b>url</b>";
					firstrow.cells[2].innerHTML = "<b>summary</b>";
					firstrow.cells[3].innerHTML = "<b>start</b>";
					firstrow.cells[4].innerHTML = "<b>end</b>";
 					var i = 0;
					var row = table.insertRow(-1);
					for(i; i < 5; i++) {
						row.insertCell();
					}
					row.cells[0].innerHTML = response.id;
					row.cells[1].innerHTML = response.url;
					row.cells[2].innerHTML = response.summary;
					row.cells[3].innerHTML = response.start;
					row.cells[4].innerHTML = response.end;

				}
				$('div.authenticated').hide();
				$('div.eventsid').show();			
			}
		});
	
}
/*ENDUOCAPIEXAMPLE*/

function displayEvents(){
	$('div.eventsid').hide();
	$('div.authenticated').show();
}