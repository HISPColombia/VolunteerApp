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
            orgUnitGroup: {
                id: "",
                name:"",
                user:{
                    id:""
                },
                organisationUnits:[{ id: "" }],
                groupSets:[{ id: "" }],
            },
            OUG: [],
            disabledSetting: true
        }
    }
    async getSupervisor(filter) {
        const D2API = new DHIS2Api(this.props.d2);
        const OUG = await D2API.getOrgUnitGroups("/" + filter);
        //console.log(JSON.stringify(OUG));
        this.setState({ OUG });
    }
    render() {
        const {d2}= this.props;
        const idSubRecipient=this.props.OUGSelected;
        this.getSupervisor(idSubRecipient);
        return (
            <div style={localstyle.divForm}>
            <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_SUBRECIPIENT_ID")}
                style={theme.volunteerForm.textBox}
                value={idSubRecipient}
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
                value={this.state.OUGList}
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