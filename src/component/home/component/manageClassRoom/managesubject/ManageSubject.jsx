import { useEffect, useState } from "react";
import "./../ManageClassRoomStyle.css"; // ใช้ CSS เดียวกันได้เลย

function ManageSubject({ user }) {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");

  // โหลดรายชื่อวิชา
  const fetchData = () => {
    fetch("https://agenda.bkkthon.ac.th/fca/api/subject/get_subject.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setSubjects(data.data);
        else setSubjects([]);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  };

  // เพิ่มวิชาใหม่
  const handleAdd = (e) => {
    e.preventDefault();
    const subjectName = newSubject.trim();

    if (!subjectName) {
      alert("กรุณากรอกชื่อวิชา");
      return;
    }

    fetch("https://agenda.bkkthon.ac.th/fca/api/subject/add_subject.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: subjectName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("เพิ่มวิชาเรียนสำเร็จ");
          setNewSubject("");
          fetchData();
        } else {
          alert(data.message || "เกิดข้อผิดพลาดในการเพิ่มวิชา");
        }
      })
      .catch((err) => console.error("Error adding subject:", err));
  };

  // ลบวิชา
  const handleDelete = (subjectName) => {
    if (window.confirm(`ต้องการลบวิชา "${subjectName}" หรือไม่?`)) {
      fetch("https://agenda.bkkthon.ac.th/fca/api/subject/delete_subject.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subjectName }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("ลบวิชาสำเร็จ");
            setSubjects((prev) => prev.filter((s) => s !== subjectName));
            fetchData();
          } else {
            alert(data.message || "เกิดข้อผิดพลาดในการลบวิชา");
          }
        })
        .catch((err) => console.error("Error deleting subject:", err));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="classroom-container">
      <h2 className="classroom-title">📚 จัดการวิชาเรียน</h2>

      <form onSubmit={handleAdd} className="classroom-form">
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="ชื่อวิชาใหม่"
          className="classroom-input"
          required
        />
        <button type="submit" className="classroom-add-btn">
          ➕ เพิ่มวิชา
        </button>
      </form>

      <div className="classroom-list">
        <ul>
          {subjects.length > 0 ? (
            subjects.map((name, index) => (
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
            <li className="classroom-empty">ไม่มีวิชาเรียน</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ManageSubject;
