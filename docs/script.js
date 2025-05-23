function runEnigma() {
  const input = document.getElementById("inputText").value;
  const plugboard = document.getElementById("plugboard").value;

const reflectors = {
  A: "EJMZALYXVBWFCRQUONTSPIKHGD",
  B: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
  C: "FVPJIAOYEDRZXWGCTKUQSBNMHL"
};

function getSelectedReflectorWiring() {
  const selected = document.getElementById("reflector-type").value;
  return reflectors[selected];
}

  const rotorTypes = [
    document.getElementById("rotor1-type").value,
    document.getElementById("rotor2-type").value,
    document.getElementById("rotor3-type").value
  ].join(" ");

  const rotorPositions = [
    document.querySelector("#rotor1-letter-window .shown").textContent,
    document.querySelector("#rotor2-letter-window .shown").textContent,
    document.querySelector("#rotor3-letter-window .shown").textContent
  ].join("");
  
  const ringSettings = [
    document.querySelector("#rotor1-ring-window .shown").textContent,
    document.querySelector("#rotor2-ring-window .shown").textContent,
    document.querySelector("#rotor3-ring-window .shown").textContent
  ].map(s => String(parseInt(s, 10) - 1).padStart(2, '0')).join(" ");  

  const encrypt = Module.cwrap("encryptMessage", "string", [
    "string", "string", "string", "string", "string", "string"
  ]);

  const reflectorWiring = getSelectedReflectorWiring();

  const result = encrypt(input, rotorTypes, rotorPositions, ringSettings, plugboard, reflectorWiring);
  document.getElementById("output").value = result;
}

Module.onRuntimeInitialized = () => {
  document.querySelector("button").disabled = false;
};

document.addEventListener("DOMContentLoaded", () => {

  function getColor(index) {
    const colors = [
      '#d32f2f', '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
      '#00796b', '#c2185b', '#512da8', '#455a64', '#5d4037',
      '#303f9f', '#0097a7', '#689f38'
    ];
    return colors[index % colors.length];
  }

  //  Tabs
  const tabs = document.querySelectorAll(".tabs ul li");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("is-active"));
      contents.forEach(c => c.classList.add("is-hidden"));

      tab.classList.add("is-active");
      contents[i].classList.remove("is-hidden");
    });
  });

  const animateAndSet = (windowEl, newVal, direction) => {
    const shownEl = windowEl.querySelector(".shown");
    const hiddenEl = windowEl.querySelector(".hidden");
  
    // Prepare hidden element
    hiddenEl.textContent = newVal;
    hiddenEl.style.transition = "none";
    hiddenEl.style.transform = direction === "up" ? "translateY(100%)" : "translateY(-100%)";
    hiddenEl.style.opacity = "0";
  
    void hiddenEl.offsetWidth; // force reflow
  
    // Animate both
    shownEl.style.transition = "transform 0.2s ease, opacity 0.2s ease";
    hiddenEl.style.transition = "transform 0.2s ease, opacity 0.2s ease";
  
    shownEl.style.transform = direction === "up" ? "translateY(-100%)" : "translateY(100%)";
    shownEl.style.opacity = "0";
  
    hiddenEl.style.transform = "translateY(0)";
    hiddenEl.style.opacity = "1";
  
    setTimeout(() => {
      shownEl.classList.remove("shown");
      shownEl.classList.add("hidden");
  
      hiddenEl.classList.remove("hidden");
      hiddenEl.classList.add("shown");
    }, 200);

    
  };
  

  // Rotor Spinners
  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  document.querySelectorAll(".rotor-spin").forEach(spinner => {
    const rotorId = spinner.dataset.rotor;
    const windowEl = document.getElementById(rotorId + "-letter-window");
    const display = windowEl.querySelector(".shown");
    let index = alphabet.indexOf(display?.textContent.trim());
    if (index === -1) index = 0;
  
    spinner.querySelector(".rotor-btn.up").addEventListener("click", () => {
      index = (index - 1 + 26) % 26;
      animateAndSet(windowEl, alphabet[index], "up");
    });
  
    spinner.querySelector(".rotor-btn.down").addEventListener("click", () => {
      index = (index + 1) % 26;
      animateAndSet(windowEl, alphabet[index], "down");
    });
  });
  
  

  // Ring Spinners
  document.querySelectorAll(".ring-spin").forEach(spinner => {
    const ringId = spinner.dataset.ring;
    const windowEl = document.getElementById(ringId + "-ring-window");
    const display = windowEl.querySelector(".shown");
    let parsed = parseInt(display?.textContent.trim(), 10);
    let index = isNaN(parsed) ? 0 : parsed - 1;
  
    spinner.querySelector(".rotor-btn.up").addEventListener("click", () => {
      index = (index - 1 + 26) % 26;
      animateAndSet(windowEl, String(index + 1).padStart(2, '0'), "up");
    });
  
    spinner.querySelector(".rotor-btn.down").addEventListener("click", () => {
      index = (index + 1) % 26;
      animateAndSet(windowEl, String(index + 1).padStart(2, '0'), "down");
    });
  });

  // Plugboard setup
  const plugboardContainer = document.getElementById("plugboard-ui");
  const hiddenPlugboard = document.getElementById("plugboard");
  const plugPairs = {};
  let pairIndex = 0;
  const pairColors = {};
  let selected = null;

  const updatePlugboardString = () => {
    const pairs = Object.entries(plugPairs).filter(([a, b]) => a < b);
    hiddenPlugboard.value = pairs.map(([a, b]) => a + b).join(" ");
  };

  [...Array(26)].forEach((_, i) => {
    const letter = String.fromCharCode(65 + i);
    const btn = document.createElement("button");
    btn.className = "button";
    btn.textContent = letter;

    btn.addEventListener("click", () => {
      if (plugPairs[letter]) {
        const other = plugPairs[letter];
        delete plugPairs[letter];
        delete plugPairs[other];
        delete pairColors[letter];
        delete pairColors[other];
      
        const otherBtn = document.querySelector(`[data-letter='${other}']`);
        otherBtn.classList.remove("paired");
        otherBtn.style.backgroundColor = "";
      
        btn.classList.remove("paired");
        btn.style.backgroundColor = "";
      
        updatePlugboardString();
        return;
      }

      if (selected === letter) {
        selected = null;
        btn.classList.remove("selected");
        return;
      }

      if (selected === null) {
        selected = letter;
        btn.classList.add("selected");
      } else {
        // Create pair
        plugPairs[selected] = letter;
        plugPairs[letter] = selected;

        const color = getColor(pairIndex++);
        pairColors[selected] = color;
        pairColors[letter] = color;

        const firstBtn = document.querySelector(`[data-letter='${selected}']`);
        firstBtn.classList.remove("selected");
        firstBtn.classList.add("paired");
        firstBtn.style.backgroundColor = color;

        btn.classList.add("paired");
        btn.style.backgroundColor = color;


        selected = null;
        updatePlugboardString();
      }
    });

    btn.setAttribute("data-letter", letter);
    plugboardContainer.appendChild(btn);
  });
   

});

