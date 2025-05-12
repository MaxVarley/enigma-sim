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
    parseInt(document.getElementById("rotor1-ring").value, 10) - 1,
    parseInt(document.getElementById("rotor2-ring").value, 10) - 1,
    parseInt(document.getElementById("rotor3-ring").value, 10) - 1
  ].map(n => String(n).padStart(2, '0')).join(" ");
  

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

  // Rotor Spinners
  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  document.querySelectorAll(".rotor-spin").forEach(spinner => {
    const rotorId = spinner.dataset.rotor + "-letter";
    const display = document.getElementById(rotorId);
    let index = 0;

    spinner.querySelector(".up").addEventListener("click", () => {
      index = (index - 1 + 26) % 26;
      display.textContent = alphabet[index];
    });

    spinner.querySelector(".down").addEventListener("click", () => {
      index = (index + 1) % 26;
      display.textContent = alphabet[index];
    });
  });
});

