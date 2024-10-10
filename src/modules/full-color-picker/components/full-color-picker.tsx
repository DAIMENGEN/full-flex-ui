import React, {useMemo} from "react";
import {ColorPaletteFactory} from "../models/color-palette-factory";
import {Col, ColorPicker, ColorPickerProps, Divider, Row} from "antd";

export const FullColorPicker: React.FC<ColorPickerProps> = (props) => {
    const defaultColorPresets = useMemo(() => {
        const happyColors = ColorPaletteFactory.happyColors();
        const luxuryColors = ColorPaletteFactory.luxuryColors();
        const summerColors = ColorPaletteFactory.summerColors();
        const primaryColors = ColorPaletteFactory.primaryColors();
        const neutralColors = ColorPaletteFactory.neutralColors();
        return [primaryColors, luxuryColors, neutralColors, summerColors, happyColors];
    }, []);
    return (
        <ColorPicker defaultValue={"#91003c"}
                     presets={defaultColorPresets}
                     styles={{popupOverlayInner: {width: 480}}}
                     panelRender={(_, {components: {Picker, Presets}}) => (
                         <Row justify={`space-between`} wrap={false}>
                             <Col span={12}>
                                 <Presets/>
                             </Col>
                             <Divider type="vertical" style={{height: "auto"}}/>
                             <Col flex="auto">
                                 <Picker/>
                             </Col>
                         </Row>
                     )}
                     {...props}/>
    )
}