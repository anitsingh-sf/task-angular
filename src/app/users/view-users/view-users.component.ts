import { Component, OnInit, Input } from '@angular/core';
import { UserDataModel } from '../../../models/userDataModel';
import { UserDataService } from '../../../services/users.data.service';
import * as cloneDeep from 'lodash/cloneDeep';
import { Subscription, Observable } from 'rxjs';
import { RoleDataService } from 'src/services/roles.data.service';
import { CustomerDataService } from 'src/services/customers.data.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css'],
  providers: [UserDataService, RoleDataService, CustomerDataService]
})
export class ViewUsersComponent implements OnInit {
  dataViewable: boolean;
  mainButtonText: string;
  columns: string[];

  userData: UserDataModel[] = [];
  beforeEditUserData: UserDataModel[] = [];
  showError: boolean[] = [];
  editable: boolean[] = [];
  buttonValues: string[][] = [];

  roles: string[] = [];
  customers: string[] = [];

  newUserSubscription: Subscription;
  @Input() newUserAddedEvent: Observable<void>;

  constructor(private dataService: UserDataService,
    private roleService: RoleDataService,
    private customerService: CustomerDataService) {
  }

  ngOnInit(): void {
    this.mainButtonText = "Load Data";
    this.columns = ["First Name", "Middle Name", "Last Name", "E-mail", "Phone Number", "Role", "Customer", "Address", "Edit", "Delete"];

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

    this.newUserSubscription = this.newUserAddedEvent.subscribe(() => {
      this.load();
    });

  }

  load() {
    this.dataViewable = true;
    this.mainButtonText = "Refresh Data";
    this.dataService.read()
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
