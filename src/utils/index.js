export function createBmap() {
    if (document.body.querySelector('#bmap-script')) {
        document.body.removeChild(document.body.querySelector('#bmap-script'))
    }
    const script = document.createElement('script')
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=HHO1MR17h68QXOjngRbmpwS4oG3WcC0F'
    script.id = 'bmap-script'
    script.async = true
    document.body.appendChild(script)
    return new Promise(resolve => {
        script.onload = function() {
            resolve()
        }
    })
}