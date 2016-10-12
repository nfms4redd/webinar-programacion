define([ "message-bus" ], function(bus) {

	var paises = {};

//	var paises = {
//		"Argentina" : [ -62, -38 ],
//		"Bolivia" : [ -65, -19 ],
//		"Ecuador" : [ -78, 0 ],
//		"Paraguay" : [ -57, -25 ]
//	};

	function dataReceived(data) {
		console.log(data);
		for ( var i = 0; i < data.features.length; i++) {
			var feature = data.features[i];
			console.log(feature.properties.nprov);
			var bbox = feature.properties.bbox;
			var lon = (bbox[0] + bbox[2])/2;
			var lat = (bbox[1] + bbox[3])/2;
			paises[feature.properties.nprov] = [lon, lat]
		}
	}

	var wfsURL = "http://snmb.ambiente.gob.ar/geo-server/wfs?REQUEST=GetFeature&SERVICE=WFS&propertyname=nprov&TYPENAME=bosques_umsef_db:limites_provinciales&VERSION=1.1.0&EXCEPTIONS=XML&outputformat=application/json&srsName=EPSG:4326";
	bus.send("ajax", {
		"url" : "proxy",
		"data" : $.param({
			url : wfsURL
		}),
		"success": dataReceived,
		"errorMsg": "fallo"
	});

	function showZoomPanel() {
		if ($("#paises").length > 0) {
			$("#paises").remove();
		} else {
			$("<div/>")//
			.appendTo("body")//
			.attr("id", "paises")//
			.attr("class", "panel-provincias");

			for ( var pais in paises) {
				var button = $("<button/>")//
				.appendTo("#paises")//
				.attr("id", pais)//
				.html(pais)//
				.on("click", function(e) {
					var pais = $(e.target).attr("id");
					bus.send("zoom-to", {
						"x" : paises[pais][0],
						"y" : paises[pais][1],
					});
				});
			}
		}
	}
	return showZoomPanel
});
