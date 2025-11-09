import "./HeroStyle.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck,faList,faChartSimple,faUsers } from "@fortawesome/free-solid-svg-icons";

function Hero() {
  return (
    <div>
      <div className="hero flex justify-between">
        <div></div>
        <div className="gap-5 flex"> 
          <button className="heroButton"><FontAwesomeIcon icon={faCircleCheck} /> เช็คชื่อนักศึกษา</button>
          <button className="heroButton"><FontAwesomeIcon icon={faList} /> รายการบันทึก</button>
          <button className="heroButton"><FontAwesomeIcon icon={faChartSimple} /> สถิติ</button>
          <button className="heroButton"><FontAwesomeIcon icon={faUsers} /> จัดการนักศึกษา</button>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Hero;
