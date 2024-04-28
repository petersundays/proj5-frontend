import './NotConfirmed.css';
import { useTranslation } from 'react-i18next';

export function NotConfirmed() {
    const { t } = useTranslation();

    return (
        <div className="not-confirmed">
            <h1>{t('accountNotConfirmed')}</h1>
            <p>{t('checkEmail')}</p>
        </div>
    );
}