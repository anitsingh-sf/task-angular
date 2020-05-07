import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataModel } from 'src/models/userDataModel';

@Injectable()
export class UserDataService {
    url: string = 'http://localhost:3000';
    constructor(private httpClient: HttpClient) {
    }

    create(newUserData: UserDataModel) {
        return this.httpClient.post(this.url + "/users", newUserData);
    }

    read() {
        return this.httpClient.get<any>(this.url + "/users");
    }

    update(updatedUserData: UserDataModel) {
        return this.httpClient.put(this.url + "/users/" + updatedUserData.index, updatedUserData);
    }

    delete(index: number) {
        return this.httpClient.delete<any>(this.url + "/users/" + index);
    }

    getUsers(customerName: string) {
        return this.httpClient.get<any>(this.url + "/users/" + customerName);
    }
}
