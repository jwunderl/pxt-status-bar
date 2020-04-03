enum StatusBarFlag {
    None = 0,
    SmoothTransition = 1 << 0,
    VerticalBar = 1 << 1,
}

namespace ui.statusbar {
    const STATUS_BAR_DATA_FIELD = "STATUS_BAR_DATA_FIELD";
    
    class StatusBar {
        flags: StatusBarFlag;
        borderWidth: number;
        // if not set, use offColor
        borderColor: number;
        header: string;
        image: Image;

        constructor(
            public barWidth: number,
            public barHeight: number,
            public onColor: number,
            public offColor: number,
        ) {
            this.image = image.create(barWidth, barHeight);
            this.borderWidth = 0;
            this.borderColor = undefined;
            this.flags = StatusBarFlag.SmoothTransition;
        }

        // percent between 0 and 1.0
        update(percent: number) {
            percent = Math.constrain(percent, 0, 1.0);
            const fillWidth = this.barWidth - 2 * this.borderWidth;
            const fillHeight = this.barHeight - 2 * this.borderWidth;
            const barIsVertical = this.flags & StatusBarFlag.VerticalBar;

            this.image.fillRect(
                0,
                0,
                this.barWidth,
                this.barHeight,
                util.isNullOrUndefined(this.borderColor) ?
                    this.offColor : this.borderColor
            );

            this.image.fillRect(
                this.borderWidth,
                this.borderWidth,
                fillWidth,
                fillHeight,
                this.offColor
            );

            if (percent > 0) {
                this.image.fillRect(
                    this.borderWidth,
                    this.borderWidth,
                    barIsVertical ? fillWidth: (fillWidth * percent) | 0,
                    barIsVertical ? (fillHeight * percent) | 0 : fillHeight,
                    this.onColor
                );
            }
        }
    }

    export function createSprite(
        width: number,
        height: number,
        onColor: number,
        offColor: number
    ) {
        const sb = new StatusBar(width, height, onColor, offColor);
        const output = sprites.create(sb.image, -1);
        output.setFlag(SpriteFlag.RelativeToCamera, true);
        output.setFlag(SpriteFlag.Ghost, true);
        output.data[STATUS_BAR_DATA_FIELD] = sb;
    }

    function getStatusBar(sprite: Sprite) {
        return sprite.data[STATUS_BAR_DATA_FIELD];
    }

    namespace util {
        export function isNullOrUndefined(v: any): v is null | undefined {
            return v === undefined || v === null;
        }
    }
}