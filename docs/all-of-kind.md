# all Of Kind

Get an array of all status bars of a certian kind.

```sig
statusbars.allOfKind(StatusBarKind.Health)
```

## Parameters

* **kind**: the kind of status bar to return an array for.

## Returns

* an array of status bars of the selected **kind**.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
let status_bar_list = statusbars.allOfKind(StatusBarKind.Health)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```