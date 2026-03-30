'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

export default function ContactPage() {
  const { t } = useTranslation('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Always set priority to 'high' for contact form submissions
      const submissionData = {
        ...formData,
        priority: 'high',
      };

      const response = await api.submitContactForm(submissionData);

      // Check if response has message
      const successMessage = response.data?.message || response.message || t('success.message');

      setSubmitStatus({
        type: 'success',
        message: successMessage,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      const errorMessage = error.message || t('error.message');
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 sm:py-16">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#bc1215]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#bc1215]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('contactInfo.phone.label')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('contactInfo.phone.number')}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">{t('contactInfo.phone.hours')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#046bd2]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#046bd2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('contactInfo.email.label')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('contactInfo.email.address')}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">{t('contactInfo.email.responseTime')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('contactInfo.location.label')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('contactInfo.location.address')}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">{t('contactInfo.location.note')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">

              {/* Success/Error Messages */}
              {submitStatus.type && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
                    : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
                }`}>
                  <p className="text-sm sm:text-base font-medium leading-relaxed">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('form.fullName.label')} {t('form.fullName.required')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.fullName.placeholder')}
                      className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('form.phone.label')} {t('form.fullName.required')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('form.phone.placeholder')}
                      className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('form.email.label')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('form.email.placeholder')}
                    className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-4 sm:mb-6">
                  <label htmlFor="subject" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('form.subject.label')} {t('form.subject.required')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('form.subject.placeholder')}
                    className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-4 sm:mb-6">
                  <label htmlFor="message" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('form.message.label')} {t('form.message.required')}
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder={t('form.message.placeholder')}
                    className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base bg-[#bc1215] text-white font-semibold rounded-lg hover:bg-[#8a0e10] focus:outline-none focus:ring-2 focus:ring-[#bc1215]/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#bc1215] min-h-[48px] sm:min-h-0"
                >
                  {isSubmitting ? t('form.submitButton.submitting') : t('form.submitButton.default')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 sm:mt-16 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('socialLinks.title')}</h3>
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1877F2] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF0000] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
