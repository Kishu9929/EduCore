import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: calculateTotalStudentsAndProfit().totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: calculateTotalStudentsAndProfit().totalProfit,
    },
  ];

  return (
    <div className="text-gray-800 font-['Inter',sans-serif]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0 md:p-0 mb-6">
        {config.map((item, index) => (
          <Card key={index} className="shadow-lg border-0 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {item.label}
              </CardTitle>
              <item.icon className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl border-0 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-800">Students List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b-2 border-gray-200">
                  <TableHead className="text-left font-semibold text-gray-700 text-base py-4">Course Name</TableHead>
                  <TableHead className="text-left font-semibold text-gray-700 text-base py-4">Student Name</TableHead>
                  <TableHead className="text-left font-semibold text-gray-700 text-base py-4">Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateTotalStudentsAndProfit().studentList.length > 0 ? (
                  calculateTotalStudentsAndProfit().studentList.map((studentItem, index) => (
                    <TableRow
                      key={index}
                      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100`}
                    >
                      <TableCell className="text-left py-4 text-gray-800 font-medium">
                        {studentItem.courseTitle}
                      </TableCell>
                      <TableCell className="text-left py-4 text-gray-700">
                        {studentItem.studentName}
                      </TableCell>
                      <TableCell className="text-left py-4 text-gray-700">
                        {studentItem.studentEmail}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500 italic">No students enrolled yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
