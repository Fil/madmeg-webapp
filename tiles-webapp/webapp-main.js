$('body').append('<div id=map>');

	// disable clic-droit
	document.oncontextmenu = function(){return false};

	//This needed to change standart YandX into XandY. 
	L.Projection.LatLon = { 
		project: function (latlng) { 
			return new L.Point(latlng.lat, latlng.lng); 
		}, 
		unproject: function (point) { 
			return new L.LatLng(point.x, point.y, true); 
		}
	};

	//This is a simple cartesian 
	L.CRS.Simple = L.Util.extend({}, L.CRS, {
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1, 0, 1, 0)
	});

	var retina = (window.devicePixelRatio > 1) ? 1 : 0;


	var maxZoom = Math.ceil(Math.log(Math.max(image.w, image.h)/tileSize)/Math.log(2));
	maxZoom -= retina;

	retina = false;
	debug=false;
	flou = false;
	testoffline = false;

	var worldpixels = tileSize*Math.pow(2, maxZoom);

	var map = new L.Map('map',{
		minZoom: minZoom,
		maxZoom: maxZoom,
		crs: L.CRS.Simple
	});

	var hash = new L.Hash(map); // hash in the URL

	// gestion du offline
	if (testoffline) {
		map.options.maxZoom = navigator.onLine ? maxZoom : 4 - retina;
		$( window ).bind("online offline", function(){
			map.options.maxZoom = navigator.onLine ? maxZoom : 4 - retina;
			if (map.getZoom() > 4 - retina)
				map.setZoom(4 - retina);
			// alert('zoom max: '+map.options.maxZoom);
		});
	}

		if (!window.location.hash
		|| (window.location.hash == "#"+zoomInitial+"/'"+center[0]+"/"+center[1] )
		) map.setView(center,zoomInitial);


		map.on('zoomend', function() {
			$('a.leaflet-control-zoom-in').css({
				opacity: (map.getZoom() == map.maxZoom) ? 0.3 : 1
			});
			$('a.leaflet-control-zoom-out').css({
				opacity: (map.getZoom() == map.minZoom) ? 0.3 : 1
			});
		});
		
		map.addControl(new L.Control.FullScreen());



	var jardin = new L.TileLayer(tileserver, {
		attribution: 'madmeg',
		continuousWorld: false,
		noWrap: true,
		tileSize: tileSize,
		detectRetina: retina,
		tms: false, // sens de l'axe vertical
		reuseTiles: true, // conserver les images chargees dans le DOM
		zIndex: 100,
	});

	map.addLayer(jardin);

	// ajouter une surcouche retina ?
	if (retina) {
		var jardinz = new L.TileLayer(tileserver, {
			attribution: 'madmeg',
			continuousWorld: false,
			noWrap: true,
			tileSize: tileSize,
			detectRetina: false,
			tms: false,
			reuseTiles: true,
		});
		map.on('zoomend',function(){
			if (map.getZoom() == maxZoom) {
				map.addLayer(jardinz);
				map.removeLayer(jardin);
			} else {
				map.addLayer(jardin);
				map.removeLayer(jardinz);
			}
		});
	}

	if (debug) {
		var debugl = L.tileLayer.canvas({tileSize: tileSize});
		debugl.drawTile = function(canvas, tilePoint, zoom) {
			var ctx = canvas.getContext('2d');
			ctx.strokeStyle = ctx.fillStyle = "red";
			ctx.rect(0,0, tileSize,tileSize);
			ctx.stroke();
			ctx.fillText('(' + map.getZoom() + ': ' + tilePoint.x + ', ' + tilePoint.y + ')',5,10);
		};

		map.addLayer(debugl); L.marker(center).addTo(map);
	}


	// afficher les boutons a cliquer quand la souris bouge
	// au premier mouvement, toujours montrer ; ensuite, seulement
	// dans la zone active (clientX)
	var moved = false;
	$('body').mousemove(function(e) {
		if (e.clientX > 150 && moved) return;
		moved = true;
		if (!$('.leaflet-control-container').is(':visible')) {
			// console.log('action');
			$('.leaflet-control-container').show();
			setTimeout(function() {
				$('.leaflet-control-container').fadeOut('slow');
				// console.log('reaction');
			}, 5000);
		}
	});


  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-3696954-2']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
