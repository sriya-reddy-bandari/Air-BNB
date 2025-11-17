import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  private readonly baseUrl = 'http://localhost:8085/api/admin';

  constructor(private readonly http: HttpClient) {}

  getAllHosts(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/hosts`, { headers });
  }

   getAllGuests(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/guests`, { headers });
  }

  getPropertiesByStatus(status: string): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any[]>(
    `http://localhost:8085/api/admin/properties-status/${status}`,
    { headers }
  );
}

getPropertyByIdForAdmin(propertyId: number) :Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<any>(`${this.baseUrl}/properties/${propertyId}`,{headers});
}

approveProperty(propertyId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.patch<any>(
    `${this.baseUrl}/${propertyId}/approve`,
    {},                           // PATCH body (empty)
    { headers }                   // OPTIONS with headers
  );
}

rejectProperty(propertyId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.patch<any>(
    `${this.baseUrl}/${propertyId}/rejected`,
    {},                    // empty body (required)
    { headers }   // headers correctly placed
  );
}

 approveDeleteProperty(propertyId: number): Observable<any> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
    return this.http.patch<any>(`${this.baseUrl}/approve-delete/${propertyId}`, {},
      {headers}
    );
  }

}
