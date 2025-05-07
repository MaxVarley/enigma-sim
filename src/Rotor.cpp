#include "Rotor.h"

/**
 * The Rotor class represents a single rotor in the Enigma machine.
 * Each rotor has a specific wiring configuration, a notch position, a ring setting, and a current position.
 * The rotor settings (Rotor order, initial position, ring settings) were provided by a physical codebook entrusted to the operators.
 * Early machines used 
 */

Rotor::Rotor(std::string wiring, char notch, int ringSetting, char position)
    : wiring_(wiring), notch_(notch), ringSetting_(ringSetting), position_(position - 'A') {

        // Build the inverse wiring so that signals can be reversed
        inverseWiring_.resize(26);
        for (int from = 0; from < 26; ++from) {
            int to = wiring_[from] - 'A';
            inverseWiring_[to] = 'A' + from;
        }
    }

int Rotor::charToIndex(char c) const {
    return (c - 'A' + 26) % 26;
}

char Rotor::indexToChar(int i) const {
    return 'A' + (i + 26) % 26;
}

// Simulates a signal passing through the rotor in the forward direction.
char Rotor::forward(char c) {
    int shifted = (charToIndex(c) + position_ - ringSetting_ + 26) % 26;
    char mapped = wiring_[shifted]; // Map the character through the rotor's wiring
    int result = (charToIndex(mapped) - position_ + ringSetting_ + 26) % 26;
    return indexToChar(result);
}

// Simulates a signal passing through the rotor in the backward direction.
char Rotor::backward(char c) {
    int shifted = (charToIndex(c) + position_ - ringSetting_ + 26) % 26;
    char mapped = inverseWiring_[shifted]; // Map the character through the rotor's inverse wiring
    int result = (charToIndex(mapped) - position_ + ringSetting_ + 26) % 26;
    return indexToChar(result);
}

// The notch setting determines when the rotor will cause the next rotor to step.
void Rotor::step() {
    position_ = (position_ + 1) % 26;
}

bool Rotor::atNotch() const {
    return position_ == (notch_ - 'A');
}

char Rotor::getPosition() const {
    return indexToChar(position_);
}

