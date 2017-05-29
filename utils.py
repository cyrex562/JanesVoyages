__author__ = 'root'


def stringify_object_ids(in_list):
    new_list = []
    for i in in_list:
        i['_id'] = str(i['_id'])
        new_list.append(i)
    return new_list


def stringify_obj_id(in_obj_id):
    return str(in_obj_id['_id'])