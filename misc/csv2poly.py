#! /usr/bin/env python

import sys
import csv
import numpy

def main():
    if len(sys.argv) > 1:
        in_file = sys.argv[1][:]
    else:
        sys.exit(-1)

    with open(in_file, 'r') as f:
        r = csv.reader(f)
        lines = list(r)

    x = []
    y = []
    for p in lines:
        x.append(float(p[0]))
        y.append(float(p[1]))

    for deg in [2, 3, 4, 5]:
        p = numpy.poly1d(numpy.polyfit(x, y, deg=deg))
        print(p)


if __name__ == "__main__":
    main()
