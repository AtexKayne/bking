export const $ = function (q) {
    let elem
    const node = this || document
    if (q.includes('js') && !q.includes('.')) {
        elem = node.querySelectorAll(`.${q}`)
    } else {
        elem = node.querySelectorAll(q)
    }

    if (elem.length >= 1) {
        const items = Array.from(elem)
        items.forEach(item => item.$ = $)
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
            },
            find: function (query) {
                const elems = this.items[0].querySelectorAll(query)
                return !!elems.length ? Array.from(elems) : null
            },
            append: function (elem) {
                this.items.forEach(item => {
                    item.append(elem)
                })
                return this
            },
            each: function (fn) {
                this.items.forEach(fn)
                return this
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

export const createObserver = (element, fn, threshold) => {
    const observer = new IntersectionObserver(fn, { threshold })
    observer.observe(element)
    return observer
}

export const detectMobile = () => window.innerWidth < 1024

Number.prototype.isBetween = function (a, b) {
    return a <= this && this <= b
}

export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}