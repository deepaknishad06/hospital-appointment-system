import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from './navbar'
import Footer from './footer'
import { getDoctorById } from '../data/doctors'
import { authAxios } from '../services/api'
import './profile.css'

function Profile() {
    const { doctorId } = useParams()
    const [uploadedImages, setUploadedImages] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [canUploadImages, setCanUploadImages] = useState(false)

    const doctor = useMemo(() => getDoctorById(doctorId), [doctorId])

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('hospital_user') || 'null')
        setCanUploadImages(Boolean(storedUser?.role === 'doctor' && storedUser?.isAdmin))
    }, [])

    useEffect(() => {
        if (!doctor) return

        const loadImages = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/doctor-gallery/${doctor.id}`
                );
                const data = await response.json()
                setUploadedImages(data.images?.length ? data.images : (doctor.galleryImages || []))
            } catch (error) {
                setUploadedImages(doctor.galleryImages || [])
            }
        }

        loadImages()
    }, [doctor])

    if (!doctor) {
        return (
            <>
                <Navbar />
                <main className="profile-page empty-state">
                    <h1>Doctor profile not found.</h1>
                    <p>Return to the doctors list and choose a valid doctor profile.</p>
                    <Link to="/doctors" className="btn btn-primary">
                        Back to doctors
                    </Link>
                </main>
                <Footer />
            </>
        )
    }

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files || [])
        if (!files.length) return

        const formData = new FormData()
        files.forEach((file) => formData.append('images', file))

        try {
            const response = await authAxios.post(`/api/doctor-gallery/${doctor.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            setSelectedFiles((current) => [...current, ...response.data.images])
            setUploadedImages((current) => [...current, ...response.data.images])
        } catch (error) {
            console.error('Upload failed', error)
        }
    }

    return (
        <>
            <Navbar />
            <main className="profile-page">
                <section className="profile-hero">
                    <div className="profile-hero-card">
                        <img src={doctor.image} alt={doctor.name} className="profile-image" />
                        <div className="profile-copy">
                            <p className="section-subtitle">Doctor Profile</p>
                            <h1>{doctor.name}</h1>
                            <p className="profile-specialty">
                                {doctor.specialty} • {doctor.experience}
                            </p>
                            <p>{doctor.about}</p>
                            <div className="profile-actions">
                                <Link to="/book-appointment" className="btn btn-primary">
                                    Book Appointment
                                </Link>
                                <Link to="/doctors" className="btn btn-secondary">
                                    Back to Doctors
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="profile-details-grid">
                    <article className="profile-card">
                        <h2>Qualifications</h2>
                        <ul>
                            {doctor.qualifications.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>

                    <article className="profile-card">
                        <h2>Availability</h2>
                        <p>{doctor.availability}</p>
                        <h2>Location</h2>
                        <p>{doctor.location}</p>
                    </article>

                    <article className="profile-card full-width">
                        <h2>Services</h2>
                        <div className="service-list">
                            {doctor.services.map((item) => (
                                <span key={item} className="service-pill">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="profile-gallery-section">
                    <div className="profile-gallery-top">
                        <div>
                            <p className="section-subtitle">Uploads</p>
                            <h2>Doctor gallery and media</h2>
                        </div>
                        {canUploadImages && (
                            <label className="upload-btn">
                                <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
                                Upload images
                            </label>
                        )}
                    </div>

                    <div className="profile-gallery-grid">
                        {uploadedImages.map((image, index) => (
                            <img key={`${image}-${index}`} src={image} alt={`${doctor.name} gallery ${index + 1}`} className="gallery-image" />
                        ))}
                    </div>

                    {selectedFiles.length > 0 && (
                        <p className="upload-hint">New uploads are added locally for preview. They will be visible immediately on this doctor profile.</p>
                    )}
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Profile
