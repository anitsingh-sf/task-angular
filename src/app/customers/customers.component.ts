import { Component, OnInit } from '@angular/core';
import { CustomerDataModel } from 'src/models/customerDataModel';
import { CustomerDataService } from 'src/services/customers.data.service';
import { UserDataService } from 'src/services/users.data.service';
import { BehaviorSubject } from 'rxjs';
import * as cloneDeep from "lodash/cloneDeep";


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers: [CustomerDataService, UserDataService]
})
export class CustomersComponent implements OnInit {
  mainButtonText: string;
  dataViewable: boolean;
  usersViewable: boolean;
  columns: string[];

  customerData: CustomerDataModel[] = [];
  beforeEditCustomerData: CustomerDataModel[] = [];
  buttonValues: string[][] = [];
  showError: boolean[] = [];
  editable: boolean[] = [];

  customerUsersVisible: boolean;
  customerWhoseUsers: BehaviorSubject<string> = new BehaviorSubject(null);;

  constructor(private dataService: CustomerDataService) { }

  ngOnInit(): void {
    this.mainButtonText = 'Load Customers';
    this.columns = ['Name', 'Website', 'Address', 'Edit', 'Delete', 'View Users'];
  }

  load() {
    this.dataViewable = true;
    this.mainButtonText = "Refresh Data";
    this.dataService.read()
      .subscribe(
        (response) => {
          this.customerData = response;
          this.beforeEditCustomerData = cloneDeep(response);

          for (let i in this.customerData) {
            this.editable[i] = false;
            this.showError[i] = false;
            this.buttonValues[i] = ["Edit", "Delete", "View Users"];
          }
        },
        error => {
          window.alert(error.statusText);
        });
  }

  edit(rowNum: number) {
    if (this.buttonValues[rowNum][0] == "Edit") {
      this.buttonValues[rowNum] = ['Save', 'Cancel', 'View Users'];
      this.editable[rowNum] = true;
    } else {
      this.save(rowNum);
    }
  }

  delete(rowNum: number) {
    if (this.buttonValues[rowNum][1] == "Delete") {
      this.dataService.delete(this.customerData[rowNum].index)
        .subscribe(() => {
          this.customerData.splice(rowNum, 1);
          this.beforeEditCustomerData.splice(rowNum, 1);
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
    this.dataService.update(this.customerData[rowNum])
      .subscribe(() => {
        this.buttonValues[rowNum] = ["Edit", "Delete", "View Users"];
        this.editable[rowNum] = false;
        this.showError[rowNum] = false;
        this.beforeEditCustomerData[rowNum] = cloneDeep(this.customerData[rowNum]);
      },
        error => {
          window.alert(error.statusText)
        });
  }

  cancel(rowNum: number) {
    this.buttonValues[rowNum] = ['Edit', 'Delete', 'View Users'];
    this.customerData[rowNum] = cloneDeep(this.beforeEditCustomerData[rowNum]);
    this.editable[rowNum] = false;
    this.showError[rowNum] = false;
  }

  viewUsers(rowNum: number) {
    this.customerUsersVisible = true;
    this.customerWhoseUsers.next(this.customerData[rowNum].customer);
  }
}
