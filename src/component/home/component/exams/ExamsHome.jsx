import { useState } from 'react'
import ExamDashboard from './componenct/ExamDashboard';
import ExamAdd from './componenct/ExamAdd';
import ExamAttendance from './componenct/ExamAttendance';

function ExamsHome({user}) {
    const [activeTab, setActiveTab] = useState("register");

    const tabConfig = {
        register: {
            label: "แดชบอร์ด",
            icon: "📊",
            component: <ExamDashboard user={user} />
        },
        Examadd: {
            label: "ลงทะเบียนวันสอบ",
            icon: "📝",
            component: <ExamAdd user={user} />
        },
        Examattendance: {
            label: "เช็คชื่อ",
            icon: "✅",
            component: <ExamAttendance user={user} />
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-pink-50 to-purple-50 p-4">
            {/* Header */}
            <div className="text-center mb-8 pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                    <span className="text-3xl">🎓</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    ระบบจัดการการสอบ
                </h1>
                <p className="text-gray-600">
                    จัดการการลงทะเบียนและเช็คชื่อการสอบ
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2 justify-center">
                    {Object.entries(tabConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`
                                flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 min-w-[180px] justify-center
                                ${activeTab === key 
                                    ? 'bg-linear-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                                }
                            `}
                        >
                            <span className="text-xl">{config.icon}</span>
                            <span className="whitespace-nowrap">{config.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Tab Content */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300">
                    {tabConfig[activeTab].component}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
                <div className="flex justify-around">
                    {Object.entries(tabConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 min-w-20
                                ${activeTab === key 
                                    ? 'bg-pink-50 text-pink-600' 
                                    : 'text-gray-500'
                                }
                            `}
                        >
                            <span className="text-2xl">{config.icon}</span>
                            <span className="text-xs font-medium whitespace-nowrap">
                                {config.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Add padding for mobile bottom nav */}
            <div className="md:hidden h-24"></div>
        </div>
    )
}

export default ExamsHome