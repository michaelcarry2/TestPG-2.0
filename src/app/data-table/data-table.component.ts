import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IUser } from '../Interfaces/user.interface';
import { DataService } from '../data.service'; // ใช้ DataService

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class DataTableComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'edit',
    'firstname',
    'lastname',
    'gender',
    'score',
  ];
  dataSource = new MatTableDataSource<any>([]);

  genderMap: { [key: string]: string } = {
    '': '',
    M: 'Male',
    F: 'Female',
    U: 'Unknown',
  };

  @Output() editUser = new EventEmitter<IUser>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.dataService.getUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      },
    });
  }

  getGenderFullName(gender: string): string {
    return this.genderMap[gender] || 'Unknown';
  }

  edit(user: IUser): void {
    this.editUser.emit(user);
  }

  updateData(updatedUser: IUser): void {
    const gender = this.matchGender(updatedUser.gender);

    this.dataService
      .updateUser(updatedUser.id, { ...updatedUser, gender })
      .subscribe({
        next: (data) => {
          const index = this.dataSource.data.findIndex(
            (user) => user.id === updatedUser.id
          );
          if (index !== -1) {
            this.dataSource.data[index] = data;

            this.dataSource.data = [...this.dataSource.data];
            console.log('ข้อมูลผู้ใช้ได้รับการอัปเดตเรียบร้อยแล้ว');
          } else {
            console.error('ไม่พบผู้ใช้ที่ต้องการอัปเดต');
          }
        },
        error: (error) => {
          console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
        },
      });
  }

  matchGender(gender: string): string {
    let n: string;

    switch (gender) {
      case 'Male':
        n = 'M';
        break;
      case 'Female':
        n = 'F';
        break;
      case 'Unknown':
        n = 'U';
        break;
      default:
        n = '';
    }

    return n;
  }
}
