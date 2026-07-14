import { useEffect, useState } from 'react'
import { authAxios } from '../services/api'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import './dashboard.css'

function Dashboard() {
    const [user, setUser] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [records, setRecords] = useState([])
    const [status, setStatus] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await authAxios.get('/users/me')
                setUser(profile.data)

                const appts = await authAxios.get('/appointments')
                setAppointments(appts.data.appointments || [])

                const recordRes = await authAxios.get('/medical-records')
                setRecords(recordRes.data.records || [])
            } catch (error) {
                setStatus(error.response?.data?.message || 'Failed to load dashboard')
            }
        }

        loadData()
    }, [])

    if (!user) {
        return (
            <>
                <Navbar />
                <main className="dashboard-page">
                    <div className="dashboard-loading">Loading dashboard...</div>
                </main>
                <Footer />
            </>
        )
    }

    const isDoctor = user.role === 'doctor'
    const isAdmin = isDoctor && user.isAdmin

    return (
        <>
            <Navbar />
            <main className="dashboard-page">
                <section className="dashboard-hero">
                    <div>
                        <p className="dashboard-subtitle">{isDoctor ? 'Doctor Panel' : 'Patient Dashboard'}</p>
                        <h1>Welcome back, {user.name}</h1>
                        <p>{user.email}</p>
                    </div>
                </section>

                {status && <div className="dashboard-status">{status}</div>}

                <section className="dashboard-grid">
                    <article className="dashboard-card profile-card">
                        <h2>Profile Information</h2>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                        {user.details?.address && <p><strong>Address:</strong> {user.details.address}</p>}
                        {user.details?.age && <p><strong>Age:</strong> {user.details.age}</p>}
                        {user.details?.gender && <p><strong>Gender:</strong> {user.details.gender}</p>}
                        {isDoctor && <p><strong>Specialization:</strong> {user.specialization}</p>}
                    </article>

                    <article className="dashboard-card appointments-card">
                        <h2>Upcoming Appointments</h2>
                        {appointments.length === 0 ? (
                            <p>No scheduled appointments yet.</p>
                        ) : (
                            <div className="dashboard-list">
                                {appointments.map((appointment) => (
                                    <div key={appointment._id} className="dashboard-list-item">
                                        <p><strong>Doctor:</strong> {appointment.doctor?.name || appointment.doctor}</p>
                                        <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                                        <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                                        <p><strong>Status:</strong> {appointment.status}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>

                    <article className="dashboard-card action-card">
                        <h2>Quick Actions</h2>
                        <ul>
                            <li>Book new appointment from the Book Appointment page.</li>
                            <li>View appointments and manage your schedule.</li>
                            <li>Update profile details in your account settings.</li>
                        </ul>
                    </article>

                    <article className="dashboard-card records-card">
                        <h2>Medical Records</h2>
                        {records.length === 0 ? (
                            <p>No medical records available.</p>
                        ) : (
                            <div className="dashboard-list">
                                {records.map((record) => (
                                    <div key={record._id} className="dashboard-list-item">
                                        <p><strong>Title:</strong> {record.title}</p>
                                        <p><strong>Doctor:</strong> {record.doctor?.name || record.doctor}</p>
                                        <p><strong>Date:</strong> {new Date(record.recordDate).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>
                </section>

                {isAdmin && (
                    <section className="dashboard-admin">
                        <h2>Doctor Admin Panel</h2>
                        <p>As an approved doctor, you can create patient accounts and manage appointments.</p>
                    </section>
                )}
            </main>
            <Footer />
        </>
    )
}

export default Dashboard
