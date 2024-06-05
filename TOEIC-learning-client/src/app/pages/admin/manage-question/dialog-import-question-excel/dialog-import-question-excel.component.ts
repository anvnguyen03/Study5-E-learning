import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminTestService } from '../../../../services/admin/admin-test.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminQuestionService } from '../../../../services/admin/admin-question.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-import-question-excel',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatInputModule,
    MatFormFieldModule, ReactiveFormsModule, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: './dialog-import-question-excel.component.html',
  styleUrl: './dialog-import-question-excel.component.css'
})
export class DialogImportQuestionExcelComponent implements OnInit{
  
  fileQuestions?: File | null
  filesImages?: File[] | null
  fileAudio?: File | null
  testId: any
  currentUrl: any

  constructor(
    private formBuilder: FormBuilder,
    private adminQuestionService: AdminQuestionService,
    private snackBar: MatSnackBar,
    private router: Router,
    // public dialogRef: MatDialogRef<DialogImportQuestionExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  ngOnInit(): void {
    this.testId = this.data.testId
    this.currentUrl = this.router.url
  }

  onFileExcelSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      this.fileQuestions = file
    } else {
      this.fileQuestions = null
    }

  }
  onFileImageSelected(event: any) {
    const files = event.target.files
    if (files) {
      this.filesImages = files
    } else {
      this.filesImages = null
    }
  }

  onFileAudioSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      this.fileAudio = file
    } else {
      this.fileAudio = null
    }
  }

  async submit() {
    Swal.fire({
      title: 'Vui lòng chờ...',
      html: 'Đang tải dữ liệu...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    await this.uploadExcelQuestions()
    await this.uploadImages()
    await this.uploadAudio()
  }

  async uploadExcelQuestions() {
    const excelForm: FormData = new FormData()
    excelForm.append('file', this.fileQuestions!)
    excelForm.append('testId', this.testId)
    this.adminQuestionService.uploadExcelQuesions(excelForm).subscribe({
      next: (resp) => {
        console.log(resp)
      },
      error: (err) => {
        Swal.close()
        Swal.fire({
          title: "Cancelled!",
          text: "Error while uploading questions. " + err.error,
          icon: "error"
        })
      }
    })
  }

  async uploadImages() {
    const imagesForm: FormData = new FormData()
    for (const file of this.filesImages!) {
      imagesForm.append('image', file)
    }
    imagesForm.append('testId', this.testId)
    this.adminQuestionService.uploadImages(imagesForm).subscribe({
      next: (resp) => {
        console.log(resp)
      },
      error: (err) => {
        Swal.close()
        Swal.fire({
          title: "Cancelled!",
          text: "Error while uploading images. " + err.error,
          icon: "error"
        })
      }
    })
  }

  async uploadAudio() {
    const audioForm: FormData = new FormData()
    audioForm.append('audio', this.fileAudio!)
    audioForm.append('testId', this.testId)
    this.adminQuestionService.uploadAudio(audioForm).subscribe({
      next: async (resp) => {
        console.log(resp)
        Swal.close()
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved.", 
          showConfirmButton: false,
          timer: 2000
        })

        await this.router.navigate(['/refresh'], { skipLocationChange: true }).then(() => {
          this.router.navigate([this.currentUrl])
        })
      },
      error: (err) => {
        console.log(err)
        Swal.close()
        Swal.fire({
          title: "Cancelled!",
          text: "Error while uploading audio. " + err.error,
          icon: "error"
        })
      }
    })
  }

}
