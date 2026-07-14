import { useState } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import './about.css'

const values = [
    {
        title: 'Patient First',
        description: 'Every decision is made for your well-being, comfort, and recovery.',
    },
    {
        title: 'Expert Care',
        description: 'Qualified specialists work together to deliver fast, accurate treatment.',
    },
    {
        title: 'Trusted Excellence',
        description: 'Clean facilities, transparent care, and a compassionate support team.',
    },
]

const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Emergency',
    'Radiology',
]

const faqItems = [
    {
        question: 'How do I book an appointment?',
        answer: 'Use the appointment form on the Book Appointment page or call our appointment desk at +91 161 1234567.',
    },
    {
        question: 'Do you accept emergency walk-ins?',
        answer: 'Yes, our emergency department is open 24/7 for urgent care and critical support.',
    },
    {
        question: 'Can I request a specific doctor?',
        answer: 'You can choose a specialist from our doctor list during booking and we will do our best to assign them.',
    },
]

function About() {
    const [activeFaq, setActiveFaq] = useState(null)

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index)
    }

    return (
        <>
            <Navbar />

            <main className="about-page">
                <section className="about-hero">
                    <div className="about-hero-copy">
                        <p className="section-subtitle">About MediCare</p>
                        <h1>Compassionate care for every family.</h1>
                        <p>
                            MediCare Hospital blends modern technology with deeply human care to support every
                            patient journey. We are proud to serve our community with medical excellence and empathy.
                        </p>
                        <a href="/book-appointment" className="btn btn-primary">Book an Appointment</a>
                    </div>
                    <div className="about-hero-image" />
                </section>

                <section className="about-mission">
                    <div className="mission-card">
                        <h2>Our mission</h2>
                        <p>
                            To provide accessible, reliable healthcare through expert medical teams, advanced facilities,
                            and personalized support for every stage of life.
                        </p>
                    </div>
                    <div className="mission-stats">
                        <div>
                            <strong>24/7</strong>
                            <span>Emergency support</span>
                        </div>
                        <div>
                            <strong>100+</strong>
                            <span>Experienced staff</span>
                        </div>
                        <div>
                            <strong>50k+</strong>
                            <span>Patients cared for</span>
                        </div>
                    </div>
                </section>

                <section className="about-values">
                    <h2>What we believe in</h2>
                    <div className="values-grid">
                        {values.map((value) => (
                            <article className="value-card" key={value.title}>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-departments">
                    <h2>Departments and services</h2>
                    <div className="departments-list">
                        {departments.map((department) => (
                            <span key={department} className="department-pill">{department}</span>
                        ))}
                    </div>
                </section>

                <section className="about-faq">
                    <h2>Frequently asked questions</h2>
                    <div className="faq-list">
                        {faqItems.map((item, index) => (
                            <div className="faq-item" key={item.question}>
                                <button type="button" className="faq-question" onClick={() => toggleFaq(index)}>
                                    <span>{item.question}</span>
                                    <span>{activeFaq === index ? '-' : '+'}</span>
                                </button>
                                {activeFaq === index && <p className="faq-answer">{item.answer}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

export default About
