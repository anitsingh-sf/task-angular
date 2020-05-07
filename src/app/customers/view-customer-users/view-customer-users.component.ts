import { Component, OnInit, Input } from '@angular/core';
import { UserDataModel } from 'src/models/userDataModel';
import { Subscription, Observable } from 'rxjs';
import { UserDataService } from 'src/services/users.data.service';
import { RoleDataService } from 'src/services/roles.data.service';
import { CustomerDataService } from 'src/services/customers.data.service';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-view-customer-users',
  templateUrl: './view-customer-users.component.html',
  styleUrls: ['./view-customer-users.component.css'],
  providers: [UserDataService, RoleDataService, CustomerDataService]
})
export class ViewCustomerUsersComponent implements OnInit {
  columns: string[];

  userData: UserDataModel[] = [];
  beforeEditUserData: UserDataModel[] = [];
  showError: boolean[] = [];
  editable: boolean[] = [];
  buttonValues: string[][] = [];

  roles: string[] = [];
  customers: string[] = [];

  customerNameSubscription: Subscription;
  @Input() customerName: Observable<string>;

  constructor(private dataService: UserDataService,
    private roleService: RoleDataService,
    private customerService: CustomerDataService) {
  }

  ngOnInit(): void {
    this.columns = ["First Name", "Middle Name", "Last Name", "E-mail", "Phone Number", "Role", "Address", "Edit", "Delete"];

    this.roleService.read()
      .subscribe((response) => {
        response.forEach(element => {
          this.roles.push(element.role);
        });
      });

    this.customerService.read()
      .subscribe((response) => {
        response.forEach(element => {
          this.customers.push(element.customer);
        });
      });

    this.customerNameSubscription = this.customerName
      .subscribe((name: string) => {
        this.load(name);
      });

  }

  load(customerName: string) {

    this.dataService.getUsers(customerName)
      .subscribe(response => {
        this.userData = response;
        this.beforeEditUserData = cloneDeep(response);

        for (let i in this.userData) {
          this.editable[i] = false;
          this.showError[i] = false;
          this.buttonValues[i] = ["Edit", "Delete"];
        }
      },
        error => {
          window.alert(error.statusText);
        });
  }

  edit(rowNum: number) {
    if (this.buttonValues[rowNum][0] == "Edit") {
      this.buttonValues[rowNum] = ["Save", "Cancel"];
      this.editable[rowNum] = true;
    } else {
      this.save(rowNum);
    }
  }

  delete(rowNum: number) {
    if (this.buttonValues[rowNum][1] == "Delete") {
      this.dataService.delete(this.userData[rowNum].index)
        .subscribe(() => {
          this.userData.splice(rowNum, 1);
          this.beforeEditUserData.splice(rowNum, 1);
          this.editable.splice(rowNum, 1);
          this.showError.splice(rowNum, 1);
          this.buttonValues.splice(rowNum, 1);
        },
          error => {
            window.alert(error.statusText);
          }
        );
    } else {
      this.cancel(rowNum);
    }
  }

  save(rowNum: number) {
    if ((!this.userData[rowNum].firstname || this.userData[rowNum].firstname.trim().length === 0) ||
      (!this.userData[rowNum].lastname || this.userData[rowNum].lastname.trim().length === 0) ||
      !this.userData[rowNum].email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
      !this.userData[rowNum].phone.match(/^((\\+91-?)|0)?[0-9]{10}$/)) {
      this.showError[rowNum] = true;
    } else {
      let updatedUserData: UserDataModel = this.userData[rowNum];
      if (updatedUserData.middlename == null) updatedUserData.middlename = '';
      if (updatedUserData.address == null) updatedUserData.address = '';
      this.dataService.update(updatedUserData)
        .subscribe(
          () => {
            this.buttonValues[rowNum] = ["Edit", "Delete"];
            this.editable[rowNum] = false;
            this.showError[rowNum] = false;
            this.beforeEditUserData[rowNum] = cloneDeep(this.userData[rowNum]);
          },
          error => {
            window.alert(error.statusText)
          }
        );
    }
  }

  cancel(rowNum: number) {
    this.buttonValues[rowNum] = ["Edit", "Delete"];
    this.userData[rowNum] = cloneDeep(this.beforeEditUserData[rowNum]);
    this.editable[rowNum] = false;
    this.showError[rowNum] = false;
  }

  changeRole(rowNum: number, selectTag: HTMLSelectElement) {
    this.userData[rowNum].role = selectTag.value;
  }

  changeCustomer(rowNum: number, selectTag: HTMLSelectElement) {
    this.userData[rowNum].customer = selectTag.value;
  }
}
