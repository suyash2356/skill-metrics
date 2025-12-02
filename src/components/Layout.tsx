import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from '@/logo.jpg';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPeopleCommunitySuggestions, fetchRecommendations, Suggestion, Recommendation } from "@/api/searchAPI";
import { debounce } from "lodash";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  Search, 
  User, 
  Settings, 
  Map, 
  Plus,
  ChevronDown,
  Moon,
  Sun,
  Bookmark,
  FileText,
  HelpCircle,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationBell from "@/components/NotificationBell";
import { useOnlineStatus } from "@/hooks/use-mobile";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [skillRecommendations, setSkillRecommendations] = useState<Recommendation[]>([]);
  const [isSkillLoading, setIsSkillLoading] = useState(false);
  const [showSkillResults, setShowSkillResults] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const fetchSuggestions = debounce(async (q: string) => {
    if (!q) return setSuggestions([]);
    try {
      const res = await fetchPeopleCommunitySuggestions(q, 6);
      setSuggestions(res);
    } catch (err) {
      setSuggestions([]);
    }
  }, 200);
  // Default to dark mode for all users unless they explicitly choose light
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light') return false;
      if (stored === 'dark') return true;
    } catch (e) {
      // ignore (e.g., during SSR or restricted environments)
    }
    return true; // default dark
  });
  const { signOut } = useAuth();
  const online = useOnlineStatus();

  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Explore", href: "/explore", icon: Search },
    { name: "My Roadmaps", href: "/roadmaps", icon: Map },
  ];

  const isActive = (path: string) => currentPath === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search initiated with query:", searchQuery);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    fetchSuggestions(searchQuery);
    return () => fetchSuggestions.cancel();
  }, [searchQuery]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Apply theme class and persist preference
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      // ignore errors writing to localStorage
    }
  }, [isDarkMode]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        {!online && (
          <div className="w-full bg-yellow-500 text-black text-xs md:text-sm py-1 text-center">You're offline. Some features may be unavailable. Changes will sync when back online.</div>
        )}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 flex-shrink-0">
            <img src={logoImg} alt="Skill Metrics" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent hidden sm:block">
              Skill-Metrics
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={isActive(item.href) ? "bg-primary text-primary-foreground" : ""}
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills, domains, exams..."
                className="pl-10 h-9"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
              />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevated z-50 overflow-hidden backdrop-blur-sm">
                    {/* If user clicked a skill and is viewing inline skill results, show cards */}
                    {showSkillResults ? (
                      <div className="p-4">
                        {isSkillLoading ? (
                          <div className="text-sm text-muted-foreground">Loading suggestions...</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {skillRecommendations.slice(0,6).map((item, i) => (
                              <div key={i} className="border border-border rounded-lg p-3 bg-card hover:border-primary/50 transition-all">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm">{item.title}</div>
                                  <div className="text-xs text-muted-foreground">{item.provider || item.type}</div>
                                </div>
                                {item.description && <div className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</div>}
                                <div className="mt-3">
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Visit</a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 text-right">
                          <Button size="sm" variant="ghost" onMouseDown={(e) => { e.preventDefault(); setShowSkillResults(false); navigate(`/search?q=${encodeURIComponent(searchQuery)}`); }}>See all</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        {/* people & community suggestions */}
                        {suggestions.map((s, idx) => (
                          <button
                            key={`${s.kind}-${idx}`}
                            className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors flex items-center gap-3"
                            onMouseDown={(e) => { e.preventDefault();
                              if (s.kind === 'user') {
                                setShowSuggestions(false);
                                navigate(`/profile/${s.id}`);
                              } else {
                                setShowSuggestions(false);
                                navigate(`/search?q=${encodeURIComponent(s.name)}&scope=people`);
                              }
                            }}
                          >
                            {s.kind === 'user' && <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover" />}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{s.name}</div>
                              <div className="text-xs text-muted-foreground capitalize">{s.kind}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <NotificationBell />
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Settings className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover backdrop-blur-sm z-50">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-posts" className="flex items-center cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    My Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/saved-posts" className="flex items-center cursor-pointer">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Saved Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme} className="flex items-center cursor-pointer">
                  {isDarkMode ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Theme
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Theme
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support" className="flex items-center cursor-pointer">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <BottomNav />
    </div>
  );
};