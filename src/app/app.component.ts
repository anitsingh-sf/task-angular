import { Component } from '@angular/core';
import { UserDataModel } from 'src/models/userDataModel';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newUserData: Subject<void> = new Subject();

  constructor() {}

  receiveNewUserData() {
    this.newUserData.next();
  }
}
