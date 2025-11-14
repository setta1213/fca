import { useEffect, useState } from "react";
import axios from "axios";

function ClassRoom() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [classroomList, setClassroomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showMovePanel, setShowMovePanel] = useState(null);
  const [newRoom, setNewRoom] = useState("");
  const [loading, setLoading] = useState(false); // <--- spinner รวม
  const [actionLoading, setActionLoading] = useState(null); // <--- spinner ปุ่มลบ/ย้าย

  useEffect(() => {
    loadStudents();
    loadClassrooms();
  }, []);

  // โหลดห้องเรียนจริงจาก API
  const loadClassrooms = async () => {
    try {
      const res = await axios.get(
        "https://agenda.bkkthon.ac.th/fca/api/classroom/get_classroom.php"
      );
      if (res.data.status === "success") setClassroomList(res.data.data);
    } catch {}
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
      );

      if (res.data.status === "success") {
        const data = res.data.data || [];
        setStudents(data);

        // ถ้าไม่มีข้อมูลเลย → ไม่มีห้องเรียน
        if (data.length === 0) {
          setRooms([]);
          setFilteredStudents([]);
          return;
        }

        // นับจำนวนคนในแต่ละห้อง
        const roomCount = {};
        data.forEach((s) => {
          const room = s.classroom.replace("\\/", "/");
          roomCount[room] = (roomCount[room] || 0) + 1;
        });

        setRooms(
          Object.keys(roomCount).map((room) => ({
            name: room,
            count: roomCount[room],
          }))
        );

        // กรองนักศึกษาถ้าห้องถูกเลือกอยู่
        if (selectedRoom) {
          const list = data.filter(
            (s) => s.classroom.replace("\\/", "/") === selectedRoom
          );
          setFilteredStudents(list);
        }
      } else {
        // ถ้า API status != success
        setStudents([]);
        setRooms([]);
        setFilteredStudents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    const list = students.filter(
      (s) => s.classroom.replace("\\/", "/") === room
    );
    setFilteredStudents(list);
  };

  // ลบนักศึกษา
  const deleteStudent = async (student_id) => {
    if (!confirm("ต้องการลบข้อมูลนี้จริงไหม?")) return;

    setActionLoading(student_id);

    try {
      // ลบข้อมูล
      await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/student/delete_student.php",
        { student_id },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("ลบข้อมูลสำเร็จ");

      // โหลดข้อมูลใหม่จาก API
      const res = await axios.get(
        "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
      );

      const updatedStudents = res.data.data || [];

      // อัปเดต state หลัก
      setStudents(updatedStudents);

      // นับห้องใหม่
      const roomCount = {};
      updatedStudents.forEach((s) => {
        const r = s.classroom.replace("\\/", "/");
        roomCount[r] = (roomCount[r] || 0) + 1;
      });

      const updatedRooms = Object.keys(roomCount).map((room) => ({
        name: room,
        count: roomCount[room],
      }));
      setRooms(updatedRooms);

 
      setFilteredStudents([]);

   
      setSelectedRoom("");

      setTimeout(() => {
        if (roomCount[selectedRoom] > 0) {
          const list = updatedStudents.filter(
            (s) => s.classroom.replace("\\/", "/") === selectedRoom
          );
          setSelectedRoom(selectedRoom);
          setFilteredStudents(list);
        }
      }, 10);
    } finally {
      setActionLoading(null);
    }
  };

  // ย้ายห้องเรียน
  const moveStudent = async (student_id) => {
    if (!newRoom) {
      alert("กรุณาเลือกห้องเรียนใหม่");
      return;
    }

    setActionLoading(student_id);

    try {
      const res = await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/student/move_student.php",
        { student_id, new_classroom: newRoom },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(res.data.message);
      setShowMovePanel(null);
      setNewRoom("");
      await loadStudents();
      handleSelectRoom(selectedRoom);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-5 text-blue-700">
        🏫 รายห้องเรียนทั้งหมด
      </h2>

      {/* Spinner โหลดข้อมูลหน้า */}
      {loading && (
        <div className="text-center my-5">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-700">กำลังโหลดข้อมูล...</p>
        </div>
      )}

      {/* ปุ่มห้องเรียน */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {/* ถ้าไม่มีห้องเรียนเลย */}
        {rooms.length === 0 && !loading && (
          <p className="text-gray-600 text-center w-full py-4">
            ❗ ไม่มีรายห้องเรียน
          </p>
        )}
        {rooms.map((room, index) => (
          <button
            key={index}
            onClick={() => handleSelectRoom(room.name)}
            className={`rounded-xl px-4 py-3 shadow-md border text-left transition-all duration-200 ${
              selectedRoom === room.name
                ? "bg-blue-600 text-white border-blue-700 shadow-lg scale-105"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
            }`}
          >
            <div className="font-semibold text-lg">{room.name}</div>
            <div className="text-sm opacity-75">👥 {room.count} คน</div>
          </button>
        ))}
      </div>

      {/* รายชื่อในห้อง */}
      {!loading && selectedRoom && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            👇 รายชื่อในห้อง{" "}
            <span className="text-blue-600">{selectedRoom}</span>
          </h3>

          {filteredStudents.length === 0 ? (
            <p>ยังไม่มีนักศึกษาในห้องนี้</p>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition-all"
                >
                  <p className="font-semibold text-lg text-gray-800">
                    {st.student_name}
                  </p>
                  <p className="text-sm text-gray-600">รหัส: {st.student_id}</p>
                  <p className="text-sm text-gray-600">สาขา: {st.course}</p>
                  <p className="text-sm text-gray-600">คณะ: {st.faculty}</p>
                  <p className="text-sm text-gray-600">เบอร์โทร {st.phone}</p>

                  {/* ปุ่มลบ & ย้าย */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => deleteStudent(st.student_id)}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                      disabled={actionLoading === st.student_id}
                    >
                      {actionLoading === st.student_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        "🗑 ลบ"
                      )}
                    </button>

                    <button
                      onClick={() => setShowMovePanel(st.student_id)}
                      className="px-3 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 flex items-center justify-center"
                    >
                      🔁 ย้ายห้อง
                    </button>
                  </div>

                  {/* Panel ย้ายห้อง */}
                  {showMovePanel === st.student_id && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-lg border">
                      <p className="text-sm mb-2">เลือกห้องใหม่:</p>

                      <select
                        className="p-2 border rounded-lg w-full mb-2"
                        onChange={(e) => setNewRoom(e.target.value)}
                      >
                        <option value="">-- เลือกห้อง --</option>
                        {classroomList.map((room, idx) => (
                          <option key={idx} value={room}>
                            {room}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => moveStudent(st.student_id)}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex justify-center"
                        disabled={actionLoading === st.student_id}
                      >
                        {actionLoading === st.student_id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          "✔ ยืนยันการย้าย"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClassRoom;
