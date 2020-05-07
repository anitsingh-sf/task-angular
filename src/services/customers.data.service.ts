import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerDataModel } from 'src/models/customerDataModel';

@Injectable()
export class CustomerDataService {
    url: string = 'http://localhost:3000';
    constructor(private httpClient: HttpClient) {
    }

    create(newCustomerData: CustomerDataModel) {
        return this.httpClient.post(this.url + "/customers", newCustomerData);
    }

    read() {
        return this.httpClient.get<any>(this.url + "/customers");
    }

    update(updatedCustomerData: CustomerDataModel) {
        return this.httpClient.put(this.url + "/customers/" + updatedCustomerData.index, updatedCustomerData);
    }

    delete(index: number) {
        return this.httpClient.delete<any>(this.url + "/customers/" + index);
    }
}
