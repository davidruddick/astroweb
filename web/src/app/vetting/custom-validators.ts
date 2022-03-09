import { AbstractControl, FormControl } from '@angular/forms';


export function isValidID(control: AbstractControl){
  let value: string = control.value
  if(isNaN(parseInt(value)) || parseInt(value)<0 || value.length != 9 ){
    return { invalidID: true }
  }
  return null
}

export function isZeroOrPositiveNumber(control: AbstractControl){
  let value: string = control.value
  if(value.length == 0){
    return null
  }
  if(isNaN(parseFloat(value)) || parseFloat(value)<0 ){
    return { invalidNumber: true }
  }
  return null
}


export function isPositiveNumber(control: AbstractControl){
  let value: string = control.value
  if(value.length == 0){
    return null
  }
  if(isNaN(parseFloat(value)) || parseFloat(value)<=0 ){
    return { invalidNumber: true }
  }
  return null
}

export function isPositiveInt(control: AbstractControl){
  let value: string = control.value
  if(isNaN(parseInt(value)) || parseInt(value)<1 || parseFloat(value) % 1 != 0 ){
    return { invalidNumber: true }
  }
  return null
}
