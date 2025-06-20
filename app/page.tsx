import QuestionForm from "@/components/question-form"
import { EQuestionCriteria, ECorrectAnswerType, type ICorrectAnswerMCQSingle } from "@/types/question.types"

export default function Home() {
  // Sample initial data matching the new structure
  const initialQuestionData = {
    text: "What is the capital of France?",
    criteria: EQuestionCriteria.EXACT,
    correctAnswer: {
      type: ECorrectAnswerType.MCQ_SINGLE,
      value: "Paris",
    } as ICorrectAnswerMCQSingle,
    options: ["Paris", "London", "Berlin", "Madrid"],
    metadata: "Geography question about European capitals",
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Question Creator</h1>
      <QuestionForm initialQuestionData={initialQuestionData} />
    </main>
  )
}
