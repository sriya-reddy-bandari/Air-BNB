import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HostService {

    private readonly baseUrl = 'http://localhost:8085/api/host'; // Adjust if your backend URL differs

  constructor(private readonly http: HttpClient) {}

  createHost(hostData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/create-host`, hostData, { headers });
  }


  checkHostExists(username: string): Observable<'EXISTS' | 'NEW'> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<boolean>(`${this.baseUrl}/exists/${username}`, { headers }).pipe(
      map((exists: boolean) => (exists ? 'EXISTS' : 'NEW'))
    );
  }

  uploadPhotos(files: File[]): Promise<string[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  // Get JWT token from localStorage or AuthService
  const token = localStorage.getItem('token'); // adjust based on your auth

  return new Promise((resolve, reject) => {
    this.http.post<string[]>(`${this.baseUrl}/upload`, formData, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (urls) => resolve(urls),
      error: (err) => reject(err)
    });
  });
}
 
  addProperty(hostId: string, property: any): Observable<any> {
    const token = localStorage.getItem('token'); // get JWT from storage

    return this.http.post(`${this.baseUrl}/${hostId}/properties`, property, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }


  getHostDetails(hostId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get(`${this.baseUrl}/details/${hostId}`, { headers });
}

getHostIdByUsername(username: string): Observable<number> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<number>(`${this.baseUrl}/id/${username}`, { headers });
}
   getHostProperties(hostId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/${hostId}/properties`, { headers });
  }


  fetchImage(filename: string): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get(`${this.baseUrl}/uploads/${filename}`, {
      headers,
      responseType: 'blob'
    });
  }

  getPropertyById(hostId: number, propertyId: number) {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<any>(`${this.baseUrl}/${hostId}/properties/${propertyId}`, { headers });
}

 updateProperty(hostId: number, propertyId: number, propertyData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(`${this.baseUrl}/${hostId}/properties/${propertyId}`, propertyData, { headers });
  }

requestDeleteProperty(hostId: number, propertyId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }); 
  return this.http.patch<any>(
    `${this.baseUrl}/${hostId}/request-delete/${propertyId}`, 
    {},
    {headers}
  );
}

// host.service.ts
getHostBookings(hostId: number): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.get<any[]>(`${this.baseUrl}/bookings/${hostId}`, { headers });
}


}
