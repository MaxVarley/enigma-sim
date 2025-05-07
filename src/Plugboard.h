#pragma once
#include <unordered_map>
#include <string>

class Plugboard {
    public:
        Plugboard(const std::string& connections);
        char substitute(char c);

    private:
        std::unordered_map<char, char> mapping_;
};