# On display updated

Set code to run when a status bar of the given kind is redrawn.
This can be used to modify how a status bar is displayed, like showing an image on top of it.

```blocks
statusbars.onDisplayUpdated(StatusBarKind.Health, function (status, image2) {
    image2.drawRect(0, 0, 4, 4, 11)
})
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
