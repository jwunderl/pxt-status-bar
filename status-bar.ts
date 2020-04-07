enum StatusBarFlag {
    //% blockHidden=true
    None = 0,
    //% block="smooth transition"
    SmoothTransition = 1 << 0, // if set, update bar over time; otherwise update bar immediately
    //% block="label at end"
    LabelAtEnd = 1 << 1, // if set, and label exists, draw label at bottom or right side
    //% block="constrain value"
    ConstrainAssignedValue = 1 << 2, // if set, constrain values stored in status bar between 0 and max
    //% block="position at end"
    PositionAtEnd = 1 << 3, // if set and bar is attached to a sprite, position on right or bottom (instead of top or left)
    //% block="invert fill direction"
    InvertFillDirection = 1 << 4, // if set, start 'on' from opposite side (top or right)
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

// TODO: option to show both target and display value, option to freeze at display value;
// allow for dark souls / fighting style game animations
// ^^ .drainColor && .freeze, needs to be exposed if wanted

// TODO: allow timing fn for transition between prev and curr value, instead of just 50ms

// TODO: angled bars?  /::::::::::/ instead of |::::::::::|

// TODO: 'rounded border' / border-radius option? just 1px or 2px

// TODO: error handling around max / etc (e.g. max sure -max is handled gracefully ish)

//% color=#38364d
//% weight=79
//% icon="\uf240"
//% blockGap=8
//% groups='["Create", "Value", "Display", "Max", "Events", "Other"]'
namespace statusbars {
    const STATUS_BAR_DATA_KEY = "STATUS_BAR_DATA_KEY";
    const MANAGED_SPRITES_KEY = STATUS_BAR_DATA_KEY + "_SPRITES";
    const ZERO_HANDLERS_KEY = STATUS_BAR_DATA_KEY + "_ON_ZERO";
    const POST_PROCESS_HANDLERS_KEY = STATUS_BAR_DATA_KEY + "_ON_DISPLAY_UPDATE";

    class StatusBar {
        // the sprite this is attached to
        sprite: Sprite;
        borderWidth: number;
        // if not set, use offColor
        borderColor: number;
        labelColor: number;

        protected flags: number;
        protected _label: string;
        protected _image: Image;
        spriteToFollow: Sprite;
        // how far away from touching the sprite to be
        followPadding: number;
        // alignment beside sprite; -5 will offset bar 5 to the left or above (depending on horizontal / vertical bar)
        followAlignment: number;

        protected font: image.Font;

        // hold state
        protected displayValue: number;
        protected target: number;

        hasHitZero: boolean;

        constructor(
            protected barWidth: number,
            protected barHeight: number,
            public onColor: number,
            public offColor: number,
            // TODO: use this; it's the 'draining from prev to curr' color
            public drainColor: number,
            protected _max: number,
            public kind: number
        ) {
            this.borderWidth = 0;
            this.borderColor = undefined;
            this.flags = StatusBarFlag.SmoothTransition | StatusBarFlag.ConstrainAssignedValue;
            this._label = undefined;
            this.labelColor = 0x1;
            this.font = image.font5;

            this.hasHitZero = false;

            this.displayValue = _max;
            this.target = _max;
            this.rebuildImage();
        }

        positionNextTo(status: Sprite, target: Sprite) {
            const positionAtEnd = !!(this.flags & StatusBarFlag.PositionAtEnd);
            const padding = this.followPadding;
            const alignment = this.followAlignment;

            if (this.isVerticalBar()) {
                status.y = target.y + alignment;
                if (positionAtEnd) {
                    status.left = target.right + padding;
                } else {
                    status.right = target.left - padding;
                }
            } else {
                status.x = target.x + alignment;
                if (positionAtEnd) {
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
            this._max = v;
            this.updateState();
        }

        get current() {
            return this.target;
        }

        set current(v: number) {
            const isDifferent = this.target != v;
            this.target = v;

            if (v <= 0 && !this.hasHitZero) {
                this.hasHitZero = true;
                const handler = (getZeroHandlers() || [])[this.kind];
                if (this.sprite && handler)
                    handler(this.sprite);
            } else if (v > 0 && this.hasHitZero) {
                // reset if this was below zero and has been refilled
                this.hasHitZero = false;
            }

            if (!(this.flags & StatusBarFlag.SmoothTransition)) {
                this.displayValue = v;
            }
            this.updateState();
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
            return this.barHeight > this.barWidth;
        }

        protected isSmoothTransition() {
            return this.flags & StatusBarFlag.SmoothTransition;
        }

        protected rebuildImage() {
            let width = this.barWidth;
            let height = this.barHeight;

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

            const change = this.max / (Math.max(this.barWidth, this.barHeight) - this.borderWidth * 2);

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

            const percent = Math.constrain(
                this.displayValue / this._max,
                0,
                1.0
            );

            const fillWidth = this.barWidth - 2 * this.borderWidth;
            const fillHeight = this.barHeight - 2 * this.borderWidth;
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
                        textY = this.barHeight + 1;
                    } else {
                        barTop += textHeight + 1;
                    }
                    if (this.barWidth > textWidth) {
                        textX = (this.barWidth - textWidth) >> 1;
                    } else if (this.barWidth < textWidth) {
                        // minus 1 due to 1px padding on right side of fonts
                        barLeft = (textWidth - this.barWidth - 1) >> 1;
                    }
                } else {
                    if (labelEnd) {
                        textX = this.barWidth + 1;
                    } else {
                        barLeft += textWidth;
                    }
                    if (this.barHeight > textHeight) {
                        textY = (this.barHeight - textHeight) >> 1;
                    } else if (this.barHeight < textHeight) {
                        barTop = (textHeight - this.barHeight) >> 1;
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
                this.barWidth,
                this.barHeight,
                borderColor
            );

            this.image.fillRect(
                barLeft + this.borderWidth,
                barTop + this.borderWidth,
                fillWidth,
                fillHeight,
                this.offColor
            );

            if (percent > 0) {
                const invertDir = (this.flags & StatusBarFlag.InvertFillDirection);
                const w = barIsVertical ? fillWidth : Math.round(fillWidth * percent);
                const h = barIsVertical ? Math.round(fillHeight * percent) : fillHeight;
                const x = barLeft + this.borderWidth + ((barIsVertical || !invertDir) ? 0 : fillWidth - w);
                const y = barTop + this.borderWidth + ((barIsVertical && !invertDir ? fillHeight - h : 0));
                this.image.fillRect(x, y, w, h, this.onColor);
            }

            const handler = (getPostProcessHandlers() || [])[this.kind];
            if (this.sprite && handler)
                handler(this.sprite, this.image);
        }
    }

    /**
     * @param width width of status bar, eg: 20
     * @param height height of status bar, eg: 4
     * @param max max value for this status, eg: 100
     */
    //% block="create status bar width $width height $height max value $max kind $kind"
    //% kind.shadow="statusbars_kind"
    //% blockId="statusbars_create"
    //% blockSetVariable="status bar"
    //% group="Create"
    //% weight=100
    export function createSprite(
        width: number,
        height: number,
        max: number,
        kind: number
    ) {
        const sb = new StatusBar(width, height, 0x7, 0x2, 0x3, max, kind);
        const output = sprites.create(sb.image, SpriteKind.StatusBar);

        sb.sprite = output;

        output.setFlag(SpriteFlag.RelativeToCamera, true);
        output.setFlag(SpriteFlag.Ghost, true);
        output.data[STATUS_BAR_DATA_KEY] = sb;
        output.z = scene.HUD_Z - 5;

        init(output);

        return output;
    }

    //% block="attach $status=variables_get(status bar) to $toFollow=variables_get(mySprite)||padding $padding alignment $alignment"
    //% blockId="statusbars_attachToSprite"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% group="Create"
    //% weight=99
    export function attachStatusBarToSprite(status: Sprite, toFollow: Sprite, padding = 0, alignment = 0) {
        applyChange(status, sb => {
            // reset this to the default value;
            // this will be changed with the follow logic to match toFollow,
            // but if this is being reassigned it should handle that gracefully
            status.setFlag(SpriteFlag.RelativeToCamera, true);
            sb.spriteToFollow = toFollow;
            sb.followPadding = padding;
            sb.followAlignment = alignment;
        });
    }

    /**
     * @param status status bar to get value of
     */
    //% block="status $status=variables_get(status bar) value"
    //% blockId="statusbars_getValue"
    //% group="Value"
    //% weight=85
    export function value(status: Sprite) {
        return applyChange(status, sb => sb.current) || 0;
    }

    /**
     * @param status status bar to set value of
     * @param value value to set status to, eg: 50
     */
    //% block="set $status=variables_get(status bar) value to $value"
    //% blockId="statusbars_setValue"
    //% group="Value"
    //% weight=84
    export function setValue(status: Sprite, value: number) {
        applyChange(status, sb => {
            sb.current = value;
        });
    }

    /**
     * @param status status bar to change value of
     * @param value value to change status by, eg: -10
     */
    //% block="change $status=variables_get(status bar) value by $value"
    //% blockId="statusbars_changeValueBy"
    //% group="Value"
    //% weight=83
    export function changeValueBy(status: Sprite, value: number) {
        applyChange(status, sb => {
            sb.current += value;
        });
    }

    /**
     * @param status status bar to apply change to
     * @param fillColor color to fill bar with, eg: 0x7
     * @param bkgdColor bar background color, eg: 0x2
     */
    //% block="set $status=variables_get(status bar) fill $fillColor background $bkgdColor"
    //% blockId="statusbars_setColor"
    //% fillColor.shadow="colorindexpicker"
    //% bkgdColor.shadow="colorindexpicker"
    //% group="Display"
    //% weight=75
    export function setColor(status: Sprite, fillColor: number, bkgdColor: number) {
        applyChange(status, sb => {
            sb.onColor = fillColor;
            sb.offColor = bkgdColor;
        });
    }

    /**
     * @param status status bar to add border to
     * @param borderWidth width of border in pixels, eg: 1
     * @param color color of border, eg: 0xd
     */
    //% block="set $status=variables_get(status bar) border width $borderWidth $color"
    //% blockId="statusbars_setBorder"
    //% color.shadow="colorindexpicker"
    //% group="Display"
    //% weight=74
    export function setBarBorder(status: Sprite, borderWidth: number, color: number) {
        applyChange(status, sb => {
            sb.borderColor = color;
            sb.borderWidth = borderWidth;
        });
    }

    /**
     * @param status status bar to add label to
     * @param label label to add to status bar, eg: HP
     * @param color color of label, eg: 0x1
     */
    //% block="set $status=variables_get(status bar) label $label||$color"
    //% blockId="statusbar_setLabel"
    //% color.shadow="colorindexpicker"
    //% group="Display"
    //% weight=73
    export function setLabel(status: Sprite, label: string, color?: number) {
        applyChange(status, sb => {
            if (color)
                sb.labelColor = color;
            sb.label = label;
        });
    }

    //% block="set $status=variables_get(status bar) $flag $on=toggleOnOff"
    //% blockId="statusbars_setFlag"
    //% group="Display"
    //% weight=72
    export function setFlag(status: Sprite, flag: StatusBarFlag, on: boolean) {
        applyChange(status, sb => {
            sb.setFlag(flag, on);
        });
    }


    /**
     * @param status status bar to get max of
     */
    //% block="status $status=variables_get(status bar) max"
    //% blockId="statusbars_getMax"
    //% group="Max"
    //% weight=65
    export function max(status: Sprite) {
        return applyChange(status, sb => sb.max) || 0;
    }

    /**
     * @param status status bar to change max of
     * @param max max value for this status, eg: 100
     */
    //% block="set $status=variables_get(status bar) max $max"
    //% blockId="statusbars_setMax"
    //% group="Max"
    //% weight=64
    export function setMax(status: Sprite, max: number) {
        applyChange(status, sb => {
            sb.max = max;
        });
    }

    /**
     * @param status status bar to change max of
     * @param value value to change max by, eg: -10
     */
    //% block="change $status=variables_get(status bar) max by $value"
    //% blockId="statusbars_changeMaxBy"
    //% group="Max"
    //% weight=63
    export function changeMaxBy(status: Sprite, value: number) {
        applyChange(status, sb => {
            sb.max += value;
        });
    }

    //% block="on status bar kind $kind zero $status"
    //% blockId="statusbars_onZero"
    //% kind.shadow="statusbars_kind"
    //% draggableParameters="reporter"
    //% group="Events"
    //% weight=60
    export function onZero(kind: number, handler: (status: Sprite) => void) {
        let zeroHandlers = getZeroHandlers();
        if (!zeroHandlers) {
            game.currentScene().data[ZERO_HANDLERS_KEY] = zeroHandlers = [];
        }
        zeroHandlers[kind] = handler;
    }

    //% block="on status bar kind $kind display updated $status $image"
    //% kind.shadow="statusbars_kind"
    //% blockId="statusbars_postprocessDisplay"
    //% draggableParameters="reporter"
    //% group="Events"
    //% weight=59
    export function onDisplayUpdated(kind: number, handler: (status: Sprite, image: Image) => void) {
        let displayUpdateHandlers = getPostProcessHandlers();
        if (!displayUpdateHandlers) {
            game.currentScene().data[POST_PROCESS_HANDLERS_KEY] = displayUpdateHandlers = [];
        }
        displayUpdateHandlers[kind] = handler;
    }

    //% block="array of status bars of $kind"
    //% kind.shadow="statusbars_kind"
    //% blockId="statusbars_arrayOfKind"
    //% blockSetVariable="status bar list"
    export function allOfKind(kind: number): Sprite[] {
        const managedSprites = getManagedSprites();
        if (!managedSprites)
            return [];
        return managedSprites.filter(status => {
            const sb = getStatusBar(status);
            return sb && sb.kind === kind;
        });
    }

    //% block="sprite that $status=variables_get(status bar) is attached to"
    //% blockId="statusbars_attachSpriteGetter"
    //% group="Other"
    //% weight=49
    export function statusBarAttachedTo(status: Sprite) {
        return applyChange(status, sb => sb.spriteToFollow)
    }

    function init(s: Sprite) {
        let managedSprites = getManagedSprites();
        if (!managedSprites) {
            game.currentScene().data[MANAGED_SPRITES_KEY] = managedSprites = [] as Sprite[];
            game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY + 5, () => {
                const managed = getManagedSprites();
                for (let i = managed.length - 1; i >= 0; --i) {
                    const spr = managed[i];
                    const sb = getStatusBar(spr);
                    if (spr.flags & sprites.Flag.Destroyed) {
                        // give the garbage collector a helping hand
                        sb.sprite = undefined;
                        managed.removeAt(i);
                        continue;
                    }
                    if (sb) {
                        sb.updateState();

                        const { spriteToFollow } = sb;
                        if (spriteToFollow) {
                            const toFollowIsRelativeToCamera = !!(spriteToFollow.flags & SpriteFlag.RelativeToCamera);
                            if (!!(spr.flags & SpriteFlag.RelativeToCamera) != toFollowIsRelativeToCamera) {
                                spr.setFlag(SpriteFlag.RelativeToCamera, toFollowIsRelativeToCamera);
                            }

                            sb.positionNextTo(spr, spriteToFollow);
                        }
                    }
                }
            });
        }
        
       managedSprites.push(s);
    }

    // passes back any return from action for getters / etc
    function applyChange<T>(status: Sprite, action: (sb: StatusBar) => T): T {
        const sb = getStatusBar(status);

        if (sb) {
            const output = action(sb);
            sb.updateDisplay();
            status.setImage(sb.image);
            return output;
        }

        return undefined;
    }

    function getStatusBar(status: Sprite) {
        return status.data[STATUS_BAR_DATA_KEY] as StatusBar;
    }

    function getSceneData(key: string) {
        return game.currentScene().data[key];
    }

    function getManagedSprites() {
        return getSceneData(MANAGED_SPRITES_KEY) as Sprite[];
    }

    function getZeroHandlers() {
        return getSceneData(ZERO_HANDLERS_KEY) as ((status: Sprite) => void)[];
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
