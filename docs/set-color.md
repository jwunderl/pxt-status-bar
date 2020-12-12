# set Color

Sets the colors for the status bar.

```sig
statusbars.create(20, 4, StatusBarKind.Health).setColor(7, 2, 3)
```

## Parameters

* **fillColor**: a [number](types/number) that is the color that is filled in when a status bar is full.
* **bkgdColor**: a [number](types/number) that is the color that is shown when a portion is empty (when value is not equal to **max**).
* **drainColor** a [number](types/number) that is the color that is shown when the bar is emptying out (when `smooth transition` is set to true).

The colors have different defaults depending on the kind of status bar you are making.

## Examples

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.setColor(7, 2, 3)
```

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.setColor(7, 2, 3)
statusbar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
statusbar.value = 0
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
