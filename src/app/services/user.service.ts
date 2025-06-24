import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {

    phoneNumber: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
    registeredDate: string;
    lastLoginDate: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getMyProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.api}/User/me`);
    }
    
}