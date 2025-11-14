import { useEffect, useState } from "react";
import axios from "axios";

function ExamAttendance() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    loadExams();
    loadRooms();
  }, []);

  const loadExams = async () => {
    const res = await axios.get(
      "https://agenda.bkkthon.ac.th/fca/api/exam/get_exam_list.php"
    );
    if (res.data.status === "success") setExams(res.data.data);
  };

  const loadRooms = async () => {
    const res = await axios.get(
      "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
    );

    if (res.data.status === "success") {
      const setRoom = new Set();
      res.data.data.forEach((s) =>
        setRoom.add(s.classroom.replace("\\/", "/"))
      );
      setRooms([...setRoom].sort());
    }
  };

  const loadStudents = async () => {
    if (!selectedExam || !selectedRoom) return;

    setLoading(true);

    const stuRes = await axios.get(
      "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
    );

    const examRes = await axios.get(
      `https://agenda.bkkthon.ac.th/fca/api/exam/get_exam_attendance.php?exam_id=${selectedExam}&room=${selectedRoom}`
    );

    let statusMap = {};
    if (examRes.data.status === "success") {
      examRes.data.data.forEach((e) => {
        statusMap[e.student_id] = e.status;
      });
    }

    if (stuRes.data.status === "success") {
      const list = stuRes.data.data
        .filter((s) => s.classroom.replace("\\/", "/") === selectedRoom)
        .map((st) => ({
          ...st,
          exam_status: statusMap[st.student_id] || null,
        }));

      setStudents(list);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (selectedExam && selectedRoom) loadStudents();
  }, [selectedExam, selectedRoom]);

  const markExam = async (studentId, status) => {
    setSaving(studentId);

    try {
      const res = await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/exam/save_exam_attendance.php",
        {
          exam_id: selectedExam,
          student_id: studentId,
          room: selectedRoom,
          status: status, // "present" / "absent"
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.status === "success") {
        setStudents((prev) =>
          prev.map((st) =>
            st.student_id === studentId ? { ...st, exam_status: status } : st
          )
        );
      }
    } catch (err) {
      alert("Server error");
    }

    setSaving(null);
  };

  // 🔥 Undo → status = null
  const undoStatus = async (studentId) => {
    setSaving(studentId);

    try {
      const res = await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/exam/save_exam_attendance.php",
        {
          exam_id: selectedExam,
          student_id: studentId,
          room: selectedRoom,
          status: "", // ลบสถานะ
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.status === "success") {
        setStudents((prev) =>
          prev.map((st) =>
            st.student_id === studentId ? { ...st, exam_status: null } : st
          )
        );
      }
    } catch (err) {
      alert("Server error");
    }

    setSaving(null);
  };

  // แยกกลุ่ม
  const notChecked = students.filter((s) => !s.exam_status);
  const present = students.filter((s) => s.exam_status === "present");
  const absent = students.filter((s) => s.exam_status === "absent");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            📝 เช็คชื่อวันสอบ
          </h1>
          <p className="text-gray-600 mt-2">แบ่งกลุ่มตามสถานะ</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="font-semibold">📘 วันสอบ</label>
              <select
                className="w-full p-3 border-2 rounded-xl"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option value="">-- เลือกวันสอบ --</option>

                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.exam_name} | {ex.exam_date}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold">🏫 ห้องเรียน</label>
              <select
                className="w-full p-3 border-2 rounded-xl"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="">-- เลือกห้องเรียน --</option>

                {rooms.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {loading && <p className="text-center">กำลังโหลด...</p>}

        {/* TWO COLUMNS */}
        {!loading && selectedExam && selectedRoom && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT – ยังไม่เช็ค */}
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                ⚪ ยังไม่เช็คชื่อ ({notChecked.length})
              </h2>

              {notChecked.map((s) => (
                <div
                  key={s.student_id}
                  className="p-4 mb-3 bg-gray-50 border rounded-xl flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{s.student_name}</p>
                    <p className="text-xs text-gray-600">{s.student_id}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => markExam(s.student_id, "present")}
                      className="px-3 py-1 bg-green-500 text-white rounded-xl"
                    >
                      มาสอบ
                    </button>

                    <button
                      onClick={() => markExam(s.student_id, "absent")}
                      className="px-3 py-1 bg-red-500 text-white rounded-xl"
                    >
                      ขาดสอบ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT – เช็คแล้ว */}
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                🟢 เช็คแล้ว ({present.length + absent.length})
              </h2>

              {/* Present */}
              {present.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-green-600 font-bold mb-2">
                    🟢 มาสอบ ({present.length})
                  </h3>

                  {present.map((s) => (
                    <div
                      key={s.student_id}
                      className="p-4 mb-2 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <p className="font-semibold">{s.student_name}</p>
                      <p className="text-xs text-gray-600">{s.student_id}</p>

                      <button
                        onClick={() => undoStatus(s.student_id)}
                        className="mt-2 px-3 py-1 text-sm bg-gray-300 rounded-xl"
                      >
                        แก้ไข
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Absent */}
              {absent.length > 0 && (
                <div>
                  <h3 className="text-red-600 font-bold mb-2">
                    🔴 ขาดสอบ ({absent.length})
                  </h3>

                  {absent.map((s) => (
                    <div
                      key={s.student_id}
                      className="p-4 mb-2 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <p className="font-semibold">{s.student_name}</p>
                      <p className="text-xs text-gray-600">{s.student_id}</p>

                      <button
                        onClick={() => undoStatus(s.student_id)}
                        className="mt-2 px-3 py-1 text-sm bg-gray-300 rounded-xl"
                      >
                        แก้ไข
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamAttendance;
