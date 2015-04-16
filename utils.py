__author__ = 'root'


def stringify_object_ids(in_list):
    new_list = []
    for i in in_list:
        i['_id'] = str(i['_id'])
        new_list.append(i)
    return new_list