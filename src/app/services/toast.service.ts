import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private readonly defaultDuration: number = 1500;
    constructor(public toastCtrl: ToastController) {

    }
    public async showToast(message: string){
        return (await this.toastCtrl.create({
            message: message,
            duration: this.defaultDuration
        })).present();
    }
    public async showToastWithDuration(message: string, duration: number){
        return (await this.toastCtrl.create({
            message: message,
            duration: duration
        })).present();
    }
}
