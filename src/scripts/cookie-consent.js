import { $ } from './helper'

const STORAGE_KEY = 'cookie-consent-accepted'

const cookieConsentInit = () => {
    const banner = $('js-cookie-consent')
    if (!banner) return

    const node = banner.eq(0)

    if (localStorage.getItem(STORAGE_KEY)) {
        node.remove()
        return
    }

    requestAnimationFrame(() => banner.attr('data-visible', 'true'))

    const dismissBanner = () => {
        localStorage.setItem(STORAGE_KEY, 'true')
        banner.attr('data-visible', 'false')

        node.addEventListener('transitionend', () => node.remove(), { once: true })
    }

    $('js-cookie-consent-btn').on('click', dismissBanner)
    $('js-cookie-consent-close').on('click', dismissBanner)
}

document.addEventListener('DOMContentLoaded', cookieConsentInit)
