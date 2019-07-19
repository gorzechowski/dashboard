import Dashboard 1.0

SwitchableTab {
    id: main
    switchAfter: 5

    WebView {
        id: web
        url: "https://play.grafana.org"
        x: 0
        y: 0
        width: main.width / 2
        height: main.height
    }

    WebView {
        id: web2
        url: "https://play.grafana.org/d/000000029/prometheus-demo-dashboard?orgId=1&refresh=5m"
        x: web2.width
        y: 0
        width: main.width / 2
        height: main.height
    }
}
