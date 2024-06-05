export class Question {
    id: number | null
    orderNumber: number | null
    content: string | null
    optionA: string | null
    optionB: string | null
    optionC: string | null
    optionD: string | null
    explaintation: string | null
    script: string | null
    questionPassage: string | null
    image: string | null
    processedImg: string[] = []
    audio: string | null
    part: number | null
    correctOption: string | null

    constructor() {
        this.id = null
        this.orderNumber = null
        this.content = null
        this.optionA = null
        this.optionB = null
        this.optionC = null
        this.optionD = null
        this.explaintation = null
        this.script = null
        this.questionPassage = null
        this.audio = null
        this.part = null
        this.image = null
        this.processedImg = []
        this.correctOption = null
    }
}
