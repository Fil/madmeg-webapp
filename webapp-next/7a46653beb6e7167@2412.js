export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# madmeg next`
)});
  main.variable(observer("map")).define("map", ["addDetails","animateCanvas","addControls","d3","style"], function(addDetails,animateCanvas,addControls,d3,style)
{
  const div = document.createElement("div");
  const canvas = document.createElement("canvas");
  const details = addDetails(div, canvas);

  div.appendChild(canvas);
  div.resize = animateCanvas(div);
  details.hide();
  addControls(div, canvas, details);

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
  return select({ options, description: "opus" });
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
  jacsmkee: {
    w: 26107,
    h: 16518,
    s: 256,
    minZ: 2,
    start: [6, 0.377, 0.535],
    cartel: "https://madmeg.org/jacsmkee/cartel-fr.jpg"
  },
  "delices-en": {
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    start: [2, .4, .5]
  },
  "delices-fr": {
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    start: [2, .4, .5]
  },
  "delices-it": {
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    start: [2, .4, .5]
  },
  "alphabet-256": {
    w: 19859,
    h: 27369,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    start: [2, .82, .56]
  },
  "alphabet-512": {
    w: 19859,
    h: 27369,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    start: [2, .82, .56]
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
  Math.clz32(Math.max(dimensions.w, dimensions.h) / dimensions.s)
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
function getIniTransform(hash, ini, width, height) {
  const gg = String(hash)
    .replace(/^#/, "")
    .split("/")
    .map(d => parseFloat(d));

  for (const i of [0, 1, 2]) if (gg[i] !== +gg[i]) gg[i] = ini[i];
  const r = 512 / dimensions.s;
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
button.fullscreen {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-fullscreen.png);
}
button.cartel {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-cartel.png);
}
button.home {
  background-image: url(https://madmeg.org/tiles-webapp/images/icon-home.png);
  height: 60px;
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

  d3.select(document.documentElement).on("keydown.esc", e => {
    if ((e.keyCode || e.which) === 27) hide();
  });

  if (dimensions.cartel) {
    const im = details
      .append("div")
      .attr("class", "cartel")
      .append("img")
      .attr("src", dimensions.cartel);

    details.node().show = function() {
      details
        .style("width", `${node.clientWidth}px`)
        .style("height", `${node.clientHeight}px`)
        .style("display", "flex");
      im.style("max-width", `${Math.min(600, node.clientWidth) - 20}px`);
      im.text("max-width" + `${Math.min(600, node.clientWidth) - 20}px`);
    };
  }

  details.node().hide = hide;

  return details.node();

  function hide() {
    details.style("display", "none");
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
  main.variable(observer("animateCanvas")).define("animateCanvas", ["d3","tiler","deltas","acceptable","url","cache","dodebug","tileSize","minZ","maxZzoom","history","hash","getIniTransform","dimensions"], function(d3,tiler,deltas,acceptable,url,cache,dodebug,tileSize,minZ,maxZzoom,history,hash,getIniTransform,dimensions){return(
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

    context.globalAlpha = 1;

    toload.length = 0;

    for (const delta of deltas) {
      // tile coordinates
      tiler.zoomDelta(delta);
      const tiles = tiler(tr);
      let im;
      if (delta === 0) context.globalAlpha = 1;

      for (const [x, y, z] of tiles) {
        if (!acceptable([x, y, z])) continue;

        const x1 = (x + tiles.translate[0]) * tiles.scale,
          y1 = (y + tiles.translate[1]) * tiles.scale;

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
        context.strokeStyle = "blue";
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
    console.log(toload, [...cache].filter(d => !d[1]).map(d => d[0]));

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
      if (width && height)
        history.replaceState(null, '', hash(tr, width, height));
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

    zoom.extent([[-width / 2, -height / 2], [width * 1.5, height * 1.5]]); // viewport coordinates

    canvas.width = dpi * width;
    canvas.height = dpi * height;
    canvas.style.width = `${width}px`;
    context.scale(dpi, dpi);
    d3.select(div)
      .style("height", `${height}px`)
      .select(".details .bg")
      .style("width", `${width}px`)
      .style("height", `${height}px`);

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
function addControls(node, canvas, details) {
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
function select({ options, description }) {
  options = options.map(d => ({ label: d, value: d }));
  const form = html`<form style="display: flex; font: 12px sans-serif; align-items: center; min-height: 33px;"><select style="margin-right: 0.5em;" name="i">${options.map(
    ({ label, value }) =>
      Object.assign(html`<option>`, { value, textContent: label })
  )}</select> <em>${description}</em>`;
  form.i.selectedIndex = 1;
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