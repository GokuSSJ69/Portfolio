import { section } from "motion/react-client"
import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Alert from '../components/Alert'
import { Particles } from "../components/Particles"

const Contact = () => {
    const [fromData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('scuccess');
    const [alertMessage, setAlertMessage] = useState('');
    const handleChange = (e) => {
        setFormData({
            ...fromData,
            [e.target.name]: e.target.value,
        });
    };
     const showAlertMessage = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log("From submitted", fromData);
             await emailjs.send('service_qsot1qg', 'template_6pzs6jp', {
            from_name: fromData.name,
            to_name: 'Irfan',
            from_email: fromData.email,
            to_email: 'irfanislam669@gmail.com',
            message: fromData.message,
        },"X_2en2beZ66DFyolf");
        setIsLoading(false);
        setFormData({name:'', email:'', message:''});
        showAlertMessage('success', 'Thank you. I will get back to you as soon as possible.');
        
        } catch (error) {
            setIsLoading(false);
            console.log(error);   
            showAlertMessage('danger', 'Something went wrong. Please try again.');
        }

       
        //service_qsot1qg
        //template_6pzs6jp
    }
  return (
    <section className="relative items-center c-space flex section-spacing">
        <Particles className="absolute inset-0 -z-50"
        quantity={100}
        ease={80}
        color={"#ffffff"}
        refresh/>
        {showAlert && <Alert type={alertType} text={alertMessage} />}
      <div className="flex flex-col items-center justify-center max-w-md mx-auto p-5 border border-white/10 rounded-2xl bg-primary">
      <div className="flex flex-col items-start gap-5 w-full mb-10">
        <h2 className="text-heading">let's chat</h2>
       <p className="font-normal text-neutral-400"> Looking to collaborate or help ? Feel free to reach out!</p>
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-5">
            <label htmlFor="name" className="field-label">Full Name</label>
            <input id="name" name="name" type="text" className="field-input field-input-focus"
            placeholder="Name"
            autoComplete="name"
            value={fromData.name}
            onChange={handleChange}
            required/>
        </div>
        <div className="mb-5">
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" name="email" type="email" className="field-input field-input-focus"
            placeholder="Email@gmail.com"
            autoComplete="email"
            value={fromData.email}
            onChange={handleChange}
            required/>
        </div>
        <div className="mb-5">
            <label htmlFor="message" className="field-label">Message</label>
            <textarea id="message" name="message"
            type="text" rows="4" className="field-input field-input-focus"
            placeholder="Your message"
            autoComplete="message"
            value={fromData.message}
            onChange={handleChange}
            required/>
        </div>
        <button type="submit" className="w-full px-1 py-3 text-lg text-center rounded-md cursor-pointer bg-radial from-lavender to-royal hover-animation">
            {!isLoading ? 'Send Message' : 'Sending...'}
        </button>
      </form>
      </div>
    </section>
  )
}

export default Contact