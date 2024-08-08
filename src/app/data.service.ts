import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from './Interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}`);
  }

  updateUser(userId: number, updatedData: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${userId}`, updatedData);
  }
}
