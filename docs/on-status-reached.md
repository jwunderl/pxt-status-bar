# On status reached

Set code to run when a status bar of the given kind reaches a given threshold.

You can choose whether to set the event to be percentage based (``%``) or fixed points (``fixed``)

```blocks
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    statusbar.value = 25
})
statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 50, function (status) {
    pause(500)
    game.over(false)
})
let statusbar: StatusBarSprite = null
statusbar = statusbars.create(20, 4, StatusBarKind.Health)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```