import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestService } from '../../services/test/test.service';
import { QuestionService } from '../../services/test/question.service';
import { ResourceService } from '../../services/test/resource.service';
import { CountdownComponent, CountdownModule, CountdownStatus } from 'ngx-countdown';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Question } from '../../model/question';
import { Test } from '../../model/test';

@Component({
  selector: 'app-dotest',
  standalone: true,
  imports: [CommonModule, RouterLink, CountdownModule,
    ReactiveFormsModule
  ],
  templateUrl: './dotest.component.html',
  styleUrl: './dotest.component.css'
})
export class DotestComponent implements OnInit, AfterViewInit {

  test: Test = new Test(null, null, null)
  questions: Question[] = []
  formatedQuestionsPart3: any[] = []
  formatedQuestionsPart4: any[] = []
  formatedQuestionsPart5: any[] = []
  formatedQuestionsPart6: any[] = []
  formatedQuestionsPart7: any[] = []
  audio: any = null

  part: boolean[] = [true, false, false, false, false, false, false]

  submitAnswerForm!: FormGroup

  constructor(private router: Router,
    private route: ActivatedRoute,
    private testService: TestService,
    private questionService: QuestionService,
    private resourceService: ResourceService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): any {
    this.getTest()
    this.formInit()
  }

  formInit() {
    
  }

  switchPart(partNum: any) {
    for (let index = 0; index < this.part.length; index++) {
      if (index == partNum - 1) {
        this.part[index] = true
      } else {
        this.part[index] = false
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getTest() {
    var testId
    this.route.params.subscribe(params => { testId = params['id'] })
    this.testService.getById(testId).subscribe({
      next: (resp) => {
        this.test = resp
        this.questionService.getQuestionsByTestId(this.test.id).subscribe({
          next: (questionsResp) => {
            /** questionResp trả về từ API chưa có thuộc tính processedImg
             *  nên khi gán cho questions: Question[] thì processedImg sẽ là undefined */
            this.questions = questionsResp
            this.audio = questionsResp[0].audio
            this.processImages()
          }
        })
      }
    })
  }

  processImages() {
    this.questions.forEach((question) => {
      if (question.image != null) {
        /** 
         * khi fetch questions từ API processedImg chưa có ( undefined )
        */ 
        question.processedImg = []
        /**
         * Trong file excel, nếu nhiều câu hỏi cùng nằm trong 1 đoạn ( Passage )
         * thì câu hỏi đầu tiên trong đoạn sẽ chứa tất cả hình ảnh của cả đoạn,
         * cách nhau bởi khoảng trắng ' '
         */
        question.image.split(' ').forEach((image) => {
          image = 'http://localhost:8080/images/' + this.test.testTitle + '/' + image  
          question.processedImg.push(image)
        })
      }
    })

    this.formatedQuestionsPart3 = this.showQuestionsFormated(3)
    this.formatedQuestionsPart4 = this.showQuestionsFormated(4)
    this.formatedQuestionsPart5 = this.showQuestionsFormated(5)
    this.formatedQuestionsPart6 = this.showQuestionsFormated(6)
    this.formatedQuestionsPart7 = this.showQuestionsFormated(7)
  }

  /** thuật toán hiển thị câu hỏi format theo passage */
  showQuestionsFormated(part: number): any[] {
    var formatedQuestions: any[] = []
    var stepPassage = 0 /** biến đếm số câu hỏi liên tiếp trong 1 passage để nhảy qua passage trong vòng lặp toàn bộ question */
    var indexOfFormatedQuestions = 0
    for (let i=0; i <= this.questions.length-1; i++) {
      /** lọc câu hỏi theo part */
      if (this.questions[i].part == part) {
        /** case nhiều câu hỏi cùng dùng 1 passage ( start - end ) */
        if (this.questions[i].questionPassage == 'start') {
          // console.log('Start passage: ' + this.questions[i].processedImg)
          formatedQuestions.push(new passageQuestion([], this.questions[i].processedImg))
          indexOfFormatedQuestions += 1
          for (let j=i; j <= this.questions.length-1; j++) {
            // console.log('question: ' + this.questions[j].orderNumber)
            formatedQuestions[indexOfFormatedQuestions-1].questions.push(this.questions[j])
            stepPassage += 1
            if (this.questions[j].questionPassage == 'end') {
              /** khi đã duyệt hết 1 passage, nhảy qua số câu hỏi trong passage đó.
               *  Tổng số câu hỏi trong passage = stepPassage, tuy nhiên biến đếm chạy từ câu hỏi 
               *  đầu tiên. VD: câu 62 start - 64 end, i = j = 62
               *  kết thúc vòng lặp passage có stepPassage = 3, lúc này dừng ở câu 64,
               *  vòng lặp tiếp theo i tự động tăng lên 1 thành câu 65 => i += stepPassage - 1
               */
              i += stepPassage - 1
              stepPassage = 0
              break;
            }
          }
        } 
        /** case câu hỏi không dùng chung passage nào */
        else {
          // console.log('Question: ' + this.questions[i].orderNumber)
          formatedQuestions.push(new singleQuestion(this.questions[i]))
          indexOfFormatedQuestions += 1
        }
      }
    }
    return formatedQuestions
  }

  handleEvent(event: any) {
    if (event.action === 'notify' && event.left === 0 && event.status === 'done') {
      this.submitAnswer();
    }
  }

  submitAnswer() {
    this.router.navigate(['tests/19/results/123123'])
  }
}

export class singleQuestion {
  type: string
  question: Question

  constructor(question: Question) {
    this.type = 'singleQuestion'
    this.question = question
  }
}

export class passageQuestion {
  type: string
  questions: Question[]
  images: string[]

  constructor(questions: Question[], images: string[]) {
    this.type = 'passageQuestion'
    this.questions = questions
    this.images = images
  }
}