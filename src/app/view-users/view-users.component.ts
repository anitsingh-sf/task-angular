import { Component, OnInit } from '@angular/core';
import { Roles, Customers } from '../../models/enum';
import { UserDataModel } from '../../models/userDataModel';
import { DataService } from '../data.service';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css'],
  providers: [DataService]
})
export class ViewUsersComponent implements OnInit {
  dataViewable: boolean;
  mainButtonText: string;
  columns: string[];
  userData: UserDataModel[] = [];
  beforeEditUserData: UserDataModel[] = [];
  updatedUserData: UserDataModel;
  showError: boolean[] = [];
  editable: boolean[] = [];
  roles: string[] = [];
  customers: string[] = [];
  buttonValues: string[][] = [];

  Roles = Roles;
  Customers = Customers;

  constructor(private dataService: DataService) { 
  }

  ngOnInit(): void {
    this.mainButtonText = "Load Data";
    this.columns = ["First Name", "Middle Name", "Last Name", "E-mail", "Phone Number", "Role", "Customer", "Address", "Edit", "Delete"];

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

  load() {
    this.dataViewable = true;
    this.mainButtonText = "Refresh Data";
    this.dataService.read()
    .subscribe(response => {
      this.userData = response;
      this.beforeEditUserData = cloneDeep(response);
    },
    error => {
      window.alert(error);
    },
    () => {
      for(let i in this.userData) {
        this.editable[i] = false;
        this.showError[i] = false;
        this.buttonValues.push(["Edit", "Delete"]);
      }
    });
  }

  edit(rowNum: number, button: HTMLTableCellElement) {  
    if(this.buttonValues[rowNum][0] == "Edit") {
      this.buttonValues[rowNum] = ["Save","Cancel"];
      this.editable[rowNum] = true;
    } else {
      this.save(rowNum, button);
    }
  }

  delete(rowNum: number, button: HTMLTableCellElement) {
    if(this.buttonValues[rowNum][1] == "Delete") {
      this.dataService.delete(this.userData[rowNum].index)
      .subscribe(() => {
        },
        error => {
          window.alert(error)
        },
        () => {
          this.userData.splice(rowNum, 1);
          this.beforeEditUserData.splice(rowNum, 1);
          this.editable.splice(rowNum, 1);
          this.showError.splice(rowNum, 1);
          this.buttonValues.splice(rowNum, 1);
        }
      );
    } else {
      this.cancel(rowNum, button);
    }
  }

  save(rowNum: number, button: HTMLTableCellElement) {
    if((!this.userData[rowNum].firstname || this.userData[rowNum].firstname.trim().length === 0) || 
    (!this.userData[rowNum].lastname || this.userData[rowNum].lastname.trim().length === 0) ||
      !this.userData[rowNum].email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
      !this.userData[rowNum].phone.match(/^((\\+91-?)|0)?[0-9]{10}$/)) {
        this.showError[rowNum] = true;
    } else {
      this.dataService.update(this.userData[rowNum])
      .subscribe( response => {},
        error => { window.alert(error) },
        () => {
          this.buttonValues[rowNum] = ["Edit", "Delete"];
          this.editable[rowNum] = false;
          this.showError[rowNum] = false;
          this.beforeEditUserData[rowNum] = cloneDeep(this.userData[rowNum]);
        }
      );
    }
  }

  cancel(rowNum: number, button: HTMLTableCellElement) {
    this.buttonValues[rowNum] = ["Edit", "Delete"];
    this.userData[rowNum] = cloneDeep(this.beforeEditUserData[rowNum]);
    this.editable[rowNum] = false;
    this.showError[rowNum] = false;
  }

  changeRole(rowNum: number, selectTag: HTMLSelectElement) {
    this.userData[rowNum].role = +selectTag.value;
  }

  changeCustomer(rowNum: number, selectTag: HTMLSelectElement) {
    this.userData[rowNum].customer = +selectTag.value;
  }
}
