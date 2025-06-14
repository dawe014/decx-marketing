import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out for collaborations, questions, or just to say hello.
          </p>
        </div>


          {/* Contact Form */}
          <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-slate-300 mb-1">First name</label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-slate-300 mb-1">Last name</label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>General Inquiry</option>
                  <option>Partnership Opportunity</option>
                  <option>Technical Support</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={''}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="privacy-policy"
                  name="privacy-policy"
                  type="checkbox"
                  className="h-4 w-4 bg-slate-700 border-slate-600 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="privacy-policy" className="ml-2 block text-sm text-slate-400">
                  I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <FaPaperPlane className="mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Location</h2>
          <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 h-96">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.082877892238!2d36.83792497383549!3d7.674239308724727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17adb960abc3de2d%3A0xd55c9da7e74aaaf1!2sDebo%20Engineering!5e0!3m2!1sen!2set!4v1743345672995!5m2!1sen!2set" 
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
              title="Google Maps Location"
            ></iframe>
          </div>
            
        </div>
      </div>
    </div>
  );
}