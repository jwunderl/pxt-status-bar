# on Zero

Run code when a status bar of the given kind reaches zero.

```sig
statusbars.onZero(StatusBarKind.Health, function (status) {})
```

## Parameters

* **kind**: the kind of status bar to check it's value for `0`.
* **status**: the status bar that has a value of `0`.

## Example

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
