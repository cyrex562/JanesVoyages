#!/bin/python3
"""
@author Josh Madden <cyrex562@gmail.com>

"""
import argparse
import jsonpickle
import os
import pyexcel as pe
import sys

SHEET_NAME = "Sheet1"
IN_FILE_NAME = "19thCUSTradeInIO2016Dec05.xlsx"


def get_excel_sheet(in_file_name: str, sheet_name

: str = "Sheet1") -> pe.Sheet:
book = pe.get_book(file_name=in_file_name)
sheet1 = book[sheet_name]
return sheet1


def parse_sheet(sheet: pe.Sheet

) -> list:
"""
Parse a sheet object extracted from a spreadsheet using the pyexcel
library. Return a collection of dictionaries.
Currently sheets are named, Sheet1, Sheet2, and Sheet3
Sheet 1 has a heading and data
Sheet 2 has a heading and no data
Sheet 3 has no heading, but data
:param sheet:
:return:
"""
# sheet1.name_columns_by_row(0)
output = []
for ele in sheet.array[1:]:
    out = {
        # Date (visiting MG)
        "voyage_year": ele[0],
        # Flag
        "vessel_flag": ele[1],
        # AAA Name of ship
        "vessel_name": ele[2],
        # Name of master or author
        "auth_mast_name": ele[3],
        # Original Port
        "origin_port": ele[4],
        # Places visited
        "places_visited": ele[5].split(','),
        # Trade?
        "trade": ele[6],
        # Archival location of ship log
        "ship_log_archive": ele[7],
        # Source
        "source": ele[8],
        # Details
        "voyage_notes": ele[9],
        "mg_port_visits": [],
        # goods bought ele[13]
        "goods_bought": ele[13],
        # goods sold ele[14]
        "goods sold": ele[14],
        # details ele[15]
        "trade_notes": ele[15]
    }

try:
    # Madagascar ports ele[10]
    # date in ele[11]
    # date out ele[12]
    if len(ele[10]) > 0:
        out["mg_port_visits"].append({
            "port": ele[10],
            "date_in": ele[11],
            "date_out": ele[12],
        })
    # second stop ele[16]
    # date in ele[17]
    # date out ele[18]
    if len(ele[16]) > 0:
        out["mg_port_visits"].append({
            "port": ele[16],
            "date_in": ele[17],
            "date_out": ele[18],
        })
    # third stop ele[19]
    # date in ele[20]
    # date out ele[21]
    if len(ele[19]) > 0:
        out["mg_port_visits"].append({
            "port": ele[19],
            "date_in": ele[20],
            "date_out": ele[21],
        })

    # fourth stop ele[22]
    # date in ele[23]
    # date out ele[24]
    if len(ele[22]) > 0:
        out["mg_port_visits"].append({
            "port": ele[22],
            "date_in": ele[23],
            "date_out": ele[24],
        })

    # fifth stop ele[25]
    # date in ele[26]
    # date out ele[27]
    if len(ele[25]) > 0:
        out["mg_port_visits"].append({
            "port": ele[25],
            "date_in": ele[26],
            "date_out": ele[27],
        })

    # sixth stop ele[28]
    # date in ele[29]
    # date out ele[30]
    if len(ele[28]) > 0:
        out["mg_port_visits"].append({
            "port": ele[28],
            "date_in": ele[29],
            "date_out": ele[30],
        })

    # 7 stop ele[31]
    # date in ele[32]
    # date out ele[33]
    if len(ele[31]) > 0:
        out["mg_port_visits"].append({
            "port": ele[31],
            "date_in": ele[32],
            "date_out": ele[33],
        })

    # 8 stop ele[34]
    # date in ele[35]
    # date out ele[36]
    if len(ele[34]) > 0:
        out["mg_port_visits"].append({
            "port": ele[34],
            "date_in": ele[35],
            "date_out": ele[36],
        })

except TypeError as te:
    print("error occurred parsing stop/date in/date out row, check rows for proper format and content, then try again.")
    print("error: {}".format(te))

output.append(out)
return output


def process_file_json(in_file_name: str, sheet_name

: str = "Sheet1"):
"""
Open an excel spreadsheet, extract the specified or first sheet, then convert the contents into a
JSON object. Return the JSON object as a string.
:param in_file_name: The name and path of the file to process.
:return: a JSON string representation of the contents of the spreadsheet.
"""
sheet = get_excel_sheet(in_file_name, sheet_name)
sheet_dict = parse_sheet(sheet)
data_json = jsonpickle.encode(sheet_dict, unpicklable=False)
return data_json


def write_json_to_file(data_json: str, output_file

: str):
"""
write the data json string to the output file
:param data_json:
:param output_file:
:return:
"""
with open(output_file, 'w') as fd:
    fd.write(data_json)


def parse_command_line() ->


tuple:
"""
parse the command line
:return:
"""
parser = argparse.ArgumentParser()
parser.add_argument("input_file",
                    help="path and filename of spreadsheet to read",
                    required=True)
parser.add_argument("sheet_name",
                    help="name of the sheet to read from the spreadsheet",
                    default="Sheet1")
parser.add_argument("output_file",
                    help="path and filename of the JSON file to write",
                    required=True)
args = parser.parse_args()
return args.input_file, args.sheet_name, args.output_file


def run():
    """
    Run as command-line tool
    :return: 
    """
    input_file, sheet_name, output_file = parse_command_line()
    data_json = process_file_json(input_file, sheet_name)
    write_json_to_file(data_json, output_file)
    return 0


if __name__ == "__main__":
    sys.exit(run())
