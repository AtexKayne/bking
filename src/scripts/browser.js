import Bowser from 'bowser'
import { detectMobile } from './helper'

const browser = Bowser.getParser(window.navigator.userAgent)
const name = browser.getBrowserName().toLowerCase()

if (name.includes('firefox') || name.includes('safari') || detectMobile()) {
    document.body.classList.add('not-blured')
}