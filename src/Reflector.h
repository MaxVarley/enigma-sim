#pragma once
#include <string>

class Reflector {
    public:
        Reflector(std::string wiring);
        char reflect(char c);

    private:
        std::string wiring_;
};