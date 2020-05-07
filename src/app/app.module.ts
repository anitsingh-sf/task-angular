import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ViewUsersComponent } from './users/view-users/view-users.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { UsersComponent } from './users/users.component';
import { CustomersComponent } from './customers/customers.component';
import { ViewCustomerUsersComponent } from './customers/view-customer-users/view-customer-users.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ViewUsersComponent,
    NewUserComponent,
    UsersComponent,
    CustomersComponent,
    ViewCustomerUsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
