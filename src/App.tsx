import { lazy, Suspense } from "react";
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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VideoMuteProvider } from "@/context/VideoMuteContext";

// Eager: entry surfaces users hit first / auth boundary
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy: everything else — route-level code splitting keeps the initial
// bundle small and scales the app's TTI as the surface area grows.
const Signup = lazy(() => import("./pages/Signup"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Notifications = lazy(() => import("./pages/Notifications"));
const FollowRequests = lazy(() => import("./pages/FollowRequests"));
const Profile = lazy(() => import("./pages/Profile"));
const Explore = lazy(() => import("./pages/Explore"));
const CreateRoadmap = lazy(() => import("./pages/CreateRoadmap"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const MyRoadmaps = lazy(() => import("./pages/MyRoadmaps"));
const RoadmapView = lazy(() => import("./pages/RoadmapView"));
const NewVideos = lazy(() => import("./pages/NewVideos"));
const SkillRecommendations = lazy(() => import("./pages/SkillRecommendations"));
const Settings = lazy(() => import("./pages/Settings"));
const MyPosts = lazy(() => import("./pages/MyPosts"));
const ShareResource = lazy(() => import("./pages/ShareResource"));
const ResourceView = lazy(() => import("./pages/ResourceView"));
const Support = lazy(() => import("./pages/Support"));
const SavedPosts = lazy(() => import("./pages/SavedPosts"));
const Messages = lazy(() => import("./pages/Messages"));
const Chat = lazy(() => import("./pages/Chat"));
const MyCommunities = lazy(() => import("./pages/MyCommunities"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Perf-tuned React Query defaults:
//  - Longer staleTime cuts redundant refetches when users navigate between pages
//  - gcTime keeps hot data warm for tab-switchers without holding memory forever
//  - refetchOnWindowFocus off by default; hooks that need freshness opt in
//  - Network-mode 'online' avoids retry storms while offline
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30_000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      staleTime: 5 * 60 * 1000,      // 5 min — most data is fine to reuse
      gcTime: 30 * 60 * 1000,        // 30 min — keep cached data warm
      networkMode: "online",
    },
    mutations: {
      retry: 1,
      networkMode: "online",
    },
  },
});

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
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
          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
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
