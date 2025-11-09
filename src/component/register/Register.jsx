import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    lastname: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const name = String(form.get("name") || "").trim();
    const lastname = String(form.get("lastname") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "").trim();
    const confirm = String(form.get("confirm") || "").trim();

    const nextErrors = { email: "", name: "", lastname: "", phone: "", password: "", confirm: "" };
    if (!email) nextErrors.email = "กรุณากรอกอีเมล";
    if (!name) nextErrors.name = "กรุณากรอกชื่อ";
    if (!lastname) nextErrors.lastname = "กรุณากรอกนามสกุล";
    if (!phone) {
      nextErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d{10}$/.test(phone)) {
      nextErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) nextErrors.password = "กรุณากรอกรหัสผ่าน";
    if (password.length < 6)
      nextErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    if (confirm !== password) nextErrors.confirm = "รหัสผ่านไม่ตรงกัน";

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    try {
      setLoading(true);
      const res = await fetch(
        "https://agenda.bkkthon.ac.th/fca/api/register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, lastname, phone}),
        }
      );
      // if (!res.ok) throw new Error('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
      const data = await res.json();
      if (data.status === "error") throw new Error(data.message);
 
      await Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: data.message,
      });
      navigate("/");
    } catch (err) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: err.message });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          สมัครสมาชิก
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              className={`mt-1 w-full rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ชื่อ
            </label>
            <input
              type="text"
              name="name"
              className={`mt-1 w-full rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none`}
              placeholder="ชื่อ"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              นามสกุล
            </label>
            <input
              type="text"
              name="lastname"
              className={`mt-1 w-full rounded-lg border ${
                errors.lastname ? "border-red-500" : "border-gray-300"
              } px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none`}
              placeholder="นามสกุล"
            />
          </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">
              เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                name="phone"
                className={`mt-1 w-full rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-gray-300"}
                  px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none`}
                placeholder="08XXXXXXXX"
                maxLength="10"
              />
              {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
         </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              className={`mt-1 w-full rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              name="confirm"
              className={`mt-1 w-full rounded-lg border ${
                errors.confirm ? "border-red-500" : "border-gray-300"
              } px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none`}
              placeholder="••••••••"
            />
            {errors.confirm && (
              <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition disabled:opacity-70"
          >
            {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          มีบัญชีอยู่แล้ว?
          <Link to="/" className="text-indigo-600 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
