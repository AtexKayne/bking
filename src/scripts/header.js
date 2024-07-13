import { $, detectMobile } from './helper'

const headerInit = () => {
    const menuBtn = $('js-menu-btn')
    const menu = $('js-menu')
    const header = $('js-header')
    const inner = $('js-menu-inner')
    const isMobile = detectMobile()

    let isOpen = false

    const menuToggle = () => {
        isOpen = !isOpen

        menuBtn.attr('data-open', isOpen)
        menu.attr('data-open', isOpen)
        header.attr('data-open', isOpen)

        if (isOpen) {
            locscroll.stop()

            // if (isMobile) {
            //     inner.eq(0).scrollTo({ top: -20000 })
            // }
        } else {
            locscroll.start()
        }
    }

    menuBtn.on('click', menuToggle)
}

document.addEventListener('DOMContentLoaded', headerInit)
