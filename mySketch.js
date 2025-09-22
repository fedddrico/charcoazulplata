const w = 100;
const h = 50;

const rate1 = 1;
const rate2 = 0.1;
const rate3 = 0.007;
const fric = 1.05;

const grid = [];
const velo = [];

let dropSound; // sonido global
let colorInicio, colorFin;


// 🔹 Array de textos para mostrar en orden
let textos = [
"cierre los ojos, y suelte su deseo en el pozo con un clic",
 "yo, por ejemplo, deseé hace un rato que mi perra no se muera nunca",
 "y, antes de eso, deseé que me pudiera abrazar",
 "porque yo abrazo a la perra pero la perra no me abraza",
 "no me abraza con el cuerpo porque no sabe abrazar con el cuerpo",
 "tiene las patas huesudas y duras",
 "y no le giran, como las mías, hacia algunos lados",
 "solo se flexionan en una dirección",
 "y en esa dirección no puede abarcar",
 "ni enredar",
 "ni atrapar",
 "ni entrelazar",
 "ni amarrar",
 "ni estrechar",
 "ni engarzar",
 "ni envoler",
 "a veces me abraza con los ojos, eso sí",
 "y yo se lo devuelvo con el cuerpo entero",
 "el abrazo, digo",
 "me acurruco y la envuelvo con los brazos",
 "y ella me recibe de espaldas, sentada, y levanta la cara y mira con el hocico al cielo",
 "yo la abrazo para que no se vaya",
 "porque últimamente todo se me va",
 "la perra se llama filipa",
 "¿puede imaginarse a filipa?",
 "yo sí, pero no sé usted",
 "filipa tiene el cuerpo grande, sobre todo el tórax",
 "creo que sería buena abrazando",
 "porque tiene mucho cuerpo",
 "el problema es que, además de mucho cuerpo, tiene muchas masas debajo de la piel",
 "por ahora ninguna está encima o adentro o en el centro de sus órganos",
"como las que le crecieron a su abuela, otra perra igualita y completamente distinta, que se murió de eso",
 "pero no, ella no tiene, por ejemplo, masas en sus pulmones",
 "y tampoco en su corazón, que debe ser grande",
 "no me refiero a su sensibilidad sino a su carne",
 "porque creo que su sensibilidad está es en el estómago",
 "pero su corazón yo creo que puede ser similar en tamaño al mío",
 "en carne, digo",
 "solo que ella es más pequeña que yo",
 "y eso que los dos somos paludos, como de mucho hueso",
 "el tema es que su corazón debe ser parecido al mío, en carne",
 "pero si lo vemos en relación al tamaño de su cuerpo, creo que su corazón es más grande",
 "porque yo soy más grande y el mío no es mucho más grande que el suyo",
 "igual no es por eso que deseo que no se me vaya",
 "podría tener el corazón del tamaño de un pollo, en carne",
 "o del tamaño de una persona, en sensibilidad",
 "podría ser así como es todo",
 "todo lo que hay",
 "minúsculo e insuficiente",
 "ridículo",
 "e igual desearía con cada clic que no se me fuera nunca",
 "me imagino que cuando se vaya se va a fundir",
 "porque en sus fichas médicas dice que su pelo es azul plata",
 "como si toda ella fuera de metal",
 "entonces asumo que cuando se muera se va a fundir",
 "se va a derretir",
 "y su carne metálica derretida va a formar un charco",
 "seguramente ahí en el jardín de la casa en la que siempre vivió",
 "o en el patio en el que le gustaba asolearse",
 "yo cierro los ojos y me la imagino así, hecha charco",
 "también me la imagino como fue cuando la conocí",
 "tres gotas de perra de metal",
 "pero ahora no, ahora sería un charco metálico brillante y espeso",
 "caprichoso y odioso",
 "intuitivo y desobediente y terco",
 "yo cierro los ojos y me le arrimo al charco",
 "que mientras me recibe va tirando el fondo hacia abajo mientras mira con le hocico al cielo",
 "y en un momento dejo de ver el charco y solo veo el vacío que tiene por dentro",
 "y siento que podría meter un brazo y no encontraría el fondo",
 "y podría meter las piernas y no encontraría el fondo",
 "y podría zambullirme entero y no encontraría el fondo",
 "y no meto ni el brazo ni las piernas ni el cuerpo entero",
 "porque me da miedo que después no encuentre la forma de vovler a salir",
 "y ahí en la orilla me imagino que ella, la perra, no es el deseo",
 "ningún deseo",
 "ella es el pozo",
 "en fín"
];
let textoIndex = 0; // índice actual

function preload() {
  dropSound = loadSound("DROP.mp3");
}

function setup() {
  createCanvas(2000, 1000);

  for (let i = 0; i < w; i++) {
    grid[i] = [];
    velo[i] = [];
    for (let j = 0; j < h; j++) {
      grid[i][j] = 0;
      velo[i][j] = 0;
    }
  }

  grid[25][25] = 1;
  velo[25][25] = -0.05;

  grid[10][12] = 1;
  velo[10][12] = -0.05;

  // Capa de grano
  pixelDensity(1); 
  grainLayer = createGraphics(width, height);
  grainLayer.loadPixels();
  for (let x = 0; x < grainLayer.width; x++) {
    for (let y = 0; y < grainLayer.height; y++) {
      let n = random(200, 255); 
      grainLayer.set(x, y, color(n, n, n, 20));
    }
  }
  grainLayer.updatePixels();

  reverb = new p5.Reverb();
  reverb.process(dropSound, 8, 8);

colorInicio = color(0, 0, 255);    // azul
colorFin = color('#aebbe3'); // azul plateado


}

let progresoColor = 0; // valor entre 0 y 1


function draw() {
  drawGrid();
  changePos();
  changeVelo();
  diffuseVelo();
  image(grainLayer, 0, 0);
}

function drawGrid() {
  noStroke();

  // color base interpolado según el progreso
  let baseColor = lerpColor(colorInicio, color(174, 187, 227, 255), progresoColor);

  // definir contraste de las ondas según el progreso (más gris = menos contraste)
  let contrasteMax = 200;  // cuando azul puro
  let contrasteMin = 80;   // cuando azul plateado
  let contraste = lerp(contrasteMax, contrasteMin, progresoColor);

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      // calcular color de cada celda, restando proporcional a la altura de la onda
      let r = red(baseColor) - grid[i][j] * contraste * 0.7;
      let g = green(baseColor) - grid[i][j] * contraste * 0.7;
      let b = blue(baseColor) - grid[i][j] * contraste; // mantener azul más dominante

      // limitar valores para que no se salgan de 0-255
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);

      fill(r, g, b);
      rect((i * width) / w, (j * height) / h, width / w, height / h);
    }
  }
}



function changePos() {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      grid[i][j] += rate1 * velo[i][j];
    }
  }
}

function changeVelo() {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      velo[i][j] += -1 * rate2 * grid[i][j];
      velo[i][j] *= fric;
    }
  }
}

function diffuseVelo() {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      diffuseVeloLocation(i, j);
    }
  }
}

function diffuseVeloLocation(x, y) {
  velo[x][y] *= 1 - 9 * rate3;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      velo[x][y] += rate3 * grid[(x + i + w) % w][(y + j + h) % h];
    }
  }
}

function mouseDragged() {
  updateGrid();
}

function mousePressed() {
  updateGrid();

  // 🔹 Cambiar texto en el div
  let divMensaje = document.getElementById("mensaje");
  textoIndex = (textoIndex + 1) % textos.length;
  divMensaje.textContent = textos[textoIndex];

  // 🔹 Sonido
  let vol = random(0.3, 0.7);
  let rate = random(0.9, 1.1);
  dropSound.setVolume(vol);
  dropSound.rate(rate);
  dropSound.play();

  progresoColor = constrain(textoIndex / (textos.length - 1), 0, 1);

}

function updateGrid() {
  let xVal = int((mouseX * w) / width);
  let yVal = int((mouseY * h) / height);
  grid[(xVal + w) % w][(yVal + h) % h] = 2;
}

let t,reset=()=>{clearTimeout(t);t=setTimeout(()=>location.reload(),120000)};
['click','keydown','scroll','mousemove','touchstart'].forEach(e=>addEventListener(e,reset));
reset();




