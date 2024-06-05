import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { TestCategoryService } from '../../../../services/test/test-category.service';
import { AdminTestService } from '../../../../services/admin/admin-test.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-add-test',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatInputModule,
     MatFormFieldModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './dialog-add-test.component.html',
  styleUrl: './dialog-add-test.component.css'
})
export class DialogAddTestComponent implements OnInit{

  testCategories: any[] = []
  addTestForm!: FormGroup

  constructor(private testCateService: TestCategoryService,
    private formBuilder: FormBuilder,
    private adminService: AdminTestService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.getAllTestCategory()

    this.addTestForm = this.formBuilder.group({
      testTitle: ['', Validators.required],
      categoryId: ['', Validators.required]
    })
  }

  getAllTestCategory() {
    this.testCateService.getAll().subscribe({
      next: (resp) => {
        this.testCategories = resp
      }
    })
  }

  addTest() {
    Swal.fire({
      title: 'Vui lòng chờ...',
      html: 'Đang tải dữ liệu...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.adminService.createTest(this.addTestForm.value).subscribe({
      next: async (resp) => {
        Swal.close()
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "New test created successfuly!", 
          showConfirmButton: false,
          timer: 1500
        })

        await this.router.navigate(['/refresh'], {skipLocationChange: true}).then(() => {
          this.router.navigate(['/admindashboard/tests/'+resp.id+'/questions'])
        })
      },
      error: async (err) => {
        Swal.close()
        await Swal.fire({
          title: "Cancelled!",
          text: "Error while creating test. " + err.error,
          icon: "error"
        })
      }
    })
  }
}
