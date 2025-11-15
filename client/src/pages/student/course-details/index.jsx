import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle, Clock, Users, Calendar } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-[#474973] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {studentViewCourseDetails?.title}
            </h1>
            <p className="text-lg md:text-xl mb-4 text-slate-200">
              {studentViewCourseDetails?.subtitle}
            </p>
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                  {studentViewCourseDetails?.instructorName?.charAt(0)}
                </div>
                <span className="font-medium">{studentViewCourseDetails?.instructorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{studentViewCourseDetails?.date.split("T")[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{studentViewCourseDetails?.primaryLanguage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {studentViewCourseDetails?.students.length}{" "}
                  {studentViewCourseDetails?.students.length <= 1 ? "Student" : "Students"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* What You'll Learn */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-2xl text-gray-800">What you'll learn</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentViewCourseDetails?.objectives
                    .split(",")
                    .map((objective, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{objective}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-2xl text-gray-800">Course Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {studentViewCourseDetails?.description}
                </p>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-2xl text-gray-800">Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {studentViewCourseDetails?.curriculum?.map(
                    (curriculumItem, index) => (
                      <div
                        key={index}
                        className={`${
                          curriculumItem?.freePreview
                            ? "cursor-pointer hover:bg-indigo-50 hover:border-indigo-200"
                            : "cursor-not-allowed opacity-75"
                        } flex items-center gap-3 p-4 border rounded-lg transition-all duration-200`}
                        onClick={
                          curriculumItem?.freePreview
                            ? () => handleSetFreePreview(curriculumItem)
                            : null
                        }
                      >
                        <div className={`p-2 rounded-full ${
                          curriculumItem?.freePreview 
                            ? "bg-indigo-100 text-indigo-600" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {curriculumItem?.freePreview ? (
                            <PlayCircle className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">
                            {curriculumItem?.title}
                          </span>
                          {curriculumItem?.freePreview && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Free Preview
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardContent className="p-0">
                  {/* Video Preview */}
                  <div className="aspect-video bg-gray-900">
                    <VideoPlayer
                      url={
                        getIndexOfFreePreviewUrl !== -1
                          ? studentViewCourseDetails?.curriculum[
                              getIndexOfFreePreviewUrl
                            ].videoUrl
                          : ""
                      }
                      width="100%"
                      height="100%"
                    />
                  </div>

                  {/* Purchase Section */}
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        ${studentViewCourseDetails?.pricing}
                      </div>
                      <p className="text-gray-500 text-sm">One-time payment</p>
                    </div>

                    <Button 
                      onClick={handleCreatePayment} 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                    >
                      Buy Now
                    </Button>

                    <div className="pt-4 border-t space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>30-day money-back guarantee</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Free Preview Dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Course Preview</DialogTitle>
          </DialogHeader>

          <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="100%"
            />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Available Previews
            </p>
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <div
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer p-3 rounded-lg hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-200 flex items-center gap-3"
                >
                  <PlayCircle className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-gray-800">{filteredItem?.title}</span>
                </div>
              ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="px-6">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
