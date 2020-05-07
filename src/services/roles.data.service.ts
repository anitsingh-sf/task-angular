import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RoleDataService {
    url: string = 'http://localhost:3000';
    constructor(private httpClient: HttpClient) {
    }

    read() {
        return this.httpClient.get<any>(this.url + "/roles");
    }
}