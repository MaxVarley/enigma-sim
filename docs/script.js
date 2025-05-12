function runEnigma() {
  const input = document.getElementById("inputText").value;
  const plugboard = document.getElementById("plugboard").value;

  const rotorTypes = [
    document.getElementById("rotor1-type").value,
    document.getElementById("rotor2-type").value,
    document.getElementById("rotor3-type").value
  ].join(" ");

  const rotorPositions = [
    document.getElementById("rotor1-letter").textContent,
    document.getElementById("rotor2-letter")?.textContent || "A",
    document.getElementById("rotor3-letter")?.textContent || "A"
  ].join("");
  
  // Convert rotor positions to zero-based index
  const ringSettings = [
    document.getElementById("rotor1-ring").textContent,
    document.getElementById("rotor2-ring").textContent,
    document.getElementById("rotor3-ring").textContent
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

  const animateAndSet = (el, newVal, direction) => {
    const className = direction === "up" ? "spin-up" : "spin-down";
    el.classList.add(className);
    setTimeout(() => {
      el.textContent = newVal;
      el.classList.remove(className);
    }, 150); // duration matches your CSS transition
  };  

  // Rotor Spinners
  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  document.querySelectorAll(".rotor-spin").forEach(spinner => {
    const rotorId = spinner.dataset.rotor + "-letter";
    const display = document.getElementById(rotorId);
    let index = alphabet.indexOf(display.textContent.trim()); // start at shown letter

    spinner.querySelector(".rotor-btn.up").addEventListener("click", () => {
      index = (index - 1 + 26) % 26;
      animateAndSet(display, alphabet[index], "up");

    });

    spinner.querySelector(".rotor-btn.down").addEventListener("click", () => {
      index = (index + 1) % 26;
      animateAndSet(display, alphabet[index], "down");

    });
  });

  // Ring Spinners
  document.querySelectorAll(".ring-spin").forEach(spinner => {
    const ringId = spinner.dataset.ring + "-ring";
    const display = document.getElementById(ringId);
    let index = parseInt(display.textContent, 10) - 1 || 0;

    spinner.querySelector(".rotor-btn.up").addEventListener("click", () => {
      index = (index - 1 + 26) % 26;
      animateAndSet(display, String(index + 1).padStart(2, '0'), "up");
    });

    spinner.querySelector(".rotor-btn.down").addEventListener("click", () => {
      index = (index + 1) % 26;
      animateAndSet(display, String(index + 1).padStart(2, '0'), "down");
    });
  });

});

