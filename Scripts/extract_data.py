import openpyxl
import argparse
import os
import logging

from openpyxl.worksheet import Worksheet

INPUT_FILE_ERR = 1
SUCCESS = 0
def parse_cmd_line() -> str:
    parser = argparse.ArgumentParser(description='Parse excel data file')
    parser.add_argument('--input_file', '-i')
    args = parser.parse_args()
    return args.input_file


def parse_sheet(sheet: Worksheet) -> (list, list):
    logging.info('parsing sheet {}'.format(sheet.title))
    i = 0
    headings = []
    rows = []
    for row in sheet.iter_rows():
        row_data = []
        for cell in row:
            print(cell)
            if i == 0:
                headings.append(cell.value)
            else:
                row_data.append(cell.value)
        rows.append(row_data)
    return headings, rows


def run() -> int:
    input_file = parse_cmd_line()

    if os.path.exists(input_file) is False:
        logging.error('input file does not exist')
        return INPUT_FILE_ERR

    if os.path.isfile(input_file) is False:
        logging.error('input file is not a file')
        return INPUT_FILE_ERR

    logging.info('loading file')
    workbook = openpyxl.load_workbook(filename=input_file,
                                      guess_types=True,
                                      data_only=True,
                                      keep_vba=False)

    logging.info('parsing sheets')
    sheet1_head, sheet1_rows = parse_sheet(workbook['Sheet1'])
    sheet2_head, sheet2_rows = parse_sheet(workbook['Sheet2'])
    sheet3_head, sheet3_rows = parse_sheet(workbook['Sheet3'])

    # TODO: based on output(s) specified, push sheet data to output.
    # TODO: output: file, format: xml, json, csv, yaml
    # TODO: output: redis
    # TODO: output: mongodb
    # TODO: output: postgresql

    return SUCCESS

if __name__ == '__main__':
    run()

# END OF FILE #
