#include "Reflector.h"

/**
 * The Reflector (or Umkehrwalze/UKW) was used to reflect the signal back through the rotors.
 * The reflector ensured that encryption and decryption were symmetric, meaning the same settings could be used for both.
 * It also ensured that no letter could be encrypted to itself, which actually weakened the security of the machine.
*/

Reflector::Reflector(std::string wiring) : wiring_(wiring) {}

char Reflector::reflect(char c) {
    return wiring_[c - 'A'];
}