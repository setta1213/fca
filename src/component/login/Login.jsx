import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "").trim();

    const nextErrors = { email: "", password: "" };
    if (!email) nextErrors.email = "กรุณากรอกอีเมล";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) nextErrors.password = "กรุณากรอกรหัสผ่าน";
    if (password && password.length < 6)
      nextErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";

    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;

    setLoading(true);
    const res = await fetch("https://agenda.bkkthon.ac.th/fca/api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.status == 200) {
      setLoading(false);
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
        Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบสำเร็จ",
          text:
            data.message +
              "\n" +
              userName +
              " " +
              userLastname +
              "คุณไม่มีสิทธิ์การเข้าถึงกรุณาติดต่อผู้ดูแลระบบ" ||
            "ยินดีต้อนรับกลับ!",
        });
      }
      if (userType === "1") {
        await Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ",
          text:
            data.message + "" + userName + " " + userLastname ||
            "ยินดีต้อนรับกลับ!",
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
      return;
    }
    if (data.status === "error") {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: data.message || "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้",
      });
      return;
    }

    // setTimeout(() => {
    //   setLoading(false);
    //   Swal.fire({
    //     icon: "success",
    //     title: "เข้าสู่ระบบสำเร็จ",
    //     text: "ยินดีต้อนรับกลับ!",
    //   });
    // }, 900);
  };
  const forgotPassword = () => {
    Swal.fire({
      title: "ลืมรหัสผ่าน",
      text: "เมื่อคุณลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
    });
  };
  const Privacynoti = () => {
    Swal.fire({
      icon: "warning",
      title: "นโยบายความเป็นส่วนตัว",
      html: `
 <section class="privacy-policy">
  <h2>นโยบายความเป็นส่วนตัว (Privacy Policy)</h2>
  <p>เว็บไซต์นี้ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน และมุ่งมั่นในการปกป้องข้อมูลส่วนบุคคลของคุณอย่างปลอดภัย โปรดอ่านนโยบายนี้เพื่อเข้าใจวิธีการที่เราเก็บ ใช้ และปกป้องข้อมูลของคุณ</p>

  <h3>1. ข้อมูลที่เราเก็บรวบรวม</h3>
  <ul>
    <li>ข้อมูลส่วนบุคคล เช่น ชื่อ, อีเมล, เบอร์โทรศัพท์, ที่อยู่</li>
    <li>ข้อมูลการใช้งาน เช่น หน้าที่เข้าชม, เวลาที่ใช้บนเว็บไซต์, ประเภทอุปกรณ์, เบราว์เซอร์</li>
    <li>ข้อมูลจากคุกกี้ (Cookies) และเทคโนโลยีติดตามอื่น ๆ เช่น Google Analytics, Facebook Pixel</li>
  </ul>

  <h3>2. วัตถุประสงค์ในการใช้ข้อมูล</h3>
  <ul>
    <li>ปรับปรุงประสบการณ์การใช้งานเว็บไซต์</li>
    <li>วิเคราะห์พฤติกรรมผู้ใช้เพื่อพัฒนาเนื้อหาและบริการ</li>
    <li>ส่งข่าวสาร โปรโมชั่น หรือการแจ้งเตือนที่เกี่ยวข้อง</li>
    <li>ป้องกันการใช้งานที่ผิดกฎหมายหรือละเมิดเงื่อนไขการใช้บริการ</li>
  </ul>

  <h3>3. การเปิดเผยข้อมูล</h3>
  <ul>
    <li>ผู้ให้บริการด้านเทคโนโลยี เช่น ระบบวิเคราะห์ข้อมูล, ระบบส่งอีเมล</li>
    <li>หน่วยงานราชการตามที่กฎหมายกำหนด</li>
    <li>กรณีที่จำเป็นเพื่อปกป้องสิทธิ์หรือความปลอดภัยของเว็บไซต์</li>
  </ul>

  <h3>4. การใช้คุกกี้ (Cookies)</h3>
  <ul>
    <li>จดจำการตั้งค่าของผู้ใช้</li>
    <li>วิเคราะห์การใช้งานเพื่อปรับปรุงประสิทธิภาพ</li>
    <li>แสดงโฆษณาที่ตรงกับความสนใจของผู้ใช้</li>
  </ul>
  <p>ผู้ใช้สามารถตั้งค่าเบราว์เซอร์เพื่อปฏิเสธคุกกี้ได้ แต่บางฟีเจอร์อาจใช้งานไม่ได้เต็มที่</p>

  <h3>5. ความปลอดภัยของข้อมูล</h3>
  <p>เราใช้มาตรการด้านเทคนิคและการบริหารจัดการเพื่อปกป้องข้อมูลจากการเข้าถึงโดยไม่ได้รับอนุญาต การสูญหาย หรือการเปิดเผยโดยไม่ได้รับอนุญาต</p>

  <h3>6. สิทธิของผู้ใช้งาน</h3>
  <ul>
    <li>ขอเข้าถึงหรือแก้ไขข้อมูลส่วนบุคคลของตน</li>
    <li>ขอให้ลบข้อมูลหรือระงับการใช้ข้อมูลบางประเภท</li>
    <li>ถอนความยินยอมในการรับข่าวสารหรือการติดตาม</li>
  </ul>
  <p>สามารถติดต่อเราได้ผ่านช่องทางที่ระบุไว้ในเว็บไซต์</p>

  <h3>7. การเปลี่ยนแปลงนโยบาย</h3>
  <p>เราขอสงวนสิทธิ์ในการปรับปรุงนโยบายนี้โดยไม่ต้องแจ้งล่วงหน้า โดยจะแสดงวันที่แก้ไขล่าสุดไว้ด้านล่าง</p>
  <p><strong>วันที่แก้ไขล่าสุด:</strong> 9 พฤศจิกายน 2568</p>
</section>`,
    });
  };
  const openPolicy = () => {
    Swal.fire({
      title: "ข้อตกลงการใช้งาน",
      html: `
        <p>โปรดอ่านข้อตกลงการใช้งานอย่างละเอียดก่อนใช้บริการของเรา...</p>
        <p>1. การยอมรับข้อตกลง
ผู้ใช้งานตกลงที่จะปฏิบัติตามข้อกำหนด เงื่อนไข และนโยบายต่าง ๆ ที่ระบุไว้ในเว็บไซต์นี้ หากไม่ยอมรับข้อตกลง กรุณาหยุดการใช้งานเว็บไซต์ทัน
</p>
        <p>2. การใช้งานเว็บไซต์
- ห้ามใช้เว็บไซต์เพื่อวัตถุประสงค์ที่ผิดกฎหมาย หรือขัดต่อศีลธรรม
- ห้ามกระทำการใด ๆ ที่อาจก่อให้เกิดความเสียหายต่อระบบ ความปลอดภัย หรือข้อมูลของเว็บไซต์
- ห้ามใช้ข้อมูลจากเว็บไซต์เพื่อการค้าโดยไม่ได้รับอนุญาต
3. การเก็บและใช้ข้อมูล
- เว็บไซต์อาจเก็บข้อมูลส่วนบุคคลและพฤติกรรมการใช้งานตามที่ระบุไว้ใน นโยบายความเป็นส่วนตัว
- ผู้ใช้งานตกลงให้เว็บไซต์ใช้ข้อมูลดังกล่าวเพื่อปรับปรุงบริการและประสบการณ์การใช้งาน
4. ทรัพย์สินทางปัญญา
- เนื้อหา รูปภาพ โลโก้ และองค์ประกอบทั้งหมดในเว็บไซต์เป็นทรัพย์สินของเจ้าของเว็บไซต์หรือผู้ให้สิทธิ์
- ห้ามคัดลอก ดัดแปลง เผยแพร่ หรือใช้เพื่อการค้าโดยไม่ได้รับอนุญาต
5. การเปลี่ยนแปลงข้อตกลง
เว็บไซต์ขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อตกลงการใช้งานโดยไม่ต้องแจ้งให้ทราบล่วงหน้า โดยจะแสดงวันที่แก้ไขล่าสุดไว้ด้านล่าง
วันที่แก้ไขล่าสุด: 9 พฤศจิกายน 2568

หากเว็บไซต์ของคุณมีบริการเฉพาะ เช่น การสมัครสมาชิก การซื้อขาย หรือระบบล็อกอิน แจ้งผมเพิ่มเติมได้เลยครับ ผมจะช่วยปรับข้อตกลงให้เหมาะสมกับระบบของคุณมากขึ้น เช่นเพิ่มเงื่อนไขการชำระเงิน การยกเลิกบัญชี หรือข้อจำกัดความรับผิดชอบ.
</p>
        <p>3. การเก็บและใช้ข้อมูล
- เว็บไซต์อาจเก็บข้อมูลส่วนบุคคลและพฤติกรรมการใช้งานตามที่ระบุไว้ใน นโยบายความเป็นส่วนตัว
- ผู้ใช้งานตกลงให้เว็บไซต์ใช้ข้อมูลดังกล่าวเพื่อปรับปรุงบริการและประสบการณ์การใช้งาน
4. ทรัพย์สินทางปัญญา
- เนื้อหา รูปภาพ โลโก้ และองค์ประกอบทั้งหมดในเว็บไซต์เป็นทรัพย์สินของเจ้าของเว็บไซต์หรือผู้ให้สิทธิ์
- ห้ามคัดลอก ดัดแปลง เผยแพร่ หรือใช้เพื่อการค้าโดยไม่ได้รับอนุญาต
5. การเปลี่ยนแปลงข้อตกลง
เว็บไซต์ขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อตกลงการใช้งานโดยไม่ต้องแจ้งให้ทราบล่วงหน้า โดยจะแสดงวันที่แก้ไขล่าสุดไว้ด้านล่าง
วันที่แก้ไขล่าสุด: 9 พฤศจิกายน 2568

หากเว็บไซต์ของคุณมีบริการเฉพาะ เช่น การสมัครสมาชิก การซื้อขาย หรือระบบล็อกอิน แจ้งผมเพิ่มเติมได้เลยครับ ผมจะช่วยปรับข้อตกลงให้เหมาะสมกับระบบของคุณมากขึ้น เช่นเพิ่มเงื่อนไขการชำระเงิน การยกเลิกบัญชี หรือข้อจำกัดความรับผิดชอบ.
</p>
        <p>4. ทรัพย์สินทางปัญญา
- เนื้อหา รูปภาพ โลโก้ และองค์ประกอบทั้งหมดในเว็บไซต์เป็นทรัพย์สินของเจ้าของเว็บไซต์หรือผู้ให้สิทธิ์
- ห้ามคัดลอก ดัดแปลง เผยแพร่ หรือใช้เพื่อการค้าโดยไม่ได้รับอนุญา
</p>
<p>
5. การเปลี่ยนแปลงข้อตกลง
เว็บไซต์ขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อตกลงการใช้งานโดยไม่ต้องแจ้งให้ทราบล่วงหน้า โดยจะแสดงวันที่แก้ไขล่าสุดไว้ด้านล่าง
วันที่แก้ไขล่าสุด: 9 พฤศจิกายน 2568

หากเว็บไซต์ของคุณมีบริการเฉพาะ เช่น การสมัครสมาชิก การซื้อขาย หรือระบบล็อกอิน แจ้งผมเพิ่มเติมได้เลยครับ ผมจะช่วยปรับข้อตกลงให้เหมาะสมกับระบบของคุณมากขึ้น เช่นเพิ่มเงื่อนไขการชำระเงิน การยกเลิกบัญชี หรือข้อจำกัดความรับผิดชอบ.

</p>
      `,
      width: "600px",
      confirmButtonText: "ยอมรับ",
    });
  };
  useEffect(() => {
    openPolicy();
  }, []);
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-linear-to-tr from-indigo-400/30 to-sky-300/30 blur-3xl dark:from-indigo-700/30 dark:to-sky-500/20" />
        <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-linear-to-tr from-fuchsia-300/30 to-pink-300/30 blur-3xl dark:from-fuchsia-700/20 dark:to-pink-600/20" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/50 dark:ring-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-white"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              เข้าสู่ระบบ
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              ยินดีต้อนรับกลับมา! โปรดลงชื่อเข้าใช้เพื่อดำเนินการต่อ
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-200/30 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-slate-700/60 dark:bg-slate-900/60 dark:shadow-black/30">
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  อีเมล
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 dark:bg-slate-900/70 dark:text-slate-100 ${
                    errors.email
                      ? "border-rose-500 ring-rose-200/60 focus:border-rose-500"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-200/60 dark:border-slate-700"
                  }`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-rose-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    รหัสผ่าน
                  </label>
                  <a
                    onClick={forgotPassword}
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:text-indigo-700 focus:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>
                <div
                  className={`group relative flex items-center rounded-xl border bg-white/90 pr-2 transition dark:bg-slate-900/70 ${
                    errors.password
                      ? "border-rose-500"
                      : "border-slate-200 focus-within:border-indigo-500 dark:border-slate-700"
                  }`}
                >
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="รหัสผ่านของคุณ"
                    className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-200/60 dark:text-slate-100"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 outline-none ring-indigo-300 transition hover:bg-slate-100 focus:ring-2 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showPassword ? (
                      // eye-off
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M2.1 3.51 3.51 2.1l18.39 18.39-1.41 1.41-2.42-2.42A11.22 11.22 0 0 1 12 20C6 20 2 12 2 12a18.69 18.69 0 0 1 5.15-6.86L2.1 3.51ZM12 6a6 6 0 0 1 6 6c0 1.02-.25 1.99-.69 2.84l-2-2A3.99 3.99 0 0 0 12 8a4.03 4.03 0 0 0-1.59.33l-2.2-2.2A11.22 11.22 0 0 1 12 6Z" />
                      </svg>
                    ) : (
                      // eye
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 4C6 4 2 12 2 12s4 8 10 8 10-8 10-8-4-8-10-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-rose-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              {/* <div className="flex items-center justify-between pt-2">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    name="remember"
                    className="peer h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 outline-none transition focus:ring-2 focus:ring-indigo-300 dark:border-slate-600"
                  />
                  จดจำฉันไว้ในระบบ
                </label>
              </div> */}

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-indigo-600 to-sky-600 px-4 py-3 text-white shadow-lg shadow-indigo-600/30 outline-none ring-indigo-300 transition hover:shadow-xl focus:ring-4 disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                      ></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  <span className="text-sm font-semibold tracking-wide">
                    เข้าสู่ระบบ
                  </span>
                )}
              </motion.button>

              <p className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                การเข้าสู่ระบบแสดงว่าคุณยอมรับ{" "}
                <a
                  onClick={openPolicy}
                  href="#"
                  className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  ข้อตกลงการใช้งาน
                </a>{" "}
                และ
                <a
                  onClick={Privacynoti}
                  href="#"
                  className="ml-1 underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  นโยบายความเป็นส่วนตัว
                </a>
              </p>
            </form>
          </div>

          {/* Footer */}

          <p className="text-center text-sm text-gray-600 mt-6">
            ยังไม่มีบัญชี?
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
