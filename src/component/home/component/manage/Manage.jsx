import { useState, useEffect } from "react";
import axios from "axios";
import "./manageStyle.css";
import ClassRoom from "./component/ClassRoom";

function Manage({ user, onSelect }) {
  const [activeTab, setActiveTab] = useState("classroom");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [stLevel, setStLevel] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [selected, setSelected] = useState("");
  const [st_course, setStCourse] = useState("");
  const [st_faculty, setStFaculty] = useState("");
  const [st_status, setStStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [wechat, setWechat] = useState("");

  useEffect(() => {
    fetch("https://agenda.bkkthon.ac.th/fca/api/classroom/get_classroom.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setClassrooms(data.data);
        else setClassrooms([]);
      })
      .catch((err) => console.error("Error fetching classrooms:", err));
  }, []);

  // ดึงข้อมูลนักศึกษา
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
          setStCourse(data.st_course || "");
          setStFaculty(data.st_faculty || "");
          setStStatus(data.st_status || "");
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

  // ฟังก์ชันรีเซ็ตฟอร์ม
  const resetForm = () => {
    setStudentId("");
    setStudentName("");
    setStLevel("");
    setStCourse("");
    setStFaculty("");
    setStStatus("");
    setPhone("");
    setLineId("");
    setWechat("");
    setSelected("");
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    if (selected === null || selected === "") {
      alert("กรุณาเลือกห้องเรียน");
      return;
    }
    const payload = {
      student_id: studentId,
      student_name: studentName,
      level: stLevel,
      course: st_course,
      faculty: st_faculty,
      status: st_status,
      phone,
      line_id: lineId,
      wechat,
      classroom: selected,
      created_by: user?.name || "ไม่ระบุ",
    };

    try {
      const res = await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/student/save_student.php",
        payload
      );

      if (res.data.status === "success") {
        alert("✅ " + res.data.message);
        resetForm(); // ✅ ล้างฟอร์มเมื่อบันทึกสำเร็จ
      } else {
        alert("⚠️ " + res.data.message);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error(err);
    }
  };



  // ฟอร์มแสดงผล
  return (
    <div className="manage-container">
      <button
        onClick={() => setActiveTab("register")}
        className=" text-white bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        ลงทะเบียนนักศึกษา
      </button>

      <button
        onClick={() => setActiveTab("classroom")}
        className=" text-white bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        ห้องเรียน
      </button>
      {activeTab === "register" && (
        <div id="div1" className="content">
          <h3>{user?.name} เนื้อหาสำหรับจัดการนักศึกษา</h3>

          <div className="manage-form">
            <input
              type="text"
              placeholder="กรอกรหัสนักศึกษา"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <button
              className="manage-btn"
              onClick={() => getStudents(studentId)}
            >
              🔍 ค้นหา
            </button>

            <input
              type="text"
              placeholder="ชื่อ-นามสกุล"
              value={studentName}
              readOnly
            />
            <input
              type="text"
              placeholder="ระดับชั้น"
              value={stLevel}
              readOnly
            />
            <input type="text" placeholder="สาขา" value={st_course} readOnly />
            <input type="text" placeholder="คณะ" value={st_faculty} readOnly />
            <input type="text" placeholder="สถานะ" value={st_status} readOnly />

            <input
              type="text"
              placeholder="เบอร์โทร (081-234-5678)"
              value={phone}
              maxLength={12} // 12 ตัว รวมขีด
              onChange={(e) => {
                let val = e.target.value;

                // เอาตัวเลขทั้งหมดออกมาก่อน
                val = val.replace(/\D/g, "");

                // ใส่ขีดรูปแบบ 081-234-5678
                if (val.length > 3 && val.length <= 6) {
                  val = val.replace(/(\d{3})(\d+)/, "$1-$2");
                } else if (val.length > 6) {
                  val = val.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
                }

                setPhone(val);
              }}
              className="your-input-class"
            />

            <input
              type="text"
              placeholder="Line ID"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
            />
            <input
              type="text"
              placeholder="We chart"
              value={wechat}
              onChange={(e) => setWechat(e.target.value)}
            />

            <label htmlFor="classroom" className="select-label">
              เลือกห้องเรียน:
            </label>
            <select
              id="classroom"
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                if (onSelect) onSelect(e.target.value);
              }}
              className="select-box"
              required={true}
            >
              <option value="">-- กรุณาเลือก --</option>
              {classrooms.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSave}
              className="text-white bg-linear-to-r from-purple-500 to-pink-500 hover:bg-linear-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              💾 บันทึกข้อมูล
            </button>
          </div>
        </div>
      )}

      {activeTab === "classroom" && (
        <div id="div2" className="content">
          <ClassRoom  user={user}/>
        </div>
      )}
    </div>
  );
}

export default Manage;
