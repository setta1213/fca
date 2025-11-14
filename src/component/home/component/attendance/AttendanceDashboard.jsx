import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function AttendanceDashboard() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // โหลดรายห้องครั้งเดียวตอนเริ่ม
  useEffect(() => {
    loadRooms();
  }, []);

  // โหลดสรุปทุกครั้งที่เปลี่ยนวันที่หรือห้อง
  useEffect(() => {
    loadSummary();
  }, [date, selectedRoom]);

  // โหลดห้องเรียนจาก student table
  const loadRooms = async () => {
    try {
      const res = await axios.get(
        "https://agenda.bkkthon.ac.th/fca/api/student/get_student.php"
      );

      if (res.data.status === "success") {
        const data = res.data.data || [];
        const roomSet = new Set();
        data.forEach((s) => {
          if (s.classroom) {
            roomSet.add(s.classroom.replace("\\/", "/"));
          }
        });
        setRooms([...roomSet].sort());
      } else {
        setRooms([]);
      }
    } catch (e) {
      console.error("loadRooms error:", e);
      setRooms([]);
    }
  };

  // โหลดสรุปการเช็คชื่อ
  const loadSummary = async () => {
    setLoading(true);
    try {
      let url = "";

      if (selectedRoom === "all") {
        url =
          "https://agenda.bkkthon.ac.th/fca/api/attendance/get_attendance_summary.php?date=" +
          date;
      } else {
        url =
          "https://agenda.bkkthon.ac.th/fca/api/attendance/get_attendance_summary_room.php?date=" +
          date +
          "&room=" +
          encodeURIComponent(selectedRoom);
      }

      const res = await axios.get(url);

      if (res.data && res.data.summary) {
        setSummary(res.data.summary);
      } else {
        setSummary(null);
      }
    } catch (e) {
      console.error("loadSummary error:", e);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // ดึงค่าแบบกัน null / undefined
  const present = Number(summary?.present) || 0;
  const absent = Number(summary?.absent) || 0;
  const sick = Number(summary?.sick) || 0;
  const leaveTotal = Number(summary?.leave_total) || 0;

  const total = present + absent + sick + leaveTotal;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const hasData = summary !== null && total > 0;

  const chartData = summary
    ? {
        labels: ["มาเรียน", "ขาด", "ลาป่วย", "ลากิจ"],
        datasets: [
          {
            data: [present, absent, sick, leaveTotal],
            backgroundColor: [
              "rgba(34,197,94,0.8)",
              "rgba(239,68,68,0.8)",
              "rgba(234,179,8,0.8)",
              "rgba(59,130,246,0.8)",
            ],
            borderColor: [
              "rgba(34,197,94,1)",
              "rgba(239,68,68,1)",
              "rgba(234,179,8,1)",
              "rgba(59,130,246,1)",
            ],
            borderWidth: 3,
            hoverOffset: 15,
          },
        ],
      }
    : null;

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a, b) => Number(a || 0) + Number(b || 0),
              0
            );
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} คน (${percentage}%)`;
          },
        },
      },
    },
    cutout: "0%",
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const statusConfig = {
    present: {
      icon: "✅",
      label: "มาเรียน",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      value: present,
    },
    absent: {
      icon: "❌",
      label: "ขาด",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      value: absent,
    },
    sick: {
      icon: "🤒",
      label: "ลาป่วย",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      value: sick,
    },
    leave: {
      icon: "📝",
      label: "ลากิจ",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      value: leaveTotal,
    },
  };

  return (
  <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-lg mb-3">
          <span className="text-3xl sm:text-4xl">📊</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
          สรุปผลการเช็คชื่อประจำวัน
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          ดูสถิติและข้อมูลการเข้าร่วมเรียนแบบเรียลไทม์
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

          {/* Date Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">📅</span> เลือกวันที่
            </label>
            <input
              type="date"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                         bg-white shadow-sm hover:border-gray-300"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Room Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">🏫</span> เลือกห้องเรียน
            </label>
            <select
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                         bg-white shadow-sm hover:border-gray-300"
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

        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div
              key={key}
              className={`${config.bgColor} border-2 ${config.borderColor}
                          rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl
                          transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
                    {config.value || 0}
                  </p>
                  <p className={`font-semibold text-sm sm:text-base ${config.textColor}`}>
                    {config.label}
                  </p>
                </div>

                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br ${config.color}
                                 flex items-center justify-center text-xl sm:text-2xl`}>
                  {config.icon}
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedRoom === "all" ? "ทุกห้องเรียน" : `ห้อง ${selectedRoom}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Summary Card */}
      {summary && (
        <div className="bg-linear-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="text-center md:text-left">
              <p className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">นักเรียนทั้งหมด</p>
              <p className="text-3xl sm:text-4xl font-bold">{total} คน</p>
            </div>

            <div className="text-center">
              <p className="text-base sm:text-lg mb-1 sm:mb-2">อัตราการมาเรียน</p>
              <p className="text-2xl sm:text-3xl font-bold">{attendanceRate}%</p>
            </div>

            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
                👥
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Chart Section */}
      {chartData && hasData && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">

          <div className="text-center mb-4 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              กราฟสรุปผลการเช็คชื่อ
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              วันที่ {new Date(date).toLocaleDateString("th-TH")}
              {selectedRoom !== "all" && ` • ห้อง ${selectedRoom}`}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">

            {/* Chart */}
            <div className="w-full lg:w-1/2 min-h-[280px]">
              <Pie
                data={chartData}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                }}
              />
            </div>

            {/* Legend */}
            <div className="w-full lg:w-1/2 space-y-4">
              {chartData.labels.map((label, idx) => {
                const value = chartData.datasets[0].data[idx];
                const totalLocal = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / totalLocal) * 100);

                const configKey = Object.keys(statusConfig)[idx];
                const config = statusConfig[configKey];

                return (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 sm:p-4
                               rounded-xl border-2 border-gray-100 hover:border-gray-200"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br ${config.color}
                                       flex items-center justify-center text-lg sm:text-xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{label}</p>
                        <p
                          className="text-lg sm:text-2xl font-bold"
                          style={{
                            color: chartData.datasets[0].backgroundColor[idx],
                          }}
                        >
                          {value} คน
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-2xl font-bold">{percentage}%</p>
                      <p className="text-xs sm:text-sm text-gray-600">ของทั้งหมด</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex items-center gap-4 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-700 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      )}

      {/* No Data */}
      {!loading && (!summary || total === 0) && (
        <div className="bg-white rounded-2xl shadow-xl p-10 sm:p-12 text-center mt-4">
          <div className="text-5xl sm:text-6xl mb-3">📭</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            ไม่พบข้อมูลการเช็คชื่อ
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            กรุณาเลือกวันที่และห้องเรียนที่มีการเช็คชื่อแล้ว
          </p>
        </div>
      )}

    </div>
  </div>
);

}

export default AttendanceDashboard;
