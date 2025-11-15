import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { FileText, Sparkles } from "lucide-react";
import { useContext } from "react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="h-10 w-10 text-green-600" />
          Course Landing Page
        </h1>
        <p className="text-gray-600 text-lg">Create compelling course information to attract students</p>
      </div>

      <Card className="shadow-2xl border-0 rounded-2xl bg-white overflow-hidden max-w-6xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-6 pt-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Sparkles className="h-7 w-7" />
            Course Details & Information
          </CardTitle>
          <p className="text-green-100 mt-1 text-sm">Fill in the details that will appear on your course landing page</p>
        </CardHeader>
        <CardContent className="p-8 bg-gradient-to-br from-white to-green-50/20">
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseLanding;
