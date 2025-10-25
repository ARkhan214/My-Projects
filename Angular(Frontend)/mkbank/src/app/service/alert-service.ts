import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success(message: string, title: string = 'Success') {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK'
    });
  }

  warning(message: string, title: string = 'Warning') {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'OK'
    });
  }

  info(message: string, title: string = 'Info') {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: 'OK'
    });
  }

  confirm(message: string, title: string = 'Are you sure?'): Promise<any> {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
  }


  //old Style
  // Swal.fire({
  //   icon: 'success',
  //   title: 'Withdraw Successful!',
  //   text: res.amount + ' Taka has been withdrawn.',
  //   showConfirmButton: false,
  //   timer: 2000
  // });
}
