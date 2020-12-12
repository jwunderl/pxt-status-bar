# set Label

Sets the label for a given status bar.

```sig
statusbars.create(20, 4, StatusBarKind.Health).setLabel("HP", 10)
```

## Parameters

* **label**: a [string](types/string) that is the text for the label.
* **color**: a [number](types/number) that is the display color of the text.

The label is centered along the status bar.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.setLabel("HP", 10)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```