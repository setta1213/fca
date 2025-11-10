import { useState, useEffect } from "react";
import axios from "axios";
import "./manageStyle.css"; // ✅ เพิ่มบรรทัดนี้

function Manage({ user, onSelect }) {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [stLevel, setStLevel] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [selected, setSelected] = useState("");

  const getStudents = async (idStuden) => {
    if (!idStuden) {
      alert("กรุณากรอกรหัสนักศึกษาให้ถูกต้อง");
      return;
    }

    try {
      const response = await axios.get(
        `https://register.bkkthon.ac.th/regapiweb1/api/th/Studentinfo/Getstudentbtu/0/${idStuden}/-/-`
      );
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        if (data.std_id) {
          setStudentName(data.st_th_name || data.st_en_name);
          setStLevel(data.st_level || "");
        } else {
          alert("ไม่พบข้อมูลนักศึกษา กรุณาติดต่อทะเบียน");
        }
      } else {
        alert("ไม่พบข้อมูลนักศึกษา กรุณาติดต่อทะเบียน");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("เกิดข้อผิดพลาดในการค้นหาข้อมูล");
    }
  };

  useEffect(() => {
    fetch("https://agenda.bkkthon.ac.th/fca/api/classroom/get_classroom.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setClassrooms(data.data);
        else setClassrooms([]);
      })
      .catch((err) => console.error("Error fetching classrooms:", err));
  }, []);

  const handleChange = (e) => {
    setSelected(e.target.value);
    if (onSelect) onSelect(e.target.value);
  };

  return (
    <div className="manage-container">
      <h3>{user?.name} เนื้อหาสำหรับจัดการนักศึกษา</h3>

      <div className="manage-form">
        <input
          type="text"
          placeholder="กรอกรหัสนักศึกษา"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button className="manage-btn" onClick={() => getStudents(studentId)}>
          🔍 ค้นหา
        </button>

        <input
          type="text"
          placeholder="ชื่อ-นามสกุล"
          value={studentName}
          readOnly
        />
        <input type="text" placeholder="ระดับชั้น" value={stLevel} readOnly />

        <label htmlFor="classroom" className="select-label">
          เลือกห้องเรียน:
        </label>
        <select
          id="classroom"
          value={selected}
          onChange={handleChange}
          className="select-box"
        >
          <option value="">-- กรุณาเลือก --</option>
          {classrooms.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Manage;
