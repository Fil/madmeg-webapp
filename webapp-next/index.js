export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# madmeg next`
)});
  main.variable(observer("map")).define("map", ["addInfo","addOverlay","animateCanvas","addControls","d3","style"], function(addInfo,addOverlay,animateCanvas,addControls,d3,style)
{
  const div = document.createElement("div");
  const canvas = document.createElement("canvas");
  const details = addInfo(div, canvas, "cartel");
  const info = addInfo(div, canvas, "info");
  const overlay = addOverlay(div, canvas);

  div.appendChild(canvas);
  div.resize = animateCanvas(div);
  overlay.hide();
  addControls(div, canvas, details, info, overlay);

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
  const options = settings.map(d => d.opus);
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
  main.variable(observer()).define(["md","opus"], function(md,opus){return(
md`[👉 test fullscreen](https://visionscarto.net/obs/?https://observablehq.com/d/7a46653beb6e7167&opus=${opus}&debug=true)`
)});
  main.variable(observer("page")).define("page", ["html","dimensions","opus"], function(html,dimensions,opus){return(
html`<textarea style="width:100%;height:10em"><!DOCTYPE html>
<html><head><meta charset="utf-8"/>

<title>${(dimensions.title || "***TITLE***").replace(
  /&/g,
  "&amp;"
)} | mad meg (${dimensions.date || "***2020***"})</title>

<meta property="og:image" content="${dimensions.url ||
  `https://madmeg.org/${opus}/`}vignette-1200x630.jpg">
<link rel="apple-touch-icon" href="images/apple-touch-icon-72x72.png" />
<link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72x72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="images/apple-touch-icon-114x114.png" />
<link rel="apple-touch-icon" sizes="144x144" href="images/apple-touch-icon-144x144.png" />
<link rel="icon" type="image/png" href="images/apple-touch-icon-72x72.png" />

<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

<script src="../webapp-next/d3.js"></script>
<script src="../webapp-next/d3-tile.min.js"></script>
</head>

<div id="wrapper"><div></div></div>

<script>
${
  dimensions.lang
    ? `
  let lang = document.location.search.match(/lang=(\\w+)/);
  lang = (lang ? lang[1] : (navigator.userLanguage || navigator.language)) || null;
`
    : ""
}
  var opus = ${(dimensions.lang || "")
    .split(/,/)
    .filter(d => d)
    .map(
      lang =>
        `lang == '${lang}' ? ${JSON.stringify(opus.replace(/fr$/, `${lang}`))}
           : `
    )}${JSON.stringify(opus.replace(/fr$/, `en`))};

</script>

<script type="module">
  import {Runtime, Inspector} from "../webapp-next/runtime.js";
  import define from "../webapp-next/index.js";
  const run = new Runtime().module(define, name => {
    if (name === "map" || name === "resizer") return Inspector.into("#wrapper")();
  });
  if (document.location.search.match(/debug/)) run.redefine("dodebug", true);
  if (d3.select && d3.tile) run.redefine("d3", d3);

  run.redefine("opus", opus);

/*

  run.redefine("dimensions", ${JSON.stringify(dimensions, null, 2).replace(
    /&/g,
    "&amp;"
  )});

*/
</script>
</textarea>`
)});
  main.variable(observer("resizer")).define("resizer", ["map","viewport","html"], function(map,viewport,html)
{
  map.resize(viewport);
  return html``;
}
);
  main.variable(observer("settings")).define("settings", function(){return(
[
  {
    opus: "-",
    title: "",
    date: "",
    w: "",
    h: "",
    s: "",
    start: "",
    minZ: "",
    addZ: "",
    cartel: "",
    url: "",
    lang: "",
    info: "",
    shop: "",
    print: "",
    playlist: "",
    fold: "",
    video: "",
    wrap: "",
    referentiel: "",
    translateExtent: "",
    aspectRatio: ""
  },
  {
    opus: "alphabet",
    title: "L’alpha-Bête",
    date: "2020",
    w: 19859,
    h: 27369,
    s: 512,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/alphabet/cartel-fr.jpg",
    url: "https://madmeg.org/alphabet/",
    video: "https://www.youtube-nocookie.com/embed/-5I1jUCxRfk?autoplay=1",
    start: "5.86/0.518/0.156"
  },
  {
    opus: "atheniennes2014_fr",
    title: "Angela &amp; Olympe",
    date: "2013-2014",
    lang: "fr,en",
    w: 17538,
    h: 24401,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/athena/cartel-fr.jpg",
    url: "https://madmeg.org/athena/",
    start: "7/0.026/0.355"
  },
  {
    opus: "atheniennes2014_en",
    title: "Angela &amp; Olympe",
    date: "2013-2014",
    lang: "fr,en",
    w: 17538,
    h: 24401,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/athena/cartel-fr.jpg",
    url: "https://madmeg.org/athena/",
    start: "7/0.026/0.355"
  },
  {
    opus: "axe",
    title: "L'axe du mâle",
    date: "2018",
    w: 9934,
    h: 16514,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/axe/cartel-fr.jpg",
    url: "https://madmeg.org/axe/",
    start: "6/0.385/0.15",
    fold: "https://madmeg.org/axe/axe-fold.jpg"
  },
  {
    opus: "bitcoin",
    title: "S1E5 Bitcoin",
    date: "2019",
    w: 13103,
    h: 16272,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/bitcoin/cartel-fr.jpg",
    url: "https://madmeg.org/bitcoin/",
    start: "4.17/0.599/0.395"
  },
  {
    opus: "christine",
    title: "Christine de Pizan",
    date: "2014",
    w: 10707,
    h: 15186,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/christine/cartel-fr.jpg",
    url: "https://madmeg.org/christine/",
    start: "6/0.5/0.537"
  },
  {
    opus: "clef",
    title: "La clef de ma chambre",
    date: "2015",
    w: 16049,
    h: 17739,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/clef/cartel-fr.jpg",
    url: "https://madmeg.org/clef/",
    start: "6/0.25/0.22"
  },
  {
    opus: "data",
    title: "Va DATA Chambre",
    date: "2015",
    w: 18990,
    h: 12604,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/data/cartel-fr.jpg",
    url: "https://madmeg.org/data/",
    start: "6/0.089/0.1"
  },
  {
    opus: "delices-en",
    title: "The Garden of Earthly Delights",
    date: "2004-2011-2012",
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    lang: "en,fr,it",
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    url: "https://madmeg.org/delizie/",
    referentiel: 1,
    start: "2/0.4/0.5"
  },
  {
    opus: "delices-fr",
    title: "Le Jardin des délices",
    date: "2004-2011-2012",
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    lang: "en,fr,it",
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    url: "https://madmeg.org/delizie/",
    referentiel: 1,
    start: "2/0.4/0.5"
  },
  {
    opus: "delices-it",
    title: "Giardino delle delizie",
    date: "2004-2011-2012",
    w: 33328,
    h: 23400,
    s: 512,
    minZ: 2,
    addZ: 0.2,
    lang: "en,fr,it",
    cartel: "https://madmeg.org/delizie/cartel-fr.jpg",
    url: "https://madmeg.org/delizie/",
    referentiel: 1,
    start: "2/0.4/0.5"
  },
  {
    opus: "epoux-fr",
    title:
      "Les époux Arnolfini / … Qu’est-ce qui peut bien rendre nos intérieurs…",
    date: "2005",
    w: 15817,
    h: 23617,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    lang: "fr,en,it",
    cartel: "https://madmeg.org/epoux/cartel-fr.jpg",
    url: "https://madmeg.org/epoux/",
    start: "7/0.342/0.245"
  },
  {
    opus: "epoux-en",
    title: "The Arnolfini Wedding / … What is it that makes today’s homes…",
    date: "2005",
    w: 15817,
    h: 23617,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    lang: "fr,en,it",
    cartel: "https://madmeg.org/epoux/cartel-fr.jpg",
    url: "https://madmeg.org/epoux/",
    start: "7/0.342/0.245"
  },
  {
    opus: "epoux-it",
    title: "Les époux Arnolfini / … Che cos’è che rende le case di oggi…",
    date: "2005",
    w: 15817,
    h: 23617,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    lang: "fr,en,it",
    cartel: "https://madmeg.org/epoux/cartel-fr.jpg",
    url: "https://madmeg.org/epoux/",
    start: "7/0.342/0.245"
  },
  {
    opus: "feast-en",
    title: "Feast of Fools",
    date: "2008-2012",
    w: 98304,
    h: 32768,
    s: 256,
    lang: "fr,en",
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/feastoffools/cartel-en.jpg",
    url: "https://madmeg.org/feastoffools/",
    video: "https://www.youtube-nocookie.com/embed/lJCAhIG4hEw?autoplay=1",
    start: "5/0.129/0.365"
  },
  {
    opus: "feast-fr",
    title: "Feast of Fools",
    date: "2008-2012",
    w: 98304,
    h: 32768,
    s: 256,
    lang: "fr,en",
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/feastoffools/cartel-fr.jpg",
    url: "https://madmeg.org/feastoffools/",
    video: "https://www.youtube-nocookie.com/embed/lJCAhIG4hEw?autoplay=1",
    start: "5/0.129/0.365"
  },
  {
    opus: "fezouata",
    title: "Fezouata",
    date: "2016",
    w: 12532,
    h: 7052,
    s: 256,
    lang: "fr,en",
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/fezouata/cartel-fr.jpg", // -en
    url: "https://madmeg.org/fezouata/",
    start: "3/0.21/0.37",
    shop: "https://www.madmeg.org/base/shop/Fezouata.html",
    info: "https://madmeg.org/fezouata/infos-fr.jpg" // -en
  },
  {
    opus: "fukushima",
    title: "Fukushima dans ma tête",
    date: "2015",
    w: 19122,
    h: 12664,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/fukushima/cartel-fr.jpg",
    url: "https://madmeg.org/fukushima/",
    start: "6/0.044/0.053",
    playlist: "https://www.madmeg.org/base/fukushima.html"
  },
  {
    opus: "giletsjaunes",
    title: "Le martyre des Gilets jaunes",
    date: "2019",
    w: 4961,
    h: 4928,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/giletsjaunes/cartel-fr.jpg",
    url: "https://madmeg.org/giletsjaunes/",
    start: "3/0.2/0.3",
    print: "https://madmeg.org/giletsjaunes/giletsjaunes.zip"
  },
  {
    opus: "jacsmkee",
    title: "Jac Sm Kee",
    date: "2015",
    w: 26107,
    h: 16518,
    s: 256,
    minZ: 2,
    start: "6/0.377/0.535",
    cartel: "https://madmeg.org/jacsmkee/cartel-fr.jpg",
    url: "https://madmeg.org/jacsmkee/"
  },
  {
    opus: "jiando",
    title: "La tentation de Jiando",
    date: "2020",
    w: 26107,
    h: 16518,
    s: 256,
    minZ: 2,
    start: "6/0.377/0.535",
    cartel: "https://madmeg.org/jiando/cartel-fr.jpg",
    url: "https://madmeg.org/jiando/",
    video: "https://www.youtube-nocookie.com/embed/4qOfTMN28Qo?autoplay=1",
    aspectRatio: "yes"
  },
  {
    opus: "jiando-normal", // pour le cas ou le script special serait cassé
    title: "La tentation de Jiando",
    date: "2020",
    w: 26107,
    h: 16518,
    s: 256,
    minZ: 2,
    start: "6/0.377/0.535",
    cartel: "https://madmeg.org/jiando/cartel-fr.jpg",
    url: "https://madmeg.org/jiando/",
    video: "https://www.youtube-nocookie.com/embed/4qOfTMN28Qo?autoplay=1"
  },
  {
    opus: "lecon",
    title: "La leçon de pornographie",
    date: "2010",
    w: 15659,
    h: 12480,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/lecon/cartel-fr.jpg",
    url: "https://madmeg.org/lecon/",
    start: "6/0.567/0.646"
  },
  {
    opus: "lippido",
    title: "Lippido",
    date: "2006",
    w: 6500,
    h: 6500,
    s: 256,
    minZ: 2,
    start: "4/0.35/0.41",
    cartel: "https://madmeg.org/lippido/cartel-fr.jpg",
    url: "https://madmeg.org/lippido/",
    shop: "https://www.madmeg.org/base/shop/Lippido.html"
  },
  {
    opus: "lisboa",
    title: "Lisboa",
    date: "2009",
    w: 16384,
    h: 1462,
    s: 256,
    minZ: 4,
    addZ: 0.2,
    cartel: "https://madmeg.org/lisboa/cartel-fr.jpg",
    url: "https://madmeg.org/lisboa/",
    wrap: true,
    translateExtent: "[[-180000, -0.52], [180000, -0.40]]",
    start: "5/0.045/0.029"
  },
  {
    opus: "ma1",
    title: "Minus Vis I - Debilitatem",
    date: "2016",
    w: 11900,
    h: 14033,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/ma1/cartel-fr.jpg",
    url: "https://madmeg.org/ma1/",
    start: "4/0.3/0.35",
    print: "https://madmeg.org/ma1/madmeg-ma1.pdf"
  },
  {
    opus: "ma2",
    title: "Minus Vis II - Aufer Dolor Meus",
    date: "2017",
    w: 9400,
    h: 9132,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/ma2/cartel-fr.jpg",
    url: "https://madmeg.org/ma2/",
    start: "5/0.176/0.281",
    print: "https://madmeg.org/ma2/madmeg-ma2.pdf"
  },
  {
    opus: "ma3",
    title: "Minus Vis III - Claudere Ora Vesta. ET Aperuit Mea",
    date: "2017",
    w: 10016,
    h: 12993,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/ma3/cartel-fr.jpg",
    url: "https://madmeg.org/ma3/",
    start: "5/0.179/0.318",
    print: "https://madmeg.org/ma3/madmeg-ma3.pdf"
  },
  {
    opus: "ma4",
    title: "Minus Vis IV - Tarot et complementarum",
    date: "2018",
    w: 7739,
    h: 9710,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/ma4/cartel-fr.jpg",
    url: "https://madmeg.org/ma4/",
    start: "5/0.318/0.228",
    print: "https://madmeg.org/ma4/madmeg-ma4.pdf"
  },
  {
    opus: "ma5",
    title: "Minus Vis V - Codex Gonadus",
    date: "2018",
    w: 7922,
    h: 10873,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/ma5/cartel-fr.jpg",
    url: "https://madmeg.org/ma5/",
    start: "5/0.073/0.23",
    print: "https://madmeg.org/ma5/madmeg-ma5.pdf"
  },
  {
    opus: "ma6",
    title: "Minus Vis VI - Rabenvatersschandzauberkapuze",
    date: "2018",
    w: 6540,
    h: 8602,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/ma6/cartel-fr.jpg",
    url: "https://madmeg.org/ma6/",
    start: "5/0.355/0.212",
    print: "https://madmeg.org/ma6/madmeg-ma6.pdf"
  },
  {
    opus: "ma7",
    title: "Minus Vis VII - Utérus, que tes trompes gonflent d’orgueil",
    date: "2019",
    w: 8597,
    h: 13103,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/ma7/cartel-fr.jpg",
    url: "https://madmeg.org/ma7/",
    start: "5/0.746/0.269",
    print: "https://madmeg.org/ma7/madmeg-ma7.pdf"
  },
  {
    opus: "mad-meg-fr",
    title: "Mad meg",
    date: "2005",
    w: 14765,
    h: 15120,
    s: 256,
    lang: "fr,en,it",
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/lenragee/cartel-fr.jpg",
    url: "https://madmeg.org/lenragee/",
    start: "3/0.32/0.46"
  },
  {
    opus: "mad-meg-en",
    title: "Mad meg",
    date: "2005",
    w: 14765,
    h: 15120,
    s: 256,
    lang: "fr,en,it",
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/lenragee/cartel-fr.jpg",
    url: "https://madmeg.org/lenragee/",
    start: "3/0.32/0.46"
  },
  {
    opus: "mad-meg-it",
    title: "Mad meg",
    date: "2005",
    w: 14765,
    h: 15120,
    s: 256,
    lang: "fr,en,it",
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/lenragee/cartel-fr.jpg",
    url: "https://madmeg.org/lenragee/",
    start: "3/0.32/0.46"
  },
  {
    opus: "mb1",
    title: "Magis habent virtutem I",
    date: "2016",
    w: 8596,
    h: 11240,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb1/cartel-fr.jpg",
    url: "https://madmeg.org/mb1/",
    start: "6/0.319/0.263",
    print: "https://madmeg.org/mb1/madmeg-mb1.pdf"
  },
  {
    opus: "mb10",
    title: "Magis habent virtutem X - Vade Retro Defecatores",
    date: "2018",
    w: 7253,
    h: 9436,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb10/cartel-fr.jpg",
    url: "https://madmeg.org/mb10/",
    start: "3/0.19/0.24",
    print: "https://madmeg.org/mb10/madmeg-mb10.pdf"
  },
  {
    opus: "mb11",
    title:
      "Magis habent virtutem XI - Les 10 tremblements pour faire tomber le Mont Sexisme",
    date: "2019",
    w: 11365,
    h: 11093,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb11/cartel-fr.jpg",
    url: "https://madmeg.org/mb11/",
    start: "5/0.394/0.18",
    print: "https://madmeg.org/mb11/madmeg-mb11.pdf"
  },
  {
    opus: "mb12",
    title: "Magis habent virtutem XII - Mortis Rosis",
    date: "2019",
    w: 11045,
    h: 10984,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb12/cartel-fr.jpg",
    url: "https://madmeg.org/mb12/",
    start: "5/0.277/0.328",
    print: "https://madmeg.org/mb12/madmeg-mb12.pdf"
  },
  {
    opus: "mb2",
    title: "Magis habent virtutem II",
    date: "2016",
    w: 9899,
    h: 11835,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb2/cartel-fr.jpg",
    url: "https://madmeg.org/mb2/",
    start: "5/0.232/0.309",
    print: "https://madmeg.org/mb2/madmeg-mb2.pdf"
  },
  {
    opus: "mb3",
    title: "Magis habent virtutem III",
    date: "2017",
    w: 7893,
    h: 10894,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb3/cartel-fr.jpg",
    url: "https://madmeg.org/mb3/",
    start: "5/0.426/0.254",
    print: "https://madmeg.org/mb3/madmeg-mb3.pdf"
  },
  {
    opus: "mb4",
    title: "Magis habent virtutem IV",
    date: "2017",
    w: 12518,
    h: 12352,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb4/cartel-fr.jpg",
    url: "https://madmeg.org/mb4/",
    start: "5/0.306/0.359",
    print: "https://madmeg.org/mb4/madmeg-mb4.pdf"
  },
  {
    opus: "mb5",
    title: "Magis habent virtutem V",
    date: "2017",
    w: 8581,
    h: 10806,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb5/cartel-fr.jpg",
    url: "https://madmeg.org/mb5/",
    start: "5/0.12/0.267",
    print: "https://madmeg.org/mb5/madmeg-mb5.pdf"
  },
  {
    opus: "mb6",
    title: "Magis habent virtutem VI",
    date: "2017",
    w: 9039,
    h: 9974,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb6/cartel-fr.jpg",
    url: "https://madmeg.org/mb6/",
    start: "5/0.338/0.289",
    print: "https://madmeg.org/mb6/madmeg-mb6.pdf"
  },
  {
    opus: "mb7",
    title: "Magis habent virtutem VII - Rabenmutterfestzauberlied",
    date: "2018",
    w: 11241,
    h: 8105,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb7/cartel-fr.jpg",
    url: "https://madmeg.org/mb7/",
    start: "5/0.347/0.186",
    print: "https://madmeg.org/mb7/madmeg-mb7.pdf"
  },
  {
    opus: "mb8",
    title: "Magis habent virtutem VIII - Ut se cogite qui in villam",
    date: "2018",
    w: 11833,
    h: 8530,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb8/cartel-fr.jpg",
    url: "https://madmeg.org/mb8/",
    start: "5/0.234/0.593",
    print: "https://madmeg.org/mb8/madmeg-mb8.pdf"
  },
  {
    opus: "mb9",
    title: "Magis habent virtutem IX - Lumina Elementa Exordii Mulieribus",
    date: "2018",
    w: 8049,
    h: 9945,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/mb9/cartel-fr.jpg",
    url: "https://madmeg.org/mb9/",
    start: "5/0.147/0.277",
    print: "https://madmeg.org/mb9/madmeg-mb9.pdf"
  },
  {
    opus: "megeres",
    title: "Mégères",
    date: "2019-2020",
    w: 30000,
    h: 10457,
    s: 512,
    minZ: 2.488,
    addZ: 0.2,
    cartel: "https://madmeg.org/megeres/cartel-fr.jpg",
    url: "https://madmeg.org/megeres/",
    start: "2.488/0.2/0.463"
  },
  {
    opus: "p1",
    title: "Patriarche n°1",
    date: "2017",
    w: 7756,
    h: 22645,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p1/cartel-fr.jpg",
    url: "https://madmeg.org/p1/",
    start: "6/0.27/0.179"
  },
  {
    opus: "p136",
    title: "Patriarche n°136",
    date: "",
    w: 10425,
    h: 12979,
    s: 512,
    minZ: 0,
    start: "5.92/0.259/0.347",
    cartel: "https://madmeg.org/p136/cartel-fr.jpg",
    url: "https://madmeg.org/p136/"
  },
  {
    opus: "p137",
    title: "Patriarche n°137",
    date: "",
    w: 9791,
    h: 17644,
    s: 512,
    minZ: 0,
    start: "6.4/0.28/0.1",
    cartel: "https://madmeg.org/p137/cartel-fr.jpg",
    url: "https://madmeg.org/p137/"
  },
  {
    opus: "p138",
    title: "Patriarche n°138",
    date: "",
    w: 17236,
    h: 21818,
    s: 512,
    minZ: 0,
    start: "5.68/0.275/0.294",
    cartel: "https://madmeg.org/p138/cartel-fr.jpg",
    url: "https://madmeg.org/p138/"
  },
  {
    opus: "p15",
    title: "Patriarche n°15",
    date: "2018",
    w: 9504,
    h: 24768,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p15/cartel-fr.jpg",
    url: "https://madmeg.org/p15/",
    start: "4/0.13/0.14"
  },
  {
    opus: "p17",
    title: "Patriarche n°17",
    date: "2016",
    w: 17206,
    h: 26796,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p17/cartel-fr.jpg",
    url: "https://madmeg.org/p17/",
    start: "5/0.334/0.194"
  },
  {
    opus: "p178",
    title: "Patriarche n°178 - Le Soldat",
    date: "2017",
    w: 7059,
    h: 15319,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p178/cartel-fr.jpg",
    url: "https://madmeg.org/p178/",
    start: "4/0.11/0.2"
  },
  {
    opus: "p2",
    title: "Patriarche n°2",
    date: "2016",
    w: 9100,
    h: 23682,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p2/cartel-fr.jpg",
    url: "https://madmeg.org/p2/",
    start: "4/0.13/0.14"
  },
  {
    opus: "p216",
    title: "Patriarche n°216",
    date: "2013",
    w: 18836,
    h: 25451,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p216/cartel-fr.jpg",
    url: "https://madmeg.org/p216/",
    start: "6/0.34/0.323"
  },
  {
    opus: "p22",
    title: "Patriarche n°22",
    date: "2018",
    w: 9266,
    h: 27327,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p22/cartel-fr.jpg",
    url: "https://madmeg.org/p22/",
    start: "6/0.173/0.075"
  },
  {
    opus: "p24",
    title: "Patriarche n°24 - Le pêcheur",
    date: "2017",
    w: 12842,
    h: 24401,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p24/cartel-fr.jpg",
    url: "https://madmeg.org/p24/",
    start: "6/0.327/0.139"
  },
  {
    opus: "p3",
    title: "Patriarche n°3",
    date: "2017",
    w: 8413,
    h: 24341,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p3/cartel-fr.jpg",
    url: "https://madmeg.org/p3/",
    start: "6/0.305/0.151"
  },
  {
    opus: "p37",
    title: "Patriarche n°37",
    date: "",
    w: 10933,
    h: 25700,
    s: 256,
    minZ: 1,
    start: "3/0.24/0.11",
    cartel: "https://madmeg.org/p37/cartel-fr.jpg",
    url: "https://madmeg.org/p37/"
  },
  {
    opus: "p40",
    title: "Patriarche 40",
    date: "2016",
    w: 9505,
    h: 26273,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p40/cartel-fr.jpg",
    url: "https://madmeg.org/p40/",
    start: "7/0.297/0.12"
  },
  {
    opus: "p5",
    title: "Patriarche n°5",
    date: "2017",
    w: 9076,
    h: 23479,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p5/cartel-fr.jpg",
    url: "https://madmeg.org/p5/",
    start: "5/0.272/0.243"
  },
  {
    opus: "p6",
    title: "Patriarche n°6",
    date: "2018",
    w: 13278,
    h: 21013,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p6/cartel-fr.jpg",
    url: "https://madmeg.org/p6/",
    start: "6/0.334/0.259"
  },
  {
    opus: "p63498",
    title: "Patriarche 63498",
    date: "2013",
    w: 8589,
    h: 25531,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p63498/cartel-fr.jpg",
    url: "https://madmeg.org/p63498/",
    start: "7/0.136/0.133"
  },
  {
    opus: "p7",
    title: "Patriarche n°7",
    date: "2018",
    w: 13866,
    h: 22387,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/p7/cartel-fr.jpg",
    url: "https://madmeg.org/p7/",
    start: "5/0.308/0.227"
  },
  {
    opus: "p8",
    title: "Patriarche n°8",
    date: "",
    w: 9148,
    h: 12324,
    s: 512,
    minZ: 0,
    start: "6/0.692/0.173",
    cartel: "https://madmeg.org/p8/cartel-fr.jpg",
    url: "https://madmeg.org/p8/"
  },
  {
    opus: "p81",
    title: "Patriarche n°81",
    date: "",
    w: 10142,
    h: 22259,
    s: 512,
    minZ: 1,
    start: "5.37/0.312/0.126",
    cartel: "https://madmeg.org/p81/cartel-fr.jpg",
    url: "https://madmeg.org/p81/"
  },
  {
    opus: "patriarche4",
    title: "Patriarche n°4",
    date: "2013",
    w: 10678,
    h: 23858,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/patriarche4/cartel-fr.jpg",
    url: "https://madmeg.org/p4/",
    start: "6/0.216/0.228"
  },
  {
    opus: "phoque",
    title: "Le Phoque mort",
    date: "2014",
    w: 8595,
    h: 16803,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/phoque/cartel-fr.jpg",
    url: "https://madmeg.org/phoque/",
    start: "6/0.267/0.131"
  },
  {
    opus: "roy",
    title: "La chambre du Roy",
    date: "2015",
    w: 9657,
    h: 18495,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/roy/cartel-fr.jpg",
    url: "https://madmeg.org/roy/",
    start: "6/0.249/0.151"
  },
  {
    opus: "scopte",
    title: "Scopte",
    date: "2020",
    w: 18344,
    h: 11000,
    s: 512,
    minZ: 2.5,
    start: "5.728/0.052/0.283",
    cartel: "https://madmeg.org/scopte/cartel-fr.jpg",
    url: "https://madmeg.org/scopte/"
  },
  {
    opus: "shanghai",
    title: "Shanghai",
    date: "2010",
    w: 16384,
    h: 4406,
    s: 256,
    wrap: true,
    translateExtent: "[[-180000, -0.52], [180000, -0.1]]",
    minZ: 3,
    start: "5/0.044/0.674",
    cartel: "https://madmeg.org/shanghai/cartel-fr.jpg",
    url: "https://madmeg.org/shanghai/"
  },
  {
    opus: "simone",
    title: "Simone de Beauvoir",
    date: "2016",
    w: 10928,
    h: 16148,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/simone/cartel-fr.jpg",
    url: "https://madmeg.org/simone/",
    start: "6/0.782/0.402"
  },
  {
    opus: "weinstein",
    title: "Le sabat des Erinyes",
    date: "2018",
    w: 9538,
    h: 11706,
    s: 256,
    minZ: 1,
    addZ: 0.2,
    cartel: "https://madmeg.org/weinstein/cartel-fr.jpg",
    url: "https://madmeg.org/weinstein/",
    start: "4/0.11/0.34"
  },
  {
    opus: "zuckerberk",
    title: "Zuckerberk",
    date: "2017",
    w: 24543,
    h: 33750,
    s: 256,
    minZ: 2,
    addZ: 0.2,
    cartel: "https://madmeg.org/zuckerberk/cartel-fr.jpg",
    url: "https://madmeg.org/zuckerberk/",
    start: "7/0.294/0.199"
  }
]
)});
  main.variable(observer("dimensions")).define("dimensions", ["settings","opus"], function(settings,opus){return(
settings.filter(d => d.opus === opus)[0]
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
  const r = dimensions.referentiel || 2;
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
  background-image: url(https://madmeg.org/webapp-next/images/icon-zoom-in.png);
}
button.zoom-out {
  background-image: url(https://madmeg.org/webapp-next/images/icon-zoom-out.png);
}
button.cartel {
  background-image: url(https://madmeg.org/webapp-next/images/icon-cartel.png);
}
button.fullscreen {
  background-image: url(https://madmeg.org/webapp-next/images/icon-fullscreen.png);
}
button.home {
  background-image: url(https://madmeg.org/webapp-next/images/icon-home.png);
  height: 60px;
}
button.shop {
  background-image: url(https://madmeg.org/webapp-next/images/icon-shop.png);
}
button.video {
  background-image: url(https://madmeg.org/webapp-next/images/icon-video.png);
  background-size: cover;
}
button.print {
  background-image: url(https://madmeg.org/webapp-next/images/icon-print.png);
}
button.info {
  background-image: url(https://madmeg.org/webapp-next/images/icon-infos.png);
}
button.fold {
  background-image: url(https://madmeg.org/webapp-next/images/icon-fold.png);
}
button.playlist {
  background-image: url(https://madmeg.org/webapp-next/images/icon-playlist.png);
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
  main.variable(observer("addDetails")).define("addDetails", ["addInfo"], function(addInfo){return(
function addDetails(node, canvas) {
  return addInfo(node, canvas, 'cartel');
}
)});
  main.variable(observer("addInfo")).define("addInfo", ["dimensions","d3"], function(dimensions,d3){return(
function addInfo(node, canvas, type) {
  const src = dimensions[type];
  if (!src) return;

  const details = d3
    .select(node)
    .insert("div", "canvas")
    .attr("class", "details")
    .append("div")
    .attr("class", "bg")
    .on("click", hide);

  d3.select(document.documentElement).on(`keydown.esc${type}`, e => {
    if ((e.keyCode || e.which) === 27) {
      console.log("esc");
      hide();
    }
  });

  details.node().show = function() {
    console.log("showing", src);
    details
      .style("width", `${node.clientWidth + 16}px`)
      .style("height", `${node.clientHeight}px`)
      .style("display", "flex")
      .html("");
    const im = details
      .append("div")
      .attr("class", type)
      .append("img")
      .attr("src", src);
    im.style("max-width", `${Math.min(600, node.clientWidth) - 20}px`);
  };

  details.node().hide = hide;

  hide();

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
      zoom.translateExtent(JSON.parse(dimensions.translateExtent));

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
        typeof dimensions.start === "object"
          ? dimensions.start
          : (dimensions.start || "").split("/"),
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
  main.variable(observer("url")).define("url", ["tileroot"], function(tileroot){return(
(x, y, z) => `${tileroot}/${z}/${x}/${y}.png`
)});
  main.variable(observer("tileroot")).define("tileroot", ["tilehost","opus","dimensions"], function(tilehost,opus,dimensions){return(
`${tilehost}/tiles/${opus}/${dimensions.s}`
)});
  main.variable(observer("tilehost")).define("tilehost", ["dodebug"], function(dodebug){return(
dodebug
  ? "https://madmeg.org"
  : "https://d369222diwx7zl.cloudfront.net"
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
function addControls(node, canvas, details, info, overlay) {
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

  if (details)
    bar2
      .append("button")
      .text("?")
      .classed("cartel", true)
      .on("click", () => details.show());

  if (info)
    bar2
      .append("button")
      .text("info")
      .classed("info", true)
      .on("click", () => {
        console.log(info);
        info.show();
      });

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

  if (dimensions.print)
    bar2
      .append("a")
      .attr("href", dimensions.print)
      .append("button")
      .text("print")
      .classed("print", true);

  if (dimensions.fold)
    bar2
      .append("a")
      .attr("href", dimensions.fold)
      .append("button")
      .text("fold")
      .classed("fold", true);

  if (dimensions.playlist)
    bar2
      .append("a")
      .attr("href", dimensions.playlist)
      .append("button")
      .text("playlist")
      .classed("playlist", true);

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
