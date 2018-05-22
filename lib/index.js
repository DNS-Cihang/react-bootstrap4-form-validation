'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValidationForm = exports.Checkbox = exports.SelectGroup = exports.FileInput = exports.RadioGroup = exports.TextInputGroup = exports.TextInput = exports.BaseFormControl = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function parseFileSize(size) {
    var num = parseFloat(size, 10);
    var unit = size.match(/[a-zA-Z]+/)[0];
    unit = unit.toLowerCase();
    switch (unit) {
        case "b":
            return num;
        case "kb":
            return 1024 * num;
        case "mb":
            return 1024 * 1024 * num;
        case "gb":
            return 1024 * 1024 * 1024 * num;
        default:
            throw new Error("Unknown unit " + unit);
    }
}

var BaseFormControl = exports.BaseFormControl = function (_React$Component) {
    _inherits(BaseFormControl, _React$Component);

    function BaseFormControl(props) {
        _classCallCheck(this, BaseFormControl);

        var _this = _possibleConstructorReturn(this, (BaseFormControl.__proto__ || Object.getPrototypeOf(BaseFormControl)).call(this, props));

        _this.setError = function (errorMessage) {
            _this.getInputRef().setCustomValidity(errorMessage);
            _this.setState({ errorMessage: errorMessage });
        };

        _this.clearError = function () {
            return _this.setError("");
        };

        _this.checkError = function (e) {
            var isPristine = _this.state.isPristine;
            if (isPristine) _this.setDirty();
            _this.buildErrorMessage();
            _this.changeInputErrorClass();
        };

        _this.handleBlur = function (e) {
            if (_this.props.immediate) return;
            _this.checkError();
        };

        _this.handleChange = function (e) {
            if (_this.props.onChange) _this.props.onChange(e);
            if (!_this.props.immediate) return;
            _this.checkError();
        };

        _this.validateInput = function () {
            _this.setDirty();
            _this.buildErrorMessage();
        };

        _this.setDirty = function () {
            _this.setState({ isPristine: false });
        };

        _this.filterProps = function () {
            var _this$props = _this.props,
                errorMessage = _this$props.errorMessage,
                attachToForm = _this$props.attachToForm,
                detachFromForm = _this$props.detachFromForm,
                setFormDirty = _this$props.setFormDirty,
                label = _this$props.label,
                immediate = _this$props.immediate,
                inline = _this$props.inline,
                multiline = _this$props.multiline,
                buttonBody = _this$props.buttonBody,
                onButtonClick = _this$props.onButtonClick,
                rest = _objectWithoutProperties(_this$props, ['errorMessage', 'attachToForm', 'detachFromForm', 'setFormDirty', 'label', 'immediate', 'inline', 'multiline', 'buttonBody', 'onButtonClick']);

            return rest;
        };

        _this.state = {
            isPristine: true,
            errorMessage: ""
        };
        if (!_react2.default.createRef) _this.inputRef = _react2.default.createRef();else _this.inputRef = function (element) {
            //Before React 16.3
            _this.inputRefLegacy = element;
        };
        return _this;
    }

    _createClass(BaseFormControl, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.attachToForm(this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.detachFromForm(this);
        }
    }, {
        key: 'getInputRef',
        value: function getInputRef() {
            return this.inputRefLegacy || this.inputRef.current;
        }
    }, {
        key: 'buildErrorMessage',
        value: function buildErrorMessage() {
            var defaultErrorMessage = {
                required: "This field is required",
                pattern: "Input value does not match the pattern",
                type: "Input value does not match the type",
                minLength: "Please enter at least {minLength} characters",
                min: "Number is too low",
                max: "Number is too high"
            };

            var map = {
                valueMissing: "required",
                customError: "",
                patternMismatch: "pattern",
                rangeUnderflow: "min",
                rangeOverflow: "max",
                typeMismatch: "type"
            };

            var errorMessage = this.props.errorMessage;
            //If string was passed to errorMessage, default to required error Message

            if (typeof errorMessage === "string") errorMessage = { required: errorMessage };
            errorMessage = Object.assign({}, defaultErrorMessage, errorMessage);

            var input = this.getInputRef();
            if (input) {
                var validityState = input.validity;
                var newErrorMessage = "";
                var hasHTML5Error = false;
                for (var prop in validityState) {
                    if (validityState[prop]) {
                        if ((prop === "rangeUnderflow" || prop === "rangeOverflow") && errorMessage["range"]) {
                            newErrorMessage = errorMessage["range"];
                        } else {
                            if (prop === "customError") newErrorMessage = input.validationMessage;else newErrorMessage = errorMessage[map[prop]];
                        }
                        break;
                    }
                }

                if (this.props.minLength) {
                    if (input.value.length < +this.props.minLength) {
                        input.setCustomValidity(errorMessage["minLength"]);
                        newErrorMessage = errorMessage["minLength"].replace("{minLength}", this.props.minLength);
                    } else {
                        input.setCustomValidity("");
                        newErrorMessage = "";
                    }
                }

                this.setState({ errorMessage: newErrorMessage });
            }
        }
    }, {
        key: 'getErrorMessage',
        value: function getErrorMessage(errorMessage) {
            return _react2.default.createElement(
                'span',
                { className: 'invalid-feedback' },
                errorMessage
            );
        }
    }, {
        key: 'displayErrorMessage',
        value: function displayErrorMessage() {
            return this.getErrorMessage(this.state.errorMessage);
        }
    }, {
        key: 'changeInputErrorClass',
        value: function changeInputErrorClass() {
            var inputRef = this.getInputRef();
            if (inputRef.type !== "radio") {
                if (!inputRef.validity.valid) {
                    inputRef.classList.add("is-invalid");
                    inputRef.classList.remove("is-valid");
                } else {
                    inputRef.classList.remove("is-invalid");
                    inputRef.classList.add("is-valid");
                }
            }
        }

        //Filter out non-DOM attribute

    }]);

    return BaseFormControl;
}(_react2.default.Component);

BaseFormControl.propTypes = {
    name: _propTypes2.default.string.isRequired,
    errorMessage: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string])
};

var TextInput = exports.TextInput = function (_BaseFormControl) {
    _inherits(TextInput, _BaseFormControl);

    function TextInput() {
        _classCallCheck(this, TextInput);

        return _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).apply(this, arguments));
    }

    _createClass(TextInput, [{
        key: 'render',
        value: function render() {
            var domProps = this.filterProps();
            var multiline = this.props.multiline;

            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                multiline ? _react2.default.createElement('textarea', _extends({ className: this.props.className }, domProps, { ref: this.inputRef, onChange: this.handleChange, onBlur: this.handleBlur })) : _react2.default.createElement('input', _extends({ className: this.props.className }, domProps, { ref: this.inputRef, onChange: this.handleChange, onBlur: this.handleBlur })),
                this.displayErrorMessage()
            );
        }
    }]);

    return TextInput;
}(BaseFormControl);

TextInput.defaultProps = _extends({}, BaseFormControl.defaultProps, {
    className: "form-control",
    multiline: false
});

var TextInputGroup = exports.TextInputGroup = function (_BaseFormControl2) {
    _inherits(TextInputGroup, _BaseFormControl2);

    function TextInputGroup() {
        _classCallCheck(this, TextInputGroup);

        return _possibleConstructorReturn(this, (TextInputGroup.__proto__ || Object.getPrototypeOf(TextInputGroup)).apply(this, arguments));
    }

    _createClass(TextInputGroup, [{
        key: 'render',
        value: function render() {
            var domProps = this.filterProps();
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'input-group' },
                    _react2.default.createElement('input', _extends({}, domProps, { ref: this.inputRef, onChange: this.handleChange, onBlur: this.handleBlur })),
                    _react2.default.createElement(
                        'div',
                        { className: 'input-group-append' },
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-outline-secondary', type: 'button' },
                            ' ',
                            this.props.buttonBody
                        )
                    )
                ),
                this.state.errorMessage && _react2.default.createElement(
                    'span',
                    { className: 'invalid-feedback d-block' },
                    this.state.errorMessage
                )
            );
        }
    }]);

    return TextInputGroup;
}(BaseFormControl);

TextInputGroup.defaultProps = {
    buttonBody: null
};

var RadioGroup = exports.RadioGroup = function (_BaseFormControl3) {
    _inherits(RadioGroup, _BaseFormControl3);

    function RadioGroup() {
        _classCallCheck(this, RadioGroup);

        return _possibleConstructorReturn(this, (RadioGroup.__proto__ || Object.getPrototypeOf(RadioGroup)).apply(this, arguments));
    }

    _createClass(RadioGroup, [{
        key: 'render',
        value: function render() {
            var _this5 = this;

            var _props = this.props,
                labels = _props.labels,
                ids = _props.ids,
                values = _props.values,
                name = _props.name,
                inline = _props.inline,
                required = _props.required,
                defaultValue = _props.defaultValue,
                disabled = _props.disabled;

            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                labels.map(function (label, i) {
                    return _react2.default.createElement(
                        'div',
                        { className: 'form-check ' + (inline ? "form-check-inline" : ""), key: i },
                        _react2.default.createElement('input', { className: 'form-check-input', type: 'radio',
                            name: name, id: ids[i], value: values[i], required: required, disabled: disabled,
                            onChange: _this5.handleChange,
                            defaultChecked: values[i] === defaultValue,
                            ref: _this5.inputRef }),
                        _react2.default.createElement(
                            'label',
                            { className: 'form-check-label', htmlFor: ids[i] },
                            label
                        )
                    );
                }),
                this.state.errorMessage && _react2.default.createElement(
                    'span',
                    { className: 'invalid-feedback d-block' },
                    this.state.errorMessage
                )
            );
        }
    }]);

    return RadioGroup;
}(BaseFormControl);

RadioGroup.defaultProps = {
    labels: [],
    ids: [],
    values: [],
    inline: true,
    defaultValue: ""
};
RadioGroup.propTypes = {
    labels: _propTypes2.default.array.isRequired,
    ids: _propTypes2.default.array.isRequired,
    values: _propTypes2.default.array.isRequired,
    inline: _propTypes2.default.bool,
    defaultValue: _propTypes2.default.string
};

var FileInput = exports.FileInput = function (_BaseFormControl4) {
    _inherits(FileInput, _BaseFormControl4);

    function FileInput() {
        var _ref;

        var _temp, _this6, _ret;

        _classCallCheck(this, FileInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this6 = _possibleConstructorReturn(this, (_ref = FileInput.__proto__ || Object.getPrototypeOf(FileInput)).call.apply(_ref, [this].concat(args))), _this6), _this6.customfilterProps = function () {
            var props = _this6.filterProps();

            var maxFileSize = props.maxFileSize,
                fileType = props.fileType,
                rest = _objectWithoutProperties(props, ['maxFileSize', 'fileType']);

            return rest;
        }, _this6.handleChange = function () {
            var _this6$props = _this6.props,
                maxFileSize = _this6$props.maxFileSize,
                fileType = _this6$props.fileType,
                errorMessage = _this6$props.errorMessage;

            var inputRef = _this6.getInputRef();
            var file = inputRef.files[0];
            if (!file) return;
            var limit = maxFileSize ? parseFileSize(maxFileSize) : null;
            var newErrorMessage = "";
            var fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase().trim();
            if (fileType.length > 0 && !fileType.includes(fileExtension)) {
                newErrorMessage = errorMessage["fileType"] || 'File type mismatch';
            } else if (limit && file.size > limit) {
                newErrorMessage = errorMessage["size"] || 'File size exeed limit ' + maxFileSize;
            } else {
                newErrorMessage = "";
            }
            inputRef.setCustomValidity(newErrorMessage);
            _this6.checkError();
        }, _temp), _possibleConstructorReturn(_this6, _ret);
    }
    // Check file mime type here https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types


    _createClass(FileInput, [{
        key: 'render',
        value: function render() {
            var domProps = this.customfilterProps();
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement('input', _extends({}, domProps, { ref: this.inputRef, type: 'file', onChange: this.handleChange })),
                this.displayErrorMessage()
            );
        }
    }]);

    return FileInput;
}(BaseFormControl);

FileInput.propTypes = {
    fileType: _propTypes2.default.array,
    maxFileSize: _propTypes2.default.string };

var SelectGroup = exports.SelectGroup = function (_BaseFormControl5) {
    _inherits(SelectGroup, _BaseFormControl5);

    function SelectGroup() {
        _classCallCheck(this, SelectGroup);

        return _possibleConstructorReturn(this, (SelectGroup.__proto__ || Object.getPrototypeOf(SelectGroup)).apply(this, arguments));
    }

    _createClass(SelectGroup, [{
        key: 'render',
        value: function render() {
            var domProps = this.filterProps();
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    'select',
                    _extends({}, domProps, { ref: this.inputRef, onChange: this.handleChange, onBlur: this.handleBlur }),
                    this.props.children
                ),
                this.displayErrorMessage()
            );
        }
    }]);

    return SelectGroup;
}(BaseFormControl);

var Checkbox = exports.Checkbox = function (_BaseFormControl6) {
    _inherits(Checkbox, _BaseFormControl6);

    function Checkbox() {
        _classCallCheck(this, Checkbox);

        return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
    }

    _createClass(Checkbox, [{
        key: 'render',
        value: function render() {
            var domProps = this.filterProps();
            var label = this.props.label;

            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement('input', _extends({ type: 'checkbox' }, domProps, { ref: this.inputRef, onChange: this.handleChange })),
                _react2.default.createElement(
                    'label',
                    { className: 'form-check-label', htmlFor: domProps.id },
                    this.props.label
                ),
                this.displayErrorMessage()
            );
        }
    }]);

    return Checkbox;
}(BaseFormControl);

Checkbox.defaultProps = _extends({}, BaseFormControl.defaultProps, {
    label: ""
});
Checkbox.propTypes = {
    label: _propTypes2.default.string.isRequired
};

var ValidationForm = exports.ValidationForm = function (_React$Component2) {
    _inherits(ValidationForm, _React$Component2);

    function ValidationForm() {
        var _ref2;

        var _temp2, _this9, _ret2;

        _classCallCheck(this, ValidationForm);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return _ret2 = (_temp2 = (_this9 = _possibleConstructorReturn(this, (_ref2 = ValidationForm.__proto__ || Object.getPrototypeOf(ValidationForm)).call.apply(_ref2, [this].concat(args))), _this9), _this9.inputs = {}, _this9.attachToForm = function (component) {
            _this9.inputs[component.props.name] = component;
        }, _this9.detachFromForm = function (component) {
            delete _this9.inputs[component.props.name];
        }, _this9.setFormDiry = function () {
            var form = _this9.refs.form;
            if (!form.classList.contains('was-validated')) form.classList.add('was-validated');
        }, _this9.mapInputs = function (inputs) {
            var arr = Object.keys(inputs).map(function (prop) {
                return inputs[prop];
            });
            return arr;
        }, _this9.findFirstErrorInput = function (inputs) {
            return inputs.find(function (input) {
                return !input.getInputRef().validity.valid;
            });
        }, _this9.handleSubmit = function (event) {
            var form = _this9.refs.form;
            var formData = _this9.getFormData();
            var inputArr = _this9.mapInputs(_this9.inputs);
            _this9.setFormDiry();
            _this9.validateInputs();

            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();

                if (_this9.props.onErrorSubmit) _this9.props.onErrorSubmit(event, formData, inputArr);
                if (_this9.props.setFocusOnError) {
                    var firstErrorInput = _this9.findFirstErrorInput(inputArr);
                    firstErrorInput.getInputRef().focus();
                }
            } else {
                if (_this9.props.onSubmit) _this9.props.onSubmit(event, formData, inputArr);
            }
        }, _this9.resetValidationState = function (isClearValue) {
            for (var prop in _this9.inputs) {
                _this9.inputs[prop].setState({ errorMessage: "", isPristine: true });
                var inputRef = _this9.inputs[prop].getInputRef();
                inputRef.classList.remove("is-valid");
                inputRef.classList.remove("is-invalid");
                inputRef.setCustomValidity("");
                if (isClearValue) {
                    if (inputRef.type == "checkbox") inputRef.checked = false;
                    inputRef.value = "";
                }
            }
            _this9.refs.form.classList.remove("was-validated");
        }, _temp2), _possibleConstructorReturn(_this9, _ret2);
    }

    _createClass(ValidationForm, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'isBaseFormControl',
        value: function isBaseFormControl(element) {
            if (typeof element !== "function") return false;
            while (element.__proto__ !== Object.prototype) {
                if (element.__proto__ === BaseFormControl) return true;
                element = element.__proto__;
            }
            return false;
        }
    }, {
        key: 'registerChildren',
        value: function registerChildren(children) {
            var _this10 = this;

            var newChildren = _react2.default.Children.map(children, function (child) {
                //If child is our baseFormControl, then assign new props to it
                if (!child) return child;
                if (_this10.isBaseFormControl(child.type)) {
                    return _react2.default.cloneElement(child, _extends({}, child.props, {
                        attachToForm: _this10.attachToForm,
                        detachFromForm: _this10.detachFromForm,
                        immediate: _this10.props.immediate
                    }));
                } else {
                    if (typeof child === 'string') return child;
                    return _react2.default.cloneElement(child, {
                        children: typeof child.props.children === "string" ? child.props.children : _this10.registerChildren(child.props.children)
                    });
                }
            });
            return newChildren;
        }
    }, {
        key: 'validateInputs',
        value: function validateInputs() {
            for (var prop in this.inputs) {
                this.inputs[prop].validateInput();
            }
        }
    }, {
        key: 'getFormData',
        value: function getFormData() {
            var model = {};
            for (var name in this.inputs) {
                var inputRef = this.inputs[name].getInputRef();
                var value = null;
                switch (inputRef.type) {
                    case "checkbox":
                        value = inputRef.checked;
                        break;
                    case "text":case "email":case "select-one":case "password":case "textarea":
                        value = inputRef.value;
                        break;
                    case "radio":
                        var radios = document.getElementsByName(name);
                        for (var i = 0; i < radios.length; i++) {
                            if (radios[i].checked) {
                                value = radios[i].value;
                                break;
                            }
                        }
                        break;
                    case "file":
                        value = inputRef.files[0];
                        break;
                    default:
                        value = null;
                }
                model[name] = value;
            };
            return model;
        }

        //By default only clear customError and class, if isClearValue is true, clear value also

    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                onSubmit = _props2.onSubmit,
                onErrorSubmit = _props2.onErrorSubmit,
                immediate = _props2.immediate,
                setFocusOnError = _props2.setFocusOnError,
                domProps = _objectWithoutProperties(_props2, ['onSubmit', 'onErrorSubmit', 'immediate', 'setFocusOnError']);

            return _react2.default.createElement(
                'form',
                _extends({ noValidate: true, ref: 'form'
                }, domProps, {
                    onSubmit: this.handleSubmit }),
                this.registerChildren(this.props.children)
            );
        }
    }]);

    return ValidationForm;
}(_react2.default.Component);

ValidationForm.defaultProps = {
    className: "needs-validation",
    setFocusOnError: true,
    immediate: true
};
ValidationForm.propTypes = {
    className: _propTypes2.default.string,
    setFocusOnError: _propTypes2.default.bool,
    immediate: _propTypes2.default.bool,
    onSubmit: _propTypes2.default.func.isRequired,
    onErrorSubmit: _propTypes2.default.func
};