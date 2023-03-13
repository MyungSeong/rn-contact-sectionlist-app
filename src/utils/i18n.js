import { NativeModules, Platform } from 'react-native';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as resources from '@/utils/translations/resources';

const defaultLang = 'ko';

i18next
    .use(initReactI18next)
    .use({
        type: 'languageDetector',
        init: () => {},
        cacheUserLanguage: () => {},
        detect: () => {
            const supportedLanguages = ['en', 'ko', 'jp'];
            const locale =
                Platform.OS === 'ios'
                    ? NativeModules.SettingsManager?.settings?.AppleLocale ||
                      NativeModules.SettingsManager?.settings
                          ?.AppleLanguages[0] ||
                      ''
                    : NativeModules.I18nManager?.localeIdentifier || '';

            const [lowerCaseLocale] = locale.split('_');

            if (supportedLanguages.includes(lowerCaseLocale)) {
                return lowerCaseLocale;
            }

            console.warn(
                `Locale ${lowerCaseLocale} from ${locale} is not supported, defaulting to ${defaultLang}`,
            );

            return defaultLang;
        },
    })
    .init({
        resources: {
            ...Object.entries(resources).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: {
                    translation: value,
                },
            })),
        },
        lng: 'ko',
        fallbackLng: 'ko',
        debug: true, // dev Env
        // keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        compatibilityJSON: 'v3',
    });

export default i18next;
