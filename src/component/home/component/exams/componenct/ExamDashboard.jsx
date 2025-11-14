import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function ExamDashboard() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("all");

  const [rangeType, setRangeType] = useState("year"); // day/month/year/custom
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]); // graph list
  const [loading, setLoading] = useState(false);

  // โหลดห้อง
  useEffect(() => {
    loadRooms();
    loadDatauser();
  }, []);

  const loadDatauser = async () => {
    await axios.get(
            "https://agenda.bkkthon.ac.th/fca/api/exam/auto_update_absent.php"
          );
  };
  const loadRooms = async () => {
    const res = await axios.get(
      "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
    );
    const setRoom = new Set();

    res.data.data.forEach((s) => setRoom.add(s.classroom.replace("\\/", "/")));

    setRooms([...setRoom].sort());
  };

  // โหลดสรุป
  const loadSummary = async () => {
    setLoading(true);

    const params = {
      room: selectedRoom,
      type: rangeType,
      dateStart,
      dateEnd,
    };

    const res = await axios.get(
      "https://agenda.bkkthon.ac.th/fca/api/exam/exam_report.php",
      { params }
    );

    if (res.data.status === "success") {
      setSummary(res.data.summary);
      setTimeline(res.data.timeline);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSummary();
  }, [selectedRoom, rangeType, dateStart, dateEnd]);

  const present = summary?.present || 0;
  const absent = summary?.absent || 0;
  const total = present + absent;
  const percentPresent = total > 0 ? Math.round((present / total) * 100) : 0;

  // Pie Chart
  const pieData = {
    labels: ["มาสอบ", "ขาดสอบ"],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#22c55e", "#ef4444"],
        borderWidth: 3,
      },
    ],
  };

  // Bar Chart (ตามวัน/เดือน)
  const barData = {
    labels: timeline.map((t) => t.label),
    datasets: [
      {
        label: "มาสอบ",
        data: timeline.map((t) => t.present),
        backgroundColor: "#4ade80",
      },
      {
        label: "ขาดสอบ",
        data: timeline.map((t) => t.absent),
        backgroundColor: "#f87171",
      },
    ],
  };

  const lineData = {
    labels: timeline.map((t) => t.label),
    datasets: [
      {
        label: "มาสอบ",
        data: timeline.map((t) => t.present),
        borderColor: "#22c55e",
        tension: 0.4,
      },
      {
        label: "ขาดสอบ",
        data: timeline.map((t) => t.absent),
        borderColor: "#ef4444",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            📊 Dashboard การสอบรวม
          </h1>
          <p className="text-gray-600">
            ดูข้อมูลภาพรวม — มาสอบ/ขาดสอบ พร้อมกราฟสวยงาม
          </p>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {/* เลือกห้อง */}
            <div className="">
              <label className="font-semibold text-gray-700 mb-1 block">
                🏫 เลือกห้องเรียน
              </label>
              <select
                className="w-full p-3 border rounded-xl"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="all">ทุกห้อง</option>
                {rooms.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* เลือกช่วงเวลา */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">
                📅 ประเภทช่วงเวลา
              </label>
              <select
                className="w-full p-3 border rounded-xl"
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value)}
              >
                <option value="day">รายวัน</option>
                <option value="month">รายเดือน</option>
                <option value="year">รายปี</option>
                <option value="custom">กำหนดเอง</option>
              </select>
            </div>

            {/* Custom Range */}
            {rangeType === "custom" && (
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <input
                  type="date"
                  className="p-3 border rounded-xl"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
                <input
                  type="date"
                  className="p-3 border rounded-xl"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 bg-white rounded-2xl shadow text-center">
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-gray-600">รวมทั้งหมด</p>
            </div>
            <div className="p-5 bg-green-50 rounded-2xl shadow text-center">
              <p className="text-3xl font-bold text-green-600">{present}</p>
              <p className="text-green-700">มาสอบ</p>
            </div>
            <div className="p-5 bg-red-50 rounded-2xl shadow text-center">
              <p className="text-3xl font-bold text-red-600">{absent}</p>
              <p className="text-red-700">ขาดสอบ</p>
            </div>
            <div className="p-5 bg-indigo-50 rounded-2xl shadow text-center">
              <p className="text-3xl font-bold text-indigo-600">
                {percentPresent}%
              </p>
              <p className="text-indigo-700">อัตรามาสอบ</p>
            </div>
          </div>
        )}

        {/* Graph Section */}
        {summary && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-center">
                สัดส่วนการสอบ
              </h3>
              <Pie data={pieData} />
            </div>

            {/* Bar chart */}
            <div className="bg-white p-6 rounded-2xl shadow-xl xl:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-center">
                กราฟแท่งตามช่วงเวลา
              </h3>
              <Bar data={barData} />
            </div>

            {/* Line chart */}
            <div className="bg-white p-6 rounded-2xl shadow-xl xl:col-span-3 mt-6">
              <h3 className="text-xl font-bold mb-4 text-center">
                แนวโน้มการสอบ (Line Chart)
              </h3>
              <Line data={lineData} />
            </div>
          </div>
        )}

        {/* Table */}
        {timeline.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-xl mt-8">
            <h3 className="text-xl font-bold mb-4">ตารางสรุป</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">ช่วง</th>
                    <th className="p-3">มาสอบ</th>
                    <th className="p-3">ขาดสอบ</th>
                    <th className="p-3">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((t, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">{t.label}</td>
                      <td className="p-3">{t.present}</td>
                      <td className="p-3">{t.absent}</td>
                      <td className="p-3">{t.present + t.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamDashboard;
