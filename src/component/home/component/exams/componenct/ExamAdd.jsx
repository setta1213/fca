import { useState, useEffect } from "react";
import axios from "axios";

function ExamAdd({user}) {
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [exams, setExams] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // โหลดรายการสอบทั้งหมด
  const loadExams = async () => {
    try {
      const res = await axios.get(
        "https://agenda.bkkthon.ac.th/fca/api/exam/get_exam_list.php"
      );
      if (res.data.status === "success") {
        setExams(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading exams:", err);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const saveExam = async () => {
    if (!examName || !examDate) {
      setMsg({ type: "error", text: "กรุณากรอกข้อมูลให้ครบ" });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const form = new FormData();
      form.append("exam_name", examName);
      form.append("exam_date", examDate);
      form.append("user_name", user.name);

      const res = await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/exam/add_exam.php",
        form
      );

      if (res.data.status === "success") {
        setMsg({ type: "success", text: "บันทึกวันสอบสำเร็จ!" });
        setExamName("");
        setExamDate("");
        // โหลดรายการสอบใหม่
        await loadExams();
      } else {
        setMsg({ type: "error", text: res.data.message || "เกิดข้อผิดพลาด" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
      console.error(err);
    }

    setLoading(false);
  };

  const deleteExam = async (examId) => {
    if (!window.confirm("คุณแน่ใจว่าต้องการลบวันสอบนี้ใช่หรือไม่?")) {
      return;
    }

    setDeleteLoading(examId);

    try {
      const form = new FormData();
      form.append("exam_id", examId);

      const res = await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/exam/delete_exam.php",
        form
      );

      if (res.data.status === "success") {
        setMsg({ type: "success", text: "ลบวันสอบสำเร็จ!" });
        // โหลดรายการสอบใหม่
        await loadExams();
      } else {
        setMsg({
          type: "error",
          text: res.data.message || "เกิดข้อผิดพลาดในการลบ",
        });
      }
    } catch (err) {
      setMsg({ type: "error", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
      console.error(err);
    }

    setDeleteLoading(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-purple-50 p-4">
      user: {user.name}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            เพิ่มวันสอบใหม่
          </h1>
          <p className="text-gray-600">จัดการวันสอบและดูรายการสอบทั้งหมด</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">➕</span>
              เพิ่มวันสอบใหม่
            </h2>

            {/* Alert Message */}
            {msg && (
              <div
                className={`p-4 mb-6 rounded-xl text-center font-semibold border-l-4 ${
                  msg.type === "success"
                    ? "bg-green-50 text-green-700 border-green-500"
                    : "bg-red-50 text-red-700 border-red-500"
                }`}
              >
                {msg.text}
              </div>
            )}

            {/* Form Input */}
            <div className="space-y-6">
              {/* Exam Name */}
              <div>
                <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  ชื่อข้อสอบ
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="เช่น สอบกลางภาค วิชาคอมพิวเตอร์"
                />
              </div>

              {/* Exam Date */}
              <div>
                <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  วันที่สอบ
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveExam}
              disabled={loading}
              className="w-full mt-8 py-4 text-white bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <span className="text-xl">💾</span>
                  บันทึกวันสอบ
                </>
              )}
            </button>
          </div>

          {/* Exams List Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              รายการสอบทั้งหมด ({exams.length})
            </h2>

            {exams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 font-medium">ยังไม่มีรายการสอบ</p>
                <p className="text-gray-400 text-sm mt-2">
                  เพิ่มวันสอบใหม่เพื่อเริ่มต้น
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-pink-200 transition-all duration-200 bg-linear-to-r from-gray-50 to-white hover:from-pink-50 hover:to-purple-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                          {exam.exam_name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">📅</span>
                          <span className="text-sm">
                            {formatDate(exam.exam_date)}
                          </span>
                        </div>
                        
                      </div>
                      {user.admin_type === "1" && (
                      <button
                        onClick={() => deleteExam(exam.id)}
                        disabled={deleteLoading === exam.id}
                        className="ml-4 px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl"
                      >
                        ลบ
                      </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Statistics */}
            {exams.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-2xl font-bold text-blue-600">
                      {exams.length}
                    </p>
                    <p className="text-blue-700 text-sm font-medium">
                      รายการสอบทั้งหมด
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-2xl font-bold text-green-600">
                      {
                        exams.filter(
                          (exam) => new Date(exam.exam_date) >= new Date()
                        ).length
                      }
                    </p>
                    <p className="text-green-700 text-sm font-medium">
                      สอบยังไม่ถึง
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {exams.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span>
              สถิติอย่างรวดเร็ว
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "ทั้งหมด",
                  value: exams.length,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: "กำลังจะมาถึง",
                  value: exams.filter(
                    (exam) => new Date(exam.exam_date) > new Date()
                  ).length,
                  color: "from-green-500 to-green-600",
                },
                {
                  label: "สอบวันนี้",
                  value: exams.filter(
                    (exam) =>
                      new Date(exam.exam_date).toDateString() ===
                      new Date().toDateString()
                  ).length,
                  color: "from-yellow-500 to-yellow-600",
                },
                {
                  label: "สอบผ่านไปแล้ว",
                  value: exams.filter(
                    (exam) => new Date(exam.exam_date) < new Date()
                  ).length,
                  color: "from-gray-500 to-gray-600",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 bg-linear-to-r ${stat.color} text-white rounded-xl`}
                >
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamAdd;
