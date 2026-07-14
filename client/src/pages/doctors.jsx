import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import doctors from '../data/doctors'
import './doctors.css'

function Doctors() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredDoctors = doctors.filter((doctor) => {
        const query = searchTerm.toLowerCase().trim()
        return (
            doctor.name.toLowerCase().includes(query) ||
            doctor.specialty.toLowerCase().includes(query) ||
            doctor.description.toLowerCase().includes(query)
        )
    })

    return (
        <>
            <Navbar />

            <main className="doctors-page">
                <section className="doctors-hero">
                    <div className="doctors-hero-copy">
                        <p className="section-subtitle">Our Medical Experts</p>
                        <h1>Meet the doctors dedicated to your wellbeing.</h1>
                        <p>
                            Discover our specialist team offering expert care across cardiology, neurology, orthopedics, and emergency support.
                            Browse doctor profiles and book a consultation with confidence.
                        </p>
                        <Link to="/book-appointment" className="btn btn-primary">
                            Book an appointment
                        </Link>
                    </div>
                </section>

                <section className="doctors-search-bar">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by doctor name, specialty, or keyword"
                    />
                </section>

                <section className="doctors-grid">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <article className="doctor-card" key={doctor.name}>
                                <div className="doctor-image-wrapper">
                                    <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                                </div>
                                <div className="doctor-card-body">
                                    <h2>{doctor.name}</h2>
                                    <p className="doctor-specialty">{doctor.specialty}</p>
                                    <p className="doctor-description">{doctor.description}</p>
                                    <div className="doctor-footer">
                                        <span>{doctor.experience} experience</span>
                                        <div className="doctor-actions">
                                            <Link to={`/doctor-profile/${doctor.id}`} className="btn btn-small btn-secondary">
                                                View Profile
                                            </Link>
                                            <Link to="/book-appointment" className="btn btn-small btn-primary">
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="no-results">
                            <h2>No doctors match your search.</h2>
                            <p>Try another name, specialty, or keyword.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    )
}

export default Doctors
