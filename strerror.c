#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void print(int num) { printf("Error %d: %s\n", num, strerror(num)); }

int main(int argc, char **argv) {
  if (argc >= 2) {
    print(atoi(argv[1]));
    return 0;
  }

  printf("# All error codes:\n");
  for (int i = 0; i < 255; i++) {
    print(i);
  }
}
