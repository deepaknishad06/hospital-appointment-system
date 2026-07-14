import drSandeepChopra from "../assets/drSandeepChopra.png";
import drJagminderSingh from "../assets/drJagminderSingh.png";
import drHunnyBansal from "../assets/drHunnyBansal.png";

const doctors = [
  {
    id: "sandeep-chopra",
    name: "Dr. Sandeep Chopra",
    specialty: "Cardiologist",
    experience: "12 years",
    description:
      "Specialist in advanced cardiac care and personalized heart health planning.",
    image: drSandeepChopra,
    qualifications: [
      "MBBS, MD (Cardiology)",
      "Fellowship in Interventional Cardiology",
    ],
    availability: "Mon - Fri | 9:00 AM - 6:00 PM",
    location: "Heart Care Center, Sector 15",
    about:
      "Dr. Chopra combines diagnostic precision with compassionate patient care to help patients manage complex heart conditions and recover with confidence.",
    services: [
      "ECG & Stress Testing",
      "Heart Failure Management",
      "Preventive Cardiology",
    ],
    galleryImages: [],
  },
  {
    id: "jagminder-singh",
    name: "Dr. Jagminder Singh",
    specialty: "Neurologist",
    experience: "10 years",
    description:
      "Experienced neurologist focused on brain and nervous system wellness.",
    image: drJagminderSingh,
    qualifications: ["MBBS, DM (Neurology)", "Certified in Neurocritical Care"],
    availability: "Tue - Sat | 10:00 AM - 7:00 PM",
    location: "Neuro Wellness Hospital, Gulmohar Lane",
    about:
      "Dr. Singh is known for combining modern neurological diagnostics with a calm, reassuring approach for patients and their families.",
    services: [
      "Migraine Management",
      "Stroke Support",
      "Neurology Consultations",
    ],
    galleryImages: [],
  },
  {
    id: "hunny-bansal",
    name: "Dr. Hunny Bansal",
    specialty: "Orthopedic Surgeon",
    experience: "15 years",
    description:
      "Expert orthopedic care for joint, bone, and mobility recovery with advanced treatment.",
    image: drHunnyBansal,
    qualifications: [
      "MBBS, MS (Orthopedics)",
      "Specialized in Joint Replacement",
    ],
    availability: "Daily | 8:00 AM - 5:00 PM",
    location: "Orthocare Clinic, Downtown Road",
    about:
      "Dr. Bansal focuses on restoring movement, reducing pain, and helping patients return to daily life quickly after injury or surgery.",
    services: [
      "Joint Replacement",
      "Sports Injuries",
      "Post-op Rehabilitation",
    ],
    galleryImages: [],
  },
];

export function getDoctorById(doctorId) {
  return doctors.find((doctor) => doctor.id === doctorId) || null;
}

export default doctors;
