# Dashboard QML types

The `Dashboard` module provides extended versions of types from [QtQuick](https://doc.qt.io/qt-5/qtquick-qmlmodule.html) and [QtWebView](https://doc.qt.io/qt-5/qtwebview-qmlmodule.html) modules. Current version of `Dashboard` module is `1.0`.

```
import Dashboard 1.0
```

# Object types

## SwitchableTab

Component used to define container (tab) for `WebView`(s). It's an extension of `QtQuick.Item` object with switch timer support added.

```
import Dashboard 1.0

SwitchableTab {
    switchAfter: 5
}
```

### Properties

#### switchAfter: `number` _required_

Number of seconds after current tab switches to the next one

## WebView

Displays web content and extends `QtWebView.WebView` component with additional auto-refresh feature.

```
import Dashboard 1.0

WebView {
    url: "https://play.grafana.org"
    refreshInterval: 5
}
```

### Properties

#### refreshInterval: `number`

Number of seconds after web page automatically reloads

Default value is 60

#### url: `string` _required_

The URL of web page to load
