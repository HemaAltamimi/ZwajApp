import { Injectable } from '@angular/core';
declare let alertify:any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

 

confirm(message:string,okCallback:()=>any ,cancelCallBack: ()=> any){
  alertify.confirm(message,function(e){
    if(e){okCallback()} else{}
  }, function(e){
    if(e){cancelCallBack()} else{}
  })
}

success(message:string){
alertify.success(message);
}

error(message:string){
  alertify.error(message);
  }

  warning(message:string){
    alertify.warning(message);
    }

 message(message:string){
      alertify.message(message);
      }

      promisifyConfirm(title: string, message: string, options = {}): Promise<ConfirmResult> {

        return new Promise<ConfirmResult>((resolve) => {
          alertify.confirm(
            title,
            message,
            () => resolve(ConfirmResult.Ok),
            () => resolve(ConfirmResult.Cancel)).set(Object.assign({}, {
              closableByDimmer: false,
              defaultFocus: 'cancel',
              frameless: false,
              closable: false
            }, options));
        });
      }

}

export enum ConfirmResult {
  Ok = 1,
  Cancel
}


//defualts
alertify.defaults = {
  // dialogs defaults
  autoReset:true,
  basic:false,
  closable:true,
  closableByDimmer:true,
  invokeOnCloseOff:false,
  frameless:false,
  defaultFocusOff:false,
  maintainFocus:true, // <== global default not per instance, applies to all dialogs
  maximizable:true,
  modal:true,
  movable:true,
  moveBounded:false,
  overflow:true,
  padding: true,
  pinnable:true,
  pinned:true,
  preventBodyShift:false, // <== global default not per instance, applies to all dialogs
  resizable:true,
  startMaximized:false,
  transition:'pulse',
  transitionOff:false,
  tabbable:'button:not(:disabled):not(.ajs-reset),[href]:not(:disabled):not(.ajs-reset),input:not(:disabled):not(.ajs-reset),select:not(:disabled):not(.ajs-reset),textarea:not(:disabled):not(.ajs-reset),[tabindex]:not([tabindex^="-"]):not(:disabled):not(.ajs-reset)',  // <== global default not per instance, applies to all dialogs

  // notifier defaults
  notifier:{
  // auto-dismiss wait time (in seconds)  
      delay:5,
  // default position
      position:'top-right',
  // adds a close button to notifier messages
      closeButton: false,
  // provides the ability to rename notifier classes
      classes : {
          base: 'alertify-notifier',
          prefix:'ajs-',
          message: 'ajs-message',
          top: 'ajs-top',
          right: 'ajs-right',
          bottom: 'ajs-bottom',
          left: 'ajs-left',
          center: 'ajs-center',
          visible: 'ajs-visible',
          hidden: 'ajs-hidden',
          close: 'ajs-close'
      }
  },

  // language resources 
  glossary:{
      // dialogs default title
      title:'موقع زواج',
      // ok button text
      ok: 'موافق',
      // cancel button text
      cancel: 'الغاء'            
  },

  // theme settings
  theme:{
      // class name attached to prompt dialog input textbox.
      input:'ajs-input',
      // class name attached to ok button
      ok:'ajs-ok',
      // class name attached to cancel button 
      cancel:'ajs-cancel'
  },
  // global hooks
  hooks:{
      // invoked before initializing any dialog
      preinit:function(instance){},
      // invoked after initializing any dialog
      postinit:function(instance){},
  },
};

