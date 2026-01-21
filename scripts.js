// ======================
// SELETORES
// ======================
const inputTexto = document.querySelector(".input-texto");
const idiomaSel = document.querySelector(".idioma");
const btnTraduzir = document.querySelector("#btn-traduzir");
const btnMic = document.querySelector("#btn-mic");
const btnFalar = document.querySelector("#btn-falar");
const traducaoP = document.querySelector(".traducao");

// ======================
// MAPA DE IDIOMAS
// ======================
const LANG_CODES = {
  "Inglês": "en",
  "Japonês": "ja",
  "Mandarim": "zh-CN",
  "Português": "pt-BR"
};

// ======================
// TRADUÇÃO
// ======================
btnTraduzir.addEventListener("click", traduzir);

async function traduzir() {
  const texto = inputTexto.value.trim();

  if (!texto) {
    traducaoP.textContent = "Digite ou fale algo para traduzir.";
    return;
  }

  const origem = "pt-BR";
  const destino = LANG_CODES[idiomaSel.value] || "en";

  traducaoP.textContent = "Traduzindo...";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      texto
    )}&langpair=${origem}|${destino}`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    traducaoP.textContent =
      dados?.responseData?.translatedText || "Erro na tradução.";
  } catch (erro) {
    traducaoP.textContent = "Erro ao traduzir.";
    console.error(erro);
  }
}

// ENTER traduz
inputTexto.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    traduzir();
  }
});

// ======================
// MICROFONE (VOZ → TEXTO)
// ======================
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.interimResults = false;

  btnMic.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onstart = () => {
    btnMic.classList.add("ouvindo");
    traducaoP.textContent = "Ouvindo...";
  };

  recognition.onresult = (event) => {
    const textoFalado = event.results[0][0].transcript;
    inputTexto.value = textoFalado;
    traduzir(); // traduz automaticamente
  };

  recognition.onend = () => {
    btnMic.classList.remove("ouvindo");
  };

  recognition.onerror = () => {
    btnMic.classList.remove("ouvindo");
    traducaoP.textContent = "Erro ao usar o microfone.";
  };
} else {
  alert("Seu navegador não suporta microfone.");
}

// ======================
// VOZ (TEXTO → FALA)
// ======================
btnFalar.addEventListener("click", () => {
  const texto = traducaoP.textContent;
  if (!texto) return;

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = LANG_CODES[idiomaSel.value] || "en";
  speechSynthesis.speak(fala);
});
