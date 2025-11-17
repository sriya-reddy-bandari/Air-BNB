import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private readonly baseUrl = 'http://localhost:8085/api/guest'; 

  constructor(private readonly http: HttpClient) {}


  checkGuestExists(username: string): Observable<'EXISTS' | 'NEW'> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<{ exists: boolean }>(`${this.baseUrl}/exists/${username}`, { headers }).pipe(
    map(res => res.exists ? 'EXISTS' : 'NEW')
  );
}

  createGuest(guestData: any): Observable<any> {
     const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/create-guest`, guestData,{ headers});
  }

  getGuestIdByUsername(username: string): Observable<number> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<number>(`${this.baseUrl}/id/${username}`, { headers });
}


 getGuestDetails(guestId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get(`${this.baseUrl}/details/${guestId}`, { headers });
}

searchProperties(city: string, checkInDate: string): Observable<any[]> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

    return this.http.get<any[]>(
      `${this.baseUrl}/search?city=${city}&checkInDate=${checkInDate}`,
      { headers }
    );
  }

  getPropertyById(propertyId: number) {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<any>(`${this.baseUrl}/properties/${propertyId}`, { headers });
}

createBooking(guestId: number, propertyId: number, checkInDate: string): Observable<any> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  return this.http.post(
    `${this.baseUrl}/book/${guestId}/${propertyId}/${checkInDate}`,
    {},
    { headers }
  );
}

getGuestBookings(guestId: number): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<any[]>(`${this.baseUrl}/bookings/${guestId}`, { headers });
}




}
