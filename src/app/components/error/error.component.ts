import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {

    @Input() control: FormControl;
    @Input() needValidate$: Observable<boolean>;
    constructor() { }

    ngOnInit() {
        this.needValidate$.subscribe(val => {console.log(this.control)});
    }

}
