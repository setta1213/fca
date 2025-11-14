import { useState, useEffect } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    email: "",
    name: "",
    lastname: "",
    phone: "",
    type: 1,
    admin_type: 0,
  });

  const loadUsers = async () => {
    try {
      const res = await axios.get(
        "https://agenda.bkkthon.ac.th/fca/api/users/get_users.php"
      );
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAdd = () => {
    setForm({
      email: "",
      name: "",
      lastname: "",
      phone: "",
      type: 1,
      admin_type: 0,
    });
    setEditUser(null);
    setModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      phone: user.phone || "",
      type: user.type,
      admin_type: user.admin_type,
    });
    setModal(true);
  };

  const saveUser = async () => {
    const frm = new FormData();
    frm.append("email", form.email);
    frm.append("name", form.name);
    frm.append("lastname", form.lastname);
    frm.append("phone", form.phone);
    frm.append("type", form.type);
    frm.append("admin_type", form.admin_type);

    if (editUser) frm.append("id", editUser.id);

    const api = editUser
      ? "https://agenda.bkkthon.ac.th/fca/api/users/update_user.php"
      : "https://agenda.bkkthon.ac.th/fca/api/users/add_user.php";

    try {
      const res = await axios.post(api, frm);
      if (res.data.status === "success") {
        alert("บันทึกสำเร็จ");
        setModal(false);
        loadUsers();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const resetPassword = async (id) => {
    if (!window.confirm("ต้องการ reset password ใช่ไหม?")) return;

    const frm = new FormData();
    frm.append("id", id);
    frm.append("type", 2);
    frm.append("password", "12345678");

    try {
      const res = await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/users/reset_password.php",
        frm
      );

      if (res.data.status === "success") {
        alert("Reset Password สำเร็จ! รหัสใหม่: " + "12345678");
      }
    } catch (err) {
      alert("ไม่สามารถ reset ได้");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("ลบผู้ใช้นี้จริงหรือไม่?")) return;

    const frm = new FormData();
    frm.append("id", id);

    try {
      await axios.post(
        "https://agenda.bkkthon.ac.th/fca/api/users/delete_user.php",
        frm
      );
      loadUsers();
    } catch (err) {
      alert("ลบไม่ได้");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                  <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  จัดการผู้ใช้งานระบบ
                </h1>
                <p className="mt-2 text-blue-100">จัดการข้อมูลผู้ใช้งานและสิทธิ์การเข้าถึงระบบ</p>
              </div>
              <button
                onClick={openAdd}
                className="mt-4 md:mt-0 px-5 py-3 bg-white text-blue-600 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                เพิ่มผู้ใช้ใหม่
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-6 text-left font-semibold text-gray-700">ชื่อ-นามสกุล</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-700">อีเมล</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-700">เบอร์โทร</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-700">สถานะ</th>
                      <th className="py-4 px-6 text-left font-semibold text-gray-700">สิทธิ์</th>
                      <th className="py-4 px-6 text-center font-semibold text-gray-700">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                              {u.name.charAt(0)}{u.lastname.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{u.name} {u.lastname}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{u.email}</td>
                        <td className="py-4 px-6 text-gray-700">{u.phone || '-'}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${u.type === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {u.type === "1" ? (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                ใช้งานได้
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                                ปิดการใช้งาน
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${u.admin_type === "1" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                            {u.admin_type === "1" ? (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                Admin
                              </>
                            ) : "User"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openEdit(u)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                              title="แก้ไขข้อมูล"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>

                            <button
                              onClick={() => resetPassword(u.id)}
                              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                              title="รีเซ็ตรหัสผ่าน"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                              </svg>
                            </button>

                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                              title="ลบผู้ใช้"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">
                          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                          </svg>
                          <p className="mt-4 text-lg">ไม่พบผู้ใช้ในระบบ</p>
                          <button
                            onClick={openAdd}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            เพิ่มผู้ใช้คนแรก
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {editUser ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="ชื่อ"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="นามสกุล"
                    value={form.lastname}
                    onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="เบอร์โทรศัพท์"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะการใช้งาน</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: Number(e.target.value) })}
                >
                  <option value={1}>ใช้งานได้</option>
                  <option value={0}>ปิดการใช้งาน</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สิทธิ์การเข้าถึง</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={form.admin_type}
                  onChange={(e) => setForm({ ...form, admin_type: Number(e.target.value) })}
                >
                  <option value={0}>User</option>
                  <option value={1}>Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setModal(false)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={saveUser}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;