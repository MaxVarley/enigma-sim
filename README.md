# Enigma Machine Simulator

An interactive Enigma machine simulator written in C++ and compiled to WebAssembly for browser use.

This project lets users experiment with the historic German Cipher machine, primarily used (and broken) during World War II. The simulator has configurable rotor order, ring settings, and plugboard options - all accessible via a web interface.

---

## Browser Demo

[Try it here on Github Pages](https://maxvarley.github.io/enigma-sim/)

---

### Features

- Up to 3 rotors based on historical wiring configuration (choose type, position, and ring settings)
- Reflector A, B, or C
- Configurable plugboard connections
- Runs entirely in browser via WebAssembly

---

## Tech Stack

- **C++** - core simulation logic
- **Emscripten** - compiles C++ to WebAssembly
- **JavaScript** - UI bindings and runtime control
- **HTML/CSS + Bulma** - Front-end
- **Github Pages** - Static Hosting

---

## Example Usage

Try these settings for a known enigma output:
| Setting        | Value         |
|----------------|---------------|
| Rotors         | III, II, I |
| Positions      | A, A, A       |
| Ring Settings  | 01, 01, 01    |
| Plugboard      | *(none)*     |
| Message        | AAAAA         |
| Output         | BDZGO         |

---

## License

This project is for educational use, you are welcome to modify or extend it.
