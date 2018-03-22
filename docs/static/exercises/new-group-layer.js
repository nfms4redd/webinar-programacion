define([ "message-bus", "toolbar" ], function(bus, toolbar) {
	let btnNewLayer = $("<a href='#'/>").html("Añadir mi capa").appendTo(toolbar);
	btnNewLayer.attr("id", "new-group-layer-button");
	btnNewLayer.addClass("blue_button");
	btnNewLayer.click(function() {
        bus.send("add-group", [ {
			id : "0",
			label : "Meteo"
		} ]);
		bus.send("add-layer", {
			"id" : "meteo-eeuu",
			"groupId" : "0",
			"label" : "Radar EEUU",
			"active" : "true",
			"timestamps": ["2011-03-01T00:00", "2011-03-02T00:00", "2011-03-03T00:00"],
			"mapLayers" : [ {
				"baseUrl" : "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi",
				"wmsName" : "nexrad-n0r-wmst"
			} ]
		});
	});
});
