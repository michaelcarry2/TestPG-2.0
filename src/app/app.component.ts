import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { DataService } from './data.service';
import { IUser } from './Interfaces/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    DataTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'TestPG';
  @ViewChild(DataTableComponent) dataTableComponent!: DataTableComponent;

  userForm: FormGroup;

  genders = [
    { value: '', viewValue: '' },
    { value: 'Male', viewValue: 'Male' },
    { value: 'Female', viewValue: 'Female' },
    { value: 'Unknown', viewValue: 'Unknown' },
  ];

  isEditMode = false;
  editingUser: IUser | null = null;

  constructor(private _fb: FormBuilder, private dataService: DataService) {
    this.userForm = this._fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['', Validators.required],
      score: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  ngOnInit() {}

  onFormSubmit() {
    if (this.userForm.valid) {
      const formData: IUser = this.userForm.value;
      if (this.isEditMode && this.editingUser) {
        this.dataService.updateUser(this.editingUser.id, formData).subscribe({
          next: (data: IUser) => {
            console.log('ข้อมูลได้รับการอัปเดตเรียบร้อยแล้ว', data);
            this.dataTableComponent.updateData(data);
            this.resetForm();
          },
          error: (error: any) => {
            console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
          },
        });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onEdit(user: IUser): void {
    this.editingUser = user;
    this.isEditMode = true;
    this.userForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      gender: this.matchGender(user.gender),
      score: user.score,
    });
  }

  matchGender(gender: string): string {
    const genderMap: { [key: string]: string } = {
      M: 'Male',
      F: 'Female',
      U: 'Unknown',
    };
    return genderMap[gender] || '';
  }

  onCancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.userForm.reset();
    this.isEditMode = false;
    this.editingUser = null;
  }

  updateData(userId: number, updatedData: IUser): void {
    this.dataService.updateUser(userId, updatedData).subscribe({
      next: (data) => {
        console.log('ข้อมูลถูกอัปเดตเรียบร้อยแล้ว:', data);
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', err);
      },
    });
  }
}
