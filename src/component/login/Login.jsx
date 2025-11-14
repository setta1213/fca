import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "./LoginStyle.css";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email.trim();
    const password = formData.password.trim();

    const nextErrors = { email: "", password: "" };
    if (!email) nextErrors.email = "กรุณากรอกอีเมล";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) nextErrors.password = "กรุณากรอกรหัสผ่าน";
    else if (password.length < 6)
      nextErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";

    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;

    setLoading(true);
    try {
      const res = await fetch("https://agenda.bkkthon.ac.th/fca/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.status === 200) {
        let userId = data.user.id;
        let userEmail = data.user.email;
        let userName = data.user.name;
        let userLastname = data.user.lastname;
        let userPhone = data.user.phone;
        let userType = data.user.type;

        if (Array.isArray(userId)) {
          userId = userId[0];
        }
        
        if (userType === "0") {
          await Swal.fire({
            icon: "error",
            title: "เข้าสู่ระบบสำเร็จ",
            text: `${data.message}\n${userName} ${userLastname} คุณไม่มีสิทธิ์การเข้าถึงกรุณาติดต่อผู้ดูแลระบบ` || "ยินดีต้อนรับกลับ!",
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#3b82f6',
          });
        } else if (userType === "1") {
          await Swal.fire({
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ",
            text: `${data.message} ${userName} ${userLastname}` || "ยินดีต้อนรับกลับ!",
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#10b981',
          });
          const user = {
            id: userId,
            email: userEmail,
            name: userName,
            lastname: userLastname,
            phone: userPhone,
            type: userType,
          };
          navigate("/home", { state: { user: user } });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = () => {
    Swal.fire({
      title: "ลืมรหัสผ่าน",
      text: "เมื่อคุณลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "ยืนยัน",
      background: '#1e293b',
      color: '#f8fafc',
    });
  };

  const Privacynoti = () => {
    Swal.fire({
      icon: "info",
      title: "นโยบายความเป็นส่วนตัว",
      html: `
        <div class="text-left text-slate-300 max-h-96 overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">นโยบายความเป็นส่วนตัว</h3>
          <p class="mb-3">เว็บไซต์นี้ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน และมุ่งมั่นในการปกป้องข้อมูลส่วนบุคคลของคุณอย่างปลอดภัย</p>
          <div class="space-y-2 text-sm">
            <p><strong>ข้อมูลที่เราเก็บรวบรวม:</strong> ข้อมูลส่วนบุคคล, ข้อมูลการใช้งาน, ข้อมูลจากคุกกี้</p>
            <p><strong>วัตถุประสงค์:</strong> ปรับปรุงประสบการณ์การใช้งาน, วิเคราะห์พฤติกรรมผู้ใช้</p>
            <p><strong>การเปิดเผยข้อมูล:</strong> ผู้ให้บริการด้านเทคโนโลยี, หน่วยงานราชการ</p>
          </div>
        </div>
      `,
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#3b82f6',
      width: '500px',
    });
  };

  const openPolicy = () => {
    Swal.fire({
      title: "ข้อตกลงการใช้งาน",
      html: `
        <div class="text-left text-slate-300 max-h-96 overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">ข้อตกลงการใช้งาน</h3>
          <div class="space-y-3 text-sm">
            <p><strong>1. การยอมรับข้อตกลง</strong><br>ผู้ใช้งานตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่ระบุไว้ในเว็บไซต์นี้</p>
            <p><strong>2. การใช้งานเว็บไซต์</strong><br>ห้ามใช้เว็บไซต์เพื่อวัตถุประสงค์ที่ผิดกฎหมาย หรือขัดต่อศีลธรรม</p>
            <p><strong>3. ข้อมูลส่วนบุคคล</strong><br>เราให้ความสำคัญกับการปกป้องข้อมูลส่วนบุคคลของคุณ</p>
          </div>
        </div>
      `,
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#3b82f6',
      width: '500px',
    });
  };

  useEffect(() => {
    openPolicy();
  }, []);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-yellow-100 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
               <img src="https://bkkthon.ac.th/home/template_front/images/logo.png" alt="" />
              </div>
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              เข้าสู่ระบบ
            </h1>
            <p className="text-slate-400">
              ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบเพื่อใช้งานต่อ
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8"
          >
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  อีเมล
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.email 
                        ? "border-rose-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20" 
                        : "border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                    placeholder="your@email.com"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-sm text-rose-400 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    รหัสผ่าน
                  </label>
                  <button
                    type="button"
                    onClick={forgotPassword}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.password 
                        ? "border-rose-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20" 
                        : "border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-sm text-rose-400 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    เข้าสู่ระบบ
                  </>
                )}
              </motion.button>

              {/* Terms and Privacy */}
              <div className="text-center pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-400">
                  การเข้าสู่ระบบแสดงว่าคุณยอมรับ{" "}
                  <button
                    type="button"
                    onClick={openPolicy}
                    className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                  >
                    ข้อตกลงการใช้งาน
                  </button>{" "}
                  และ{" "}
                  <button
                    type="button"
                    onClick={Privacynoti}
                    className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                  >
                    นโยบายความเป็นส่วนตัว
                  </button>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-slate-400">
              ยังไม่มีบัญชี?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}