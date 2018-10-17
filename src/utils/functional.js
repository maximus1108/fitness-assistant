export const pipe = (...funcs) => val => funcs.reduce((value, func) => func(value), val)