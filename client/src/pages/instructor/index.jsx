import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, GraduationCap } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  console.log(instructorCoursesList, "instructorCoursesList");

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl hidden md:flex flex-col">
        <div className="p-8">
          {/* Logo/Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin</h2>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                className={`w-full justify-start gap-3 h-12 text-base transition-all duration-200 ${
                  activeTab === menuItem.value
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-transparent hover:bg-slate-700/50 text-gray-300 hover:text-white border-0"
                }`}
                variant={activeTab === menuItem.value ? "default" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="h-5 w-5" />
                <span className="font-medium">{menuItem.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        
        {/* Footer Section */}
        <div className="mt-auto p-6 border-t border-slate-700">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl p-4 backdrop-blur">
            <p className="text-sm text-white font-medium">Instructor Panel</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1">
                      {menuItems.find(item => item.value === activeTab)?.label}
                    </h1>
                    <p className="text-slate-600">Manage your teaching experience</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl shadow-lg">
                    <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                    <span className="font-semibold text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content - ALL original functionality preserved */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {menuItems.map((menuItem) => (
                <TabsContent key={menuItem.value} value={menuItem.value} className="mt-0">
                  {menuItem.component !== null ? menuItem.component : null}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
