import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Unlock Your Future with <span className="text-indigo-600">Educore</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Learn in-demand skills from industry experts. Shape your tomorrow—starting today.
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      {/* Upgraded Course Categories Section */}
      <div className="bg-gray-100 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Explore Course Categories</h2>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courseCategories.map((categoryItem) => (
            <div
              key={categoryItem.id}
              className="rounded-xl shadow-md bg-white hover:bg-indigo-50 transition duration-300 cursor-pointer p-5 flex items-center justify-center font-medium text-gray-700 text-center hover:shadow-lg"
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </div>
          ))}
        </div>
      </div>
      {/* Upgraded Featured Courses Section */}
      <div className="py-10 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">All Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                key={courseItem?._id}
              >
                <img
                  src={courseItem?.image}
                  alt={courseItem?.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-600">{courseItem?.instructorName}</p>
                  <span className="inline-block px-3 py-1 text-indigo-600 font-bold rounded-md bg-indigo-100 w-fit">
                    ${courseItem?.pricing}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-lg w-full col-span-full">🎓 No Courses Found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHomePage;
