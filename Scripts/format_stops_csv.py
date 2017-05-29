#!/usr/bin/python3
import csv
import sys


def run():
    csv_file = "Stops2016Dec05.csv"
    new_rows = []
    with open(csv_file) as csv:
        reader = csv.DictReader(csv)
        for row in reader:
            print(row)

    return 0

if __name__ == "__main__":
    sys.exit(run())