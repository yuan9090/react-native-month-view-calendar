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
var calendarHeader_1 = __importDefault(require("./components/calendarHeader"));
var calendarRow_1 = __importDefault(require("./components/calendarRow"));
var calendarDay_1 = __importDefault(require("./components/calendarDay"));
var weekDaysLengthError_1 = __importDefault(require("./errors/weekDaysLengthError"));
var utils_1 = require("./utils");
var MonthViewCalendar = /** @class */ (function (_super) {
    __extends(MonthViewCalendar, _super);
    function MonthViewCalendar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            currentDate: null,
            datesList: [],
        };
        /**
         * Calculate initial array of dates
         */
        _this.calculateInitialDates = function (date) {
            var initialDates = [];
            for (var i = -_this.pageOffset; i <= _this.pageOffset; i += 1) {
                var centralDate = new Date(date);
                centralDate.setMonth(centralDate.getMonth() + i);
                initialDates.push(centralDate);
            }
            _this.state.datesList = initialDates;
        };
        /**
         * Add new dates to dateList by referencing
         */
        _this.appendPagesInPlace = function (datesList, nPages) {
            var latest = datesList[datesList.length - 1];
            for (var i = 1; i <= nPages; i += 1) {
                var newDate = new Date(latest);
                newDate.setMonth(newDate.getMonth() + i);
                datesList.push(newDate);
            }
        };
        /**
         * Prepend new dates to dateList by referencing
         */
        _this.prependPagesInPlace = function (datesList, nPages) {
            var first = datesList[0];
            for (var i = 1; i <= nPages; i += 1) {
                var newDate = new Date(first);
                newDate.setMonth(newDate.getMonth() - i);
                datesList.unshift(newDate);
            }
        };
        /**
         * Return date object of the month that is being shown
         */
        _this.getCurrentDate = function () {
            return _this.state.datesList[_this.currentPageIndex];
        };
        /**
         * Change month that is being shown
         */
        _this.goToDate = function (date, animated) {
            if (animated === void 0) { animated = true; }
            if (!_this.monthVirtualList) {
                return;
            }
            var currentDate = _this.state.datesList[_this.currentPageIndex];
            if (currentDate.getMonth() == date.getMonth()
                && currentDate.getFullYear() == date.getFullYear()) {
                return;
            }
            var index = _this.state.datesList.findIndex(function (item) {
                return item.getMonth() == date.getMonth()
                    && item.getFullYear() == date.getFullYear();
            });
            _this.scrollTo(index, animated);
        };
        /**
         * Move scroll of virtualized list of months to specific index
         */
        _this.scrollTo = function (index, animated) {
            if (animated === void 0) { animated = true; }
            if (_this.monthVirtualList) {
                _this.monthVirtualList.scrollToIndex({
                    index: index,
                    animated: animated,
                });
                _this.currentPageIndex = index;
            }
        };
        _this.scrollBegin = function (event) {
            var contentOffset = event.nativeEvent.contentOffset;
            var position = contentOffset.x;
            var _a = _this.props, date = _a.date, onSwipe = _a.onSwipe, onSwipePrev = _a.onSwipePrev, onSwipeNext = _a.onSwipeNext;
            var newIndex = position > 50 ? 1 : position < -50 ? -1 : 0;
            var newDate = new Date(date.setMonth(date.getMonth() + newIndex));
            newIndex !== 0 && onSwipe && onSwipe(newDate);
            if (newIndex > 0) {
                onSwipeNext && onSwipeNext(newDate);
            }
            else if (newIndex < 0) {
                onSwipePrev && onSwipePrev(newDate);
            }
        };
        _this.setRefOfMonthVirtualList = function (ref) {
            _this.monthVirtualList = ref;
        };
        _this.now = new Date();
        _this.CONTAINER_HEIGHT = 0;
        _this.HEADER_HEIGHT = 50;
        _this.pageOffset = 0;
        _this.currentPageIndex = _this.pageOffset;
        _this.eventsGridScrollX = new react_native_1.Animated.Value(0);
        if (props.weekDays.length != 7) {
            throw new weekDaysLengthError_1.default(props.weekDays.length.toString());
        }
        _this.state.currentDate = props.date;
        _this.calculateInitialDates(_this.props.date);
        return _this;
    }
    MonthViewCalendar.prototype.renderWeekCalendar = function (date) {
        var _this = this;
        var days = (0, utils_1.getDaysOfCalendarMonth)(date);
        return days.map(function (week, i) { return (react_1.default.createElement(calendarRow_1.default, { key: "week-".concat(i) }, week.map(function (day, j) {
            day.setHours(23, 59, 59);
            var isSameMonth = day.getMonth() == date.getMonth() && day.getFullYear() == date.getFullYear();
            var isToday = day.getDate() === new Date().getDate();
            var eventsOfDay = (0, utils_1.findEventsForTheDay)(day, _this.props.events);
            var getViewStyle = typeof _this.props.cellStyles === 'function' ? _this.props.cellStyles : function () { return _this.props.cellStyles; };
            var viewStyles = [
                getViewStyle(day),
                { height: ((_this.CONTAINER_HEIGHT - _this.HEADER_HEIGHT) / days.length) },
                (_this.now > day ? _this.props.pastMonthsCellStyles : {})
            ];
            var textStyles;
            var getTextStyle = typeof _this.props.dayTextStyles === 'function' ? _this.props.dayTextStyles : function () { return _this.props.dayTextStyles; };
            if (isSameMonth) {
                textStyles = getTextStyle(day);
                if (isToday && _this.props.todayTextStyles) {
                    textStyles = _this.props.todayTextStyles;
                }
            }
            else {
                textStyles = _this.props.otherMonthsDayTextStyles;
            }
            return (react_1.default.createElement(calendarDay_1.default, { key: j, index: j, date: day, events: eventsOfDay, renderEvent: _this.props.renderEvent, textStyles: textStyles, viewStyles: viewStyles, onPressEnabled: isSameMonth || !!_this.props.otherMonthsEnabled, onPress: _this.props.onPress }));
        }))); });
    };
    MonthViewCalendar.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.date !== prevProps.date) {
            this.calculateInitialDates(this.props.date);
        }
    };
    MonthViewCalendar.prototype.render = function () {
        var _this = this;
        var _a = this.props, weekDays = _a.weekDays, headerTextStyles = _a.headerTextStyles;
        return (react_1.default.createElement(react_native_1.View, { style: styles.calendarContainer, onLayout: function (event) { _this.CONTAINER_HEIGHT = event.nativeEvent.layout.height; } },
            react_1.default.createElement(react_native_1.VirtualizedList, { ref: this.setRefOfMonthVirtualList, keyExtractor: function (item) { return item; }, data: this.state.datesList, getItemCount: function (data) { return data.length; }, getItem: function (data, index) { return data[index]; }, initialScrollIndex: this.pageOffset, horizontal: true, renderItem: function (_a) {
                    var item = _a.item;
                    return (react_1.default.createElement(react_native_1.View, { style: { width: utils_1.CONTAINER_WIDTH, height: _this.HEADER_HEIGHT } },
                        react_1.default.createElement(calendarHeader_1.default, { weekDays: weekDays, textStyles: headerTextStyles }),
                        _this.renderWeekCalendar(item)));
                }, pagingEnabled: true, onMomentumScrollBegin: this.scrollBegin, scrollEventThrottle: 32, onScroll: react_native_1.Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                x: this.eventsGridScrollX,
                            },
                        },
                    },
                ], { useNativeDriver: false }), onScrollToIndexFailed: this.props.onScrollToIndexFailed, showsHorizontalScrollIndicator: false })));
    };
    return MonthViewCalendar;
}(react_1.default.Component));
MonthViewCalendar.defaultProps = {
    date: new Date(),
    weekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    headerTextStyles: {},
    dayTextStyles: {},
    otherMonthsDayTextStyles: {},
    pastMonthsCellStyles: {},
    cellStyles: {},
};
var styles = react_native_1.StyleSheet.create({
    calendarContainer: {
        flex: 1,
        minHeight: 300,
        width: '100%',
    },
});
exports.default = MonthViewCalendar;
//# sourceMappingURL=index.js.map