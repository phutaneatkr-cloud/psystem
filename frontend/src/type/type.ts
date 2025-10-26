export type T_Value = { id: string | number, name: string }

export type T_ValueCheckbox = string | number | boolean | T_Value

export type T_Options = string[] | number[] | T_Value[]