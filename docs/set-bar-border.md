# set Bar Border

Set the border for a status bar with the given width and and color.

```sig
statusbars.create(20, 4, StatusBarKind.Health).setBarBorder(1, 13)
```

## Parameters

* **width**: a [number](types/number) which is the width in pixels of the border.
* **color**: a [number](types/number) that is color, in the current color palette, for the status bar border.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.setBarBorder(1, 13)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```