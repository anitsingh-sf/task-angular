import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  newUserData: Subject<void> = new Subject();

  constructor() { }

  ngOnInit(): void {
  }

  receiveNewUserData() {
    this.newUserData.next();
  }

}
