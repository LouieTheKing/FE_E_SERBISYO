import React from "react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { useConfig } from '../../hooks/useConfig';

function ContactSection() {
  const address = useConfig('address');
  const exactAddress = useConfig('exact_address');
  const telephone = useConfig('telephone');
  const phone = useConfig('phone');
  const email = useConfig('email');
  const barangay = useConfig('barangay');
  const googleMapLink = useConfig('google_map')

  return (
    <section className="relative w-full py-12 sm:py-20 bg-white flex flex-col items-center px-2 sm:px-4 overflow-hidden">
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[var(--color-secondary)] opacity-10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--color-accent)] opacity-20 rounded-full blur-2xl z-0" />
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="w-16 h-1.5 bg-[var(--color-secondary)] rounded-full mb-6 sm:mb-8" />
        <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6 drop-shadow-sm">
          <FiMail className="text-[var(--color-secondary)] text-2xl" /> Contact Us
        </h2>
        <p className="text-neutral-800 mb-6 text-center max-w-xl text-xs sm:text-lg">
          Have questions or need assistance? Reach out to Barangay {barangay} using
          the details below. We are here to help you with your barangay service
          needs.
        </p>
        <div className="flex flex-col gap-3 text-neutral-900 text-sm sm:text-base items-center mb-8">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-[var(--color-secondary)]" /> 
            {exactAddress}
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-[var(--color-secondary)]" /> {telephone}
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-[var(--color-secondary)]" />{" "}
            {email}
          </div>
        </div>
        <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-xl border border-[var(--color-secondary)] bg-white/90 backdrop-blur-md">
          <iframe
            title={`Barangay ${barangay} Hall Map`}
            src={googleMapLink}
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
