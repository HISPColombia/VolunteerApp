
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import theme from '../theme'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DHIS2Api from './DHIS2API';
import setting from '../setting.json'
import { generateUid } from 'd2/lib/uid';

const localstyle = {
    divForm: { overflowY: 'auto', height: 600 },
    buttonsPanel: { paddingTop: 40, textAlign: "center" },
    buttons: { margin: 10 }
}
class EditOu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            volunteer:{
                code:"",
                supervisor:"",
                parent:"",
                fullname:"",
                firstname:"",
                lastname:"",
                village:"",
                villagegps:"",
                openingDate:"",
                closedDate:"",
                email:"",
                phoneNumber:"",
                password:"",
                repeatpassword:"",
                language:"",
            },
            OUList: [],
            OUGList: [],
           
        }
    }
    async getParthers() {
        //get list of OU leve 6
        const D2API = new DHIS2Api(this.props.d2);
        const OUList = await D2API.getOrgUnit("&filter=level:eq:6&paging=false");
        this.setState({ OUList });
    }
    async searchParents(value) {
        //get list of OU leve 6
        const D2API = new DHIS2Api(this.props.d2);
        const OUList = await D2API.getOrgUnit("&pageSize=5&filter=level:eq:6&filter=name:like:"+value);
        this.setState({ OUList });
        return OUList;
    }
    async getSupervisor(value) {
        const D2API = new DHIS2Api(this.props.d2);
        const OUGListFull = await D2API.getOrgUnitGroups("&filter=id:eq:" + setting.orgUnitGroupSet+"&filter=name:like:"+value);
        let OUGList=[]
       
         if(OUGListFull.length>0){
            OUGList=OUGListFull[0].organisationUnitGroups                
        }
        this.setState({ OUGList});
        return OUGList;
    }
    async getLanguage() {
        const D2API = new DHIS2Api(this.props.d2);
        const language = await D2API.getLangUsers(this.props.volunteerOU.code);
        let { volunteer } = this.state;
        let arrLen=["en","my","zh"];
        let languageNum=arrLen.findIndex(l=>{return l==language})
        volunteer.language = languageNum;
        this.setState({ volunteer });
    }
    async setVolunteer() {
        const uidUser=generateUid();
        const uidCredential=generateUid();
        const uidOrgUnit=generateUid();


        const OU = {
            id: uidOrgUnit,
            code: this.state.volunteer.code,
            contactPerson: this.state.volunteer.firstname + " " + this.state.volunteer.lastname,
            coordinates: "["+this.state.volunteer.villagegps+"]",
            email: this.state.volunteer.email,
            featureType: "POINT",
            name: this.state.volunteer.firstname + "-" + this.state.volunteer.lastname,
            openingDate: + this.state.volunteer.openingDate.getFullYear() + "-" + (this.state.volunteer.openingDate.getMonth() + 1) + "-" + this.state.volunteer.openingDate.getDate(),

            parent: { id: this.state.volunteer.parent },
            phoneNumber: this.state.volunteer.phoneNumber,
            shortName: this.state.volunteer.village
        }
        const User = {
            attributeValues: [],
            id:uidUser,
            dataViewOrganisationUnits: [{ id: uidOrgUnit }],
            email: this.state.volunteer.email,
            firstName: this.state.volunteer.firstname,
            organisationUnits: [{ id: uidOrgUnit }],
            surname: this.state.volunteer.lastname,
            userCredentials: {
                id:uidCredential,
                catDimensionConstraints: [],
                cogsDimensionConstraints: [],
                externalAuth: false,
                password: this.state.volunteer.password,
                userInfo: { id: uidUser },
                userRoles: [{ id: "tUHgJMmGppY" }],
                username: this.state.volunteer.code,
                userGroups: [{ id: "XCo6cPPctTl" }]

            }
        }
        const D2API = new DHIS2Api(this.props.d2);
        const respOUSaved = await D2API.setOrgUnit(OU);
        const respUserSaved = await D2API.setUser(User);
        const respGrpuoAssigned =await D2API.setOrgUnitGroups(this.state.volunteer.supervisor,uidOrgUnit);
        this.props.handleClose();

    }
    componentDidMount() {
        if (this.props.mode == "edit") {
            this.setValueForm();
            this.setState({ disabled: true });        
        }
    }
    handleSetValueForm(key, value, event, index) {
        let volunteer = this.state.volunteer
        volunteer[key] = value
        this.setState({ volunteer });;
        this.setFullname();
    }
    handleSupervisor(chosenRequest,index){
        let volunteer = this.state.volunteer
        volunteer["supervisor"] = chosenRequest.id
        this.setState({ volunteer });
    }
    handleParent(chosenRequest,index){
        let volunteer = this.state.volunteer
        volunteer["parent"] = chosenRequest.id
        this.setState({ volunteer });
    }
    setFullname(){
       //OU Code + OU ShortName + U.First + U.Last Name
       let {code} =this.state.volunteer;
       let {village}=this.state.volunteer;
       let {firstname}=this.state.volunteer;
       let {lastname}=this.state.volunteer;
       const fullname=code+"_"+village+"_"+firstname+"_"+lastname
       let {volunteer}=this.state
       volunteer["fullname"]=fullname
       this.setState({volunteer})
       //

    }
    setValueForm() {
        this.getLanguage();
        const code = this.props.volunteerOU.code;
        const fullname = this.props.volunteerOU.name;
        const firstname = this.props.volunterUser.firstName;
        const lastname = this.props.volunterUser.surname;
        const openingDate = new Date(this.props.volunteerOU.openingDate);
        const closedDate = (this.props.volunteerOU.closedDate == undefined ? "" : new Date(this.props.volunteerOU.closedDate));
        const parent = this.props.volunteerOU.parent.id;
        const supervisor = this.props.volunteerOU.organisationUnitGroups[0].id;
        const village = this.props.volunteerOU.shortName;
        const villagegps = "";
        const password = "";
        const repeatpassword = "";
        const { language } = this.state;
        var email = this.props.volunteerOU.email == undefined ? "" : this.props.volunteerOU.email;
        var phoneNumber = this.props.volunterUser.phoneNumber == undefined ? "" : this.props.volunterUser.phoneNumber;
        let volunteer = {
            code,
            supervisor,
            parent,
            fullname,
            firstname,
            lastname,
            village,
            villagegps,
            openingDate,
            closedDate,
            email,
            phoneNumber,
            password,
            repeatpassword,
            language,
        }
        this.setState({ volunteer });


    }

    render() {
        const { d2 } = this.props;
        const dataSourceConfig = {
            text: 'name',
            value: 'id',
          };
        return (<div>
            <div style={localstyle.divForm}>
                <AutoComplete
                hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_SUPERVISOR")}
                dataSource={this.state.OUGList}
                onUpdateInput={this.getSupervisor.bind(this)}
                dataSourceConfig={dataSourceConfig}
                style={theme.volunteerForm.textBox}
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_SUPERVISOR")}
                onNewRequest={this.handleSupervisor.bind(this)}
                />
                <AutoComplete
                hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PARENT")} 
                dataSource={this.state.OUList}
                onUpdateInput={this.searchParents.bind(this)} 
                dataSourceConfig={dataSourceConfig}
                style={theme.volunteerForm.textBox}
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PARENT")}
                onNewRequest={this.handleParent.bind(this)}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_CODE")}
                    value={this.state.volunteer.code}
                    style={theme.volunteerForm.textBoxAuto}
                    disabled={this.state.disabled}
                    fullWidth={true}
                    onChange={(event, value) => this.handleSetValueForm("code", value, event)}                />
                          <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_VILLAGE")}
                    value={this.state.volunteer.village}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("village", value, event)}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_VILLAGEGPS")}
                    value={this.state.volunteer.villagegps}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("villagegps", value, event)}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FISTNAME")}
                    value={this.state.volunteer.firstname}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("firstname", value, event)}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LASTNAME")}
                    value={this.state.volunteer.lastname}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("lastname", value, event)}
                />            
               
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FULLNAME")}
                    value={this.state.volunteer.fullname}
                    style={theme.volunteerForm.textBoxAuto}
                    disabled={true}
                    fullWidth={true}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PHONE")}
                    value={this.state.volunteer.phoneNumber}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("phoneNumber", value, event)}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_EMAIL")}
                    value={this.state.volunteer.email}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("email", value, event)}
                />
                <DatePicker
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE")}
                    hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE")}
                    value={this.state.volunteer.openingDate}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("openingDate", value, event)}

                />
                <DatePicker
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_CLOSEDDATE")}
                    hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE")}
                    value={this.state.volunteer.closedDate}
                    style={theme.volunteerForm.textBox}
                    onChange={(event, value) => this.handleSetValueForm("closedDate", value, event)}

                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PASSWORD")}
                    value={this.state.volunteer.password}
                    style={theme.volunteerForm.textBox}
                    type="password"
                    onChange={(event, value) => this.handleSetValueForm("password", value, event)}
                />
                <TextField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_REPEATPASSWORD")}
                    value={this.state.volunteer.repeatpassword}
                    style={theme.volunteerForm.textBox}
                    type="password"
                    onChange={(event, value) => this.handleSetValueForm("repeatpassword", value, event)}
                />
                <SelectField
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LANGUAGE")}
                    value={this.state.volunteer.language}
                    style={theme.volunteerForm.selectField}
                    onChange={(event, value) => this.handleSetValueForm("language", value, event)}
                >
                    <MenuItem value={0} primaryText="English" /> 
                    <MenuItem value={1} primaryText="Burmese" />
                    <MenuItem value={2} primaryText="Chinese" />
                </SelectField>

            </div>
            <div style={localstyle.buttonsPanel}>
                <RaisedButton
                    label="Cancel"
                    primary={true}
                    keyboardFocused={true}
                    style={localstyle.buttons}
                    onClick={() => this.props.handleClose()}

                />

                <RaisedButton
                    label="Save"
                    primary={true}
                    keyboardFocused={true}
                    style={localstyle.buttons}
                    onClick={() => this.setVolunteer()}
                />
            </div>

        </div>
        )
    }
}

export default EditOu;