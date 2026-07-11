'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
    useEffect(() => {
        const addScript = document.createElement('script');
        addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        addScript.async = true;
        document.body.appendChild(addScript);

        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
                {
                    pageLanguage: 'vi',
                    includedLanguages: 'en,vi',
                    layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                'google_translate_element'
            );
        };
    }, []);

    return (
        <div
            id="google_translate_element"
            style={{ display: 'none' }}
        ></div>
    );
}
