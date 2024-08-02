import Bowser from 'bowser'

const browser = Bowser.getParser(window.navigator.userAgent)
const name = browser.getBrowserName().toLowerCase()

if (name.includes('firefox') || name.includes('safari')) {
    document.body.classList.add('not-blured')
}