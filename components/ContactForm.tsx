
'use client'
import React, { useState } from 'react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateMailtoLink = () => {
    const subject = encodeURIComponent(`New message from ${formData.fullName}`);
    const body = encodeURIComponent(
      `Full Name: ${formData.fullName}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    );
    // return `mailto:your-email@example.com?subject=${subject}&body=${body}`;
    return `mailto:brayanmartinez1102@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <form
      className="flex flex-col w-full"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent default form behavior
        window.location.href = generateMailtoLink(); // Redirect to mailto link
      }}
    >
      <label className="font-extrabold">
        Full Name <b className="text-primary-color">*</b>
      </label>
      <input
        type="text"
        name="fullName"
        placeholder='E.g: "Brayan Martinez"'
        className="bg-gray-200 h-10 w-full p-4 rounded-sm border-none outline-none"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <label className="font-extrabold">
        Email <b className="text-primary-color">*</b>
      </label>
      <input
        type="email"
        name="email"
        placeholder="youremail@gmail.com"
        className="bg-gray-200 h-10 w-full p-4 rounded-sm border-none outline-none"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label className="font-extrabold">
        Tell us about it <b className="text-primary-color">*</b>
      </label>
      <textarea
        name="message"
        placeholder="Write Here.."
        className="bg-gray-200 h-72 px-5 py-8 rounded-md border-none outline-none mb-8"
        value={formData.message}
        onChange={handleChange}
        required
      />

      <button type="submit" className="px-7 py-8 square-button">
        &nbsp; Send Message
      </button>
    </form>
  );
};
