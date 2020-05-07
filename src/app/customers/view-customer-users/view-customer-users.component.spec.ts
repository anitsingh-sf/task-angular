import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerUsersComponent } from './view-customer-users.component';

describe('ViewCustomerUsersComponent', () => {
  let component: ViewCustomerUsersComponent;
  let fixture: ComponentFixture<ViewCustomerUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
