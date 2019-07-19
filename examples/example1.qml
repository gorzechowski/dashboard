import QtQuick 2.0
import Dashboard 1.0

SwitchableTab {
    id: main
    switchAfter: 10

    Rectangle {
        id: prod
        color: "#c62828"
        x: 0
        y: 0
        width: main.width / 3
        height: main.height / 3
        Text {
            id: prodTxt
            text: "PROD"
            font.pointSize: 46
            x: prod.width / 2 - prodTxt.width / 2
            y: prod.height / 2
            color: "white"
        }
    }

    WebView {
        id: web
        url: "https://play.grafana.org/d/000000002/influxdb-templated?orgId=1&var-datacenter=Europe&var-host=All&var-summarize=1m&from=now-1h&to=now&refresh=5s"
        x: prod.width
        y: 0
        width: (main.width / 3) * 2
        height: main.height / 3
    }

    Rectangle {
        id: staging
        color: "#d84315"
        x: (main.width / 3) * 2
        y: main.height / 3
        width: main.width / 3
        height: main.height / 3
        Text {
            id: stagingTxt
            text: "STAGING"
            font.pointSize: 46
            x: prod.width / 2 - stagingTxt.width / 2
            y: prod.height / 2 - stagingTxt.height / 2
            color: "white"
        }
    }

    WebView {
        id: web2
        url: "https://play.grafana.org/d/000000002/influxdb-templated?orgId=1&var-datacenter=Europe&var-host=All&var-summarize=1m&from=now-1h&to=now&refresh=5s"
        x: 0
        y: main.height / 3
        width: (main.width / 3) * 2
        height: main.height / 3
    }

    Rectangle {
        id: dev
        color: "#424242"
        x: 0
        y: (main.height / 3) * 2
        width: main.width / 3
        height: main.height / 3
        Text {
            id: devTxt
            text: "DEV"
            font.pointSize: 46
            x: prod.width / 2 - devTxt.width / 2
            y: prod.height / 2 - devTxt.height / 2
            color: "white"
        }
    }

    WebView {
        id: web3
        url: "https://play.grafana.org/d/000000002/influxdb-templated?orgId=1&var-datacenter=Europe&var-host=All&var-summarize=1m&from=now-1h&to=now&refresh=5s"
        x: dev.width
        y: (main.height / 3) * 2
        width: (main.width / 3) * 2
        height: main.height / 3
    }
}
