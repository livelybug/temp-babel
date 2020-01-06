import { Notify } from 'quasar'

let dismiss = undefined;

export const notifyOk = (msg) => {
  if(dismiss) dismiss();

  dismiss = Notify.create({
    message: msg,
    type: 'positive',
    position: 'top'
  })
}

export const notifyErr = (msg) => {
  if(dismiss) dismiss();

  dismiss = Notify.create({
    message: msg,
    position: 'top'
  })

}



