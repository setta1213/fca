import { useState } from "react";
import axios from "axios";

function Manage({ user }) {
  const [studentId, setStudentId] = useState("");
  const [studenName, setStudenName] = useState("");
  const [stLevel, setStLevel] = useState("");

  const getStudents = async (idStuden) => {
    const ids = idStuden;
    // Clear previous results at the start of a new search
    setStudenName("");
    setStLevel("");

    if (!ids) {
      alert("กรุณากรอกรหัสนักศึกษาให้ถูกต้อง");
      return;
    }

    try {
      const response = await axios.get(
        "https://register.bkkthon.ac.th/regapiweb1/api/th/Studentinfo/Getstudentbtu/0/" +
          ids +
          "/-/-"
      );

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        if (data.std_id) {
          setStudenName(data.st_th_name || data.st_en_name);
          setStLevel(data.st_level || "");
        } else {
          alert("ไม่พบข้อมูลนักศึกษากรุณาติดต่อทะเบียน");
        }
      } else {
        alert("ไม่พบข้อมูลนักศึกษากรุณาติดต่อทะเบียน");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("เกิดข้อผิดพลาดในการค้นหาข้อมูล");
    }
  };

  return (
    <div>
      {user.name} เนื้อหาสำหรับจัดการนักศึกษา
      <input
        type="text"
        placeholder="กรอกรหัสนักศึกษา"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={() => getStudents(studentId)}>ค้นหา</button>
      <form action="#">
        <input
          type="text"
          placeholder="ชื่อ-นามสกุล"
          value={studenName}
          readOnly
        />
        <input type="text" placeholder="ระดับชั้น" value={stLevel} readOnly />
      </form>
    </div>
  );
}

export default Manage;
