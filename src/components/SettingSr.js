import React from 'react';
import TextField from 'material-ui/TextField';
import theme from '../theme'
import DHIS2Api from './DHIS2API';

const localstyle = {
    divForm: { overflowY: 'auto', height: 400 }
}
class SettingSr extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            supervisor: {
                id: "",
                name: "",
            },
        }
    }
    async getSupervisor() {
        const D2API = new DHIS2Api(this.props.d2);
        const OUGList = await D2API.getOrgUnitGroups();
        this.setState({ OUGList });
    }
    render() {
        const {d2}= this.props;
        return (
            <div style={localstyle.divForm}>
            <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_SUBRECIPIENT_ID")}
                style={theme.volunteerForm.textBox}
                disabled={true}

            />
            <br/>
            <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_UG_TEST_TREAT_ID1")}
                style={theme.volunteerForm.textBox}
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_UG_TEST_TREAT_ID2")}
                style={theme.volunteerForm.textBox}
                />
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_UG_MODE")}
                style={theme.volunteerForm.textBox}
                />   
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_UG_REMOTE_SERVER")}
                style={theme.volunteerForm.textBox}
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_UG_USER_ID")}
                style={theme.volunteerForm.textBox}
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_UG_PASSWORD")}
                style={theme.volunteerForm.textBox}
                type="password"
                /> 
        </div>
        )
    }
}
export default SettingSr;