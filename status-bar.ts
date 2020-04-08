enum StatusBarFlag {
    //% blockHidden=true
    None = 0,
    // if set, update bar over time; otherwise update bar immediately
    //% block="smooth transition"
    SmoothTransition = 1 << 0,
    // if set, and label exists, draw label at bottom or right side
    //% block="label at end"
    LabelAtEnd = 1 << 1,
    // if set, constrain values stored in status bar between 0 and max
    //% block="constrain value"
    ConstrainAssignedValue = 1 << 2,
    // if set, start 'on' from opposite side (top or right)
    //% block="invert fill direction"
    InvertFillDirection = 1 << 3,
    // if set, do not immediately show target when transitioning
    //% block="hide transition preview"
    HideTargetPreview = 1 << 4,
    // if set, do not destroy this status bar when sprite it is attached to is destroyed
    //% block="no autodestroy on attached destroy"
    NoAutoDestroy = 1 << 5,
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
    get max(): number {
        return this.applyChange(sb => sb.max) || 0;
    }

    set max(v: number) {
        this.applyChange(sb => {
            sb.max = v;
        });
    }

    //% block="attach $this(statusbar) to $toFollow=variables_get(mySprite)||padding $padding offset $offset"
    //% blockId="statusbars_attachToSprite"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode="inline"
    //% group="Attach"
    //% weight=85
    attachToSprite(toFollow: Sprite, padding = 0, offset = 0) {
        this.applyChange(sb => {
            // reset this to the default value;
            // this will be changed with the follow logic to match toFollow,
            // but if this is being reassigned it should handle that gracefully
            this.setFlag(SpriteFlag.RelativeToCamera, true);
            sb.spriteToFollow = toFollow;
            sb.followPadding = padding;
            sb.followOffset = offset;
        });
    }

    //% block="sprite that $this(statusbar) is attached to"
    //% blockId="statusbars_attachSpriteGetter"
    //% group="Attach"
    //% weight=83
    spriteAttachedTo() {
        return this.applyChange(sb => sb.spriteToFollow);
    }

    /**
     * @param status status bar to apply change to
     * @param fillColor color to fill bar with, eg: 0x7
     * @param bkgdColor bar background color, eg: 0x2
     * @param drainColor color to show while value is being changed; eg: 0x3
     */
    //% block="set $this(statusbar) fill $fillColor background $bkgdColor||drain color $drainColor"
    //% blockId="statusbars_setColor"
    //% fillColor.shadow="colorindexpicker"
    //% bkgdColor.shadow="colorindexpicker"
    //% drainColor.shadow="colorindexpicker"
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
     * @param color color of border, eg: 0xd
     */
    //% block="set $this(statusbar) border width $borderWidth $color"
    //% blockId="statusbars_setBorder"
    //% color.shadow="colorindexpicker"
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
     * @param color color of label, eg: 0x1
     */
    //% block="set $this(statusbar) label $label||$color"
    //% blockId="statusbar_setLabel"
    //% color.shadow="colorindexpicker"
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
    //% blockId="statusbars_setFlag"
    //% group="Display"
    //% weight=72
    setStatusBarFlag(flag: StatusBarFlag, on: boolean) {
        this.applyChange(sb => {
            sb.setFlag(flag, on);
        });
    }

    //% block="set $this(statusbar) position to $dir"
    //% blockId="statusbars_positionNextToSprite"
    //% group="Display"
    //% weight=71
    positionDirection(status: StatusBarSprite, dir: CollisionDirection) {
        this.applyChange(sb => {
            sb.explicitlySetDirection = dir;
            if (!sb.spriteToFollow) {
                
            }
        });
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
            const padding = this.followPadding;
            const alignment = this.followOffset;
            const position = this.explicitlySetDirection != null ?
                    this.explicitlySetDirection
                    : (this.isVerticalBar() ? CollisionDirection.Left : CollisionDirection.Top);

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

    /**
     * @param width width of status bar, eg: 20
     * @param height height of status bar, eg: 4
     */
    //% block="create status bar sprite width $width height $height kind $kind"
    //% kind.shadow="statusbars_kind"
    //% blockId="statusbars_create"
    //% blockSetVariable="statusbar"
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

        return output;
    }

    //% block="status bar attached to $sprite=variables_get(mySprite)"
    //% blockId="statusbars_spriteStatusBarIsAttachedTo"
    //% group="Attach"
    //% weight=84
    export function getStatusBarAttachedTo(sprite: Sprite) {
        const managedSprites = getManagedSprites();
        if (!managedSprites || !sprite)
            return undefined;
        return managedSprites.find(s => applyChange(s, sb => sb.spriteToFollow === sprite));
    }

    //% block="on status bar kind $kind zero $status"
    //% blockId="statusbars_onZero"
    //% kind.shadow="statusbars_kind"
    //% draggableParameters="reporter"
    //% group="Events"
    //% weight=60
    export function onZero(kind: number, handler: (status: StatusBarSprite) => void) {
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
    export function onDisplayUpdated(kind: number, handler: (status: StatusBarSprite, image: Image) => void) {
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
    //% group="Other"
    //% weight=45
    export function allOfKind(kind: number): Sprite[] {
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
                            if (spriteToFollow.flags & sprites.Flag.Destroyed
                                    && !(sb.flags & StatusBarFlag.NoAutoDestroy)) {
                                spr.destroy();
                            }
                            const toFollowIsRelativeToCamera = !!(spriteToFollow.flags & SpriteFlag.RelativeToCamera);
                            if (!!(spr.flags & SpriteFlag.RelativeToCamera) != toFollowIsRelativeToCamera) {
                                spr.setFlag(SpriteFlag.RelativeToCamera, toFollowIsRelativeToCamera);
                            }

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

    function getPostProcessHandlers() {
        return getSceneData(POST_PROCESS_HANDLERS_KEY) as ((status: Sprite, image: Image) => void)[];
    }

    namespace util {
        export function isNullOrUndefined(v: any): v is null | undefined {
            return v === undefined || v === null;
        }
    }
}
