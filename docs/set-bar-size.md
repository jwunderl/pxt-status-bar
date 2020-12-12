# set Bar Size

Set the width and height of the status bar.

```sig
statusbars.create(20, 4, StatusBarKind.Health).setBarSize(5, 20)
```

## Parameters

* **width**: a [number](types/number) the width in pixels of the status bar.
* **height**: a [number](types/number) the height in pixels of the status bar.

If the status bar is set to be taller (height > width),
the status bar will fill vertically instead of horizontally.

The **width** and **height** *include* the border width -- that is,
if you have a width of 5px and a 1px border,
the filled portion of the status bar will have a width of 3px. 

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.setStatusBarFlag(StatusBarFlag.LabelAtEnd, true)
statusbar.setBarSize(5, 20)
statusbar.value = 50
statusbar.setBarBorder(1, 13)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
