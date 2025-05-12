function runEnigma() {
  const input = document.getElementById("inputText").value;
  const plugboard = document.getElementById("plugboard").value;

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
  ].join(" ");
  

  const encrypt = Module.cwrap("encryptMessage", "string", [
    "string", "string", "string", "string", "string"
  ]);

  const result = encrypt(input, rotorTypes, rotorPositions, ringSettings, plugboard);
  document.getElementById("output").textContent = result;
}

Module.onRuntimeInitialized = () => {
  document.querySelector("button").disabled = false;
};

document.addEventListener("DOMContentLoaded", () => {
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
    const [shownEl, hiddenEl] = windowEl.querySelectorAll(".shown, .hidden");

    
    // Setup hidden element with new value
    hiddenEl.textContent = newVal;
    hiddenEl.style.transition = "none";
    hiddenEl.style.opacity = "0";
    hiddenEl.style.transform = direction === "up" ? "translateY(100%)" : "translateY(-100%)";
  
    // Force reflow
    void hiddenEl.offsetWidth;
  
    // Animate both elements
    shownEl.style.transition = "transform 0.2s ease, opacity 0.2s ease";
    hiddenEl.style.transition = "transform 0.2s ease, opacity 0.2s ease";
  
    shownEl.style.transform = direction === "up" ? "translateY(-100%)" : "translateY(100%)";
    shownEl.style.opacity = "0";
  
    hiddenEl.style.transform = "translateY(0)";
    hiddenEl.style.opacity = "1";
  
    // After animation, swap classes
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
    let parsed = parseInt(display.textContent.trim(), 10);
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

});

