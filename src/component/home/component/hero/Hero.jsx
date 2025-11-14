import "./HeroStyle.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCircleCheck, 
  faList, 
  faChartSimple, 
  faUsers, 
  faSchool, 
  faBars,
  faTimes,
  
  
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Hero({ user,onViewChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { key: 'checkin', label: 'เช็คชื่อนักศึกษา', icon: faCircleCheck },
    { key: 'exams', label: 'จัดการการสอบ', icon: faCircleCheck },
    { key: 'records', label: 'รายงานบันทึก', icon: faList },
    { key: 'stats', label: 'สถิติ', icon: faChartSimple },
    { key: 'manage', label: 'จัดการนักศึกษา', icon: faUsers },
    { key: 'manageClassRoom', label: 'จัดการห้องเรียน', icon: faSchool },
   ...(user?.admin_type === "1"
    ? [{
  key: 'admin',
  label: 'แอดมิน',
  icon: faUsers,
  iconSpecial: (
    <FontAwesomeIcon icon={faUsers} beat style={{ color: "#f81616" }} />
  )
}]
    : [])

  ];
  

  const handleMenuClick = (key) => {
    onViewChange(key);
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="hero relative">
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="hero-particle"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          />
        ))}
        
        {/* Desktop Menu */}
        
        <div className="hidden md:flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-6">
          {menuItems.map((item) => (
            <button 
              key={item.key}
              onClick={() => onViewChange(item.key)} 
              className="heroButton"
            >
              <FontAwesomeIcon icon={item.icon} />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-center items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="heroButton w-auto px-8 py-4 flex items-center justify-center gap-3"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            <span>{isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}</span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden mt-4 transition-all duration-300 ease-in-out  ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <button 
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  className="mobile-menu-button flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 transition-all duration-200 border border-white/30"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <FontAwesomeIcon icon={item.icon}  />
                  </div>
                  <span className="text-gray-800 font-semibold text-left flex-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;