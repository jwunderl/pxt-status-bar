# set Status Bar Flag

Enable or disable a flag that changes the status bar behavior.

```sig
statusbars.create(20, 4, StatusBarKind.Health).setStatusBarFlag(StatusBarFlag.LabelAtEnd, true)
```

## Parameters

* **flag**: a flag value that modifies the status bar behavior:
>* `smooth transition`:  When set, update bar over time; otherwise update bar immediately. This is similar to the draining effect that is commonly seen in fighting games.
>* `label at end`: When set, and label exists, draw label at bottom or right side (instead of top / left side).
>* `constrain value`: When set, constrain values stored in status bar between 0 and max. This is set to `on` by default.
>* `invert fill direction`: When set, swap the direction in which a status bar is filled. 
>* `no auto destroy`: When set, this status bar will persist after the sprite it is attached to is destroyed.
>* `ignore events`: When set, disable `on zero` and `on status changed` events when changing values on this status bar.
* **on**: a [boolean](types/boolean) that is `true` to set the flag on or `false` to set the flag off.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.setStatusBarFlag(StatusBarFlag.LabelAtEnd, true)
statusbar.setLabel("HP")
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```