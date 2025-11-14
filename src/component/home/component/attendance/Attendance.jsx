import { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedRoom) loadAttendanceToday();
  }, [selectedRoom, selectedDate]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
      );
      if (res.data.status === "success") {
        const data = res.data.data;
        const roomMap = {};
        data.forEach((s) => {
          const room = s.classroom.replace("\\/", "/");
          roomMap[room] = (roomMap[room] || 0) + 1;
        });
        setRooms(Object.keys(roomMap));
        setStudents(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceToday = async () => {
    const res = await axios.get(
      "https://agenda.bkkthon.ac.th/fca/api/attendance/get_attendance_by_date.php?date=" +
        selectedDate
    );
    if (res.data.status === "success") {
      setAttendance(res.data.data);
    }
  };

  const studentChecked = attendance.filter(
    (a) => a.room === selectedRoom
  );

  const studentNotChecked = students.filter(
    (s) =>
      s.classroom.replace("\\/", "/") === selectedRoom &&
      !studentChecked.some((a) => a.student_id === s.student_id)
  );

  const markAttendance = async (student_id, status) => {
    setActionLoading(student_id);
    try {
      const payload = {
        student_id,
        room: selectedRoom,
        date: selectedDate,
        status,
      };
      await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/attendance/save_attendance.php",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      await loadAttendanceToday();
    } finally {
      setActionLoading(null);
    }
  };

  const statusConfig = {
    present: {
      label: "มาเรียน",
      color: "bg-green-500 hover:bg-green-600",
      icon: "✅",
      badge: "bg-green-100 text-green-800 border-green-200"
    },
    absent: {
      label: "ขาด",
      color: "bg-red-500 hover:bg-red-600",
      icon: "❌",
      badge: "bg-red-100 text-red-800 border-red-200"
    },
    sick: {
      label: "ลาป่วย",
      color: "bg-yellow-500 hover:bg-yellow-600",
      icon: "🤒",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    leave: {
      label: "ลากิจ",
      color: "bg-blue-500 hover:bg-blue-600",
      icon: "📝",
      badge: "bg-blue-100 text-blue-800 border-blue-200"
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ระบบเช็คชื่อประจำวัน
          </h1>
          <p className="text-gray-600">จัดการการเข้าร่วมเรียนของนักเรียน</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏫 ห้องเรียน
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="">-- เลือกห้องเรียน --</option>
                {rooms.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 วันที่
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        {selectedRoom && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{studentNotChecked.length}</div>
              <div className="text-sm text-gray-600">รอเช็คชื่อ</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{studentChecked.length}</div>
              <div className="text-sm text-gray-600">เช็คชื่อแล้ว</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {studentNotChecked.length + studentChecked.length}
              </div>
              <div className="text-sm text-gray-600">นักเรียนทั้งหมด</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Attendance */}
          {selectedRoom && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  ⏳ รอเช็คชื่อ
                </h3>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {studentNotChecked.length} คน
                </span>
              </div>

              {studentNotChecked.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-gray-500 font-medium">ทุกคนเช็คชื่อแล้ว!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studentNotChecked.map((st) => (
                    <div
                      key={st.student_id}
                      className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {st.student_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            รหัส: {st.student_id}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <button
                            key={status}
                            disabled={actionLoading === st.student_id}
                            onClick={() => markAttendance(st.student_id, status)}
                            className={`${config.color} text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                          >
                            <span>{config.icon}</span>
                            <span>{config.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed Attendance */}
          {selectedRoom && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  ✅ เช็คชื่อแล้ว
                </h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {studentChecked.length} คน
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {studentChecked.map((st) => (
                  <div
                    key={st.student_id}
                    className={`p-4 rounded-xl border-l-4 ${
                      statusConfig[st.status]?.badge
                    } border shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{st.student_id}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {statusConfig[st.status]?.icon}{" "}
                          {statusConfig[st.status]?.label}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          เช็คชื่อแล้ว
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {studentChecked.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-500 font-medium">ยังไม่มีรายการเช็คชื่อ</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-700">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;