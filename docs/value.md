# Value

Gets or sets the current value of the status bar. The default value is 100.

By default, this is constrained between 0 and the max value; this can be changed using the `constrain value` flag.

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.value = 50
console.log(statusbar.value)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```