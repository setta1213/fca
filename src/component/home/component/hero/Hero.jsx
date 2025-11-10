import "./HeroStyle.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck,faList,faChartSimple,faUsers,faSchool} from "@fortawesome/free-solid-svg-icons";

function Hero({ onViewChange }) {
  return (
    <div>
      <div className="hero flex justify-between">
        <div></div>
        <div className="gap-5 flex"> 
          <button onClick={() => onViewChange('checkin')} className="heroButton"><FontAwesomeIcon icon={faCircleCheck} /> เช็คชื่อนักศึกษา</button>
          <button onClick={() => onViewChange('records')} className="heroButton"><FontAwesomeIcon icon={faList} /> รายการบันทึก</button>
          <button onClick={() => onViewChange('stats')} className="heroButton"><FontAwesomeIcon icon={faChartSimple} /> สถิติ</button>
          <button onClick={() => onViewChange('manage')} className="heroButton"><FontAwesomeIcon icon={faUsers} /> จัดการนักศึกษา</button>
          <button onClick={() => onViewChange('manageClassRoom')} className="heroButton"><FontAwesomeIcon icon={faSchool} />จัดการห้องเรียน</button>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Hero;
