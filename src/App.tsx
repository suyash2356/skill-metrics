import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatEncryptionProvider } from "@/context/ChatEncryptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import FollowRequests from "./pages/FollowRequests";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import CreateRoadmap from "./pages/CreateRoadmap";
import SearchResults from "./pages/SearchResults";
import CreatePost from "./pages/CreatePost";
import MyRoadmaps from "./pages/MyRoadmaps";
import RoadmapView from "./pages/RoadmapView";
import NewVideos from "./pages/NewVideos";
import SkillView from "./pages/SkillView";
import SkillRecommendations from "./pages/SkillRecommendations";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import MyPosts from "./pages/MyPosts";
import Support from "./pages/Support";
import SavedPosts from "./pages/SavedPosts";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import MyCommunities from "./pages/MyCommunities";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VideoMuteProvider } from "@/context/VideoMuteContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 60 * 1000,
      retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ChatEncryptionProvider>
          <VideoMuteProvider>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/follow-requests" element={<ProtectedRoute><FollowRequests /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                <Route path="/create-roadmap" element={<ProtectedRoute><CreateRoadmap /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
                <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="/roadmaps" element={<ProtectedRoute><MyRoadmaps /></ProtectedRoute>} />
                <Route path="/roadmaps/:id" element={<ProtectedRoute><RoadmapView /></ProtectedRoute>} />
                <Route path="/skills/:skill" element={<ProtectedRoute><SkillRecommendations /></ProtectedRoute>} />
                <Route path="/new-videos" element={<ProtectedRoute><NewVideos /></ProtectedRoute>} />
                <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
                <Route path="/saved-posts" element={<ProtectedRoute><SavedPosts /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/my-communities" element={<ProtectedRoute><MyCommunities /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/messages/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </VideoMuteProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;