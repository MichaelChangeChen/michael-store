import { createI18n } from 'vue-i18n';
import locales from '../configs/locales.js';

const { locale, availableLocales, fallbackLocale } = locales;
const messages = {};
availableLocales.forEach((l) => { messages[l.code] = l.messages });
const i18n = createI18n({
	locale,
	fallbackLocale,
	messages
});
i18n.locales = availableLocales;

export default i18n;