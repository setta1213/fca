import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AttendanceReport() {
  const [mode, setMode] = useState("daily");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await axios.get(
      "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
    );
    if (res.data.status === "success") {
      const roomSet = new Set();
      res.data.data.forEach((s) =>
        roomSet.add(s.classroom.replace("\\/", "/"))
      );
      setRooms([...roomSet].sort());
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    let url = "";

    if (mode === "daily") {
      // ← ใช้ช่วงวันที่แทน
      url = `https://agenda.bkkthon.ac.th/fca/api/attendance/report_range.php?start=${date}&end=${date}&room=${selectedRoom}`;
    }

    if (mode === "monthly")
      url = `https://agenda.bkkthon.ac.th/fca/api/attendance/report_monthly.php?month=${month}&year=${year}&room=${selectedRoom}`;

    if (mode === "yearly")
      url = `https://agenda.bkkthon.ac.th/fca/api/attendance/report_yearly.php?year=${year}&room=${selectedRoom}`;

    if (mode === "range")
      url = `https://agenda.bkkthon.ac.th/fca/api/attendance/report_range.php?start=${startDate}&end=${endDate}&room=${selectedRoom}`;

    try {
      const res = await axios.get(url);
      const data = res.data.data || [];
      setReportData(data);
      prepareChartData(data);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (data) => {
    const statusCount = {
      present: 0,
      absent: 0,
      sick: 0,
      leave: 0,
    };

    data.forEach((item) => {
      if (statusCount[item.status] !== undefined) {
        statusCount[item.status]++;
      }
    });

    setChartData({
      labels: ["มาเรียน", "ขาด", "ลาป่วย", "ลากิจ"],
      datasets: [
        {
          label: "จำนวนนักเรียน",
          data: [
            statusCount.present,
            statusCount.absent,
            statusCount.sick,
            statusCount.leave,
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(234, 179, 8, 0.8)",
            "rgba(59, 130, 246, 0.8)",
          ],
          borderColor: [
            "rgb(34, 197, 94)",
            "rgb(239, 68, 68)",
            "rgb(234, 179, 8)",
            "rgb(59, 130, 246)",
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, `attendance_report_${Date.now()}.xlsx`);
  };

  const getStatusColor = (status) => {
    const colors = {
      present: "bg-green-100 text-green-800 border-green-200",
      absent: "bg-red-100 text-red-800 border-red-200",
      sick: "bg-yellow-100 text-yellow-800 border-yellow-200",
      leave: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      present: "✅",
      absent: "❌",
      sick: "🤒",
      leave: "📝",
    };
    return icons[status] || "📄";
  };

  const modeConfig = {
    daily: { label: "รายวัน", icon: "📅" },
    monthly: { label: "รายเดือน", icon: "📆" },
    yearly: { label: "รายปี", icon: "📊" },
    range: { label: "ช่วงวันที่", icon: "⏰" },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">📘</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            รายงานสรุปการเช็คชื่อ
          </h1>
          <p className="text-gray-600 text-lg">
            ดูรายงานสถิติการเข้าร่วมเรียนแบบละเอียด
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              โหมดการดูรายงาน
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(modeConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2 ${
                    mode === key
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{config.icon}</span>
                  <span className="font-semibold">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div className="mb-6">
            <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-lg">🏫</span>
              เลือกห้องเรียน
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              {rooms.map((room, idx) => (
                <option key={idx} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection Based on Mode */}
          <div className="mb-6">
            <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-lg">📅</span>
              {modeConfig[mode].label}
            </label>

            {mode === "daily" && (
              <input
                type="date"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            )}

            {mode === "monthly" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      เดือน {i + 1}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2000"
                  max="2100"
                />
              </div>
            )}

            {mode === "yearly" && (
              <input
                type="number"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max="2100"
              />
            )}

            {mode === "range" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="วันที่เริ่มต้น"
                />
                <input
                  type="date"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="วันที่สิ้นสุด"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  กำลังโหลด...
                </>
              ) : (
                <>
                  <span className="text-xl">🔍</span>
                  ดึงข้อมูลรายงาน
                </>
              )}
            </button>

            {reportData.length > 0 && (
              <button
                onClick={exportExcel}
                className="flex-1 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <span className="text-xl">📤</span>
                Export Excel
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {!loading && reportData.length > 0 && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { status: "present", label: "มาเรียน", color: "green" },
                { status: "absent", label: "ขาด", color: "red" },
                { status: "sick", label: "ลาป่วย", color: "yellow" },
                { status: "leave", label: "ลากิจ", color: "blue" },
              ].map((item) => {
                const count = reportData.filter(
                  (r) => r.status === item.status
                ).length;
                return (
                  <div
                    key={item.status}
                    className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 border-${item.color}-500 hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-800">
                          {count}
                        </p>
                        <p className="text-gray-600 font-medium">
                          {item.label}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center`}
                      >
                        <span className="text-2xl">
                          {getStatusIcon(item.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart */}
            {chartData && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  📈 สถิติการเข้าร่วมเรียน
                </h3>
                <div className="h-80">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">
                  📋 รายละเอียดการเช็คชื่อ ({reportData.length} รายการ)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        วันที่
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        รหัสนักเรียน
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ชื่อนักเรียน
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ห้องเรียน
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        สถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.map((r, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {r.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {r.student_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {r.student_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {r.room}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              r.status
                            )}`}
                          >
                            {getStatusIcon(r.status)}
                            {r.status === "present" && "มาเรียน"}
                            {r.status === "absent" && "ขาด"}
                            {r.status === "sick" && "ลาป่วย"}
                            {r.status === "leave" && "ลากิจ"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reportData.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              ยังไม่มีข้อมูล
            </h3>
            <p className="text-gray-600 mb-6">
              กรุณาเลือกเงื่อนไขและดึงข้อมูลรายงาน
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceReport;
