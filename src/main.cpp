#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <sstream>

#include "Rotor.h"
#include "Reflector.h"
#include "Plugboard.h"
#include "EnigmaMachine.h"

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

std::string runEnigma(const std::string& input,
                      const std::vector<std::string>& rotorOrder,
                      const std::vector<char>& rotorPositions,
                      const std::vector<int>& ringSettings,
                      const std::string& plugboardPairs) {

    // Historically accurate rotor wirings and notches
    std::map<std::string, std::pair<std::string, char>> rotorDefs = {
        {"I",   {"EKMFLGDQVZNTOWYHXUSPAIBRCJ", 'Q'}},
        {"II",  {"AJDKSIRUXBLHWTMCQGZNPYFVOE", 'E'}},
        {"III", {"BDFHJLCPRTXVZNYEIWGAKMUSQO", 'V'}},
        {"IV",  {"ESOVPZJAYQUIRHXLNFTGKDCMWB", 'J'}},
        {"V",   {"VZBRGITYUPSDNHLXAWMJQOFECK", 'Z'}}
    };

    // Build rotors based on the provided rotor order and settings
    std::vector<Rotor> rotors;
    for (size_t i = 0; i < rotorOrder.size(); ++i) {
        auto [wiring, notch] = rotorDefs[rotorOrder[i]];
        rotors.emplace_back(wiring, notch, ringSettings[i], rotorPositions[i]);
    }

    // Hardcoded reflector wiring (UKW-B)
    // This is a common reflector used in the Enigma machine.
    Reflector reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT");
    Plugboard plugboard(plugboardPairs);

    EnigmaMachine machine(rotors, reflector, plugboard);
    return machine.encryptMessage(input);
}

#ifdef __EMSCRIPTEN__
extern "C" {
EMSCRIPTEN_KEEPALIVE
const char* encryptMessage(const char* input,
                           const char* rotorOrder,     // e.g. "I II III"
                           const char* positions,      // e.g. "ABC"
                           const char* ringSettings,   // e.g. "01 02 03"
                           const char* plugboardPairs) // e.g. "AB CD"
{
    static std::string output;

    // Parse rotor order
    std::vector<std::string> rotorNames;
    std::istringstream rStream(rotorOrder);
    std::string r;
    while (rStream >> r) rotorNames.push_back(r);

    // Parse rotor positions
    std::vector<char> positionsVec;
    for (int i = 0; positions[i]; ++i) {
        positionsVec.push_back(positions[i]);
    }

    // Parse ring settings
    std::vector<int> rings;
    std::istringstream ringStream(ringSettings);
    int ring;
    while (ringStream >> ring) rings.push_back(ring);

    output = runEnigma(input, rotorNames, positionsVec, rings, plugboardPairs);
    return output.c_str();
}
}
#endif

// Console mode for local testing
#ifndef __EMSCRIPTEN__
int main() {
    std::string input;
    std::cout << "Enter message (A-Z only): ";
    std::getline(std::cin, input);

    // Testing with hardcoded values
    std::string encrypted = runEnigma(
        input,
        {"I", "II", "III"},
        {'A', 'A', 'A'},
        {0, 0, 0},
        "AB CD EF GH"
    );

    std::cout << "Encrypted: " << encrypted << "\n";
    std::cin.get();
    return 0;
}
#endif
