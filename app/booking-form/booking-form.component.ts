import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../booking/booking.service';
import { Booking } from '../booking.model';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css', '../../../node_modules/ngx-toastr/toastr.css']
})
export class BookingFormComponent implements OnInit {
  booking: Booking;
  bookingForm: FormGroup;
  bookingId: number;
  editMode: boolean = false;
  scooterTypes = ['Petrol', 'Electric'];
  manufacturerNames = [
    'Hero Motocorp',
    'Honda',
    'TVS',
    'Suzuki',
    'Ather Energy',
    'Aprilla',
    'Ola Electric',
    'Bajaj',
  ];
  public currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      scooterType: ['', Validators.required],
      manufacturerName: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      hireStartDate: ['', Validators.required],
      hireEndDate: ['', Validators.required],
      chargesPerHour: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const bookingId = +params.get('id');
      console.log('Route Param bookingId:', bookingId);
      if (bookingId) {
        this.editMode = true;
        this.bookingService
          .getBooking(bookingId)
          .subscribe((booking: Booking) => {
            this.booking = booking;
            this.bookingForm.patchValue(booking);
          });
      } else {
        console.log('Booking ID not found in route parameters.');
      }
    });
    console.log(this.editMode);
  }

  public onSubmit(): void {
    this.route.paramMap.subscribe((params) => {
      if (this.bookingForm.valid) {
        const bookingData = this.bookingForm.value;
        const bookingId = +params.get('id');
        if (this.editMode) {
          // Update existing booking
          console.log('Updating Booking:', bookingId, bookingData);
          this.bookingService.updateBooking(bookingId, bookingData).subscribe(
            () => {
              this.toastr.success('Booking updated successfully.');
              setTimeout(() => {
                this.router.navigate(['/bookings']);
              }, 100);
            },
            (error) => {
              console.error(`Error updating booking: ${error}`);
              this.toastr.error(`Error updating booking: ${error}`);
            }
          );
        } else {
          // Create new booking
          console.log('Creating Booking:', bookingData);
          this.bookingService.createBooking(bookingData).subscribe(
            () => {
              console.log('Booking created successfully');
              this.toastr.success('Booking created successfully');
              setTimeout(() => {
                this.router.navigate(['/bookings']);
              }, 100);
            },
            (error) => {
              console.error(`Error creating booking: ${error}`);
              this.toastr.error(`Error creating booking: ${error}`);
            }
          );
        }
      } else {
        alert('Please enter valid booking details.');
      }
    });
  }
}
