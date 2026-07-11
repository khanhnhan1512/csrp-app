"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWizardStore } from "@/lib/stores/wizard-store";
import type { Category } from "@/lib/questionnaire/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

interface Props {
  category: Category;
  onNext: () => void;
  onBack: () => void;
}

export function CategoryStep({ category, onNext, onBack }: Props) {
  const { answers, setAnswer } = useWizardStore();

  // Answers are optional — unanswered questions default to "Not applicable" on submit.
  const schemaShape: Record<string, z.ZodOptional<z.ZodString>> = {};
  for (const q of category.questions) {
    schemaShape[q.id] = z.string().optional();
  }
  const schema = z.object(schemaShape);
  type FormValues = z.infer<typeof schema>;

  const defaultValues: Record<string, string> = {};
  for (const q of category.questions) {
    defaultValues[q.id] = answers[q.id] ?? "";
  }

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues,
  });

  const watchedValues = watch();

  function onSubmit(values: FormValues) {
    for (const question of category.questions) {
      const val = values[question.id as keyof FormValues];
      if (val) {
        setAnswer(question.id, val);
      } else {
        const naOption = question.options.find((o) => o.score === null);
        setAnswer(question.id, naOption?.value ?? "na");
      }
    }
    onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.label}</CardTitle>
        <CardDescription>
          Select the option that best describes the company for each question. Unanswered
          questions default to &quot;Not applicable&quot;.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {category.questions.map((question, idx) => (
            <div key={question.id}>
              {idx > 0 && <Separator className="mb-6" />}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">{question.label}</p>
                <div className="space-y-2">
                  {question.options.map((option) => {
                    const isSelected = watchedValues[question.id as keyof FormValues] === option.value;
                    return (
                      <div
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setValue(question.id as keyof FormValues, option.value, { shouldValidate: true })}
                      >
                        {/* Custom radio indicator */}
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected ? "border-primary" : "border-gray-300"
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                        {option.score !== null && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              option.score === 0
                                ? "bg-green-100 text-green-700"
                                : option.score === 1
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {option.score === 0 ? "Low" : option.score === 1 ? "Medium" : "High"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {errors[question.id as keyof FormValues] && (
                  <p className="text-sm text-red-500">
                    {errors[question.id as keyof FormValues]?.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button type="submit">
              Continue
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
