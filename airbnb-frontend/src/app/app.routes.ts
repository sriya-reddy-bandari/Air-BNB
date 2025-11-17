import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { hostAuthGuard } from './guards/host-auth.guard';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { guestGuard } from './guards/guest.guard';
export const routes: Routes = [
    { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // ✅ Lazy load Signup component
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then((m) => m.SignupComponent),
  },

  // ✅ Host Dashboard (protected)
  {
    path: 'host-dashboard/:username',
    loadComponent: () =>
      import('./host-dashboard/host-dashboard.component').then(
        (m) => m.HostDashboardComponent
      ),
    canActivate: [hostAuthGuard],
  },

  // ✅ Create Host (protected)
  {
    path: 'host/:username/create',
    loadComponent: () =>
      import('./create-host/create-host.component').then(
        (m) => m.CreateHostComponent
      ),
    canActivate: [hostAuthGuard],
  },

  // ✅ Host Profile (protected)
  {
    path: 'host/profile/:id',
    loadComponent: () =>
      import('./host-profile/host-profile.component').then(
        (m) => m.HostProfileComponent
      ),
    canActivate: [hostAuthGuard],
  },

  // ✅ Add Property (protected)
  {
    path: 'host/:hostId/add-property',
    loadComponent: () =>
      import('./add-property/add-property.component').then(
        (m) => m.AddPropertyComponent
      ),
    canActivate: [hostAuthGuard],
  },
  {
  path: 'host/:username/properties',
  loadComponent: () =>
    import('./host-properties/host-properties.component').then(
      (m) => m.HostPropertiesComponent
    ),
  canActivate: [hostAuthGuard],
},

  // Other dashboards
  { path: 'guest-dashboard/:username',
    loadComponent: () =>
      import('./guest-dashboard/guest-dashboard.component').then(
        (m) => m.GuestDashboardComponent
      ), 
      canActivate: [guestGuard] 
    },

  { path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ), 
      canActivate: [adminAuthGuard] 
    },
 
{
  path: 'host/:hostId/property/:propertyId',
  loadComponent: () => import('./host-property-details/host-property-details.component')
                     .then(m => m.HostPropertyDetailsComponent),
  canActivate: [hostAuthGuard],
} ,

  { path: 'admin/hosts',
      loadComponent: () => import('./admin-host-list/admin-host-list.component')
               .then(m=>m.AdminHostListComponent ),
    canActivate: [adminAuthGuard],
  },

 { path: 'admin/properties/pending',
     loadComponent: () => import('./admin-pending-properties/admin-pending-properties.component')
               .then(m=>m.AdminPendingPropertiesComponent ),
   canActivate: [adminAuthGuard],
 },

 {
  path: 'admin/property-details/:id',
  loadComponent: () =>
    import('./admin-property-details/admin-property-details.component')
      .then(c => c.AdminPropertyDetailsComponent),
   canActivate: [adminAuthGuard], 
},

 {
  path: 'admin/properties/deleterequests',
  loadComponent: () =>
    import('./admin-delete-request-property/admin-delete-request-property.component')
      .then(c => c.AdminDeleteRequestPropertyComponent),
   canActivate: [adminAuthGuard], 
},

 
 {
    path: 'guest/:username/create',
    loadComponent: () =>
      import('./create-guest/create-guest.component').then(
        (m) => m.CreateGuestComponent
      ),
    canActivate: [guestGuard],
  },

   {
    path: 'guest/profile/:id',
    loadComponent: () =>
      import('./guest-profile/guest-profile.component').then(
        (m) => m.GuestProfileComponent
      ),
    canActivate: [guestGuard],
  },

  {
  path: 'property-details/:guestId/:propertyId',
  loadComponent: () =>
    import('./guest-property-details/guest-property-details.component')
      .then((m) => m.GuestPropertyDetailsComponent),
  canActivate: [guestGuard],
},

{
  path:`guest/bookings/:guestId`,
  loadComponent: () =>
    import('./booking/booking.component')
      .then((m) => m.BookingComponent)
},
{ path: 'host/bookings/:hostId', loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent) },

{ path: 'admin/guests',
      loadComponent: () => import('./admin-guest-list/admin-guest-list.component')
               .then(m=>m.AdminGuestListComponent ),
    canActivate: [adminAuthGuard],
  },

];
