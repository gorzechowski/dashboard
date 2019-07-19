import Dashboard 1.0

SwitchableTab {
    id: main
	switchAfter: 30

    WebView {
        id: web
        url: "http://localhost:8080/view/DEV/"
        x: 0
        y: 0
        width: main.width / 3
        height: main.height
    }

    WebView {
        id: web2
        url: "http://localhost:8080/view/STAGING/"
        x: web.width
        y: 0
        width: main.width / 3
        height: main.height
    }

    WebView {
        id: web3
        url: "http://localhost:8080/view/PROD/"
        x: web.width * 2
        y: 0
        width: main.width / 3
        height: main.height
    }
}
