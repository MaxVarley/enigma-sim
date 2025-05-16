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
                      const std::string& plugboardPairs,
                      const std::string& reflectorWiring) {

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

    // reflector wiring
    Reflector reflector(reflectorWiring);
    Plugboard plugboard(plugboardPairs);

    EnigmaMachine machine(rotors, reflector, plugboard);
    return machine.encryptMessage(input);
}

#ifdef __EMSCRIPTEN__
extern "C" {
EMSCRIPTEN_KEEPALIVE
const char* encryptMessage(const char* input,
                           const char* rotorOrder,
                           const char* positions,
                           const char* ringSettings,
                           const char* plugboardPairs,
                           const char* reflectorWiring) {

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

    output = runEnigma(input, rotorNames, positionsVec, rings, plugboardPairs, reflectorWiring);
    return output.c_str();
}
}
#endif