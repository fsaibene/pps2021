import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { NavService } from 'src/app/services/nav.service';
import { ToastService } from 'src/app/services/toast.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthFirebaseErrors } from 'src/auth/auth-errors';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  implements OnInit{
    public loginForm: FormGroup = new FormGroup({
        'email': new FormControl(null, [Validators.email, Validators.required]),
        'password': new FormControl(null, [
            Validators.required, Validators.minLength(6)]),
    });

    public needValidate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public needValidate$: Observable<boolean> = this.needValidate.asObservable();
    constructor(private ns : NavService,
    private toastService: ToastService,
    private auth : AuthService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController) {

    }

    public ngOnInit(): void {
    }

    async login() {
        this.needValidate.next(true);
        if(this.loginForm.valid) {
            let loading = this.loadSpinner();
            loading.then(async loader => {
                loader.present();
                await this.auth.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
                .then(result => {
                    if(result && result["hasError"]){
                        loading.then(l => l.dismiss());
                        this.showToast(result.code);
                    } else {
                        this.ns.setNavRoot(this.navCtrl);
                        this.navCtrl.navigateRoot("/home");
                    }
                });
            })
        }
    }

  async showToast(code: string) {
    if(AuthFirebaseErrors[code]){
        (await this.toastService.showToast(AuthFirebaseErrors[code]));
    } else {
        (await this.toastService.showToast("Error desconocido"));
    } 

  }
  
  register(){
    this.navCtrl.navigateRoot("/register");
  }

  private loadSpinner(): Promise<HTMLIonLoadingElement>
  {
    let loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      duration: 2500
    });
    return loader;
  }
}
