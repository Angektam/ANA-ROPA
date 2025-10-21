#include <stdio.h>
#include <string.h>

int dfa_ab_star(const char* cadena) {
    int estado = 0;
    
    for (int i = 0; cadena[i] != '\0'; i++) {
        char c = cadena[i];
        
        switch (estado) {
            case 0:
                if (c == 'a') estado = 1;
                else return 0;
                break;
            case 1:
                if (c != 'b') return 0;
                break;
        }
    }
    return estado == 1;
}