# On zero

Set code to run when a status bar of the given kind reaches zero.

```blocks
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    statusbar.value = 0
})
statusbars.onZero(StatusBarKind.Health, function (status) {
    pause(500)
    game.over(false)
})
let statusbar: StatusBarSprite = null
statusbar = statusbars.create(20, 4, StatusBarKind.Health)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
