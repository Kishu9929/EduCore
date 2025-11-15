import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";
import { Upload, Image, X, Camera } from "lucide-react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Camera className="h-10 w-10 text-purple-600" />
          Course Settings
        </h1>
        <p className="text-gray-600 text-lg">Manage your course visual appearance</p>
      </div>

      <Card className="shadow-2xl border-0 rounded-2xl bg-white overflow-hidden max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white pb-6 pt-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Image className="h-7 w-7" />
            Course Thumbnail Image
          </CardTitle>
          <p className="text-purple-100 mt-1 text-sm">Upload an engaging image to attract students</p>
        </CardHeader>

        <CardContent className="p-8">
          {mediaUploadProgress && (
            <div className="mb-6">
              <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
            </div>
          )}

          {courseLandingFormData?.image ? (
            <div className="space-y-6">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img src={courseLandingFormData.image} alt="Course thumbnail" className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => setCourseLandingFormData({ ...courseLandingFormData, image: "" })} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
                        <X className="h-5 w-5 mr-2 inline" /> Remove Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-green-800 font-medium">Course image uploaded successfully</p>
              </div>

              <div className="pt-4 border-t-2 border-gray-100">
                <Label className="text-base font-semibold text-gray-700 mb-3 block">Replace Course Image</Label>
                <div className="relative">
                  <Input onChange={handleImageUploadChange} type="file" accept="image/*" className="hidden" id="replace-image-upload" />
                  <label htmlFor="replace-image-upload" className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 cursor-pointer group">
                    <Upload className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-purple-700 font-semibold">Choose a different image</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <Input onChange={handleImageUploadChange} type="file" accept="image/*" className="hidden" id="course-image-upload" />
                <label htmlFor="course-image-upload" className="flex flex-col items-center justify-center gap-4 px-8 py-16 border-3 border-dashed border-purple-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
                  <div className="bg-purple-100 p-6 rounded-full group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
                    <Upload className="h-12 w-12 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-800 mb-2">Upload Course Image</p>
                    <p className="text-gray-600 text-sm">Click to browse or drag and drop your image here</p>
                    <p className="text-gray-500 text-xs mt-2">PNG, JPG, or WEBP (max. 5MB)</p>
                  </div>
                  <button type="button" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 mt-2">Select Image</button>
                </label>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-5 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">Image Guidelines</h4>
                <ul className="text-blue-800 text-sm list-disc ml-6">
                  <li>Use high-quality images (minimum 1280x720px)</li>
                  <li>Choose images that represent your course content</li>
                  <li>Avoid text-heavy or cluttered images</li>
                  <li>Ensure good contrast and visibility</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseSettings;
