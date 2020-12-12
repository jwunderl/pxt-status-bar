# on Status Reached

Run code  when a status bar of the given kind reaches a given threshold.

```sig
statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.LTE, statusbars.ComparisonType.Percentage, 50, function (status) {
})
```

You can choose whether to set the event to be percentage based (``%``) or fixed points (``fixed``)

## Parameters

* **kind**: the kind of status bar to check status for.
* **comparison**: the comparison operation to use: <, >, <=, >=, or =.
* **comparisonType**: the type of comparison, the types are `percentage` or `fixed`.
* **value**: a [number](types/number) that is the value to compare with.

## Example

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