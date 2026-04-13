"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWizardStore } from "@/lib/stores/wizard-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  analystNotes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onNext: () => void;
}

export function CompanyInfoStep({ onNext }: Props) {
  const { companyName, industry, analystNotes, setCompanyName, setIndustry, setAnalystNotes } =
    useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { companyName, industry, analystNotes },
  });

  function onSubmit(values: FormValues) {
    setCompanyName(values.companyName);
    setIndustry(values.industry ?? "");
    setAnalystNotes(values.analystNotes ?? "");
    onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Enter the basic details about the company being assessed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="e.g., Acme Corp Ltd."
              {...register("companyName")}
              aria-invalid={!!errors.companyName}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry / Sector</Label>
            <Input
              id="industry"
              placeholder="e.g., Construction, Retail, Healthcare"
              {...register("industry")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analystNotes">Additional Analyst Notes</Label>
            <Textarea
              id="analystNotes"
              placeholder="Any additional context that should be included in the report..."
              className="resize-none"
              rows={3}
              {...register("analystNotes")}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
