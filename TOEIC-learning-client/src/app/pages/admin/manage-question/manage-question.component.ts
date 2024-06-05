import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { QuestionService } from '../../../services/test/question.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestService } from '../../../services/test/test.service';
import { DialogImportQuestionExcelComponent } from './dialog-import-question-excel/dialog-import-question-excel.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminQuestionService } from '../../../services/admin/admin-question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-question',
  standalone: true,
  imports: [RouterLink, DataTablesModule, CommonModule,
    MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './manage-question.component.html',
  styleUrl: './manage-question.component.css'
})
export class ManageQuestionComponent implements OnInit {

  dtOptions: Config = {}
  test!: any
  questions: any[] = []
  currentUrl = this.router.url

  constructor(private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private snackBar: MatSnackBar,
    private testService: TestService,
    private adminService: AdminQuestionService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
    }
    const testId = this.route.snapshot.url[1].path
    this.getTest(testId)
    this.getAllQuestionsFromTest(testId)
  }

  getTest(testId: any) {
    this.testService.getById(testId).subscribe({
      next: (resp) => {
        this.test = resp
      }
    })
  }

  getAllQuestionsFromTest(testId: any) {
    this.questionService.getQuestionsByTestId(testId).subscribe({
      next: (resp: any) => {
        resp.forEach((element: any) => {
          element.image = 'http://localhost:8080/images/' + this.test.testTitle + '/' + element.image
        });
        this.questions = resp
      },
      error: (err) => {
        this.snackBar.open('Lỗi: ' + err.error, 'Đóng', { duration: 3000 })
      }
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogImportQuestionExcelComponent, {
      data: { testId: this.test.id }
    })

    dialogRef.afterClosed().subscribe((result => {
      console.log(`Dialog result: ${result}`)
    }));
  }

  deleteAll() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Vui lòng chờ...',
          html: 'Đang tải dữ liệu...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const testId = this.route.snapshot.url[1].path
        this.adminService.deleteAllQuestionsByTest(testId).subscribe({
          next: async (resp) => {
            Swal.close();
            await Swal.fire({
              position: "center",
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });

            await this.router.navigate(['/refresh'], { skipLocationChange: true }).then(() => {
              this.router.navigate([this.currentUrl])
            })
          },
          error: (err) => {
            Swal.close()
            Swal.fire({
              title: "Cancelled!",
              text: "Error while deleting files.",
              icon: "error"
            })
          }
        })
      }
    });
  }
}
