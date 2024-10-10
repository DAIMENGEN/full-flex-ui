import {PresetsItem} from "antd/es/color-picker/interface";

export type ColorPalette = PresetsItem;

export class ColorPaletteFactory {

    static luxuryColors(): ColorPalette {
        return {
            label: 'Luxury Colors',
            colors: [
                "#103240", "#196273", "#f2f1df", "#bf9b6f", "#d97f30",
                "#1d1e26", "#568c8c", "#d9c6b0", "#d99b84", "#a65656",
            ],
            defaultOpen: false
        }
    }

    static neutralColors(): ColorPalette {
        return {
            label: 'Neutral Colors',
            colors: [
                "#8fadbf", "#202612", "#f2b279", "#8c5332", "#40291c",
                "#364c59", "#54734c", "#f2cea2", "#a65526", "#8c6a56"
            ],
            defaultOpen: false
        }
    }

    static primaryColors(): ColorPalette {
        return {
            label: 'Primary Colors',
            colors: [
                "#1570bf", "#abd94a", "#f2b90f", "#d97904", "#f23827",
                "#682abf", "#1f54bf", "#68bf3f", "#d9a407", "#d94814"
            ],
            defaultOpen: false
        }
    }

    static summerColors(): ColorPalette {
        return {
            label: 'Summer Colors',
            colors: [
                "#956fa6", "#babf1b", "#d9cb84", "#f2b90c", "#d9910d",
                "#8bbbd9", "#f2e205", "#8c6e37", "#d9d0c7", "#d94f30"
            ],
            defaultOpen: false
        }
    }

    static happyColors(): ColorPalette {
        return {
            label: 'Happy Colors',
            colors: [
                "#d7d7d9", "#868c56", "#262622", "#d9663d", "#bf7d65",
                "#6fa0a6", "#f2ecd8", "#f27405", "#d99f6c", "#732002"
            ],
            defaultOpen: false
        }
    }
}