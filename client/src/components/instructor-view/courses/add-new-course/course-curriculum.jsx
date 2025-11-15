import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload, Video, Trash2, RefreshCw, BookOpen } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      console.log(response, "bulk");
      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-orange-600" />
          Course Curriculum
        </h1>
        <p className="text-gray-600 text-lg">Build your course content with engaging lectures</p>
      </div>

      <Card className="shadow-2xl border-0 rounded-2xl bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white pb-6 pt-6">
          <div className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Video className="h-7 w-7" />
                Create Course Curriculum
              </CardTitle>
              <p className="text-orange-100 mt-1 text-sm">Add and organize your lecture videos</p>
            </div>
            <div>
              <Input
                type="file"
                ref={bulkUploadInputRef}
                accept="video/*"
                multiple
                className="hidden"
                id="bulk-media-upload"
                onChange={handleMediaBulkUpload}
              />
              <Button
                as="label"
                htmlFor="bulk-media-upload"
                variant="outline"
                className="cursor-pointer px-6 py-3 bg-white text-orange-600 border-2 border-white hover:bg-orange-50 transition-all duration-200 rounded-xl font-semibold shadow-lg"
                onClick={handleOpenBulkUploadDialog}
              >
                <Upload className="w-5 h-5 mr-2" />
                Bulk Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <Button
            disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
            onClick={handleNewLecture}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Video className="w-5 h-5 mr-2" />
            Add New Lecture
          </Button>

          {mediaUploadProgress ? (
            <div className="mb-6">
              <MediaProgressbar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            </div>
          ) : null}

          <div className="mt-6 space-y-6">
            {courseCurriculumFormData.map((curriculumItem, index) => (
              <div key={index} className="border-2 border-orange-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-white to-orange-50/30">
                <div className="flex gap-5 items-center mb-5">
                  <div className="bg-orange-100 px-4 py-2 rounded-xl">
                    <h3 className="font-bold text-lg text-orange-700">Lecture {index + 1}</h3>
                  </div>
                  <Input
                    name={`title-${index + 1}`}
                    placeholder="Enter lecture title"
                    className="flex-1 max-w-md border-2 border-orange-200 rounded-xl p-3 hover:border-orange-400 focus:border-orange-500 transition-colors duration-200 font-medium"
                    onChange={(event) => handleCourseTitleChange(event, index)}
                    value={courseCurriculumFormData[index]?.title}
                  />
                  <div className="flex items-center space-x-3 bg-orange-50 px-4 py-2 rounded-xl">
                    <Switch
                      onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview-${index + 1}`}
                    />
                    <Label htmlFor={`freePreview-${index + 1}`} className="text-gray-700 font-semibold cursor-pointer">
                      Free Preview
                    </Label>
                  </div>
                </div>
                <div className="mt-6">
                  {courseCurriculumFormData[index]?.videoUrl ? (
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                        <VideoPlayer url={courseCurriculumFormData[index]?.videoUrl} width="450px" height="200px" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button onClick={() => handleReplaceVideo(index)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Replace Video
                        </Button>
                        <Button onClick={() => handleDeleteLecture(index)} className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Lecture
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(event) => handleSingleLectureUpload(event, index)}
                        className="border-2 border-dashed border-orange-300 rounded-xl p-4 hover:border-orange-500 focus:border-orange-600 transition-colors duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-700 file:font-semibold hover:file:bg-orange-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseCurriculum;
