let jugadas = 6;
let verde = "#43AA8B";
const BUTTON = document.getElementById("guess-button");
BUTTON.addEventListener("click", intentar);

let palabraOculta = '';  

// Función para obtener una palabra aleatoria de la API
function obtenerPalabraDesdeAPI() {
  const API = "https://random-word-api.herokuapp.com/word?length=5&lang=es";

  return fetch(API)
    .then(response => response.json())
    .then(data => {
      return data[0].toUpperCase();  
    })
    .catch(error => {
      console.log("Error al obtener la palabra desde la API:", error);
       
      return obtenerPalabraDeDiccionario();  
    });
}

// Al inicio del juego, obtener la palabra oculta
obtenerPalabraDesdeAPI().then(palabra => {
  palabraOculta = palabra;  
  console.log("Palabra oculta inicial:", palabraOculta);  
  BUTTON.disabled = false;  
});

function intentar() {
  const INTENTO = document.getElementById("guess-input").value.trim().toUpperCase();

  // Verificar la longitud de la palabra
  if (INTENTO.length !== 5) {
    document.getElementById("error-message").textContent = "La palabra debe tener exactamente 5 letras.";
    return; 
  } else {
    document.getElementById("error-message").textContent = "";  
  }

  jugadas--;
  document.getElementById("intentos-numero").textContent = jugadas;

  // Deshabilitar el botón si se agotaron los intentos
  if (jugadas === 0) {
    terminar("PERDISTE!😖");
    return;  
  }

  if (palabraOculta === INTENTO) {
    mostrarPalabraAdivinada(INTENTO);
    terminar("GANASTE!😀");
    return;  
  }

  // Algoritmo para mostrar las letras
  mostrarPalabraAdivinada(INTENTO);
}

function mostrarPalabraAdivinada(adivinanza) {
  let fila = document.createElement("div");
  fila.className = "row";
  for (let i = 0; i < 5; i++) {
    let letra = document.createElement("span");
    letra.className = "letter";
    letra.innerText = adivinanza[i];
    fila.appendChild(letra);
    if (adivinanza[i] === palabraOculta[i]) {
      letra.style.background = verde;
    } else if (palabraOculta.includes(adivinanza[i])) {
      letra.style.background = "#F2DD6E";
    } else {
      letra.style.background = "#495D63";
    }
  }
  let grilla = document.getElementById("grid");
  grilla.appendChild(fila);
}

function terminar(mensaje) {
  const INPUT = document.getElementById("guess-input");
  INPUT.disabled = true;
  BUTTON.disabled = true;
  let p = document.getElementById("guesses");
  p.innerHTML = "<h1>" + mensaje + "</h1>";
  if (mensaje.includes("PERDISTE!😖")) {
    p.innerHTML += "<p>La palabra era: " + palabraOculta + "</p>";
  }
  // Botón de "Volver a Jugar"
  let restartButton = document.createElement("button");
  restartButton.textContent = "Volver a Jugar";
  restartButton.classList.add("restart-button");
  restartButton.addEventListener("click", reiniciarJuego);
  p.appendChild(restartButton);
}

function reiniciarJuego() {
  // Resetear variables y elementos
  jugadas = 6;
  document.getElementById("intentos-numero").textContent = jugadas;
  document.getElementById("guess-input").value = "";
  document.getElementById("grid").innerHTML = "";
  document.getElementById("guesses").innerHTML = "";
  document.getElementById("error-message").textContent = "";  

  // Obtener una nueva palabra oculta al reiniciar el juego
  obtenerPalabraDesdeAPI().then(palabra => {
    palabraOculta = palabra;  
    console.log("Palabra oculta reiniciada:", palabraOculta); 
  });

  document.getElementById("guess-input").disabled = false;
  document.getElementById("guess-button").disabled = false;
}