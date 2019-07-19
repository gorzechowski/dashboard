import QtQuick 2.0
import Dashboard 1.0

SwitchableTab {
    id: main
    switchAfter: 30

    WebView {
        id: jenkins
        url: "http://localhost:8080/view/PROD/"
        x: 0
        y: 0
        width: main.width / 3
        height: main.height
    }

    WebView {
        id: grafana
        url: "https://play.grafana.org/d/000000029/prometheus-demo-dashboard?orgId=1&refresh=5m"
        x: jenkins.width
        y: 0
        width: main.width - jenkins.width
        height: (main.height / 3) * 2
    }

    WebView {
        id: pipelines
        url: "http://localhost:8080/view/PROD_PIPELINES/"
        x: jenkins.width
        y: grafana.height
        width: main.width - jenkins.width
        height: main.height / 3
    }
}