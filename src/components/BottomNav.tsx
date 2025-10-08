import { Home, Users, Compass, Video, Map } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { to: '/home', icon: <Home size={24} />, label: 'Home' },
    { to: '/roadmaps', icon: <Map size={24} />, label: 'Roadmaps' },
    { to: '/my-communities', icon: <Users size={24} />, label: 'Communities' },
    { to: '/explore', icon: <Compass size={24} />, label: 'Explore' },
    { to: '/new-videos', icon: <Video size={24} />, label: 'Videos' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg lg:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-sm font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`
            }
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
