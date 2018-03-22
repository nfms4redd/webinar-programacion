define([ "botonera/crear", "message-bus", "ol2/map", "ol2/controlRegistry", "toolbar" ], 
        function(crear, bus, map, controlRegistry, toolbar) {

    controlRegistry.registerControl('temperature', function(message) {
	    let clickControl = new OpenLayers.Control();
	    clickControl.handler = new OpenLayers.Handler.Click(clickControl, {
		    'click' : function(e) {
                let olmap = map.getMap();
		        let lonlat = olmap.getLonLatFromPixel(e.xy);
		        lonlat.transform(olmap.projection, new OpenLayers.Projection("EPSG:4326"));
		        let requestData = {
			        url : "http://api.openweathermap.org/data/2.5/weather?" + //
                        "APPID=d8cbabebfd28985fe4ca7ab08784de01&lat=" + //
    			        lonlat.lat + "&lon=" + lonlat.lon
		        };
		        bus.send("ajax", {
			        dataType : "json",
			        url : "proxy",
			        data : $.param(requestData),
			        success : function(data, textStatus, jqXHR) {
				        window.alert("Temperatura en: " + data.name + //
				        ": " + (data.main.temp - 273.15));
			        },
			        errorMsg : "Cannot get temperature"
		        });
            }
	    });
        return clickControl;
    });

    bus.listen('modules-loaded', function() {
        bus.send('map:createControl', {
            'controlId': 'temperature',
            'controlType': 'temperature'
        });
    });

    crear("Temperatura", function() {
        bus.send("activate-exclusive-control", {
            controlIds: ['temperature']
        });
    });
});
