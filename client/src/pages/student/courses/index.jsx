import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    console.log(indexOfCurrentSeection, getSectionId);
    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

      console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
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
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  console.log(loadingState, "loadingState");

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-white shadow border px-4 py-2 rounded-md hover:bg-gray-100 transition">
                <ArrowUpDownIcon className="h-4 w-4" />
                <span>Sort By</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) => setSort(value)}
              >
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem
                    value={sortItem.id}
                    key={sortItem.id}
                  >
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-sm text-gray-600">{studentViewCoursesList.length} Results</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="bg-white shadow rounded-xl p-6 space-y-8 col-span-1">
          {/* Category Filter */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-indigo-600">Category</h3>
            <div className="space-y-2">
              {filterOptions.category.map((option) => (
                <label key={option.id} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <Checkbox
                    checked={filters && filters.category && filters.category.indexOf(option.id) > -1}
                    onCheckedChange={() => handleFilterOnChange('category', option)}
                    className="accent-indigo-600"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          {/* Level Filter */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-indigo-600">Level</h3>
            <div className="space-y-2">
              {filterOptions.level.map((option) => (
                <label key={option.id} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <Checkbox
                    checked={filters && filters.level && filters.level.indexOf(option.id) > -1}
                    onCheckedChange={() => handleFilterOnChange('level', option)}
                    className="accent-indigo-600"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          {/* Language Filter */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-indigo-600">Primary Language</h3>
            <div className="space-y-2">
              {filterOptions.primaryLanguage.map((option) => (
                <label key={option.id} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <Checkbox
                    checked={filters && filters.primaryLanguage && filters.primaryLanguage.indexOf(option.id) > -1}
                    onCheckedChange={() => handleFilterOnChange('primaryLanguage', option)}
                    className="accent-indigo-600"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="cursor-pointer bg-white rounded-xl shadow hover:bg-indigo-50 transition duration-300 hover:shadow-lg"
                  key={courseItem?._id}
                >
                  <CardContent className="flex flex-col gap-4 p-4">
                    <div className="w-full h-40 flex-shrink-0 mb-2">
                      <img
                        src={courseItem?.image}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 text-gray-900">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By <span className="font-bold">{courseItem?.instructorName}</span>
                      </p>
                      <p className="text-[15px] text-gray-600 mt-2 mb-2">
                        {`${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"} - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-indigo-600 text-lg">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-24">
                <h2 className="text-2xl font-semibold text-gray-800">🚫 No Courses Found</h2>
                <p className="text-gray-500 mt-2">Try adjusting the filters or check back later.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
