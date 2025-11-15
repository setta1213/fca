import { useEffect, useState } from "react";
import "./ManageClassRoomStyle.css"; // ✅ เพิ่มไฟล์ CSS
import ManageSubject from "./managesubject/ManageSubject";

function ManageClassRoom({ user }) {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroom, setNewClassroom] = useState("");

  const fetchData = () => {
    fetch("https://agenda.bkkthon.ac.th/fca/api/classroom/get_classroom.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setClassrooms(data.data);
        else setClassrooms([]);
      })
      .catch((err) => console.error("Error fetching classrooms:", err));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const classroomName = newClassroom.trim();
    if (!classroomName) {
      alert("กรุณากรอกชื่อห้องเรียน");
      return;
    }

    fetch("https://agenda.bkkthon.ac.th/fca/api/classroom/add_classroom.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: classroomName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert(data.message || "เพิ่มห้องเรียนสำเร็จ");
          setNewClassroom("");
          fetchData();
        } else {
          alert(data.message || "เกิดข้อผิดพลาดในการเพิ่มห้องเรียน");
        }
      })
      .catch((error) => console.error("Error adding classroom:", error));
  };

  const handleDelete = (classroomName) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียน "${classroomName}"?`)) {
      fetch("https://agenda.bkkthon.ac.th/fca/api/classroom/delete_classroom.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: classroomName }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert(data.message || "ลบห้องเรียนสำเร็จ");
            setClassrooms((prev) => prev.filter((c) => c !== classroomName));
            fetchData();
          } else {
            alert(data.message || "เกิดข้อผิดพลาดในการลบ");
          }
        })
        .catch((error) => console.error("Error deleting classroom:", error));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="classroom-container">
      <h2 className="classroom-title">📘 จัดการห้องเรียน</h2>

      <form onSubmit={handleAdd} className="classroom-form">
        <input
          type="text"
          value={newClassroom}
          onChange={(e) => setNewClassroom(e.target.value)}
          placeholder="ชื่อห้องเรียนใหม่"
          className="classroom-input"
          required
        />
        <button type="submit" className="classroom-add-btn">
          ➕ เพิ่มห้องเรียน
        </button>
      </form>

      <div className="classroom-list">
        <ul>
          {classrooms.length > 0 ? (
            classrooms.map((name, index) => (
              <li key={index} className="classroom-item">
                <span className="classroom-name">{name}</span>
                {user.admin_type === "1" && (
                  <button
                    onClick={() => handleDelete(name)}
                    className="classroom-delete-btn"
                  >
                    🗑 ลบ
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className="classroom-empty">ไม่มีห้องเรียน</li>
          )}
        </ul>
      </div>
      <ManageSubject user={user} />
    </div>
    
  );
}

export default ManageClassRoom;
