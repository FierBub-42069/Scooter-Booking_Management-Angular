import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking/booking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from '../booking.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: [
    './bookings.component.css',
    '../../../node_modules/ngx-toastr/toastr.css',
  ],
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  public currentYear = new Date().getFullYear();

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    this.bookingService.getBookings().subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
    });
  }

  public addBooking(): void {
    this.router.navigate(['/booking-form']);
  }

  public editBooking(id: number): void {
    this.router.navigate([`/booking-form/${id}/edit`]);
  }

  public deleteBooking(id: number): void {
    if (
      confirm(`Are you sure you want to delete this booking with ID ${id} ?`)
    ) {
      this.toastr.success('Post deleted successfully.');
      setTimeout(() => {
        this.bookingService.deleteBooking(id).subscribe(() => {
          console.log(id);
          this.bookings = this.bookings.filter((booking) => booking.id !== id);
        });
      }, 100);
    }
  }

  public logout(): void {
    this.authService.logout();
    this.toastr.success('Logout successful.');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }
}
