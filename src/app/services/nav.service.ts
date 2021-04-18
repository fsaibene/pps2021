import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  contentNavCtrl: NavController;
  constructor() {
  }
  public setNavRoot(root: NavController): void {
      this.contentNavCtrl = root;
  }

  public getNavRoot(): NavController {
      return this.contentNavCtrl;
  }
}
