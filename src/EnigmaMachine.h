#pragma once
#include "Rotor.h"
#include "Plugboard.h"
#include "Reflector.h"
#include <vector>
#include <string>

class EnigmaMachine {
    public:
        EnigmaMachine(const std::vector<Rotor>& rotors, Reflector reflector, Plugboard plugboard);

        char encrypt(char c); 
        std::string encryptMessage(const std::string& message); 

        void stepRotors();

        void setReflector(const Reflector& reflector);

    private:
        std::vector<Rotor> rotors_;
        Reflector reflector_;
        Plugboard plugboard_;
};