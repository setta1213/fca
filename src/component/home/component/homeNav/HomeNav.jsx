import "./HomeNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate, faBuildingColumns,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
function HomeNav({ user, onLogout }) {
  if (!user) return null;

  return (
    <div className="home-nav">
      <div className="user-info flex items-center justify-between">
        <div>
          <h2>
            ยินดีต้อนรับคุณ <br />
            <span className="user-name">
              {user.name} {user.lastname}
            </span>
          </h2>
        </div>
        <div className="flex flex-col justify-center text-center">
          <h1 className="text-4xl font-bold text-center">
            <FontAwesomeIcon icon={faUserGraduate} />ประวัตินักศึกษา</h1>
          <p>
            <FontAwesomeIcon icon={faBuildingColumns} />คณะนิเทศศาสตร์ มหาวิทยาลัยกรุงเทพธนบุรี</p>
        </div>
        <div></div>
      </div>

      <div className="user-details">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      </div>

      <button className="logout-btn" onClick={onLogout} aria-label="ออกจากระบบ">
        <span><FontAwesomeIcon icon={faRightFromBracket} /> ออกจากระบบ</span>
      </button>
    </div>
  );
}

export default HomeNav;
