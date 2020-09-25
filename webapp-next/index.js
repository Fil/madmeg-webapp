export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# madmeg next`
)});
  main.variable(observer("map")).define("map", ["addDetails","addOverlay","animateCanvas","addControls","d3","style"], function(addDetails,addOverlay,animateCanvas,addControls,d3,style)
{
  const div = document.createElement("div");
  const canvas = document.createElement("canvas");
  const details = addDetails(div, canvas);
  const overlay = addOverlay(div, canvas);

  div.appendChild(canvas);
  div.resize = animateCanvas(div);
  details.hide();
  overlay.hide();
  addControls(div, canvas, details, overlay);

  d3.select(div).append(() => style);
  d3.select("body").classed(
    "embed",
    !document.location.host.match("observableusercontent")
  );

  return div;
}
);
  main.variable(observer("viewof opus")).define("viewof opus", ["settings","select"], function(settings,select)
{
  const options = Object.keys(settings);
  let value = (document.location.search || "").match(/opus=([^=?&]+)/);
  value = value && value[1];
  if (!options.includes(value)) value = "delices-en";
  if (!options.includes(value)) value = options[0];
  return select({ options, value, description: "opus" });
}
);
  main.variable(observer("opus")).define("opus", ["Generators", "viewof opus"], (G, _) => G.input(_));
  main.variable(observer("viewof dodebug")).define("viewof dodebug", ["checkbox"], function(checkbox){return(
checkbox({
  options: ["debug"],
  value: [] // "debug"
  //  description: "(can be passed in the URL)"
})
)});
  main.variable(observer("dodebug")).define("dodebug", ["Generators", "viewof dodebug"], (G, _) => G.input(_));
  main.variable(observer("resizer")).define("resizer", ["map","viewport","html"], function(map,viewport,html)
{
  map.resize(viewport);
  return html``;
}
);
  main.variable(observer("settings")).define("settings", function(){return(
{
  alphabet: {
    w: 19859,
    h: 27369,
    s: 512,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/alphabet/cartel-fr.jpg",
    video: `https://www.youtube-nocookie.com/embed/-5I1jUCxRfk?autoplay=1`,
    start: [5.86, 1.038, 0.314]
  },
  bitcoin: {
    w: 13103,
    h: 16272,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/bitcoin/cartel-fr.jpg",
    start: [4.17, 0.599, 0.395]
  },
  "delices-en": {
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    referentiel: 1, // historical coordinates
    start: [2, .4, .5]
  },
  "delices-fr": {
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    referentiel: 1,
    start: [2, .4, .5]
  },
  "delices-it": {
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    referentiel: 1,
    start: [2, .4, .5]
  },
  "feast-fr": {
    w: 98304,
    h: 32768,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/feastoffools/cartel-fr.jpg",
    video: `https://www.youtube-nocookie.com/embed/lJCAhIG4hEw?autoplay=1`,
    start: [5, 0.129, 0.365]
  },
  jacsmkee: {
    w: 26107,
    h: 16518,
    s: 256,
    minZ: 2,
    start: [6, 0.377, 0.535],
    cartel: "https://madmeg.org/jacsmkee/cartel-fr.jpg"
  },
  jiando: {
    w: 26107,
    h: 16518,
    s: 256,
    minZ: 2,
    start: [6, 0.377, 0.535],
    cartel: "https://madmeg.org/jiando/cartel-fr.jpg",
    video: `https://www.youtube-nocookie.com/embed/4qOfTMN28Qo?autoplay=1`
  },
  lippido: {
    w: 6500,
    h: 6500,
    s: 256,
    minZ: 2,
    start: [4, 0.35, 0.41],
    cartel: "https://madmeg.org/lippido/cartel-fr.jpg",
    shop: "https://www.madmeg.org/base/shop/Lippido.html"
  },
  megeres: {
    w: 30000,
    h: 10457,
    s: 512,
    minZ: 2.488,
    addZ: 0.2,
    cartel: "https://madmeg.org/megeres/cartel-fr.jpg",
    start: [2.488, 0.2, 0.463]
  },
  p8: {
    title: "Patriarche n°8",
    w: 9148,
    h: 12324,
    s: 512,
    minZ: 0,
    start: [6, 0.692, 0.173],
    cartel: "https://madmeg.org/p8/cartel-fr.jpg"
  },
  p37: {
    title: "Patriarche n°37",
    w: 10933,
    h: 25700,
    s: 256,
    minZ: 1,
    start: [3, 0.24, 0.11],
    cartel: "https://madmeg.org/p37/cartel-fr.jpg"
  },
  p81: {
    title: "Patriarche n°81",
    w: 10142,
    h: 22259,
    s: 512,
    minZ: 1,
    start: [3, 0.24, 0.11],
    cartel: "https://madmeg.org/p81/cartel-fr.jpg"
  },
  p136: {
    title: "Patriarche n°136",
    w: 10425,
    h: 12979,
    s: 512,
    minZ: 0,
    start: [5.92, 0.259, 0.347],
    cartel: "https://madmeg.org/p136/cartel-fr.jpg"
  },
  p137: {
    title: "Patriarche n°137",
    w: 9791,
    h: 17644,
    s: 512,
    minZ: 0,
    start: [6.4, 0.28, 0.1],
    cartel: "https://madmeg.org/p137/cartel-fr.jpg"
  },
  p138: {
    title: "Patriarche n°138",
    w: 17236,
    h: 21818,
    s: 512,
    minZ: 0,
    start: [5.68, 0.275, 0.294],
    cartel: "https://madmeg.org/p138/cartel-fr.jpg"
  },
  scopte: {
    title: "Scopte",
    w: 18344,
    h: 11000,
    s: 512,
    minZ: 2.5,
    start: [5.728, 0.052, 0.283],
    cartel: "https://madmeg.org/scopte/cartel-fr.jpg"
  },
  shanghai: {
    title: "Shanghai",
    w: 16384,
    h: 4406,
    s: 256,
    wrap: true,
    translateExtent: [[-180000, -.55], [180000, -.2]],
    minZ: 3,
    start: [5, 0.044, 0.674],
    cartel: "https://madmeg.org/shanghai/cartel-fr.jpg"
  }
}
)});
  main.variable(observer("dimensions")).define("dimensions", ["settings","opus"], function(settings,opus){return(
settings[opus]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`TODO:
- [x] clean-up the code
- [x] fix initial position
- [x] extract variables
- [x] fullscreen
- [x] fit to screen
- [x] get simpler screen size
- [x] select initial point & scale (scale depending on screensize?)
- [x] don't allow the image to get out of bounds
- [x] manage #2/0.4/0.5 in the url fragment
  - [x] make it independent from dpr!!
- [x] baroug dit "on a l'air d'aller au-delà de 100%"?
- [x] no scroll
- [x] ipad chrome frequent crashes (updating document.location.hash was the culprit)

Fullscreen Seamless Canvas Zoomable Map Tiles No offscreen

_Research for the next iteration of madmeg.org_

- [Fullscreen](https://observablehq.com/@mbostock/fullscreen-canvas)
- [Seamless Zoomable Map Tiles](/@d3/seamless-zoomable-map-tiles)
- Artist: [Madmeg](http://madmeg.org/)
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The zoom factor depends on retina detection, and dimensions.addZ which allows the use to zoom beyond 100%.`
)});
  main.variable(observer("maxNativeZoom")).define("maxNativeZoom", ["dimensions"], function(dimensions){return(
32 -
  Math.clz32((Math.max(dimensions.w, dimensions.h) - 1) / dimensions.s)
)});
  main.variable(observer("minZ")).define("minZ", ["dimensions"], function(dimensions){return(
dimensions.minZ
)});
  main.variable(observer("maxZ")).define("maxZ", ["maxNativeZoom","dprlog"], function(maxNativeZoom,dprlog){return(
maxNativeZoom + dprlog
)});
  main.variable(observer("maxZzoom")).define("maxZzoom", ["maxZ","dimensions"], function(maxZ,dimensions){return(
maxZ + (dimensions.addZ || 0)
)});
  main.variable(observer("tileSize")).define("tileSize", ["dimensions","dpr"], function(dimensions,dpr){return(
dimensions.s / dpr
)});
  main.variable(observer("dpr")).define("dpr", ["retina"], function(retina){return(
retina ? devicePixelRatio : 1
)});
  main.variable(observer("dprlog")).define("dprlog", ["dpr"], function(dpr){return(
Math.log2(dpr)
)});
  main.variable(observer("viewof retina")).define("viewof retina", ["checkbox"], function(checkbox){return(
checkbox({
  options: ["detect retina"],
  value: ["detect retina"]
})
)});
  main.variable(observer("retina")).define("retina", ["Generators", "viewof retina"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`The following part is a bit complex as it emulates the old coordinates system we had with leaflet. The good part is that cooordinates that are visible in the hash don't depend on D3 or leaflet.`
)});
  main.variable(observer("hash")).define("hash", ["dimensions"], function(dimensions){return(
function hash(t, width, height) {
  const K = t.k / dimensions.s;
  const z = Math.log2(K);
  const r = 512 / dimensions.s;
  const g = [(width / 2 - t.x) / t.k, (height / 2 - t.y) / t.k];
  // transform to LatLng from https://leafletjs.com/reference-1.7.1.html#map-setview
  const lat = (1 + 2 * g[1]) / r,
    lng = (1 + 2 * g[0]) / r;
  return `#${+z.toFixed(3)}/${+lat.toFixed(3)}/${+lng.toFixed(3)}`;
}
)});
  main.variable(observer("getIniTransform")).define("getIniTransform", ["dimensions"], function(dimensions){return(
function getIniTransform(hash, ini = [2, 0.5, 0.5], width, height) {
  dimensions;

  const gg = String(hash)
    .replace(/^#/, "")
    .split("/")
    .map(d => parseFloat(d));

  for (const i of [0, 1, 2]) if (gg[i] !== +gg[i]) gg[i] = ini[i];
  const r = dimensions.referentiel || 2; // referentiel = 1 for delizie for historical reasons.
  const k = dimensions.s * Math.pow(2, gg[0]);
  const y = height / 2 - (k * (gg[1] * r - 1)) / 2;
  const x = width / 2 - (k * (gg[2] * r - 1)) / 2;
  return { k, x, y };
}
)});
  main.variable(observer("style")).define("style", ["html"], function(html){return(
html`<style>

body.embed { margin: 0; height: 100vh; overflow: hidden; }

.controls {
  overflow: visible;
  position: relative;
  top: 4px;
  left: 4px;
  height: 0;
  z-index: 2;
}
.controls a, .controls a:hover {
  text-decoration: none;
}
.bar {
  border: 2px solid rgba(0,0,0,0.2);
  background: #fff;
  background-clip: padding-box;
  width: 42px;
  padding: 1px;
  display: block;
  margin-bottom: 10px;
}

.bar {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

button {
  width: 40px;
  height:40px;
  display: block;
  background-color: #fff;
  background-position-x:50%;
  background-position-y:50%;
  padding: 0; border: none; 
  color: transparent;
  overflow: hidden;
}
button.zoom-in {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-zoom-in.png);
}
button.zoom-out {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-zoom-out.png);
}
button.cartel {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-cartel.png);
}
button.fullscreen {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-fullscreen.png);
}
button.home {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-home.png);
  height: 60px;
}
button.shop {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-shop.png);
}
button.video {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-video.png);
  background-size: cover
}
button:focus { outline: none; }


.details {
  overflow: visible; position: relative; top: 0; height: 0; z-index: 3; width: 100%;
  touch-action: none;
}
.details .bg {
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
.details .cartel {
  text-align: center;
  background: white;
  margin: 8px;
  border-radius: 3px;
  box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.75);
}

.overlay {
  overflow: visible; position: absolute; bottom: 0; left:0; z-index: 1;
  touch-action: none;
  transform-origin: bottom left;
  transform: translate(65px, 0) scale(0);
  transition: transform 0.5s;
  padding-top: 30px;
  background: transparent;
  pointer-events: all;
}

.overlay.small {
  transform: translate(0px, 0) scale(0.35);
  padding-top: 60px;
}

.video-button {
  float:right; font-size: 25px; font-weight: bold; margin-left: 13px; height: 28px; cursor: pointer;
}
`
)});
  main.variable(observer("addDetails")).define("addDetails", ["d3","dimensions"], function(d3,dimensions){return(
function addDetails(node, canvas) {
  const details = d3
    .select(node)
    .insert("div", "canvas")
    .attr("class", "details")
    .append("div")
    .attr("class", "bg")
    .on("click", hide);

  d3.select(document.documentElement).on("keydown.escDetails", e => {
    if ((e.keyCode || e.which) === 27) {
      console.log("esc");
      hide();
    }
  });

  if (dimensions.cartel) {
    details.node().show = function() {
      details
        .style("width", `${node.clientWidth + 16}px`)
        .style("height", `${node.clientHeight}px`)
        .style("display", "flex")
        .html("");
      const im = details
        .append("div")
        .attr("class", "cartel")
        .append("img")
        .attr("src", dimensions.cartel);
      im.style("max-width", `${Math.min(600, node.clientWidth) - 20}px`);
    };
  }

  details.node().hide = hide;

  return details.node();

  function hide() {
    details.style("display", "none").html("");
  }
}
)});
  main.variable(observer("addOverlay")).define("addOverlay", ["d3"], function(d3){return(
function addOverlay(node, canvas) {
  const details = d3
    .select(node)
    .insert("div", "canvas")
    .attr("class", "overlay");

  d3.select(document.documentElement).on("keydown.escOverlay", e => {
    if ((e.keyCode || e.which) === 27) hide();
  });

  details.node().show = function(embed) {

    if (details.select("div").size()) return hide();

    function small() {
      details.classed("small", true).classed("large", false);
    }
    function large() {
      details.classed("small", false).classed("large", true);
    }
    function toggle() {
      details.classed("small") ? large() : small();
    }

    const im = details.append("div").html(embed);

    im.style("max-width", `${Math.min(600, node.clientWidth) - 20}px`);
    large();

    details.on("click", toggle);
    im.insert("div", "*").html("<div class='video-button'>&downdownarrows;"); // https://www.compart.com/en/unicode/U+21CA
    im.insert("div", "*")
      .html("<div class='video-button'>&times;")
      .on("click", hide);
  };

  details.node().hide = hide;

  return details.node();

  function hide() {
    details
      .classed("small", false)
      .classed("large", false)
      .transition()
      .duration(1000)
      .end()
      .then(() => details.html(""));
  }
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Tile loader`
)});
  main.variable(observer("tiler")).define("tiler", ["d3","tileSize"], function(d3,tileSize){return(
d3
  .tile()
  .tileSize(tileSize)
  .clampX(false)
)});
  main.variable(observer("animateCanvas")).define("animateCanvas", ["d3","tiler","dimensions","deltas","acceptable","url","cache","dodebug","tileSize","minZ","maxZzoom","history","hash","getIniTransform"], function(d3,tiler,dimensions,deltas,acceptable,url,cache,dodebug,tileSize,minZ,maxZzoom,history,hash,getIniTransform){return(
function animateCanvas(div) {
  const canvas = d3
    .select(div)
    .select("canvas")
    .node();
  const context = canvas.getContext("2d");
  const dpi = Math.min(1.5, window.devicePixelRatio || 1);

  const zoom = d3.zoom();

  let width;
  let height;

  let tr;
  let pruned;

  let drawn;

  const toload = [];

  function draw() {
    drawn = true;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    tiler.extent([[0, 0], [width, height]]);

    if (dimensions.translateExtent)
      zoom.translateExtent(dimensions.translateExtent);

    context.globalAlpha = 1;

    toload.length = 0;

    for (const delta of deltas) {
      // tile coordinates
      tiler.zoomDelta(delta);
      let tiles = tiler(tr);

      let im;
      if (delta === 0) context.globalAlpha = 1;

      for (const u of tiles) {
        const [x, y, z] = dimensions.wrap ? d3.tileWrap(u) : u;
        if (!acceptable([x, y, z])) continue;

        const x1 = (u[0] + tiles.translate[0]) * tiles.scale,
          y1 = (u[1] + tiles.translate[1]) * tiles.scale;

        const code = url(x, y, z);

        context.strokeStyle = context.fillStyle = "red";
        if (!cache.has(code)) {
          toload.push(code);
        } else if ((im = cache.get(code)) && im !== -1) {
          context.drawImage(im, x1, y1, tiles.scale, tiles.scale);
          context.strokeStyle = context.fillStyle = "lightblue";
        } else {
          context.strokeStyle = context.fillStyle = "orange";
        }

        if (dodebug) {
          context.fillText(`${x}x${y}/${z}`, x1, y1 + 9 * z);
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo(x1, y1 + tiles.scale);
          context.lineTo(x1 + tiles.scale, y1 + tiles.scale);
          context.lineTo(x1 + tiles.scale, y1);
          context.lineTo(x1, y1);
          context.globalAlpha = 0.1;
          context.fill();
          context.globalAlpha = 1;
          context.stroke();
        }
      }
    }
    if (true) {
      const n1 = toload.length,
        n2 = [...cache.values()].filter(d => !d).length;
      for (let i = 0; i < n1 + n2; i++) {
        context.fillStyle = i < n2 ? "#ccc" : "#eee";
        context.fillRect(3 + 4 * i, height - 7, 3, 3);
      }
    }

    if (dodebug) {
      context.fillStyle = "red";
      context.fillText(`${width}x${height} ; cached: ${cache.size}`, 100, 20);
    }
    if (dodebug) {
      context.save();
      context.translate(tr.x, tr.y);
      context.scale(tr.k, tr.k);
      context.lineWidth = 1 / tr.k;

      // square of size (1,1) centered on [0,0]
      {
        context.strokeStyle = "green";
        const A = [-.5, -.5];
        const B = [1, 1];
        context.strokeRect(A[0], A[1], B[0], B[1]);
      }
      // translateExtent
      {
        context.strokeStyle = "yellow";
        const A = zoom.translateExtent();
        context.strokeRect(
          A[0][0],
          A[0][1],
          A[1][0] - A[0][0],
          A[1][1] - A[0][1]
        );
      }

      // center
      context.fillRect(-.01 / 2, -.01 / 2, .01, .01);
      context.restore();
    }
  }

  function refresh() {
    if (!tr) return;

    if (!drawn) requestAnimationFrame(draw);
    drawn = false;

    const MAXLOAD = 12;
    while (
      toload.length &&
      [...cache.values()].filter(d => !d).length < MAXLOAD
    ) {
      const code = toload.pop();
      cache.set(code, 0);
      const image = new Image();
      image.src = code;
      image.onload = () => {
        cache.set(code, image);
        refresh();
      };
      image.onerror = () => {
        cache.set(code, -1);
        refresh();
      };
    }

    if (!pruned) {
      pruned = setTimeout(() => (pruned = false), 1000);
      cache.prune();
    }
  }

  zoom
    // .translateExtent([[-.60, -.60], [.10, -.10]]) // world coordinates
    .scaleExtent([
      tileSize * Math.pow(2, minZ),
      tileSize * Math.pow(2, maxZzoom)
    ])
    .on("zoom", ({ transform }) => {
      tr = transform;
      refresh();
      if (width && height) {
        try {
          history.replaceState(null, '', hash(tr, width, height));
        } catch (e) {}
      }
    });

  canvas.zoomIn = () =>
    d3
      .select(canvas)
      .transition()
      .call(zoom.scaleBy, 2);

  canvas.zoomOut = () =>
    d3
      .select(canvas)
      .transition()
      .call(zoom.scaleBy, .5);

  d3.select(canvas)
    .on("mousemove click", event =>
      d3
        .select(div)
        .select(".controls")
        .transition()
        .style("opacity", +(d3.pointer(event)[0] < width * 0.33))
    )
    .on("wheel.preventscroll", event => event.preventDefault())
    .call(zoom)
    .node();

  function resize(viewport) {
    if (!viewport.width) return; // not ready

    // was 2, 0.4, 0.5
    if (!tr) {
      const tt = getIniTransform(
        document.location.hash,
        dimensions.start,
        viewport.width,
        viewport.height
      );
      tr = d3.zoomIdentity.translate(tt.x, tt.y).scale(tt.k);
      d3.select(canvas).call(zoom.transform, tr);
    }

    width = viewport.width;
    height = viewport.height;

    zoom.extent([[0, 0], [width, height]]); // viewport coordinates

    canvas.width = dpi * width;
    canvas.height = dpi * height;
    canvas.style.width = `${width}px`;
    context.scale(dpi, dpi);
    d3.select(div)
      .style("height", `${height}px`)
      .select(".details .bg")
      .style("width", `${width}px`)
      .style("height", `${height}px`);

    drawn = false;
    setTimeout(refresh, 300);
  }

  return resize;
}
)});
  main.variable(observer("deltas")).define("deltas", function(){return(
[-100, -7, -6, -5, -4, -3, -2, -1, 0]
)});
  main.variable(observer("url")).define("url", ["opus","dimensions"], function(opus,dimensions){return(
(x, y, z) =>
  `https://madmeg.org/tiles/${opus}/${dimensions.s}/${z}/${x}/${y}.jpg`
)});
  main.variable(observer("cache")).define("cache", function()
{
  const cache = new Map();
  cache.prune = () => {
    if (cache.size > 900) {
      let i = 0;
      for (const [k] of cache) {
        cache.delete(k);
        if (++i > 100) break;
      }
    }
  };
  return cache;
}
);
  main.variable(observer("acceptable")).define("acceptable", ["maxNativeZoom","tileSize","maxZ","dimensions"], function(maxNativeZoom,tileSize,maxZ,dimensions){return(
function acceptable([x, y, z]) {
  return (
    z <= maxNativeZoom &&
    x >= 0 &&
    y >= 0 &&
    x * (tileSize * Math.pow(2, maxZ - z)) < dimensions.w &&
    y * (tileSize * Math.pow(2, maxZ - z)) < dimensions.h
  );
}
)});
  main.variable(observer("addControls")).define("addControls", ["d3","dimensions"], function(d3,dimensions){return(
function addControls(node, canvas, details, overlay) {
  const controls = d3
    .select(node)
    .insert("div", "canvas")
    .attr("class", "controls");

  const bar1 = controls.append("div").classed("bar", true),
    bar2 = controls.append("div").classed("bar", true);
  bar1
    .append("button")
    .text("+")
    .classed("zoom-in", true)
    .on("click", () => canvas.zoomIn());

  bar1
    .append("button")
    .text("-")
    .classed("zoom-out", true)
    .on("click", () => canvas.zoomOut());

  if (node.requestFullscreen) {
    bar1
      .append("button")
      .text("FullScreen")
      .classed("fullscreen", true)
      .on("click", () => {
        if (document.fullscreenElement === node) document.exitFullscreen();
        else node.requestFullscreen();
      });
  }

  if (dimensions.cartel)
    bar2
      .append("button")
      .text("?")
      .classed("cartel", true)
      .on("click", () => details.show());

  if (dimensions.video)
    bar2
      .append("button")
      .text("video")
      .classed("video", true)
      .on("click", () => {
        const width = node.clientWidth,
          height = node.clientHeight;
        const W = Math.min(600, width) - 20;
        const H = (W * 0.7) | 0;
        d3.select(overlay).style("height", `${H}px`);
        const embed = `<iframe src="${
          dimensions.video
        }" width="${W}" height="${H}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
       <style>.overlay.large { transform: translate(
         ${(width - W) / 2}px,
         ${-(height - H) / 2}px)
         scale(1); }
        </style>`;
        overlay.show(embed);
      });

  if (dimensions.shop)
    bar2
      .append("a")
      .attr("href", dimensions.shop)
      .append("button")
      .text("shop")
      .classed("shop", true);

  bar2
    .append("a")
    .attr("href", dimensions.home || "https://madmeg.org/")
    .append("button")
    .text("madmeg.org")
    .classed("home", true);
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## viewport width & height`
)});
  main.variable(observer("viewport")).define("viewport", ["width","height"], function(width,height){return(
{
  width: width + 16, // sometimes on iPad there is a margin
  height
}
)});
  main.variable(observer("height")).define("height", ["Generators","DEFAULT_HEIGHT","invalidation"], function(Generators,DEFAULT_HEIGHT,invalidation){return(
Generators.observe(function(change) {
  const embed = !document.location.host.match(/\.observableusercontent\.com$/);
  const t = testcell(DEFAULT_HEIGHT);

  let height = change(t.clientHeight);
  function update() {
    if (t.clientHeight !== height) change((height = t.clientHeight));
  }
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", update);
  return function() {
    window.removeEventListener("resize", update);
    window.removeEventListener("orientationchange", update);
  };

  function testcell(height) {
    if (embed)
      for (const [k, v] of [
        ["padding", "0px"],
        ["margin", "0px"],
        ["height", "100%"],
        ["max-height", "100%"],
        ["width", "100vw"]
      ]) {
        document.documentElement.style[k] = v;
        document.body.style[k] = v;
      }

    const t = document.createElement("div");
    t.setAttribute("id", "heighttestcell");
    t.setAttribute(
      "style",
      `position: fixed; width:1px; ${
        embed ? `height: 100%;` : `min-height: ${height}px;`
      }`
    );
    t.innerHTML =
      "<style>body.fullscreen > div#heighttestcell { height: 100%!important; }";
    document.body.appendChild(t);

    invalidation.then(() => document.body.removeChild(t));

    return t;
  }
})
)});
  main.variable(observer()).define(["height"], function(height){return(
height
)});
  main.variable(observer("DEFAULT_HEIGHT")).define("DEFAULT_HEIGHT", ["SCREEN_HEIGHT","width"], function(SCREEN_HEIGHT,width){return(
Math.min(SCREEN_HEIGHT, width * 0.7) | 0
)});
  main.variable(observer("SCREEN_HEIGHT")).define("SCREEN_HEIGHT", ["screen"], function(screen){return(
screen.height
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Utilities`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3-selection@2", "d3-transition@2", "d3-zoom@2", "d3-tile@1")
)});
  main.variable(observer("select")).define("select", ["html"], function(html){return(
function select({ options, value, description }) {
  if (options[0].value === undefined)
    options = options.map(d => ({ label: d, value: d }));

  const form = html`<form style="display: flex; font: 12px sans-serif; align-items: center; min-height: 33px;"><select style="margin-right: 0.5em;" name="i">${options.map(
    ({ label, value }) =>
      Object.assign(html`<option>`, {
        value,
        textContent: label
      })
  )}</select> <em>${description}</em>`;
  form.i.selectedIndex = 1;
  if (value)
    for (let i = 0; i < options.length; i++)
      if (options[i].value == value) form.i.selectedIndex = i;

  form.i.onchange = () => form.dispatchEvent(new CustomEvent("input"));
  form.oninput = () => (form.value = options[form.i.selectedIndex].value);

  form.oninput();

  return form;
}
)});
  main.variable(observer("checkbox")).define("checkbox", ["html"], function(html){return(
function checkbox({ options, description, value }) {
  value = (value && value.length !== 0) || false;
  const form = html`<form style="font-size: 14px; display: flex; flex-direction: column; justify-content: center; min-height: 33px;"><label style="display: flex; align-items: center;">
<input type=checkbox name=i${
    value ? ` checked="checked"` : ""
  }><span style="margin-left: 0.5em;">${options[0]}</span></label>
${
  description
    ? `<div style="font-size: 0.85rem; font-style: italic; margin-top: 3px;">${description}</div>`
    : ""
}`;
  form.i.onclick = () => {
    form.value = form.i.checked;
    form.dispatchEvent(new CustomEvent("input"));
  };
  form.value = value;
  return form;
}
)});
  return main;
}
