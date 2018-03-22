define([ "toolbar", "ol2/map" ], function(toolbar, map) {
	var txtLat = $("<input/>").attr("id", "txtLat").attr("type", "text").appendTo(toolbar);
	var txtLon = $("<input/>").attr("id", "txtLon").attr("type", "text").appendTo(toolbar);
	$("<button/>").html("ir!").appendTo(toolbar).click(function() {
		var newCenter = new OpenLayers.LonLat(txtLon.val(), txtLat.val());
		newCenter.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
		map.getMap().setCenter(newCenter, 10);
	});
});
