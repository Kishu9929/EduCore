import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header with glassmorphism effect */}
      <header className="px-4 lg:px-6 h-16 flex items-center relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <Link to={"/"} className="flex items-center justify-center group">
          <BookOpen className="h-8 w-8 mr-3 text-indigo-600 group-hover:text-purple-600 transition-colors" />
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EduCore
          </span>
        </Link>
      </header>

      {/* Main content with animated background */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Form container with glassmorphism */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all duration-500 hover:scale-[1.02]">
            {/* Custom tab switcher with sliding indicator */}
            <div className="relative mb-8">
              <div className="flex bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-1.5 relative">
                <button
                  className={`tab flex-1 text-center py-3 rounded-xl transition-all duration-300 text-sm font-bold relative z-10 ${
                    activeTab === "signin"
                      ? "text-white"
                      : "text-indigo-600 hover:text-indigo-700"
                  }`}
                  style={{ outline: 'none', border: 'none' }}
                  onClick={() => setActiveTab("signin")}
                >
                  Sign In
                </button>
                <button
                  className={`tab flex-1 text-center py-3 rounded-xl transition-all duration-300 text-sm font-bold relative z-10 ${
                    activeTab === "signup"
                      ? "text-white"
                      : "text-indigo-600 hover:text-indigo-700"
                  }`}
                  style={{ outline: 'none', border: 'none' }}
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up
                </button>
                {/* Animated sliding background */}
                <div
                  className={`absolute top-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg transition-transform duration-300 ease-out ${
                    activeTab === "signup" ? "translate-x-[calc(100%+6px)]" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>

            {/* Sign In Form */}
            {activeTab === "signin" && (
              <Card className="p-0 space-y-4 bg-transparent shadow-none border-none animate-fadeIn">
                <CardHeader className="pb-4 px-0">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-base text-center text-gray-600">
                    Sign in to continue your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 px-0">
                  <CommonForm
                    formControls={signInFormControls.map(control =>
                      control.type === "password"
                        ? { ...control, type: showPassword ? "text" : "password", icon: (
                          <button 
                            type="button" 
                            tabIndex={-1} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors" 
                            onClick={() => setShowPassword(v => !v)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        ) }
                        : control
                    )}
                    buttonText={"Sign In"}
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />
                </CardContent>
              </Card>
            )}

            {/* Sign Up Form */}
            {activeTab === "signup" && (
              <Card className="p-0 space-y-4 bg-transparent shadow-none border-none animate-fadeIn">
                <CardHeader className="pb-4 px-0">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
                    Join EduCore
                  </CardTitle>
                  <CardDescription className="text-base text-center text-gray-600">
                    Create your account and start learning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 px-0">
                  <CommonForm
                    formControls={signUpFormControls.map(control =>
                      control.type === "password"
                        ? { ...control, type: showPassword ? "text" : "password", icon: (
                          <button 
                            type="button" 
                            tabIndex={-1} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors" 
                            onClick={() => setShowPassword(v => !v)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        ) }
                        : control
                    )}
                    buttonText={"Sign Up"}
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer text */}
          <p className="text-center mt-6 text-slate-600 text-sm font-medium">
            🔒 Secure authentication powered by EduCore
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AuthPage;
