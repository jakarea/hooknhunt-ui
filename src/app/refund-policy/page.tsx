'use client';

import { useTranslation } from 'react-i18next';

export default function RefundPolicyPage() {
  const { t } = useTranslation('policies');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1f1515] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('refund.title')}
        </h1>

        <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#2a1e1e] rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
            {t('refund.intro')}
          </p>

          {/* Eligibility */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('refund.eligibility.title')}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-100">
              <li>{t('refund.eligibility.condition1')}</li>
              <li>{t('refund.eligibility.condition2')}</li>
              <li>{t('refund.eligibility.condition3')}</li>
            </ul>
          </section>

          {/* Process */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('refund.process.title')}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-100">
              <li>{t('refund.process.step1')}</li>
              <li>{t('refund.process.step2')}</li>
              <li>{t('refund.process.step3')}</li>
            </ol>
          </section>

          {/* Late Refunds */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('refund.lateRefunds.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed mb-3">
              {t('refund.lateRefunds.info1')}
            </p>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('refund.lateRefunds.info2')}
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('refund.changes.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
              {t('refund.changes.text')}
            </p>
          </section>

          {/* Outro */}
          <p className="text-gray-700 dark:text-gray-100 leading-relaxed font-medium">
            {t('refund.outro')}
          </p>
        </div>
      </div>
    </div>
  );
}
