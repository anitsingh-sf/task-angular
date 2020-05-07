import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserDataModel } from '../../../models/userDataModel';
import { UserDataService } from '../../../services/users.data.service';
import { NgForm } from '@angular/forms';
import { RoleDataService } from 'src/services/roles.data.service';
import { CustomerDataService } from 'src/services/customers.data.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  providers: [UserDataService, RoleDataService, CustomerDataService]
})

export class NewUserComponent implements OnInit {
  newUserTable: boolean;
  model: UserDataModel;
  showError: boolean;
  roles: string[] = [];
  customers: string[] = [];

  @Output() newUserAddedEvent = new EventEmitter<void>();

  constructor(private dataService: UserDataService,
    private roleService: RoleDataService,
    private customerService: CustomerDataService) { }

  ngOnInit(): void {
    this.model = new UserDataModel();

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

  }

  createNewUser(): void {
    this.newUserTable = true;
  }

  save(newUserForm: NgForm): void {
    this.showError = false;
    if (newUserForm.invalid) {
      this.showError = true;
    } else {
      if (!this.model.middlename || this.model.middlename.trim().length == 0) {
        this.model.middlename = "";
      }
      if (!this.model.address || this.model.address.trim().length == 0) {
        this.model.address = "";
      }
      this.model.role = this.model.role;
      this.model.customer = this.model.customer;

      this.dataService.create(this.model)
        .subscribe(
          () => {
            this.newUserAddedEvent.emit();
            newUserForm.reset();
            this.newUserTable = false;
          },
          (error) => {
            window.alert(error.statusText);
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
