#include "EnigmaMachine.h"
#include <cctype>

/**
 * The EnigmaMachine class represents the entire Enigma machine, which consists of rotors, a reflector, and a plugboard.
 * The rotors are stepped before each encryption to change the wiring configuration.
 * The reflector reflects the signal back through the rotors, ensuring that encryption and decryption are symmetric.
 * The plugboard allows for additional letter substitutions before and after the rotor encryption.
 */

EnigmaMachine::EnigmaMachine(const std::vector<Rotor>& rotors, Reflector reflector, Plugboard plugboard)
    : rotors_(rotors), reflector_(reflector), plugboard_(plugboard) {}

void EnigmaMachine::setReflector(const Reflector& reflector) {
    reflector_ = reflector;
}

void EnigmaMachine::stepRotors() {
    bool rightAtNotch = rotors_[0].atNotch();
    bool middleAtNotch = rotors_[1].atNotch();

    rotors_[0].step(); 

    if (middleAtNotch) {
        rotors_[1].step(); 
        rotors_[2].step();
    } else if (rightAtNotch) {
        rotors_[1].step(); 
    }
}

char EnigmaMachine::encrypt(char c) {
    if (!std::isalpha(c)) return c; 
    c= std::toupper(c); 

    // Note the rotors are stepped before encryption
    stepRotors(); 
    c = plugboard_.substitute(c); 

    for (auto& rotor : rotors_) c = rotor.forward(c);
    c = reflector_.reflect(c);
    for (auto it = rotors_.rbegin(); it != rotors_.rend(); ++it) c = it->backward(c);

    c = plugboard_.substitute(c);
    return c;
}

std::string EnigmaMachine::encryptMessage(const std::string& message) {
    std::string result;
    for (char c : message) {
        result += encrypt(c);
    }
    return result;
}