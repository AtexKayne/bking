import { $ } from './helper'

const headerInit = () => {
    const menuBtn = $('js-menu-btn')
    const menu = $('js-menu')
    const header = $('js-header')

    let isOpen = false

    const menuToggle = () => {
        isOpen = !isOpen

        menuBtn.attr('data-open', isOpen)
        menu.attr('data-open', isOpen)
        header.attr('data-open', isOpen)
        
        if (isOpen) {
            locscroll.stop()
            console.log(locscroll);
        } else {
            locscroll.start()
        }
    }

    menuBtn.on('click', menuToggle)
}

document.addEventListener('DOMContentLoaded', headerInit)
