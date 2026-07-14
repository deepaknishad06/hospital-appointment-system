import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import bannerImg from '../assets/banner.jpg'
import drSandeepChopra from '../assets/drSandeepChopra.png'
import drJagminderSingh from '../assets/drJagminderSingh.png'
import drHunnyBansal from '../assets/drHunnyBansal.png'
import Navbar from '../components/navbar'
import './home.css'
import Footer from '../components/footer'

const doctors = [
    {
        id: 'sandeep-chopra',
        name: 'Dr. Sandeep Chopra',
        specialization: 'Cardiologist',
        experience: '12+ years',
        image: drSandeepChopra,
    },
    {
        id: 'jagminder-singh',
        name: 'Dr. Jagminder Singh',
        specialization: 'Neurologist',
        experience: '10+ years',
        image: drJagminderSingh,
    },
    {
        id: 'hunny-bansal',
        name: 'Dr. Hunny Bansal',
        specialization: 'Orthopedic Surgeon',
        experience: '15+ years',
        image: drHunnyBansal,
    },
]

const services = [
    {
        title: 'Emergency Care',
        description: '24/7 urgent medical support with fast response and expert doctors.',
    },
    {
        title: 'OPD Consultation',
        description: 'Easy outpatient appointments for general and specialist visits.',
    },
    {
        title: 'Advanced Surgery',
        description: 'Modern operating facilities for safe and precise surgical care.',
    },
    {
        title: 'Pharmacy',
        description: 'Quick access to medicines and essential healthcare products.',
    },
]

const initialTestimonials = [
    {
        name: 'aisha',
        feedback: 'The doctors were very caring and the treatment process was smooth and professional.',
        rating: 5,
        location: 'Ludhiana,punjab',
    },
    {
        name: 'Rajesh Shukla',
        feedback: 'Excellent care, clean environment, and fast support during my visit.',
        rating: 5,
        location: 'Jalandhar,punjab',
    },
    {
        name: 'sara shah',
        feedback: 'I felt comfortable throughout my appointment and the staff was very helpful.',
        rating: 5,
        location: 'New Delhi',
    },
]

function Home() {
    const navigate = useNavigate()
    const [reviews, setReviews] = useState(initialTestimonials)
    const [formData, setFormData] = useState({ name: '', location: '', feedback: '', rating: 5 })
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })

    const handleBookAppointmentClick = () => {
        if (!localStorage.getItem('hospital_token')) {
            alert('Login patient first for booking appointments')
            return
        }
        navigate('/login')
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!formData.name.trim() || !formData.feedback.trim()) return

        const newReview = {
            name: formData.name.trim(),
            location: formData.location.trim() || 'Patient',
            feedback: formData.feedback.trim(),
            rating: Number(formData.rating),
        }

        setReviews((prev) => [newReview, ...prev])
        setFormData({ name: '', location: '', feedback: '', rating: 5 })
    }

    const handleContactChange = (event) => {
        const { name, value } = event.target
        setContactForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleContactSubmit = (event) => {
        event.preventDefault()
        if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return
        console.log('Contact submission:', contactForm)
        setContactForm({ name: '', email: '', message: '' })
    }

    return (
        <>
            <Navbar />
            <section className="hero-section">
                <img src={bannerImg} alt="Hospital banner" className="hero-image" />
                <div className="hero-overlay" />
                <div className="hero-content">
                        <p className="hero-subtitle">Compassionate Care, Anytime</p>
                    <h1>Your trusted health partner</h1>
                    <p className="hero-description">
                        Experience trusted medical care with a caring team dedicated to your health and comfort.
                    </p>
                    <div className="hero-actions">
                        <button onClick={handleBookAppointmentClick} className="btn btn-primary">
                            Book Appointment
                        </button>
                    </div>
                </div>
            </section>

            <section className="doctors-section">
                <div className="section-heading">
                    <p className="section-subtitle">Featured Doctors</p>
                    <h2>Meet Our Specialists</h2>
                </div>

                <div className="doctors-grid">
                    {doctors.map((doctor) => (
                        <article className="doctor-card" key={doctor.name}>
                            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                            <div className="doctor-info">
                                <h3>{doctor.name}</h3>
                                <p className="doctor-specialization">{doctor.specialization}</p>
                                <p className="doctor-experience">{doctor.experience} experience</p>
                                <div className="doctor-actions">
                                    <Link to={`/doctor-profile/${doctor.id}`} className="btn btn-small btn-primary">
                                        View Profile
                                    </Link>
                                    <button onClick={handleBookAppointmentClick} className="btn btn-small btn-secondary">Book Appointment</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="services-section">
                <div className="section-heading">
                    <p className="section-subtitle">Our Facilities</p>
                    <h2>Hospital Services We Provide</h2>
                </div>

                <div className="services-grid">
                    {services.map((service) => (
                        <article className="service-card" key={service.title}>
                            <div className="service-icon">✚</div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="appointment-cta">
                <div className="appointment-cta-content">
                    <p className="section-subtitle">Quick Action</p>
                    <h2>Need medical help today?</h2>
                    <p>Book your appointment now and get fast support from our expert care team.</p>
                    <button onClick={handleBookAppointmentClick} className="btn btn-primary">
                        Book Appointment
                    </button>
                </div>
            </section>

            <section className="testimonials-section">
                <div className="section-heading">
                    <p className="section-subtitle">Patient Reviews</p>
                    <h2>What Our Patients Say</h2>
                </div>

                <form className="review-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="City"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <textarea
                        name="feedback"
                        placeholder="Write your review"
                        value={formData.feedback}
                        onChange={handleChange}
                        required
                    />
                    <select name="rating" value={formData.rating} onChange={handleChange}>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Save Review</button>
                </form>

                <div className="testimonials-grid">
                    {reviews.map((testimonial, index) => (
                        <article className="testimonial-card slide-in" key={`${testimonial.name}-${index}`}>
                            <div className="testimonial-rating">
                                {'★'.repeat(testimonial.rating)}
                            </div>
                            <p className="testimonial-feedback">“{testimonial.feedback}”</p>
                            <div className="testimonial-author">
                                <strong>{testimonial.name}</strong>
                                <span>{testimonial.location}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="contact-section">
                <div className="section-heading">
                    <p className="section-subtitle">Contact Us</p>
                    <h2>Get in Touch</h2>
                </div>

                <div className="contact-grid">
                    <div className="contact-info">
                        <div className="contact-card">
                            <h3>Address</h3>
                            <p>123 MediCare Road, Civil Lines, Ludhiana, Punjab, India</p>
                        </div>
                        <div className="contact-card">
                            <h3>Phone</h3>
                            <p>+91 161 1234567</p>
                        </div>
                        <div className="contact-card">
                            <h3>Email</h3>
                            <p>info@medicarehospital.com</p>
                        </div>
                    </div>

                    <div className="contact-right">
                        <div className="map-wrapper">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3463.4848613426395!2d75.84773817544587!3d30.900218081764728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a8df6c442ecd5%3A0xccc1ad9c5e8f8f28!2sLudhiana%2C%20Punjab%2C%20India!5e0!3m2!1sen!2sus!4v1700000000000"
                                width="100%"
                                height="280"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ludhiana Map"
                            />
                        </div>

                        <form className="contact-form" onSubmit={handleContactSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={contactForm.name}
                                onChange={handleContactChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={contactForm.email}
                                onChange={handleContactChange}
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={contactForm.message}
                                onChange={handleContactChange}
                                required
                            />
                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default Home
