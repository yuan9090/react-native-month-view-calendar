"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var CalendarDay = /** @class */ (function (_super) {
    __extends(CalendarDay, _super);
    function CalendarDay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CalendarDay.prototype.render = function () {
        var _a = this.props, index = _a.index, date = _a.date, renderEvent = _a.renderEvent, events = _a.events, textStyles = _a.textStyles, onPress = _a.onPress, onPressEnabled = _a.onPressEnabled;
        var cellStyles = [styles.cell];
        if (index === 0) {
            cellStyles.push(styles.leftBorder);
        }
        if (Array.isArray(this.props.viewStyles)) {
            cellStyles.push.apply(cellStyles, this.props.viewStyles);
        }
        else {
            cellStyles.push(this.props.viewStyles);
        }
        return (react_1.default.createElement(react_native_1.View, { key: date.getTime(), style: cellStyles },
            react_1.default.createElement(react_native_1.TouchableOpacity, { disabled: !onPressEnabled, style: styles.touchableOpacity, onPress: function () { return onPress && onPress(date); } },
                react_1.default.createElement(react_native_1.View, { style: [styles.text, textStyles] },
                    react_1.default.createElement(react_native_1.Text, { style: textStyles }, date.getDate())),
                events.map(renderEvent))));
    };
    return CalendarDay;
}(react_1.default.Component));
CalendarDay.defaultProps = {
    textStyles: {},
    viewStyles: {},
};
var styles = react_native_1.StyleSheet.create({
    cell: {
        width: '14.2857142857%',
        borderColor: '#CCCCCC',
        borderRightWidth: 1,
        minHeight: 65,
        paddingTop: 3,
        paddingHorizontal: 1.5,
    },
    leftBorder: {
        borderLeftWidth: 1,
    },
    text: {
        height: 22,
        width: 22,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableOpacity: {
        height: '100%',
        minHeight: 65
    }
});
exports.default = CalendarDay;
//# sourceMappingURL=calendarDay.js.map