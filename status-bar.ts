enum StatusBarFlag {
    //% blockHidden=true
    None = 0,
    // if set, update bar over time; otherwise update bar immediately
    //% block="smooth transition"
    //% block.loc.ru="плавное изменение"
    SmoothTransition = 1 << 0,
    // if set, and label exists, draw label at bottom or right side
    //% block="label at end"
    //% block.loc.ru="подпись в конце"
    LabelAtEnd = 1 << 1,
    // if set, constrain values stored in status bar between 0 and max
    //% block="constrain value"
    //% block.loc.ru="максимальное значение"
    ConstrainAssignedValue = 1 << 2,
    // if set, start 'on' from opposite side (top or right)
    //% block="invert fill direction"
    //% block.loc.ru="заполнять в обратную сторону"
    InvertFillDirection = 1 << 3,
    // if set, do not immediately show target when transitioning
    //% block="hide transition preview"
    //% block.loc.ru="скрыть предпросмотр изменения"
    HideTargetPreview = 1 << 4,
    // if set, do not destroy this status bar when sprite it is attached to is destroyed
    //% block="no autodestroy on attached destroy"
    //% block.loc.ru="не уничтожать вместе с присоединенным спрайтом"
    NoAutoDestroy = 1 << 5,
    // if set, do not run `on zero` or `on status changed` events when changing values on this status bar.
    //% block="ignore events"
    //% block.loc.ru="игнорировать события"
    IgnoreValueEvents = 1 << 6,
}

namespace SpriteKind {
    //% isKind
    export const StatusBar = SpriteKind.create();
}

namespace StatusBarKind {
    /**
     * Gets the "kind" of a status bar
     */
    //% shim=KIND_GET
    //% blockId="statusbars_kind" block="$kind"
    //% kindNamespace=StatusBarKind kindMemberName=kind kindPromptHint="e.g. Hungry, Thirst, ..."
    //% blockHidden=true
    export function _statusbarKind(kind: number): number {
        return kind;
    }

    let nextKind: number
    export function create() {
        if (nextKind === undefined) nextKind = 1;
        return nextKind++;
    }

    //% isKind
    export const Health = create();

    //% isKind
    export const Energy = create();

    //% isKind
    export const Magic = create();

    //% isKind
    export const EnemyHealth = create();
}

// TODO: allow timing fn for transition between prev and curr value, instead of just 100ms

// TODO: angled bars?  /::::::::::/ instead of |::::::::::|

// TODO: 'rounded border' / border-radius option? just 1px or 2px

//% blockNamespace="statusbars"
//% blockGap=8
class StatusBarSprite extends Sprite {
    constructor(public _statusBar: statusbars.StatusBar) {
        super(_statusBar.image);
    }

    //% group="Value" blockSetVariable="statusbar"
    //% blockCombine block="value" callInDebugger
    //% help=github:pxt-status-bar/docs/value
    get value(): number {
        return this.applyChange(sb => sb.current) || 0;
    }

    set value(v: number) {
        this.applyChange(sb => {
            sb.current = v;
        });
    }

    //% group="Value" blockSetVariable="statusbar"
    //% blockCombine block="max" callInDebugger
    //% help=github:pxt-status-bar/docs/max
    get max(): number {
        return this.applyChange(sb => sb.max) || 0;
    }

    set max(v: number) {
        this.applyChange(sb => {
            sb.max = v;
        });
    }

    //% block="attach $this(statusbar) to $toFollow=variables_get(mySprite)||padding $padding offset $offset"
    //% block.loc.ru="прикрепить $this(statusbar) к $toFollow=variables_get(mySprite)||отступ $padding смещение $offset"
    //% blockId="statusbars_attachToSprite"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% help=github:pxt-status-bar/docs/attach-to-sprite
    //% group="Attach"
    //% weight=85
    attachToSprite(toFollow: Sprite, padding?: number, offset?: number) {
        this.applyChange(sb => {
            // reset this to the default value;
            // this will be changed with the follow logic to match toFollow,
            // but if this is being reassigned it should handle that gracefully
            this.setFlag(SpriteFlag.RelativeToCamera, true);
            sb.spriteToFollow = toFollow;
            if (sb.followPadding === undefined || padding !== undefined) {
                sb.followPadding = padding || 0;
            }
            if (sb.followOffset === undefined || padding !== undefined) {
                sb.followOffset = offset || 0;
            }
            if (toFollow)
                sb.positionNextTo(this, toFollow);
        });
    }

    //% block="sprite that $this(statusbar) is attached to"
    //% block.loc.ru="спрайт к которому прикреплен $this(statusbar)"
    //% blockId="statusbars_attachSpriteGetter"
    //% help=github:pxt-status-bar/docs/sprite-attached-to
    //% group="Attach"
    //% weight=83
    spriteAttachedTo() {
        return this.applyChange(sb => sb.spriteToFollow);
    }

    /**
     * @param status status bar to apply change to
     * @param fillColor color to fill bar with, eg: 7
     * @param bkgdColor bar background color, eg: 2
     * @param drainColor color to show while value is being changed; eg: 3
     */
    //% block="set $this(statusbar) fill $fillColor background $bkgdColor||drain color $drainColor"
    //% block.loc.ru="установить для $this(statusbar) цвет $fillColor фон $bkgdColor||цвет уменьшения $drainColor"
    //% blockId="statusbars_setColor"
    //% fillColor.shadow="colorindexpicker"
    //% bkgdColor.shadow="colorindexpicker"
    //% drainColor.shadow="colorindexpicker"
    //% help=github:pxt-status-bar/docs/set-color
    //% group="Display"
    //% weight=75
    setColor(fillColor: number, bkgdColor: number, drainColor?: number) {
        this.applyChange(sb => {
            sb.onColor = fillColor;
            sb.offColor = bkgdColor;

            if (drainColor != null) {
                sb.drainColor = drainColor;
            }
        });
    }

    /**
     * @param status status bar to add border to
     * @param borderWidth width of border in pixels, eg: 1
     * @param color color of border, eg: 13
     */
    //% block="set $this(statusbar) border width $borderWidth $color"
    //% block.loc.ru="установить для $this(statusbar) рамку толщиной $borderWidth цветом $color"
    //% blockId="statusbars_setBorder"
    //% color.shadow="colorindexpicker"
    //% help=github:pxt-status-bar/docs/set-bar-border
    //% group="Display"
    //% weight=74
    setBarBorder(borderWidth: number, color: number) {
        this.applyChange(sb => {
            sb.borderColor = color;
            sb.borderWidth = borderWidth;
        });
    }

    /**
     * @param status status bar to add label to
     * @param label label to add to status bar, eg: HP
     * @param color color of label, eg: 1
     */
    //% block="set $this(statusbar) label $label||$color"
    //% block.loc.ru="установить для $this(statusbar) подпись $label||$color"
    //% blockId="statusbar_setLabel"
    //% color.shadow="colorindexpicker"
    //% help=github:pxt-status-bar/docs/set-label
    //% group="Display"
    //% weight=73
    setLabel(label: string, color?: number) {
        this.applyChange(sb => {
            if (color)
                sb.labelColor = color;
            sb.label = label;
        });
    }

    //% block="set $this(statusbar) $flag $on=toggleOnOff"
    //% block.loc.ru="установить для $this(statusbar) $flag $on=toggleOnOff"
    //% blockId="statusbars_setFlag"
    //% help=github:pxt-status-bar/docs/set-status-bar-flag
    //% group="Display"
    //% weight=72
    setStatusBarFlag(flag: StatusBarFlag, on: boolean) {
        this.applyChange(sb => {
            sb.setFlag(flag, on);
        });
    }

    /**
     * @param width width of status bar, eg: 20
     * @param height height of status bar, eg: 4
     */
    //% block="set $this(statusbar) width $width height $height"
    //% block.loc.ru="установить для $this(statusbar) ширину $width высоту $height"
    //% blockId="statusbars_setBarSize"
    //% help=github:pxt-status-bar/docs/set-bar-size
    //% group=Display
    //% weight=71
    setBarSize(width: number, height: number) {
        this.applyChange(sb => {
            sb.barWidth = width;
            sb.barHeight = height;
        });
    }

    //% block="set $this(statusbar) position to $dir"
    //% block.loc.ru="установить позицию $this(statusbar) $dir"
    //% blockId="statusbars_positionNextToSprite"
    //% help=github:pxt-status-bar/docs/position-direction
    //% group="Display"
    //% weight=70
    positionDirection(dir: CollisionDirection) {
        this.applyChange(sb => {
            sb.explicitlySetDirection = dir;
            if (sb.spriteToFollow) {
                sb.positionNextTo(this, sb.spriteToFollow);
            } else {
                // if no position, set to side of the screen
                if (dir === CollisionDirection.Top || dir === CollisionDirection.Bottom) {
                    this.x = (screen.width >> 1) + sb.followOffset;
                    if (dir === CollisionDirection.Top) {
                        this.top = sb.followPadding;
                    } else {
                        this.bottom = screen.height - sb.followPadding;
                    }
                } else {
                    this.y = (screen.height >> 1) + sb.followOffset;
                    if (dir === CollisionDirection.Left) {
                        this.left = sb.followPadding;
                    } else {
                        this.right = screen.width - sb.followPadding;
                    }
                }
            }
        });
    }

    //% block="set $this(statusbar) padding $padding offset $offset"
    //% block.loc.ru="установить для $this(statusbar) отступ $padding смещение $offset"
    //% blockId="setPaddingOffset"
    //% help=github:pxt-status-bar/docs/set-offset-padding
    //% group="Display"
    //% weight=69
    setOffsetPadding(offset: number, padding: number) {
        this.applyChange(sb => {
            if (!sb.spriteToFollow && sb.explicitlySetDirection !== null) {
                switch (sb.explicitlySetDirection) {
                    case CollisionDirection.Top:
                        this.x += offset - sb.followOffset;
                        this.y += padding + sb.followPadding;
                        break;
                    case CollisionDirection.Bottom:
                        this.x += offset - sb.followOffset;
                        this.y -= padding + sb.followPadding;
                        break;
                    case CollisionDirection.Left:
                        this.x += padding + sb.followPadding;
                        this.y += offset - sb.followOffset;
                        break
                    case CollisionDirection.Right:
                        this.x -= padding + sb.followPadding;
                        this.y += offset - sb.followOffset;
                        break
                }
            }
            sb.followOffset = offset;
            sb.followPadding = padding;
            if (sb.spriteToFollow) {
                sb.positionNextTo(this, sb.spriteToFollow);
            }
        })
    }

    freeze() {
        this.applyChange(sb => sb.freeze());
    }
    
    private applyChange<T>(action: (sb: statusbars.StatusBar) => T): T {
        const sb = this._statusBar;

        if (sb) {
            const output = action(sb);
            sb.updateDisplay();
            this.setImage(sb.image);
            return output;
        }

        return undefined;
    }
}

//% color=#38364d
//% weight=79
//% icon="\uf240"
//% blockGap=8 block="Status Bars"
//% groups='["Create", "Value", "Attach", "Display", "Events", "Other"]'
namespace statusbars {
    const STATUS_BAR_DATA_KEY = "STATUS_BAR_DATA_KEY";
    const MANAGED_SPRITES_KEY = STATUS_BAR_DATA_KEY + "_SPRITES";
    const ZERO_HANDLERS_KEY = STATUS_BAR_DATA_KEY + "_ON_ZERO";
    const STATUS_HANDLERS_KEY = STATUS_BAR_DATA_KEY + "_ON_STATUS_REACHED";
    const POST_PROCESS_HANDLERS_KEY = STATUS_BAR_DATA_KEY + "_ON_DISPLAY_UPDATE";

    export class StatusBar {
        // the sprite this is attached to
        sprite: Sprite;
        borderWidth: number;
        // if not set, use offColor
        borderColor: number;
        labelColor: number;

        flags: number;
        protected _label: string;
        protected _image: Image;

        spriteToFollow: Sprite;
        // how far away from touching the sprite to be
        followPadding: number;
        // offset beside sprite; -5 will offset bar 5 to the left or above (depending on horizontal / vertical bar)
        followOffset: number;
        explicitlySetDirection: CollisionDirection;

        protected font: image.Font;

        // hold state
        protected displayValue: number;
        protected target: number;

        hasHitZero: boolean;

        constructor(
            protected _barWidth: number,
            protected _barHeight: number,
            public onColor: number,
            public offColor: number,
            public drainColor: number,
            protected _max: number,
            public kind: number
        ) {
            this.borderWidth = 0;
            this.borderColor = undefined;
            this.flags = StatusBarFlag.ConstrainAssignedValue;
            this._label = undefined;
            this.labelColor = 0x1;
            this.font = image.font5;

            this.followPadding = 0;
            this.followOffset = 0;

            this.hasHitZero = false;

            this.displayValue = _max;
            this.target = _max;
            this.rebuildImage();
        }

        get barWidth() {
            return this._barWidth;
        }

        set barWidth(v: number) {
            this._barWidth = v;
            this.rebuildImage();
        }

        get barHeight() {
            return this._barHeight;
        }

        set barHeight(v: number) {
            this._barHeight = v;
            this.rebuildImage();
        }

        positionNextTo(status: Sprite, target: Sprite) {
            const padding = this.followPadding;
            const alignment = this.followOffset;
            const position = this.explicitlySetDirection != null ?
                    this.explicitlySetDirection
                    : (this.isVerticalBar() ? CollisionDirection.Left : CollisionDirection.Top);
            if (target.flags & sprites.Flag.Destroyed
                    && !(this.flags & StatusBarFlag.NoAutoDestroy)) {
                status.destroy();
            }
            const toFollowIsRelativeToCamera = !!(target.flags & SpriteFlag.RelativeToCamera);
            if (!!(status.flags & SpriteFlag.RelativeToCamera) != toFollowIsRelativeToCamera) {
                status.setFlag(SpriteFlag.RelativeToCamera, toFollowIsRelativeToCamera);
            }

            if (position === CollisionDirection.Left || position === CollisionDirection.Right) {
                status.y = target.y + alignment;
                if (position === CollisionDirection.Right) {
                    status.left = target.right + padding;
                } else {
                    status.right = target.left - padding;
                }
            } else {
                status.x = target.x + alignment;
                if (position === CollisionDirection.Bottom) {
                    status.top = target.bottom + padding;
                } else {
                    status.bottom = target.top - padding;
                }
            }
        }

        freeze() {
            this.target = this.displayValue;
        }

        get label() {
            return this._label;
        }
        
        set label(v: string) {
            this._label = v;
            this.rebuildImage();
        }

        get max() {
            return this._max;
        }

        set max(v: number) {
            this.changeValue(this.current, v);
            this.updateState();
        }

        get current() {
            return this.target;
        }

        set current(v: number) {
            this.changeValue(v, this.max);

            if (!(this.flags & StatusBarFlag.SmoothTransition))
                this.displayValue = v;

            this.updateState();
        }

        protected changeValue(current: number, max: number) {
            const statusHandlers = getStatusHandlers();
            const toRun = statusHandlers && statusHandlers.filter(h =>
                h.kind === this.kind
                    && !(this.flags & StatusBarFlag.IgnoreValueEvents)
                    && h.conditionMet(current, max)
                    && !h.conditionMet(this.current, this.max)
            );

            this.target = current;
            this._max = max

            if (current <= 0 && !this.hasHitZero && !(this.flags & StatusBarFlag.IgnoreValueEvents)) {
                this.hasHitZero = true;
                const handler = (getZeroHandlers() || [])[this.kind];
                if (this.sprite && handler)
                    handler(this.sprite);
            } else if (current > 0 && this.hasHitZero) {
                // reset if this was below zero and has been refilled
                this.hasHitZero = false;
            }
            
            for (const h of (toRun || [])) {
                h.handler(this.sprite);
            }
        }

        setFlag(flag: StatusBarFlag, on: boolean) {
            if (on)
                this.flags |= flag
            else
                this.flags = ~(~this.flags | flag);
        }

        get image() {
            return this._image;
        }

        set image(v: Image) {
            // ignore, readonly ref outside this class
        }

        protected isVerticalBar() {
            return this._barHeight > this._barWidth;
        }

        protected isSmoothTransition() {
            return this.flags & StatusBarFlag.SmoothTransition;
        }

        protected rebuildImage() {
            let width = this._barWidth;
            let height = this._barHeight;

            if (this.label) {
                const labelWidth = this.font.charWidth * this.label.length;
                if (this.isVerticalBar()) {
                    width = Math.max(width, labelWidth);
                    height += this.font.charHeight + 1;
                } else {
                    width += labelWidth;
                    height = Math.max(height, this.font.charHeight);
                }
            }

            if (!this.image || width !== this.image.width || height !== this.image.height) {
                const newImg = image.create(width, height);
                this._image = newImg;
            }

            this.updateDisplay();
        }

        private lastUpdate = game.currentScene().millis();
        private throttleAmount = 100; 
        updateState() {
            const { target, displayValue } = this;
            if (this.flags & StatusBarFlag.ConstrainAssignedValue) {
                this.target = Math.constrain(target, 0, this.max);
                this.displayValue = Math.constrain(displayValue, 0, this.max);
            }

            const currTime = game.currentScene().millis();
            if (Math.abs(this.lastUpdate - currTime) < this.throttleAmount)
                return;

            const change = this.max / (Math.max(this._barWidth, this._barHeight) - this.borderWidth * 2);

            if (this.target > this.displayValue) {
                this.displayValue = Math.min(displayValue + change, this.target);
                this.lastUpdate = currTime;
            } else if (this.target < this.displayValue) {
                this.displayValue = Math.max(displayValue - change, this.target);
                this.lastUpdate = currTime;
            }
            
            if (displayValue !== this.displayValue) {
                this.updateDisplay();
            }
        }

        updateDisplay() {
            this.image.fill(0x0);
            const fillWidth = this._barWidth - 2 * this.borderWidth;
            const fillHeight = this._barHeight - 2 * this.borderWidth;
            const barIsVertical = this.isVerticalBar();
            const borderColor = util.isNullOrUndefined(this.borderColor) ?
                    this.offColor : this.borderColor;
    
            let barLeft = 0;
            let barTop = 0;
            
            if (this.label) {
                const textWidth = this.font.charWidth * this.label.length;
                const textHeight = this.font.charHeight;
                const labelEnd = this.flags & StatusBarFlag.LabelAtEnd;

                let textX = 0;
                let textY = 0;
                if (barIsVertical) {
                    if (labelEnd) {
                        textY = this._barHeight + 1;
                    } else {
                        barTop += textHeight + 1;
                    }
                    if (this._barWidth > textWidth) {
                        textX = (this._barWidth - textWidth) >> 1;
                    } else if (this._barWidth < textWidth) {
                        // minus 1 due to 1px padding on right side of fonts
                        barLeft = (textWidth - this._barWidth - 1) >> 1;
                    }
                } else {
                    if (labelEnd) {
                        textX = this._barWidth + 1;
                    } else {
                        barLeft += textWidth;
                    }
                    if (this._barHeight > textHeight) {
                        textY = (this._barHeight - textHeight) >> 1;
                    } else if (this._barHeight < textHeight) {
                        barTop = (textHeight - this._barHeight) >> 1;
                    }
                }

                this.image.print(
                    this.label,
                    textX,
                    textY,
                    this.labelColor,
                    this.font
                );
            }

            this.image.fillRect(
                barLeft,
                barTop,
                this._barWidth,
                this._barHeight,
                borderColor
            );

            this.image.fillRect(
                barLeft + this.borderWidth,
                barTop + this.borderWidth,
                fillWidth,
                fillHeight,
                this.offColor
            );

            if (this.displayValue > 0) {
                const showTarget = !(this.flags & StatusBarFlag.HideTargetPreview);
                const invertDir = (this.flags & StatusBarFlag.InvertFillDirection);

                if (showTarget) {
                    const drainPercent = Math.constrain(
                        (this.displayValue) / this._max,
                        0,
                        1.0
                    );
                    const dw = barIsVertical ? fillWidth : Math.round(fillWidth * drainPercent);
                    const dh = barIsVertical ? Math.round(fillHeight * drainPercent) : fillHeight;
                    const dx = barLeft + this.borderWidth + ((barIsVertical || !invertDir) ? 0 : fillWidth - dw);
                    const dy = barTop + this.borderWidth + ((barIsVertical && !invertDir ? fillHeight - dh : 0));
                    this.image.fillRect(dx, dy, dw, dh, this.drainColor);
                }

                const percent = Math.constrain(
                    this.target / this._max,
                    0,
                    1.0
                );

                const tw = barIsVertical ? fillWidth : Math.round(fillWidth * percent);
                const th = barIsVertical ? Math.round(fillHeight * percent) : fillHeight;
                const tx = barLeft + this.borderWidth + ((barIsVertical || !invertDir) ? 0 : fillWidth - tw);
                const ty = barTop + this.borderWidth + ((barIsVertical && !invertDir ? fillHeight - th : 0));
                this.image.fillRect(tx, ty, tw, th, this.onColor);
            }

            const handler = (getPostProcessHandlers() || [])[this.kind];
            if (this.sprite && handler)
                handler(this.sprite, this.image);
        }
    }

    export enum StatusComparison {
        //% block="="
        EQ,
        //% block="≠"
        NEQ,
        //% block="<"
        LT,
        //% block="≤"
        LTE,
        //% block=">"
        GT,
        //% block="≥"
        GTE,
    }

    export enum ComparisonType {
        //% block="%"
        Percentage,
        //% block="fixed"
        Fixed
    }

    class StatusHandler {
        constructor(
            public kind: number,
            protected comparison: StatusComparison,
            protected comparisonType: ComparisonType,
            protected percent: number,
            public handler: (sprite: Sprite) => void
        ) { }

        conditionMet(current: number, max: number) {
            const value = this.comparisonType === ComparisonType.Percentage ?
                (current / max) * 100
                : current;
            switch (this.comparison) {
                // TODO: maybe round / cast to int percent and value for the eq / neq comparison?
                case StatusComparison.EQ:
                    return value === this.percent;
                case StatusComparison.NEQ:
                    return value !== this.percent;
                case StatusComparison.GT:
                    return value > this.percent;
                case StatusComparison.GTE:
                    return value >= this.percent;
                case StatusComparison.LT:
                    return value < this.percent;
                case StatusComparison.LTE:
                    return value <= this.percent;
                default:
                    return false;
            }
        }

    }

    /**
     * @param width width of status bar, eg: 20
     * @param height height of status bar, eg: 4
     */
    //% block="create status bar sprite width $width height $height kind $kind"
    //% block.loc.ru="создать спрайт индикатора статуса шириной $width высотой $height типа $kind"
    //% kind.shadow="statusbars_kind"
    //% blockId="statusbars_create"
    //% blockSetVariable="statusbar"
    //% help=github:pxt-status-bar/docs/create
    //% group="Create"
    //% weight=100
    export function create(
        width: number,
        height: number,
        kind: number
    ): StatusBarSprite {
        let onColor = 0x7;
        let offColor = 0x2;
        let drainColor = 0x3;

        if (kind === StatusBarKind.Energy) {
            onColor = 0x5;
            offColor = 0xB;
            drainColor = 0x4;
        } else if (kind === StatusBarKind.Magic) {
            onColor = 0x8;
            offColor = 0xB;
            drainColor = 0x9;
        }
        
        const sb = new StatusBar(
            width,
            height,
            onColor,
            offColor,
            drainColor,
            100,
            kind
        );

        const output = new StatusBarSprite(sb);
        // below is normally done in `sprites.create`
        output.setKind(SpriteKind.StatusBar);
        const cs = game.currentScene();
        cs.physicsEngine.addSprite(output);

        // run on created handlers
        cs.createdHandlers
            .filter(h => h.kind == kind)
            .forEach(h => h.handler(output));

        sb.sprite = output;

        output.setFlag(SpriteFlag.RelativeToCamera, true);
        output.setFlag(SpriteFlag.Ghost, true);
        output.data[STATUS_BAR_DATA_KEY] = sb;
        output.z = scene.HUD_Z - 5;

        init(output);
        
        const handler = (getPostProcessHandlers() || [])[kind];
        if (output && handler)
            handler(output, output.image);

        return output;
    }

    //% block="status bar kind $kind attached to $sprite=variables_get(mySprite)"
    //% block.loc.ru="индикатор статуса типа $kind приклепленный к $sprite=variables_get(mySprite)"
    //% blockId="statusbars_spriteStatusBarIsAttachedTo"
    //% kind.shadow="statusbars_kind"
    //% help=github:pxt-status-bar/docs/get-status-bar-attached-to
    //% group="Attach"
    //% weight=84
    export function getStatusBarAttachedTo(kind: number, sprite: Sprite) {
        const managedSprites = getManagedSprites();
        if (!managedSprites || !sprite)
            return undefined;
        return managedSprites.find(s => applyChange(s, sb => sb.spriteToFollow === sprite && sb.kind === kind));
    }

    //% block="on status bar kind $kind zero $status"
    //% block.loc.ru="когда индикатор статуса типа $kind обнуляется $status"
    //% blockId="statusbars_onZero"
    //% kind.shadow="statusbars_kind"
    //% draggableParameters="reporter"
    //% help=github:pxt-status-bar/docs/on-zero
    //% group="Events"
    //% weight=60
    export function onZero(kind: number, handler: (status: StatusBarSprite) => void) {
        let zeroHandlers = getZeroHandlers();
        if (!zeroHandlers) {
            game.currentScene().data[ZERO_HANDLERS_KEY] = zeroHandlers = [];
        }
        zeroHandlers[kind] = handler;
    }

    //% block="on status bar kind $kind $comparison $value|$comparisonType $status"
    //% block.loc.ru="когда индикатор статуса типа $kind $comparison $value|$comparisonType $status"
    //% blockId="statusbars_onStatusReached"
    //% kind.shadow="statusbars_kind"
    //% draggableParameters="reporter"
    //% group="Events"
    //% comparison.defl=statusbars.StatusComparison.LTE
    //% help=github:pxt-status-bar/docs/on-status-reached
    //% value.defl=50
    //% weight=58
    export function onStatusReached(
        kind: number,
        comparison: StatusComparison,
        comparisonType: ComparisonType,
        value: number,
        handler: (status: StatusBarSprite) => void
    ) {
        let statusHandlers = getStatusHandlers();
        if (!statusHandlers) {
            game.currentScene().data[STATUS_HANDLERS_KEY] = statusHandlers = [];
        }
        const statusHandler = new StatusHandler(
            kind,
            comparison,
            comparisonType,
            value,
            handler
        );
        statusHandlers.push(statusHandler);
    }

    //% block="on status bar kind $kind display updated $status $image"
    //% block.loc.ru="когда у индикатора статуса типа $kind обновляется отображение $status $image"
    //% kind.shadow="statusbars_kind"
    //% blockId="statusbars_postprocessDisplay"
    //% draggableParameters="reporter"
    //% help=github:pxt-status-bar/docs/on-display-updated
    //% group="Events"
    //% weight=59
    export function onDisplayUpdated(kind: number, handler: (status: StatusBarSprite, image: Image) => void) {
        let displayUpdateHandlers = getPostProcessHandlers();
        if (!displayUpdateHandlers) {
            game.currentScene().data[POST_PROCESS_HANDLERS_KEY] = displayUpdateHandlers = [];
        }
        displayUpdateHandlers[kind] = handler;
    }

    //% block="array of status bars of $kind"
    //% block.loc.ru="массив индикаторов статуса типа $kind"
    //% kind.shadow="statusbars_kind"
    //% blockId="statusbars_arrayOfKind"
    //% blockSetVariable="status bar list"
    //% help=github:pxt-status-bar/docs/all-of-kind
    //% group="Other"
    //% weight=45
    export function allOfKind(kind: number): StatusBarSprite[] {
        const managedSprites = getManagedSprites();
        if (!managedSprites)
            return [];
        return managedSprites.filter(status => {
            const sb = status._statusBar;
            return sb && sb.kind === kind;
        });
    }

    function init(s: StatusBarSprite) {
        let managedSprites = getManagedSprites();
        if (!managedSprites) {
            game.currentScene().data[MANAGED_SPRITES_KEY] = managedSprites = [] as StatusBarSprite[];
            game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY + 5, () => {
                const managed = getManagedSprites();
                for (let i = managed.length - 1; i >= 0; --i) {
                    const spr = managed[i];
                    const sb = spr._statusBar;
                    if (sb) {
                        sb.updateState();

                        const { spriteToFollow } = sb;
                        if (spriteToFollow) {
                            sb.positionNextTo(spr, spriteToFollow);
                        }
                    }

                    if (spr.flags & sprites.Flag.Destroyed) {
                        // give the garbage collector a helping hand
                        sb.sprite = undefined;
                        managed.removeAt(i);
                        continue;
                    }
                }
            });
        }
        
       managedSprites.push(s);
    }

    // passes back any return from action for getters / etc
    function applyChange<T>(status: StatusBarSprite, action: (sb: StatusBar) => T): T {
        const sb = status._statusBar;

        if (sb) {
            const output = action(sb);
            sb.updateDisplay();
            status.setImage(sb.image);
            return output;
        }

        return undefined;
    }

    function getSceneData(key: string) {
        return game.currentScene().data[key];
    }

    function getManagedSprites() {
        return getSceneData(MANAGED_SPRITES_KEY) as StatusBarSprite[];
    }

    function getZeroHandlers() {
        return getSceneData(ZERO_HANDLERS_KEY) as ((status: Sprite) => void)[];
    }

    function getStatusHandlers() {
        return getSceneData(STATUS_HANDLERS_KEY) as StatusHandler[];
    }

    function getPostProcessHandlers() {
        return getSceneData(POST_PROCESS_HANDLERS_KEY) as ((status: Sprite, image: Image) => void)[];
    }

    namespace util {
        export function isNullOrUndefined(v: any): v is null | undefined {
            return v === undefined || v === null;
        }
    }
}
