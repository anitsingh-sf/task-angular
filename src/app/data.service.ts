import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
    constructor(private httpClient: HttpClient) {
    }

    create(newUserData) {
        return this.httpClient.request<any>("post", 
            "http://localhost:5000/api/addUser", 
            { body: newUserData });
    }

    read() {
        return this.httpClient.get<any>("http://localhost:5000/api/getData");
    }

    update(updatedUserData) {
        return this.httpClient.request<any>("post",     
            "http://localhost:5000/api/updateUser", 
            { body: updatedUserData });
    }

    delete(index) {
        return this.httpClient.request<any>("delete", 
            "http://localhost:5000/api/delUser", 
            { body: 
                { "index": index }
            });
    }
}
