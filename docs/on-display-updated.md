# on Display Updated

Run code when a status bar of the given kind is redrawn.

```sig
statusbars.onDisplayUpdated(StatusBarKind.Health, function (0, null) {

})
```

This event can be used to modify how a status bar is displayed, like showing an image on top of it.

## Parameters

* **kind**: the kind of status bar.
* **status**: the status bar with a display update.
* **image**: the image object for the status bar.

## Example

```blocks
statusbars.onDisplayUpdated(StatusBarKind.Health, function (status, image2) {
    image2.drawRect(0, 0, 4, 4, 11)
})
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
