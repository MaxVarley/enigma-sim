#pragma once
#include <string>

class Rotor {
    public:
        Rotor(std::string wiring, char notch, int ringSetting, char position);

        char forward(char c); // encrypt a character using the rotor's wiring
        char backward(char c); // decrypt a character using the rotor's wiring

        void step(); // step the rotor one position forward
        bool atNotch() const; // check if rotor is at notch position
        char getPosition() const; // get the current position of the rotor

    private:
        std::string wiring_;
        std::string inverseWiring_;
        char notch_;
        int ringSetting_; 
        int position_; // 0-25 for A-Z

        int charToIndex(char c) const; 
        char indexToChar(int i) const; 
};