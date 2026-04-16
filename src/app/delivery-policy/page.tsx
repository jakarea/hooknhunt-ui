'use client';

import { useTranslation } from 'react-i18next';

export default function DeliveryPolicyPage() {
  const { t } = useTranslation('policies');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('delivery.title')}
        </h1>

        <div className="bg-white dark:bg-[#121212] rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('delivery.intro')}
          </p>

          {/* Order Processing Time */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.processingTime.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              {t('delivery.processingTime.info1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.processingTime.info2')}
            </p>
          </section>

          {/* Delivery Methods */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.deliveryMethods.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.deliveryMethods.text')}
            </p>
          </section>

          {/* Shipping Addresses */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.shippingAddresses.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.shippingAddresses.text')}
            </p>
          </section>

          {/* Shipping Restrictions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.restrictions.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.restrictions.text')}
            </p>
          </section>

          {/* Delivery Confirmation */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.confirmation.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.confirmation.text')}
            </p>
          </section>

          {/* Shipping Delays */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.delays.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.delays.text')}
            </p>
          </section>

          {/* Returns Due to Non-Delivery */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.returns.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.returns.text')}
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery.contact.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('delivery.contact.text')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
