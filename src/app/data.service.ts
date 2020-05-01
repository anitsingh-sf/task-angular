import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
    url: string = 'http://localhost:5000';
    constructor(private httpClient: HttpClient) {
    }

    create(newUserData) {
        return this.httpClient.request<any>("post", 
            this.url + "/api/addUser", 
            { 
                body: { 'newUserData': newUserData } 
            });
    }

    read() {
        return this.httpClient.get<any>(this.url + "/api/getUsers");
    }

    update(updatedUserData) {
        return this.httpClient.request<any>("post",     
            this.url + "/api/updateUser", 
            {
                body: {'updatedUserData': updatedUserData }
            });
    }

    delete(index) {
        return this.httpClient.request<any>("delete", 
            this.url + "/api/deleteUser", 
            { 
                body: { "index": index }
            });
    }
}
