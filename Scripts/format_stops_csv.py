#!/usr/bin/python3
import csv
import os
import sys


def run():
    csv_file = "Data/Stops2016Dec05.csv"
    os.chdir("..")
    path = os.path.join(os.getcwd(), os.path.normpath(csv_file))
    new_rows = []
    with open(path) as csv_fd:
        reader = csv.DictReader(csv_fd)

        # OrderedDict([('VoyageID', '1'), ('YearOfVoyage', '1836'), ('Stop01Location', 'Majunga'),
        # ('Stop01DateIn', ''), ('Stop01DateOut', ''), ('Stop01GoodsBought', ''), ('Stop01GoodsSold', ''),
        # ('Stop01Details', ''), ('Stop02Location', ''), ('Stop02DateIn', ''), ('Stop02DateOut', ''),
        # ('Stop02GoodsBought', ''), ('Stop02GoodsSold', ''), ('Stop02Details', ''), ('Stop03Location', ''),
        # ('Stop03DateIn', ''), ('Stop03DateOut', ''), ('Stop03GoodsBought', ''), ('Stop03GoodsSold', ''),
        # ('Stop03Details', ''), ('Stop04Location', ''), ('Stop04DateIn', ''), ('Stop04DateOut', ''),
        # ('Stop04GoodsBought', ''), ('Stop04GoodsSold', ''), ('Stop04Details', ''), ('Stop05Location', ''),
        # ('Stop05DateIn', ''), ('Stop05DateOut', ''), ('Stop05GoodsBought', ''), ('Stop05GoodsSold', ''),
        # ('Stop05Details', ''), ('Stop06Location', ''), ('Stop06DateIn', ''), ('Stop06DateOut', ''),
        # ('Stop06GoodsBought', ''), ('Stop06GoodsSold', ''), ('Stop06Details', ''), ('Stop07Location', ''),
        # ('Stop07DateIn', ''), ('Stop07DateOut', ''), ('Stop07GoodsBought', ''), ('Stop07GoodsSold', ''),
        # ('Stop07Details', ''), ('Stop08Location', ''), ('Stop08DateIn', ''), ('Stop08DateOut', ''),
        # ('Stop08GoodsBought', ''), ('Stop08GoodsSold', ''), ('Stop08Details', ''), ('Stop09Location', ''),
        # ('Stop09DateIn', ''), ('Stop09DateOut', ''), ('Stop09GoodsBought', ''), ('Stop09GoodsSold', ''),
        # ('Stop09Details', ''), ('Stop10Location', ''), ('Stop10DateIn', ''), ('Stop10DateOut', ''),
        # ('Stop10GoodsBought', ''), ('Stop10GoodsSold', ''), ('Stop10Details', '')])

        # TODO: parse row and reformat into multiple rows
        # TODO: fixup date into ISO format
        # TODO: write new rows to new_rows list
        for row in reader:
            print(row)
    return 0


if __name__ == "__main__":
    sys.exit(run())
