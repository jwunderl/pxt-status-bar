# Max

Gets or sets the current max value of the status bar. The default max value is 100.

By default, the value is constrained between 0 and the max value; this can be changed using the `constrain value` flag.

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.max = 50
console.log(statusbar.max)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```