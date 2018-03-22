define([ "toolbar", "ol2/map" ], function(toolbar, map) {
    let cql = $("<input/>").attr("id", "cql").attr("type", "text").appendTo(toolbar);
    $("<button/>").html("Filtrar").appendTo(toolbar).click(function() {
		var provincesLayer = map.getMap().getLayer("limites_provinciales");
		provincesLayer.mergeNewParams({
			"cql_filter" : cql.val()
		});
	});
});

