export class Test {
    id: number | null
    testTitle: string | null
    duration: number | null

    constructor(id: number | null,
        testTitle: string | null,
        duration: number | null) {
        this.id = id
        this.testTitle = testTitle
        this.duration = duration
    }
}