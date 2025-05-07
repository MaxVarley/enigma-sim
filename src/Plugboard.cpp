#include "Plugboard.h"
#include <sstream>

/**
 * The Plugboard (or Steckerbrett) was used to swap pairs of letters before and after the rotor encryption.
 * The substitutions are symmetric, meaning if A is swapped with B, then B is swapped with A.
 * The format should be space-separated pairs of letters, e.g., "AB CD EF GH", where A is swapped with B, C with D, etc.
 * An Enigma machine without a plugboard (Unsteckerred) was far less secure than one with a plugboard (Steckerred).  
 */

Plugboard::Plugboard(const std::string& connections) {
    std::istringstream iss(connections); // Use string stream to parse the input string
    std::string pair;
    while (iss >> pair) {
        if (pair.size() == 2) {
            char a = pair[0];
            char b = pair[1];
            mapping_[a] = b;
            mapping_[b] = a; 
        }
    }
}

char Plugboard::substitute(char c) {
    if (mapping_.count(c)) return mapping_[c];
    return c; // return the character itself if no mapping exists
} 