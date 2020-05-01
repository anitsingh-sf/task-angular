import { Component, OnInit } from '@angular/core';
import { UserDataModel } from '../../models/userDataModel';
import { Roles, Customers } from '../../models/enum';
import { DataService } from '../data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  providers: [DataService]
})

export class NewUserComponent implements OnInit {
  newUserTable: boolean;
  model: UserDataModel;
  showError: boolean;
  roles: string[] = [];
  customers: string[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.model = new UserDataModel();

    for(let i in Roles) {
      if (!isNaN(Number(i))) {
        this.roles.push(Roles[i]);
      }
    }
    
    for(let i in Customers) {
      if (!isNaN(Number(i))) {
        this.customers.push(Customers[i]);
      }
    }
  }

  createNewUser(): void {
    this.newUserTable = true;
  }

  save(newUserForm: NgForm): void {
    this.showError = false;
    if(newUserForm.invalid) {
      this.showError = true;
    } else {
      if(!this.model.middlename || this.model.middlename.trim().length == 0){
        this.model.middlename = "";
      } 
      if(!this.model.address || this.model.address.trim().length == 0) {
        this.model.address = "";
      }
      this.model.role = +Roles[this.model.role];
      this.model.customer = +Customers[this.model.customer];

      this.dataService.create(this.model)
      .subscribe(
        () => {
          newUserForm.reset();
          this.newUserTable = false;
        },
        (error) => {
          window.alert(error);
        }
      );
    }
  }

  cancel(newUserForm: NgForm): void {
    newUserForm.reset();
    this.showError = false;
    this.newUserTable = false;
  }
}
