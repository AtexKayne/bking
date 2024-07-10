export const $ = (q) => {
    let elem

    if (q.includes('js') && !q.includes('.')) {
        elem = document.querySelectorAll(`.${q}`)
    } else {
        elem = document.querySelectorAll(q)
    }

    if (elem.length >= 1) {
        const items = Array.from(elem)
        const obj = {
            items,
            on: function (event, fn) {
                this.items.forEach(el => el.addEventListener(event, fn))
                return this
            },
            off: function (event, fn) {
                this.items.forEach(el => el.removeEventListener(event, fn))
                return this
            },
            css: function (css) {
                const props = Object.entries(css)
                props.forEach(prop => {
                    this.items.forEach(el => el.style[prop[0]] = prop[1])
                })
                return this
            },
            attr: function (attribute, value = null) {
                if (value !== null) {
                    this.items.forEach(el => el.setAttribute(attribute, value))
                    return this
                } else {
                    return this.items[0].getAttribute(attribute)
                }
            },
            aClass: function (className) {
                this.items.forEach(el => el.classList.add(className))
                return this
            },
            tClass: function (className) {
                this.items.forEach(el => el.classList.toggle(className))
                return this
            },
            rClass: function (className) {
                this.items.forEach(el => el.classList.remove(className))
                return this
            },
            eq: function (index) {
                return this.items[index]
            }
        }
        return obj
    } else {
        return null
    }
}

export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomFromInterval = (min, max) => {
    return Math.random() * (max - min + 1) + min
}

export const createObserver = (element, fn) => {
    const observer = new IntersectionObserver(fn, {})
    observer.observe(element)
    return observer
}

Number.prototype.isBetween = function (a, b) {
    return a <= this && this <= b;
};