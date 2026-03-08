import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ChatEncryptionProvider } from "@/context/ChatEncryptionContext";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
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
import ShareResource from "./pages/ShareResource";
import ResourceView from "./pages/ResourceView";
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

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/notifications" element={<ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>} />
        <Route path="/follow-requests" element={<ProtectedRoute><PageTransition><FollowRequests /></PageTransition></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><PageTransition><Home /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><PageTransition><Explore /></PageTransition></ProtectedRoute>} />
        <Route path="/create-roadmap" element={<ProtectedRoute><PageTransition><CreateRoadmap /></PageTransition></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><PageTransition><SearchResults /></PageTransition></ProtectedRoute>} />
        <Route path="/create-post" element={<ProtectedRoute><PageTransition><CreatePost /></PageTransition></ProtectedRoute>} />
        <Route path="/roadmaps" element={<ProtectedRoute><PageTransition><MyRoadmaps /></PageTransition></ProtectedRoute>} />
        <Route path="/roadmaps/:id" element={<ProtectedRoute><PageTransition><RoadmapView /></PageTransition></ProtectedRoute>} />
        <Route path="/skills/:skill" element={<ProtectedRoute><PageTransition><SkillRecommendations /></PageTransition></ProtectedRoute>} />
        <Route path="/new-videos" element={<ProtectedRoute><PageTransition><NewVideos /></PageTransition></ProtectedRoute>} />
        <Route path="/my-posts" element={<ProtectedRoute><PageTransition><MyPosts /></PageTransition></ProtectedRoute>} />
        <Route path="/share-resource" element={<ProtectedRoute><PageTransition><ShareResource /></PageTransition></ProtectedRoute>} />
        <Route path="/resources/:id" element={<ProtectedRoute><PageTransition><ResourceView /></PageTransition></ProtectedRoute>} />
        <Route path="/saved-posts" element={<ProtectedRoute><PageTransition><SavedPosts /></PageTransition></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><PageTransition><Support /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
        <Route path="/my-communities" element={<ProtectedRoute><PageTransition><MyCommunities /></PageTransition></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><PageTransition><Messages /></PageTransition></ProtectedRoute>} />
        <Route path="/messages/:conversationId" element={<ProtectedRoute><PageTransition><Chat /></PageTransition></ProtectedRoute>} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

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
              <AnimatedRoutes />
            </ErrorBoundary>
          </VideoMuteProvider>
          </ChatEncryptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;