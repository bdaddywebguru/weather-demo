function populateWeatherConditions (weather) {
	var tmpl, output;

	emptyContent(); 

	forge.logging.log("[populateWeatherConditions] beginning populating weather conditions");

	tmpl = $("#forecast_information_tmpl").html();
	output = Mustache.to_html(tmpl, weather.current_observation);
	$("#forecast_information").append(output);
	forge.logging.log("[populateWeatherConditions] finished populating forecast information");

	tmpl = $("#current_conditions_tmpl").html();
	output = Mustache.to_html(tmpl, weather.current_observation);
	$("#current_conditions").append(output);
	forge.logging.log("[populateWeatherConditions] finished populating current conditions");

	tmpl = $("#forecast_conditions_tmpl").html();
	output = Mustache.to_html(tmpl, weather.forecast.simpleforecast);
	$("#forecast_conditions table tr").append(output);
	forge.logging.log("[populateWeatherConditions] finished populating forecast conditions");

	forge.logging.log("[populateWeatherConditions] finished populating weather conditions");
};


function getWeatherInfo(location, callback) {
	var api_key = "0a084861454405e8";
	forge.logging.info("[getWeatherInfo] getting weather for for " + location);
	forge.request.ajax({
		url: "http://api.wunderground.com/api/" + api_key +
				"/conditions/forecast/q/" +	location + ".json",
		dataType: "json",
		success: function (data) {
			forge.logging.info("[getWeatherInfo] success");
			callback(data);
		},
		error: function (error) {
			forge.logging.error("[getWeatherInfo] " + JSON.stringify(error));
		}
	});
};


function emptyContent() {
	forge.logging.log("[emptyContent] removing old data");
	$("#forecast_information").empty();
	$("#current_conditions").empty();
	$("#forecast_conditions table tr").empty();
	
	forge.logging.log("[emptyContent] finished emptying content");
};


$(function () {
	var cities = [ 
		{ name: "New York", code: "NY/New_York" },
		{ name: "Los Angeles", code: "CA/Los_Angeles" },
		{ name: "Chicago", code: "IL/Chicago" },
		{ name: "Houston", code: "TX/Houston" },
		{ name: "Philadelphia", code: "PA/Philadelphia" },
		{ name: "Phoenix", code: "AZ/Phoenix" },
		{ name: "San Antonio", code: "TX/San Antonio" },
		{ name: "San Diego", code: "CA/San Diego" },
		{ name: "Dallas", code: "TX/Dallas" },
		{ name: "San Jose", code: "CA/San Jose" } 
	];
	cities.forEach(function(city) {	
		$("#city_menu").append("<option value='" + city.code + "'>" + city.name + "</option>");
	});
	$("#city_menu").change(function() {
		var city = $("#city_menu option:selected").val();
		forge.prefs.set("city", city);
		getWeatherInfo(city, populateWeatherConditions);
	});
	forge.prefs.get("city", function(resource) {
		if (resource) { // user has previously selected a city
			var city = resource;
		} else { // no previous selection
			var city = "TX/San Antonio";
		}
		$("#city_menu").val(city);
		$("#city_menu").change();
	}, function (error) {
		forge.logging.error("failed when retrieving city preferences");
		$("#city_menu").val("TX/San Antonio"); // default;
	});
});


