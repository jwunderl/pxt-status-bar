# all Of Kind

Gets an array of all Status Bars of the given Status Bar Kind.

```sig
statusbars.allOfKind(StatusBarKind.Health)
```

## Parameters

* **kind**: the kind of status bars to return an array for.

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