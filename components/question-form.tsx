"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  EQuestionCriteria,
  ECorrectAnswerType,
  type ICorrectAnswer,
  type ICorrectAnswerNumber,
  type ICorrectAnswerRange,
  type ICorrectAnswerYesNo,
  type ICorrectAnswerMCQSingle,
  type ICorrectAnswerMCQMultiple,
  type ICorrectAnswerText,
} from "@/types/question.types"

interface QuestionFormProps {
  initialQuestionData: {
    text: string
    criteria: EQuestionCriteria
    correctAnswer: ICorrectAnswer
    options?: string[]
    metadata: string
  }
}

export default function QuestionForm({ initialQuestionData }: QuestionFormProps) {
  const [formData, setFormData] = useState(initialQuestionData)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCriteriaChange = (criteria: EQuestionCriteria) => {
    setFormData((prev) => ({ ...prev, criteria }))
  }

  const handleAnswerTypeChange = (type: ECorrectAnswerType) => {
    let newCorrectAnswer: ICorrectAnswer
    let newOptions: string[] | undefined

    switch (type) {
      case ECorrectAnswerType.NUMBER:
        newCorrectAnswer = { type, value: 0 } as ICorrectAnswerNumber
        newOptions = undefined
        break
      case ECorrectAnswerType.RANGE:
        newCorrectAnswer = { type, value: [0, 100] } as ICorrectAnswerRange
        newOptions = undefined
        break
      case ECorrectAnswerType.YES_NO:
        newCorrectAnswer = { type, value: "yes" } as ICorrectAnswerYesNo
        newOptions = ["Yes", "No"]
        break
      case ECorrectAnswerType.MCQ_SINGLE:
        newCorrectAnswer = { type, value: "" } as ICorrectAnswerMCQSingle
        newOptions = formData.options?.length ? formData.options : ["Option 1", "Option 2", "Option 3", "Option 4"]
        break
      case ECorrectAnswerType.MCQ_MULTIPLE:
        newCorrectAnswer = { type, value: [] } as ICorrectAnswerMCQMultiple
        newOptions = formData.options?.length ? formData.options : ["Option 1", "Option 2", "Option 3", "Option 4"]
        break
      case ECorrectAnswerType.TEXT:
        newCorrectAnswer = { type, value: "" } as ICorrectAnswerText
        newOptions = undefined
        break
      default:
        return
    }

    setFormData((prev) => ({
      ...prev,
      correctAnswer: newCorrectAnswer,
      options: newOptions,
    }))
  }

  const handleCorrectAnswerChange = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswer: { ...prev.correctAnswer, value },
    }))
  }

  const handleRangeChange = (index: 0 | 1, value: number) => {
    const currentRange = formData.correctAnswer.value as [number, number]
    const newRange: [number, number] = [...currentRange]
    newRange[index] = value
    handleCorrectAnswerChange(newRange)
  }

  const handleMultipleChoiceChange = (option: string, checked: boolean) => {
    const currentValues = formData.correctAnswer.value as string[]
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, option]
    } else {
      newValues = currentValues.filter((v) => v !== option)
    }

    handleCorrectAnswerChange(newValues)
  }

  const handleOptionChange = (index: number, value: string) => {
    if (!formData.options) return
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    const newOptions = [...(formData.options || []), ""]
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const removeOption = (index: number) => {
    if (!formData.options) return
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const createQuestion = async () => {
    console.log("Creating question with data:", formData)
    // Implement API call here
  }

  const generateQuestionWithAI = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      setTimeout(() => {
        const generatedQuestion = {
          text: "What is the square root of 144?",
          criteria: EQuestionCriteria.EXACT,
          correctAnswer: {
            type: ECorrectAnswerType.NUMBER,
            value: 12,
          } as ICorrectAnswerNumber,
          metadata: "Basic mathematics question about square roots",
        }
        setFormData(generatedQuestion)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error generating question:", error)
      setIsLoading(false)
    }
  }

  const getRelevantCriteria = (answerType: ECorrectAnswerType): EQuestionCriteria[] => {
    switch (answerType) {
      case ECorrectAnswerType.NUMBER:
        return [
          EQuestionCriteria.EXACT,
          EQuestionCriteria.GREATER_THAN,
          EQuestionCriteria.LESSER_THAN,
          EQuestionCriteria.RANGE,
        ]
      case ECorrectAnswerType.RANGE:
        return [EQuestionCriteria.RANGE]
      case ECorrectAnswerType.YES_NO:
        return [EQuestionCriteria.EXACT]
      case ECorrectAnswerType.MCQ_SINGLE:
        return [EQuestionCriteria.EXACT, EQuestionCriteria.EXCLUDES]
      case ECorrectAnswerType.MCQ_MULTIPLE:
        return [EQuestionCriteria.INCLUDES, EQuestionCriteria.EXCLUDES]
      case ECorrectAnswerType.TEXT:
        return [EQuestionCriteria.EXACT, EQuestionCriteria.CONTAINS, EQuestionCriteria.MANUAL_REVIEW]
      default:
        return Object.values(EQuestionCriteria)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <Label htmlFor="text">Question Text</Label>
          <Textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Enter your question here..."
            className="min-h-[100px]"
          />
        </div>

        {/* Answer Type */}
        <div className="space-y-2">
          <Label htmlFor="answerType">Answer Type</Label>
          <Select
            value={formData.correctAnswer.type}
            onValueChange={(value) => handleAnswerTypeChange(value as ECorrectAnswerType)}
          >
            <SelectTrigger id="answerType">
              <SelectValue placeholder="Select answer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ECorrectAnswerType.TEXT}>Text</SelectItem>
              <SelectItem value={ECorrectAnswerType.NUMBER}>Number</SelectItem>
              <SelectItem value={ECorrectAnswerType.RANGE}>Number Range</SelectItem>
              <SelectItem value={ECorrectAnswerType.YES_NO}>Yes/No</SelectItem>
              <SelectItem value={ECorrectAnswerType.MCQ_SINGLE}>Multiple Choice (Single)</SelectItem>
              <SelectItem value={ECorrectAnswerType.MCQ_MULTIPLE}>Multiple Choice (Multiple)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Options (for MCQ and Yes/No) */}
        {(formData.correctAnswer.type === ECorrectAnswerType.MCQ_SINGLE ||
          formData.correctAnswer.type === ECorrectAnswerType.MCQ_MULTIPLE ||
          formData.correctAnswer.type === ECorrectAnswerType.YES_NO) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              {(formData.correctAnswer.type === ECorrectAnswerType.MCQ_SINGLE ||
                formData.correctAnswer.type === ECorrectAnswerType.MCQ_MULTIPLE) && (
                <Button type="button" variant="outline" size="sm" onClick={addOption} className="h-8">
                  <Plus className="h-4 w-4 mr-1" /> Add Option
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {formData.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    disabled={formData.correctAnswer.type === ECorrectAnswerType.YES_NO}
                  />
                  {(formData.correctAnswer.type === ECorrectAnswerType.MCQ_SINGLE ||
                    formData.correctAnswer.type === ECorrectAnswerType.MCQ_MULTIPLE) &&
                    formData.options &&
                    formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Criteria */}
        <div className="space-y-2">
          <Label htmlFor="criteria">Answer Criteria</Label>
          <Select value={formData.criteria} onValueChange={handleCriteriaChange}>
            <SelectTrigger id="criteria">
              <SelectValue placeholder="Select criteria" />
            </SelectTrigger>
            <SelectContent>
              {getRelevantCriteria(formData.correctAnswer.type).map((criteria) => (
                <SelectItem key={criteria} value={criteria}>
                  {criteria.charAt(0).toUpperCase() + criteria.slice(1).replace(/([A-Z])/g, " $1")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Correct Answer */}
        <div className="space-y-2">
          <Label htmlFor="correctAnswer">Correct Answer</Label>

          {formData.correctAnswer.type === ECorrectAnswerType.TEXT && (
            <Textarea
              id="correctAnswer"
              value={formData.correctAnswer.value}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              placeholder="Enter the correct answer"
            />
          )}

          {formData.correctAnswer.type === ECorrectAnswerType.NUMBER && (
            <Input
              id="correctAnswer"
              type="number"
              value={formData.correctAnswer.value}
              onChange={(e) => handleCorrectAnswerChange(Number(e.target.value))}
              placeholder="Enter the correct number"
            />
          )}

          {formData.correctAnswer.type === ECorrectAnswerType.RANGE && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={(formData.correctAnswer.value as [number, number])[0]}
                onChange={(e) => handleRangeChange(0, Number(e.target.value))}
                placeholder="Min value"
              />
              <span>to</span>
              <Input
                type="number"
                value={(formData.correctAnswer.value as [number, number])[1]}
                onChange={(e) => handleRangeChange(1, Number(e.target.value))}
                placeholder="Max value"
              />
            </div>
          )}

          {formData.correctAnswer.type === ECorrectAnswerType.YES_NO && (
            <RadioGroup
              value={formData.correctAnswer.value}
              onValueChange={handleCorrectAnswerChange}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          )}

          {formData.correctAnswer.type === ECorrectAnswerType.MCQ_SINGLE && (
            <RadioGroup
              value={formData.correctAnswer.value}
              onValueChange={handleCorrectAnswerChange}
              className="space-y-2"
            >
              {formData.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`single-option-${index}`} />
                  <Label htmlFor={`single-option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {formData.correctAnswer.type === ECorrectAnswerType.MCQ_MULTIPLE && (
            <div className="space-y-2">
              {formData.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`multiple-option-${index}`}
                    checked={(formData.correctAnswer.value as string[]).includes(option)}
                    onCheckedChange={(checked) => handleMultipleChoiceChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`multiple-option-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2">
          <Label htmlFor="metadata">Additional Information</Label>
          <Textarea
            id="metadata"
            name="metadata"
            value={formData.metadata}
            onChange={handleInputChange}
            placeholder="Enter any additional information or instructions"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button onClick={createQuestion} className="w-full sm:w-auto">
          Create Question
        </Button>
        <Button onClick={generateQuestionWithAI} variant="outline" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Question with AI"}
        </Button>
      </CardFooter>
    </Card>
  )
}
