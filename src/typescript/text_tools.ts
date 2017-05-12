import {Face} from './datatypes';

import {List, Map} from 'immutable';

export function uncapitalize(msg: string) {
    return msg[0].toLowerCase() + msg.slice(1);
}

export function capitalize(msg: string) {
    return msg[0].toUpperCase() + msg.slice(1);
}

export function face_message(face_order: List<Face>, f_code_2_name?: Map<Face, string>){
    if (f_code_2_name === undefined) {
        f_code_2_name = Map<Face, string>([
            [Face.n, 'back'],
            [Face.s, 'front'],
            [Face.e, 'right'],
            [Face.w, 'left'],
            [Face.t, 'top'],
            [Face.b, 'bottom']
        ]);
    }

    if (face_order.size == 1) {
        return f_code_2_name.get(face_order.first()) + ' face';
    } else {
        return face_order.butLast().map(f_code_2_name.get).join(', ') + ' and ' + f_code_2_name.get(face_order.last()) + ' faces';
    }
}