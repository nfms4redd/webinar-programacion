define([ "botonera/crear", "message-bus", "ol2/controlRegistry" ], function(crear, bus, controlRegistry) {
    controlRegistry.registerControl('measure', function(message) {
        var control = new OpenLayers.Control.Measure(OpenLayers.Handler.Path);
        control.events.on({
	        "measure" : function(evt) {
		        alert(evt.measure + " " + evt.units);
	        }
        });
        return control;
    });

    bus.listen('modules-loaded', function() {
        bus.send('map:createControl', {
            'controlId': 'measure',
            'controlType': 'measure'
        });
    });

    crear("medir", function() {
        bus.send("activate-exclusive-control", {
            controlIds: ['measure']
        });
    });
});

