import React from 'react';
import TextField from 'material-ui/TextField';
import theme from '../theme'
import DHIS2Api from './DHIS2API';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';

const localstyle = {
    divForm: {
        overflowY: 'auto',
        height: 400
    },
    radioButtonG: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    radioButton: {
        float: 'left',
        marginTop: 16,
        marginBotom: 16,
        width: '45%',
        height: 'auto',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        boxSizing: 'border-box',
    },
}
class SettingSr extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgUnitGroup: {
                id: "",
                name: "",
                user: {
                    id: ""
                },
                organisationUnits: [{ id: "" }],
                groupSets: [{ id: "" }],
            },
            settingApp: {
                supervisor: "", //OUGS
                supervisorError: "",
                userRole: "",
                userRoleError: "",
                userGroup: "",
                userGroupError: "",
                latitudeRange: "",
                latitudeRangeError: "",
                longitudeRange: "",
                longitudeRangeError: "",
                modeSetting: "local",
                modeSettingError: "",
                remoteServer: "",
                remoteServerError: "",
                userId: "",
                userIdError: "",
                passwordUser: "",
                passwordUserError: ""
            },
            value: props.value,
            OUG: [],
            disabledSetting: true,
            remoteConnect: true,
        }
    }
    validateSubrecipient(value) {
        if (value.length === 11) {
            return true;
        } else {
            return false;
        }
    }
    validateSupervisor(value) {
        if (value.length === 11) {
            return true;
        } else {
            return false;
        }
    }

    validateUserRole(value) {
        let MyArray = value.split(',')
        let i = 0;
        let validatePas = false
        for (i = 0; i < MyArray.length; i++) {
            if (MyArray[i].length == 11) {
                validatePas = true
            } else {
                validatePas = false
            }
        } return validatePas
    }

    validateUserGroup(value) {
        let MyArray = value.split(',');
        let i = 0;
        let validatePas = false
        for (i = 0; i < MyArray.length; i++) {
            if (MyArray[i].length == 11) {
                validatePas = true
            } else {
                validatePas = false
            }
        } return validatePas
    }
    validateUserProgram(value) {
        let validatePas = false
            if (value.length == 11) {
                validatePas = true
            } else {
                validatePas = false
            }
         return validatePas
    }

    validateLatitudeRange(value) {
        let MyArray = value.split(',');
        let i = 0;
        let validatePas = false
        for (i = 0; i < MyArray.length; i++) {
            if (MyArray[i] <= 90.00000) {
                validatePas = true
            } else {
                validatePas = false
            }
        } return validatePas
    }

    validateLongitudeRange(value) {
        let MyArray = value.split(',');
        let i = 0;
        let validatePas = false
        for (i = 0; i < MyArray.length; i++) {
            if (MyArray[i] <= 180.00000) {
                validatePas = true
            } else {
                validatePas = false
            }
        } return validatePas
    }

    validateUrl(value) {
        if (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)) {
            return true
        } else {
            return false
        }
    }

    validateUserId(value) {
        if (value.length >= 2 && value.length <= 25) {
            return true
        } else {
            return false
        }
    }

    validateUserPass(value) {
        const { d2 } = this.props;
        let errorText = d2.i18n.getTranslation("ERROR_USER_PASS_SERVER_REMOTE");
        if (value.length >= 8 && value.length <= 25) {
            return true
        } else {
            return false
        }
    }

    handleSetValueForm(key, index, event, value) {
        const { d2 } = this.props;
        let settingApp = this.state.settingApp
        let errorKey = key + "Error"
        let errorText = ""
        switch (key) {
            case 'subrecipient':
                if (this.validateSubrecipient(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_TEXT_SUBRECIPIENT")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'supervisor':
                if (this.validateSupervisor(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_TEXT_SUPERVISOR")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'userRole':
                if (this.validateUserRole(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_TEXT_USER_ROLE_GR")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'userGroup':
                if (this.validateUserGroup(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_TEXT_USER_ROLE_GR")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'program':
                if (this.validateUserProgram(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_TEXT_PROGRAM")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'latitudeRange':
                if (this.validateLatitudeRange(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_TEXT_LATITUDE_RANGE")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'longitudeRange':
                if (this.validateLongitudeRange(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_TEXT_LONGITUDE_RANGE")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'modeSetting':
                let remoteConnect = true;
                if (value == "Local") {
                    remoteConnect = true;
                    this.setState({ remoteConnect })
                } else {
                    remoteConnect = false;
                    this.setState({ remoteConnect })
                }
                break;
            case 'remoteServer':
                if (this.validateUrl(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_URL_SERVER")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'userId':
                if (this.validateUserId(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_USER_ID_SERVER_REMOTE")
                    settingApp[errorKey] = errorText
                }
                break;
            case 'passwordUser':
                if (this.validateUserPass(value)) {
                    settingApp[errorKey] = ""
                } else {
                    errorText = d2.i18n.getTranslation("ERROR_USER_PASS_SERVER_REMOTE")
                    settingApp[errorKey] = errorText
                }
                break;
        }
        settingApp[key] = value
        this.setState({ settingApp });
    }
    handleCloseSetting() {
        this.props.handleClose();
    };
    handleSaveSetting() {
        const D2API = new DHIS2Api(this.props.d2);
        //Create 
        if (this.state.firstSetting == true)
            D2API.setSetting(this.state.settingApp);
        else //update
            D2API.upSetting(this.state.settingApp);
        this.handleCloseSetting();
    }
    async getSetting() {
        const D2API = new DHIS2Api(this.props.d2);
        const settingApp = await D2API.getSetting();
        if(settingApp=={} ||Object.keys(settingApp).length==0 ){
            this.setState({ firstSetting:true });
        }
        else{
            this.setState({ firstSetting:false,settingApp });
        }

        
    }
    componentDidMount() {
        this.getSetting();
    }
    render() {
        const { d2 } = this.props;
        const idSubRecipient = this.props.OUGSelected.id;
        return (
            <div>
            <div style={localstyle.divForm}>
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_SUBRECIPIENT_ID")}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.subrecipient}
                    onChange={(event, index, value) => this.handleSetValueForm("subrecipient", value, event, index)}
                    errorText={this.state.settingApp.subrecipientError}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_SUPERVISOR_OUGS_ID")}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.supervisor}
                    onChange={(event, index, value) => this.handleSetValueForm("supervisor", value, event, index)}
                    errorText={this.state.settingApp.supervisorError}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_PROGRAM_ID")}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.program}
                    onChange={(event, index, value) => this.handleSetValueForm("program", value, event, index)}
                    errorText={this.state.settingApp.programError}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_USER_ROL_CREATION_ID")}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.userRole}
                    onChange={(event, index, value) => this.handleSetValueForm("userRole", value, event, index)}
                    errorText={this.state.settingApp.userRoleError}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_GROUP_CREATION_ID")}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.userGroup}
                    onChange={(event, index, value) => this.handleSetValueForm("userGroup", value, event, index)}
                    errorText={this.state.settingApp.userGroupError}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_LATITUDE_RANGE")}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.latitudeRange}
                    onChange={(event, index, value) => this.handleSetValueForm("latitudeRange", value, event, index)}
                    errorText={this.state.settingApp.latitudeRangeError}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_LONGITUDE_RANGE")}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.longitudeRange}
                    onChange={(event, index, value) => this.handleSetValueForm("longitudeRange", value, event, index)}
                    errorText={this.state.settingApp.longitudeRangeError}
                />
                <h4>{d2.i18n.getTranslation("LABEL_MODE")}</h4>
                <RadioButtonGroup name="connection" style={localstyle.radioButtonG} valueSelected={this.state.settingApp.modeSetting==undefined?"Local":this.state.settingApp.modeSetting} onChange={(event, index, value) => this.handleSetValueForm("modeSetting", value, event, index)}>
                    <RadioButton
                        name="Local"
                        value="Local"
                        label={d2.i18n.getTranslation("LABEL_LOCAL_SERVER")}
                        style={localstyle.radioButton}
                    />
                    <RadioButton
                        name="Local_and_remote"
                        value="Local_and_remote"
                        label={d2.i18n.getTranslation("LABEL_LOCAL_AND_REMOTE_SERVER")}
                        style={localstyle.radioButton}
                    />
                </RadioButtonGroup>
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_UG_REMOTE_SERVER")}
                    style={theme.volunteerForm.urlInput}
                    value={this.state.settingApp.remoteServer}
                    onChange={(event, index, value) => this.handleSetValueForm("remoteServer", value, event, index)}
                    errorText={this.state.settingApp.remoteServerError}
                    disabled={this.state.remoteConnect}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_UG_USER_ID")}
                    value={this.state.OUGList}
                    style={theme.volunteerForm.textBox}
                    value={this.state.settingApp.userId}
                    onChange={(event, index, value) => this.handleSetValueForm("userId", value, event, index)}
                    errorText={this.state.settingApp.userIdError}
                    disabled={this.state.remoteConnect}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_UG_PASSWORD")}
                    style={theme.volunteerForm.textBox}
                    type="password"
                    value={this.state.settingApp.passwordUser}
                    onChange={(event, index, value) => this.handleSetValueForm("passwordUser", value, event, index)}
                    errorText={this.state.settingApp.passwordUserError}
                    disabled={this.state.remoteConnect}
                />
            </div>
                    <RaisedButton
                    label={d2.i18n.getTranslation("BTN_CANCEL")}
                    primary={true}
                    keyboardFocused={false}
                    onClick={() => this.handleCloseSetting()}
                    style={{margin:5}}
                    />,
                    <RaisedButton
                        label={d2.i18n.getTranslation("BTN_SAVE")}
                        primary={true}
                        keyboardFocused={true}
                        onClick={() => this.handleSaveSetting()}
                        style={{margin:5}}
                    />
            </div>
        )
    }
}
export default SettingSr;