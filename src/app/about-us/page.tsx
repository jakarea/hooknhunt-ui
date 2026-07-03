'use client';

import { useTranslation } from 'react-i18next';

export default function AboutUsPage() {
  const { t } = useTranslation('policies');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1f1515] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('about.title')}
        </h1>

        <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#2a1e1e] rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <p className="text-gray-700 dark:text-gray-100 leading-relaxed text-lg">
            {t('about.intro')}
          </p>

          {/* Our Mission */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('about.mission.text')}
            </p>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('about.offer.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('about.offer.text')}
            </p>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('about.whyChoose.title')}
            </h2>
            <ul className="space-y-4">
              {['0', '1', '2', '3'].map((index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t(`about.whyChoose.items.${index}`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Our Commitment */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('about.commitment.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('about.commitment.text')}
            </p>
          </section>

          {/* Connect With Us */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('about.connect.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('about.connect.text')}
            </p>
          </section>

          {/* Outro */}
          <p className="text-gray-700 dark:text-gray-100 leading-relaxed font-medium text-center border-t dark:border-gray-400 pt-6">
            {t('about.outro')}
          </p>
        </div>
      </div>
    </div>
  );
}
