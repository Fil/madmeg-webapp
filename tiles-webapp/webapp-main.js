$('body').append('<div id=map>');

// envoyer sur le tileserver madmeg.org si on tourne en localhost
if (window.location.hostname == 'localhost')
    tileserver = tileserver.replace(/^\.\.\//, 'http://madmeg.org/')

// disable clic-droit
document.oncontextmenu = function () {
    return false
};



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


// L.TileLayer.NoGap.js
L.TileLayer.NoGap = L.TileLayer.extend({

	options: {
		// @option dumpToCanvas: Boolean = true
		// Whether to dump loaded tiles to a `<canvas>` to prevent some rendering
		// artifacts. (Disabled by default in IE)
		dumpToCanvas: L.Browser.canvas && !L.Browser.ie
	},

	// Full rewrite of L.GridLayer._updateLevels to support dumpToCanvas
	_updateLevels: function() {
		var zoom = this._tileZoom,
		maxZoom = this.options.maxZoom;

		if (zoom === undefined) { return undefined; }

		for (var z in this._levels) {
// 			console.log(this._levels[z].el.children.length, (zoom - z));
			if (this._levels[z].el.children.length || (zoom - z) === 0) {
				this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
				if (this.options.dumpToCanvas) {
					this._levels[z].canvas.style.zIndex = maxZoom - Math.abs(zoom - z);
				}
			} else {
				L.DomUtil.remove(this._levels[z].el);
				if (this.options.dumpToCanvas) {
					L.DomUtil.remove(this._levels[z].canvas);
				}
				this._removeTilesAtZoom(z);
				delete this._levels[z];
			}
		}

		var level = this._levels[zoom],
		map = this._map;

		if (!level) {
			level = this._levels[zoom] = {};

			level.el = L.DomUtil.create('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
			level.el.style.zIndex = maxZoom;

			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
			level.zoom = zoom;

			this._setZoomTransform(level, map.getCenter(), map.getZoom());

			// force the browser to consider the newly added element for transition
			L.Util.falseFn(level.el.offsetWidth);

			if (this.options.dumpToCanvas) {
				level.canvas = L.DomUtil.create('canvas', 'leaflet-tile-container leaflet-zoom-animated', this._container);
				level.ctx = level.canvas.getContext('2d');
				this._resetCanvasSize(level);
			}
		}

		this._level = level;
		return level;
	},

	_removeTile: function(key) {
		if (this.options.dumpToCanvas) {
			var tile = this._tiles[key];
			var level = this._levels[tile.coords.z];
			var tileSize = this.getTileSize();

			if (level) {
				// Where in the canvas should this tile go?
				var offset = L.point(tile.coords.x, tile.coords.y).subtract(level.canvasRange.min).scaleBy(this.getTileSize());

				level.ctx.clearRect(offset.x, offset.y, tileSize.x, tileSize.y);
			}
		}

		L.GridLayer.prototype._removeTile.call(this, key);
	},

	_resetCanvasSize: function(level) {
		var buff = this.options.keepBuffer,
			pixelBounds = this._getTiledPixelBounds(this._map.getCenter()),
			tileRange = this._pxBoundsToTileRange(pixelBounds),
			tileSize = this.getTileSize();

		tileRange.min = tileRange.min.subtract([buff, buff]);	// This adds the no-prune buffer
		tileRange.max = tileRange.max.add([buff+1, buff+1]);

		var pixelRange = L.bounds(
				tileRange.min.scaleBy(tileSize),
				tileRange.max.add([1, 1]).scaleBy(tileSize)	// This prevents an off-by-one when checking if tiles are inside
			),
			mustRepositionCanvas = false,
			neededSize = pixelRange.max.subtract(pixelRange.min);

		// Resize the canvas, if needed, and only to make it bigger.
		if (neededSize.x > level.canvas.width || neededSize.y > level.canvas.height) {
			// Resizing canvases erases the currently drawn content, I'm afraid.
			// To keep it, dump the pixels to another canvas, then display it on
			// top. This could be done with getImageData/putImageData, but that
			// would break for tainted canvases (in non-CORS tilesets)
			var oldSize = {x: level.canvas.width, y: level.canvas.height};
// 			console.info('Resizing canvas from ', oldSize, 'to ', neededSize);

			var tmpCanvas = L.DomUtil.create('canvas');
			tmpCanvas.style.width  = (tmpCanvas.width  = oldSize.x) + 'px';
			tmpCanvas.style.height = (tmpCanvas.height = oldSize.y) + 'px';
			tmpCanvas.getContext('2d').drawImage(level.canvas, 0, 0);
// 			var data = level.ctx.getImageData(0, 0, oldSize.x, oldSize.y);

			level.canvas.style.width  = (level.canvas.width  = neededSize.x) + 'px';
			level.canvas.style.height = (level.canvas.height = neededSize.y) + 'px';
			level.ctx.drawImage(tmpCanvas, 0, 0);
// 			level.ctx.putImageData(data, 0, 0, 0, 0, oldSize.x, oldSize.y);
		}

		// Translate the canvas contents if it's moved around
		if (level.canvasRange) {
			var offset = level.canvasRange.min.subtract(tileRange.min).scaleBy(this.getTileSize());

// 			console.info('Offsetting by ', offset);

			if (!L.Browser.safari) {
				// By default, canvases copy things "on top of" existing pixels, but we want
				// this to *replace* the existing pixels when doing a drawImage() call.
				// This will also clear the sides, so no clearRect() calls are needed to make room
				// for the new tiles.
				level.ctx.globalCompositeOperation = 'copy';
				level.ctx.drawImage(level.canvas, offset.x, offset.y);
				level.ctx.globalCompositeOperation = 'source-over';
			} else {
				// Safari clears the canvas when copying from itself :-(
				if (!this._tmpCanvas) {
					var t = this._tmpCanvas = L.DomUtil.create('canvas');
					t.width  = level.canvas.width;
					t.height = level.canvas.height;
					this._tmpContext = t.getContext('2d');
				}
				this._tmpContext.clearRect(0, 0, level.canvas.width, level.canvas.height);
				this._tmpContext.drawImage(level.canvas, 0, 0);
				level.ctx.clearRect(0, 0, level.canvas.width, level.canvas.height);
				level.ctx.drawImage(this._tmpCanvas, offset.x, offset.y);
			}

			mustRepositionCanvas = true;	// Wait until new props are set
		}

		level.canvasRange = tileRange;
		level.canvasPxRange = pixelRange;
		level.canvasOrigin = pixelRange.min;

// 		console.log('Canvas tile range: ', level, tileRange.min, tileRange.max );
// 		console.log('Canvas pixel range: ', pixelRange.min, pixelRange.max );
// 		console.log('Level origin: ', level.origin );

		if (mustRepositionCanvas) {
			this._setCanvasZoomTransform(level, this._map.getCenter(), this._map.getZoom());
		}
	},


	/// set transform/position of canvas, in addition to the transform/position of the individual tile container
	_setZoomTransform: function(level, center, zoom) {
		L.TileLayer.prototype._setZoomTransform.call(this, level, center, zoom);
		if (this.options.dumpToCanvas) {
			this._setCanvasZoomTransform(level, center, zoom);
		}
	},


	// This will get called twice:
	// * From _setZoomTransform
	// * When the canvas has shifted due to a new tile being loaded
	_setCanvasZoomTransform: function(level, center, zoom){
// 		console.log('_setCanvasZoomTransform', level, center, zoom);
		if (!level.canvasOrigin) { return; }
		var scale = this._map.getZoomScale(zoom, level.zoom),
		    translate = level.canvasOrigin.multiplyBy(scale)
		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		if (L.Browser.any3d) {
			L.DomUtil.setTransform(level.canvas, translate, scale);
		} else {
			L.DomUtil.setPosition(level.canvas, translate);
		}
	},


	// Rewrite _updateOpacity to make a func call to dump the faded-in tile into the canvas
	_updateOpacity: function () {
		if (!this._map) { return; }

		// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
		if (L.Browser.ielt9) { return; }

		L.DomUtil.setOpacity(this._container, this.options.opacity);

		var now = +new Date(),
		    nextFrame = false,
		    willPrune = false;

		for (var key in this._tiles) {
			var tile = this._tiles[key];
			if (!tile.current || !tile.loaded) { continue; }

			var fade = Math.min(1, (now - tile.loaded) / 200);

			L.DomUtil.setOpacity(tile.el, fade);
			if (fade < 1) {
				nextFrame = true;
			} else {
				if (tile.active) {
					willPrune = true;
				} else if (this.options.dumpToCanvas) {
					this._dumpTileToCanvas(tile);
				}
				tile.active = true;
			}
		}

		if (willPrune && !this._noPrune) { this._pruneTiles(); }

		if (nextFrame) {
			L.Util.cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
		}
	},

	_dumpTileToCanvas: function(tile){
		var level = this._levels[tile.coords.z];
		var tileSize = this.getTileSize();

		/// Check if the tile is inside the currently visible map bounds
		/// There is a possible race condition when tiles are loaded after they
		/// have been panned outside of the map.
		if (!level.canvasRange.contains(tile.coords)) {
			this._resetCanvasSize(level);
		}

		// Where in the canvas should this tile go?
		var offset = L.point(tile.coords.x, tile.coords.y).subtract(level.canvasRange.min).scaleBy(this.getTileSize());

// 		console.log('Should dump tile to canvas:', tile);
// 		console.log('Dumping:', tile.coords, "at", offset );

		level.ctx.drawImage(tile.el, offset.x, offset.y, tileSize.x, tileSize.y);

		// Do not remove the tile itself, as it is needed to check if the whole
		// level (and its canvas) should be removed (via level.el.children.length)
// 		L.DomUtil.remove(tile.el);
		tile.el.style.display = 'none';


		/// TODO: Clear the pixels of other levels' canvases where they overlap
		/// this newly dumped tile.
	},



});
///////// end

// In case we comment out the NoGap file
if (!L.TileLayer.NoGap) L.TileLayer.NoGap = L.TileLayer;


var retina = (window.devicePixelRatio > 1) ? 1 : 0;


var maxZoom = Math.ceil(Math.log(Math.max(image.w, image.h) / tileSize) / Math.log(2));
maxZoom -= retina;

retina = false;
debug = false;
flou = false;
testoffline = false;

var worldpixels = tileSize * Math.pow(2, maxZoom);

var config = {
    minZoom: minZoom,
    maxZoom: maxZoom,
};

if (typeof panorama360 !== 'undefined' && panorama360) {
    panorama360 = true;
} else {
    panorama360 = false;
    config.crs = L.CRS.Simple;
}

var map = new L.Map('map', config);

var hash = new L.Hash(map); // hash in the URL

// gestion du offline
if (testoffline) {
    map.options.maxZoom = navigator.onLine ? maxZoom : 4 - retina;
    $(window).bind("online offline", function () {
        map.options.maxZoom = navigator.onLine ? maxZoom : 4 - retina;
        if (map.getZoom() > 4 - retina)
            map.setZoom(4 - retina);
        // alert('zoom max: '+map.options.maxZoom);
    });
}

if (!window.location.hash || (window.location.hash == "#" + zoomInitial + "/'" + center[0] + "/" + center[1])) map.setView(center, zoomInitial);


map.on('zoomend', function () {
    $('a.leaflet-control-zoom-in').css({
        opacity: (map.getZoom() == map.maxZoom) ? 0.3 : 1
    });
    $('a.leaflet-control-zoom-out').css({
        opacity: (map.getZoom() == map.minZoom) ? 0.3 : 1
    });
});

map.addControl(new L.Control.FullScreen());



var jardin = new L.TileLayer.NoGap(tileserver, {
    attribution: 'madmeg',
    continuousWorld: panorama360,
    noWrap: !panorama360,
    tileSize: tileSize,
    detectRetina: retina,
    tms: false, // sens de l'axe vertical
    reuseTiles: true, // conserver les images chargees dans le DOM
    zIndex: 100,
});

map.addLayer(jardin);

// ajouter une surcouche retina ?
if (retina) {
    var jardinz = new L.TileLayer.NoGap(tileserver, {
        attribution: 'madmeg',
        continuousWorld: panorama360,
        noWrap: !panorama360,
        tileSize: tileSize,
        detectRetina: false,
        tms: false,
        reuseTiles: true,
    });
    map.on('zoomend', function () {
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
    var debugl = L.TileLayer.NoGap.canvas({
        tileSize: tileSize
    });
    debugl.drawTile = function (canvas, tilePoint, zoom) {
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = ctx.fillStyle = "red";
        ctx.rect(0, 0, tileSize, tileSize);
        ctx.stroke();
        ctx.fillText('(' + map.getZoom() + ': ' + tilePoint.x + ', ' + tilePoint.y + ')', 5, 10);
    };

    map.addLayer(debugl);
    L.marker(center).addTo(map);
}


// afficher les boutons a cliquer quand la souris bouge
// au premier mouvement, toujours montrer ; ensuite, seulement
// dans la zone active (clientX)
var moved = false;
$('body').mousemove(function (e) {
    if (e.clientX > 150 && moved) return;
    moved = true;
    if (!$('.leaflet-control-container').is(':visible')) {
        // console.log('action');
        $('.leaflet-control-container').show();
        setTimeout(function () {
            $('.leaflet-control-container').fadeOut('slow');
            // console.log('reaction');
        }, 5000);
    }
});


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3696954-2']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();






///   https://github.com/mapshakers/leaflet-control-window  ///


L.Control.Window = L.Control.extend({

    includes: L.Mixin.Events,

    options: {
        element: 'map',
        className: 'control-window',
        visible: false,
        title: undefined,
        closeButton: true,
        content: undefined,
        prompt: undefined,
        maxWidth: 600,
        modal: false,
        position: 'center'
    },
    initialize: function (container, options) {
        var self = this;

        if (container.hasOwnProperty('options')) { container = container.getContainer(); }

        options.element = container;
        L.setOptions(this, options);

        var modality = 'nonmodal';

        if (this.options.modal){
            modality = 'modal'
        }

        // Create popup window container
        this._wrapper = L.DomUtil.create('div',modality+' leaflet-control-window-wrapper', L.DomUtil.get(this.options.element));

        this._container = L.DomUtil.create('div', 'leaflet-control leaflet-control-window '+this.options.className,this._wrapper);
        this._container.setAttribute('style','max-width:'+this.options.maxWidth+'px');

        this._containerTitleBar = L.DomUtil.create('div', 'titlebar',this._container);
        this.titleContent = L.DomUtil.create('h2', 'title',this._containerTitleBar);
        this._containerContent =  L.DomUtil.create('div', 'content' ,this._container);
        this._containerPromptButtons =  L.DomUtil.create('div', 'promptButtons' ,this._container);

        if (this.options.closeButton) {
            this._closeButton = L.DomUtil.create('a', 'close',this._containerTitleBar);
            this._closeButton.innerHTML = '&times;';
        }

        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(this._wrapper, 'contextmenu', stop)
            .on(this._wrapper, 'click', stop)
            .on(this._wrapper, 'mousedown', stop)
            .on(this._wrapper, 'touchstart', stop)
            .on(this._wrapper, 'dblclick', stop)
            .on(this._wrapper, 'mousewheel', stop)
            .on(this._wrapper, 'MozMousePixelScroll', stop)

        // Attach event to close button
        if (this.options.closeButton) {
            var close = this._closeButton;
            L.DomEvent.on(close, 'click', this.hide, this);
        }
        if (this.options.title){
            this.title(this.options.title);
        }
        if (this.options.content) {
            this.content(this.options.content);
        }
        if (typeof(this.options.prompt)=='object') {
            this.prompt(this.options.prompt);
        }
        if (this.options.visible){
            this.show();
        }

        //map.on('resize',function(){self.mapResized()});
    },
    disableBtn: function(){
			this._btnOK.disabled=true;
			this._btnOK.className='disabled';
	},
	enableBtn: function(){
			this._btnOK.disabled=false;
			this._btnOK.className='';
	},
    title: function(titleContent){
        if (titleContent==undefined){
            return this.options.title
        }

        this.options.title = titleContent;
        var title = titleContent || '';
        this.titleContent.innerHTML = title;
        return this;
    },
    remove: function () {

        L.DomUtil.get(this.options.element).removeChild(this._wrapper);

        // Unregister events to prevent memory leak
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .off(this._wrapper, 'contextmenu', stop)
            .off(this._wrapper, 'click', stop)
            .off(this._wrapper, 'mousedown', stop)
            .off(this._wrapper, 'touchstart', stop)
            .off(this._wrapper, 'dblclick', stop)
            .off(this._wrapper, 'mousewheel', stop)
            .off(this._wrapper, 'MozMousePixelScroll', stop);

       // map.off('resize',self.mapResized);

        if (this._closeButton && this._close) {
            var close = this._closeButton;
            L.DomEvent.off(close, 'click', this.close, this);
        }
        return this;
    },
    mapResized : function(){
      // this.show()
    },
    show: function (position) {

        if (position){
            this.options.position = position
        }

        L.DomUtil.addClass(this._wrapper, 'visible');


        this.setContentMaxHeight();
        var thisWidth = this._container.offsetWidth;
        var thisHeight = this._container.offsetHeight;
        var margin = 8;

        var el =  L.DomUtil.get(this.options.element);
        var rect = el.getBoundingClientRect();
        var width = rect.right -rect.left ||  Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var height = rect.bottom -rect.top ||  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        var top = rect.top;
        var left = rect.left;
        var offset =0;

        // SET POSITION OF WINDOW
        if (this.options.position == 'topLeft'){
            this.showOn([left,top+offset])
            } else if (this.options.position == 'left') {
            this.showOn([left, top+height/2-thisHeight/2-margin+offset])
        } else if (this.options.position == 'bottomLeft') {
            this.showOn([left, top+height-thisHeight-margin*2-offset])
        } else if (this.options.position == 'top') {
            this.showOn([left+width/2-thisWidth/2-margin,top+offset])
        } else if (this.options.position == 'topRight') {
            this.showOn([left+width-thisWidth-margin*2,top+ offset])
        } else if (this.options.position == 'right') {
            this.showOn([left+width-thisWidth-margin*2, top+height/2-thisHeight/2-margin+offset])
        } else if (this.options.position == 'bottomRight') {
            this.showOn([left+width-thisWidth-margin*2,top+ height-thisHeight-margin*2-offset])
        } else if (this.options.position == 'bottom') {
            this.showOn([left+width/2-thisWidth/2-margin,top+ height-thisHeight-margin*2-offset])
        } else {
            this.showOn([left+width/2-thisWidth/2-margin, top+top+height/2-thisHeight/2-margin+offset])
        }

        return this;
    },
    showOn: function(point){

        this.setContentMaxHeight();
        L.DomUtil.setPosition(this._container, L.point(Math.round(point[0]),Math.round(point[1]),true));

        var draggable = new L.Draggable(this._container,this._containerTitleBar);
        draggable.enable();

        L.DomUtil.addClass(this._wrapper, 'visible');
        this.fire('show');
        return this;
    },
    hide: function (e) {

        L.DomUtil.removeClass(this._wrapper, 'visible');
        this.fire('hide');
        return this;
    },

    getContainer: function () {
        return this._containerContent;
    },
    content: function (content) {
        if (content==undefined){
            return this.options.content
        }
        this.options.content = content;
        this.getContainer().innerHTML = content;
        return this;
    },
    prompt : function(promptObject){

        if (promptObject==undefined){
            return this.options.prompt
        }

        this.options.prompt = promptObject;

        this.setPromptCallback(promptObject.callback);
        
        this.setActionCallback(promptObject.action);

        var cancel = this.options.prompt.buttonCancel || 'CANCEL';

        var ok = this.options.prompt.buttonOK || 'OK';

        var action = this.options.prompt.buttonAction || undefined;

        if (action != undefined) {
            var btnAction = L.DomUtil.create('button','',this._containerPromptButtons);
            L.DomEvent.on(btnAction, 'click',this.action, this);
            btnAction.innerHTML=action;
        }

        var btnOK= L.DomUtil.create('button','',this._containerPromptButtons);
        L.DomEvent.on(btnOK, 'click',this.promptCallback, this);
        btnOK.innerHTML=ok;
        
        this._btnOK=btnOK;
        
        var btnCancel= L.DomUtil.create('button','',this._containerPromptButtons);
        L.DomEvent.on(btnCancel, 'click', this.close, this);
        btnCancel.innerHTML=cancel

        return this;
    },
    container : function(containerContent){
        if (containerContent==undefined){
            return this._container.innerHTML
        }

        this._container.innerHTML = containerContent;

        if (this.options.closeButton) {
            this._closeButton = L.DomUtil.create('a', 'close',this._container);
            this._closeButton.innerHTML = '&times;';
            L.DomEvent.on(this._closeButton, 'click', this.close, this);
        }
        return this;

    },
    setPromptCallback : function(callback){
        var self = this;
        if (typeof(callback)!= 'function') { callback = function() {console.warn('No callback function specified!');}}
        var cb = function() { self.close();callback();};
        this.promptCallback = cb;
        return this;
    },
    setActionCallback : function(callback){
        var self = this;
        if (typeof(callback)!= 'function') { callback = function() {console.warn('No callback function specified!');}}
        var cb = function() { self.hide();callback();};
        this.action = cb;
        return this;
    },

    setContentMaxHeight : function(){
        var margin = 68;

        if (this.options.title){
            margin += this._containerTitleBar.offsetHeight-36;
        }
        if (typeof(this.options.prompt) == 'object'){
            margin += this._containerPromptButtons.offsetHeight-20
        }

        var el =  L.DomUtil.get(this.options.element)
        var rect = el.getBoundingClientRect();
        var height = rect.bottom -rect.top;

        var maxHeight = height - margin;
        this._containerContent.setAttribute('style','max-height:'+maxHeight+'px')
    },
    close : function(){
        this.hide();
        this.remove();
        this.fire('close');
        return undefined;
    }
});

L.control.window = function (container,options) {
    return new L.Control.Window(container,options);
};


var infowindow;
function openwindow(cartel, height) {
	height = height || 300;
	infowindow = L.control.window(map,{title: '',
       content:'<div style="width:500px; height: ' + height + 'px;"><a href="#" onclick="infowindow.close(); return false;"><img src="' + cartel + '" style="width: 500px; height: auto;"></a></div>', visible: false, modal: true, closeButton: false });
	infowindow
	.show()
	.prompt({
	    buttonOK: ' ',
	    buttonCancel: ' ',
	    callback: function() {}
	})
	$('.modal').on('click', function() {
	    setTimeout(function() { infowindow.close(); },10);
	});
	return false;
}

    var home = L.control({position: 'topleft'});
    home.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        var buttons = '';
        if (typeof cartel == 'string') {
            buttons += '<a class="leaflet-control-cartel" href="#" title="cartel" style="opacity: 1;" onclick="return openwindow(\'' + cartel + '\');">?</a>';
        }
        if (typeof infos == 'string') {
            buttons += '<a class="leaflet-control-infos" href="#" title="infos" style="opacity: 1;" onclick="return openwindow(\'' + infos + '\', 430);">i</a>';
        }
        if (typeof print == 'string') {
            buttons += '<a class="leaflet-control-print" href="' + print + '" title="print" style="opacity: 1;">🖨</a>';
        }
        if (typeof shop == 'string') {
            buttons += '<a class="leaflet-control-shop" href="' + shop + '" title="shop" style="opacity: 1;">$</a>';
        }

        // en dernier, home page
        buttons += '<a class="leaflet-control-home" href="http://madmeg.org/" title="madmeg.org" style="opacity: 1;">H</a>';
        
       // buttons += '<a class="leaflet-control-home" href="/" title="home" style="opacity: 1;">H</a>';

        this._div.innerHTML = buttons;
        return this._div;
    };
    home.addTo(this.map);

