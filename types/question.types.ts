export enum EQuestionCriteria {
  EXACT = "exact",
  GREATER_THAN = "greaterThan",
  LESSER_THAN = "lesserThan",
  RANGE = "range",
  INCLUDES = "includes",
  EXCLUDES = "excludes",
  CONTAINS = "contains",
  MANUAL_REVIEW = "manualReview",
}

export enum ECorrectAnswerType {
  NUMBER = "number",
  RANGE = "range",
  YES_NO = "yesNo",
  MCQ_SINGLE = "mcqSingle",
  MCQ_MULTIPLE = "mcqMultiple",
  TEXT = "text",
}

/* ---------- shared answer union ---------- */
export interface ICorrectAnswerBase<T extends ECorrectAnswerType = ECorrectAnswerType, V = unknown> {
  type: T
  value: V
}

export type ICorrectAnswerNumber = ICorrectAnswerBase<ECorrectAnswerType.NUMBER, number>
export type ICorrectAnswerRange = ICorrectAnswerBase<ECorrectAnswerType.RANGE, [number, number]>
export type ICorrectAnswerYesNo = ICorrectAnswerBase<ECorrectAnswerType.YES_NO, "yes" | "no">
export type ICorrectAnswerMCQSingle = ICorrectAnswerBase<ECorrectAnswerType.MCQ_SINGLE, string>
export type ICorrectAnswerMCQMultiple = ICorrectAnswerBase<ECorrectAnswerType.MCQ_MULTIPLE, string[]>
export type ICorrectAnswerText = ICorrectAnswerBase<ECorrectAnswerType.TEXT, string>

export type ICorrectAnswer =
  | ICorrectAnswerNumber
  | ICorrectAnswerRange
  | ICorrectAnswerYesNo
  | ICorrectAnswerMCQSingle
  | ICorrectAnswerMCQMultiple
  | ICorrectAnswerText

/* ---------- question shape used on the client ---------- */
export interface IQuestion {
  _id: string
  jobId: string
  text: string
  criteria: EQuestionCriteria
  correctAnswer: ICorrectAnswer
  options?: string[]
  metadata: string
  createdAt: Date
  updatedAt: Date
}
