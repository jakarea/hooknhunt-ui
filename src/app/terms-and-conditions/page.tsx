'use client';

import { useTranslation } from 'react-i18next';

export default function TermsAndConditionsPage() {
  const { t } = useTranslation('policies');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('terms.title')}
        </h1>

        <div className="bg-white dark:bg-[#121212] rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
            {t('terms.intro')}
          </p>

          {/* Agreement to Terms */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.agreement.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.agreement.text')}
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.account.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.account.text')}
            </p>
          </section>

          {/* Products and Pricing */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.products.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.products.text')}
            </p>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.orders.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.orders.text')}
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.intellectual.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.intellectual.text')}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.limitations.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.limitations.text')}
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.governing.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.governing.text')}
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.changes.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.changes.text')}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('terms.contact.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('terms.contact.text')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
