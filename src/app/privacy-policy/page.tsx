'use client';

import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation('policies');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('privacy.title')}
        </h1>

        <div className="bg-white dark:bg-[#121212] rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('privacy.intro')}
          </p>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.informationCollect.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {t('privacy.informationCollect.subtitle')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-4">
              <li>{t('privacy.informationCollect.items.0')}</li>
              <li>{t('privacy.informationCollect.items.1')}</li>
              <li>{t('privacy.informationCollect.items.2')}</li>
              <li>{t('privacy.informationCollect.items.3')}</li>
              <li>{t('privacy.informationCollect.items.4')}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {t('privacy.informationCollect.collectWhen')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>{t('privacy.informationCollect.collectWhenItems.0')}</li>
              <li>{t('privacy.informationCollect.collectWhenItems.1')}</li>
              <li>{t('privacy.informationCollect.collectWhenItems.2')}</li>
              <li>{t('privacy.informationCollect.collectWhenItems.3')}</li>
              <li>{t('privacy.informationCollect.collectWhenItems.4')}</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.informationUse.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {t('privacy.informationUse.intro')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>{t('privacy.informationUse.items.0')}</li>
              <li>{t('privacy.informationUse.items.1')}</li>
              <li>{t('privacy.informationUse.items.2')}</li>
              <li>{t('privacy.informationUse.items.3')}</li>
              <li>{t('privacy.informationUse.items.4')}</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.informationShare.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {t('privacy.informationShare.intro')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>{t('privacy.informationShare.items.0')}</li>
              <li>{t('privacy.informationShare.items.1')}</li>
              <li>{t('privacy.informationShare.items.2')}</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.dataSecurity.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacy.dataSecurity.text')}
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.yourRights.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {t('privacy.yourRights.intro')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>{t('privacy.yourRights.items.0')}</li>
              <li>{t('privacy.yourRights.items.1')}</li>
              <li>{t('privacy.yourRights.items.2')}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.cookies.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacy.cookies.text')}
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.changes.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacy.changes.text')}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('privacy.contact.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              {t('privacy.contact.text')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('privacy.contact.updated')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
