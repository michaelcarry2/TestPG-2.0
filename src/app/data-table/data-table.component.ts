import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IUser } from '../Interfaces/user.interface';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    HttpClientModule,
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
    U: 'Unknow',
  };

  @Output() editUser = new EventEmitter<IUser>();
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<IUser[]>('assets/sample-data.json').subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  getGenderFullName(gender: string): string {
    return this.genderMap[gender] || 'Unknow';
  }

  edit(user: IUser): void {
    this.editUser.emit(user);
  }

  //ผมได้พยายามลอง update ในรูปแบบที่ เคยบอกไว้แล้ว แต่ผมไม่รู้วิธี ทำยังไงให้มัน update จริงๆครับ ผมอาจจะทำพลาดตรงไหนตั้งแต่แรก แต่ผมพยายามหาหลายๆทางแล้ว
  // ก็ยังไม่ได้เลย ถ้าหากแนะนำได้จะขอบคุณมากครับ ผมไม่ชัวร์เลยว่าต้องทำแบบไหน update แบบ ที่โจทย์บอกให้เปลี่ยนแค่ตรงหน้าจอ
  updateData(updatedData: IUser[]): void {
    this.http.put<IUser[]>('assets/sample-data.json', updatedData).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', err);
      },
    });
  }
}
