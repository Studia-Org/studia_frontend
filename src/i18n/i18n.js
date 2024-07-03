import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locals/es.json';
import ca from './locals/ca.json';
import en from './locals/en.json';

const initializeI18n = () => {
    let ln = navigator.language || navigator.userLanguage;
    ln = ln.split("-")[0];
    if (ln !== "es" && ln !== "ca" && ln !== "en") {
        ln = "ca";
    }
    const lngStorage = localStorage.getItem("lng");
    if (lngStorage && (lngStorage === "es" || lngStorage === "ca" || lngStorage === "en")) {
        ln = lngStorage;
    }
    return new Promise((resolve) => {
        i18n.use(initReactI18next)
            .init({
                lng: ln,
                interpolation: {
                    escapeValue: false
                },
                resources: {
                    ca: { translation: ca },
                    es: { translation: es },
                    en: { translation: en }
                }
            },
                () => {
                    resolve();
                });
    });
};

export { initializeI18n };
export default i18n;
