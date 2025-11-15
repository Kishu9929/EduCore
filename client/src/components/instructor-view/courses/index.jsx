import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourseByIdService } from "@/services";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    instructorCoursesList,
    setInstructorCoursesList,
  } = useContext(InstructorContext);

  async function handleDeleteCourse(courseId) {
    try {
      const resp = await deleteCourseByIdService(courseId);
      if (resp?.success) {
        const updated = instructorCoursesList.filter((c) => c._id !== courseId);
        setInstructorCoursesList(updated);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Card className="shadow-xl border-0 rounded-xl">
      <CardHeader className="flex justify-between flex-row items-center pb-6">
        <CardTitle className="text-3xl font-bold text-gray-800">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b-2 border-gray-200">
                <TableHead className="text-left font-semibold text-gray-700 text-base py-4">Course</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 text-base py-4">Students</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 text-base py-4">Revenue</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 text-base py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course, index) => (
                    <TableRow 
                      key={course._id}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100`}
                    >
                      <TableCell className="text-left py-4 text-gray-800 font-semibold">
                        {course?.title}
                      </TableCell>
                      <TableCell className="text-left py-4 text-gray-700">
                        {course?.students?.length}
                      </TableCell>
                      <TableCell className="text-left py-4 text-gray-700 font-semibold">
                        ${course?.students?.length * course?.pricing}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          variant="ghost"
                          size="sm"
                          className="mr-2 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCourse(course?._id)}
                          className="hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                        >
                          <Delete className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
