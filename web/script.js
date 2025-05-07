function runEnigma() {
  const input = document.getElementById("inputText").value;
  const plugboard = document.getElementById("plugboard").value;

  const rotorTypes = [
    document.getElementById("rotor1-type").value,
    document.getElementById("rotor2-type").value,
    document.getElementById("rotor3-type").value
  ].join(" ");

  const rotorPositions = [
    document.getElementById("rotor1-position").value,
    document.getElementById("rotor2-position").value,
    document.getElementById("rotor3-position").value
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
