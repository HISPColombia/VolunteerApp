
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import theme from '../theme'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DHIS2Api from './DHIS2API';
import { generateUid } from 'd2/lib/uid';
import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';

import '../css/Volunteer.css';
const localstyle = {
    divForm: { overflowY: 'auto', height: 300 },
    buttonsPanel: { paddingTop: 40, textAlign: "center" },
    buttons: { margin: 10 },
    errorStyle: {
        color: theme,
    },
}
class EditOu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            volunteer: {
                code: "",
                supervisor: "",
                parent: "",
                fullname: "",
                firstname: "",
                lastname: "",
                village: "",
                villagegps: "",
                openingDate: "",
                closedDate: "",
                email: "",
                phoneNumber: "",
                password: "",
                repeatpassword: "",
                language: "",
            },
            OUList: [],
            OUGList: [],
            validateResult: { parent: true, village: true, villagegps: true, villagegps: true, firstname: true, lastname: true, password: true, repeatpassword: true, language: true, openingDate: true },
            validation: false,
            open: false,
            saving: false,
            message: "",
            subCenterError:false

        }
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    };
    async getParthers() {
        //get list of OU leve 6
        const D2API = new DHIS2Api(this.props.d2);
        const OUList = await D2API.getOrgUnit("&filter=level:eq:6&paging=false");
        this.setState({ OUList });
    }
    async searchParents(value) {
        //get list of OU leve 6
        const D2API = new DHIS2Api(this.props.d2);
        const OUList = await D2API.getOrgUnit("&pageSize=5&filter=level:eq:6&filter=name:ilike:" + value);
        this.setState({ OUList });
        return OUList;
    }
    async getSupervisor(value) {
        if (value != "" && value != undefined) {
            const D2API = new DHIS2Api(this.props.d2);
            const OUGListFull = await D2API.getOrgUnitGroups("&filter=id:eq:" + this.props.settingApp.supervisor); //+"&filter=name:ilike:"+value
            let OUGList = []
            if (OUGListFull.length > 0) {
                OUGList = OUGListFull[0].organisationUnitGroups
            }
            this.setState({ OUGList });
            return OUGList;
        }
        else {
            return [];
        }
    }
    async getLanguage() {
        const D2API = new DHIS2Api(this.props.d2);
        const language = await D2API.getLangUsers(this.props.volunteerOU.code);
        let { volunteer } = this.state;
        let arrLen = ["en", "my", "zh"];
        let languageNum = arrLen.findIndex(l => { return l == language })
        volunteer.language = languageNum;
        this.setState({ volunteer });
    }
    async setVolunteer() {
        const uidUser = generateUid();
        const uidCredential = generateUid();
        const uidOrgUnit = generateUid();


        var OU = {
            id: uidOrgUnit,
            code: this.state.volunteer.code,
            contactPerson: this.state.volunteer.firstname + " " + this.state.volunteer.lastname,
            coordinates: "[" + this.state.volunteer.villagegps + "]",
            email: this.state.volunteer.email,
            featureType: "POINT",
            name: this.state.volunteer.fullname,
            openingDate: this.state.volunteer.openingDate.getFullYear() + "-" + (this.state.volunteer.openingDate.getMonth() + 1) + "-" + this.state.volunteer.openingDate.getDate(),
            parent: { id: this.state.volunteer.parent },
            shortName: this.state.volunteer.village
        }
        if(this.state.volunteer.closedDate!="" && this.state.volunteer.closedDate!=undefined){
            OU["closedDate"]=this.state.volunteer.closedDate.getFullYear() + "-" + (this.state.volunteer.closedDate.getMonth() + 1) + "-" + this.state.volunteer.closedDate.getDate()
        }
        const User = {
            attributeValues: [],
            id: uidUser,
            dataViewOrganisationUnits: [{ id: uidOrgUnit }],
            firstName: this.state.volunteer.firstname,
            organisationUnits: [{ id: uidOrgUnit }],
            surname: this.state.volunteer.lastname,
            phoneNumber: this.state.volunteer.phoneNumber,
            userCredentials: {
                id: uidCredential,
                catDimensionConstraints: [],
                cogsDimensionConstraints: [],
                externalAuth: false,
                password: this.state.volunteer.password,
                userInfo: { id: uidUser },
                userRoles: [{ id: this.props.settingApp.userRole}],
                username: this.state.volunteer.code              

            },
            userGroups: [{ id: this.props.settingApp.userGroup }]//XCo6cPPctTl
        }
        const D2API = new DHIS2Api(this.props.d2);
        let arrLen = ["en", "my", "zh"];
        const respOUSaved = await D2API.setOrgUnit(OU); //status: "OK"
        if (respOUSaved.status == "OK") {
            const respUserSaved = await D2API.setUser(User);
            if (respUserSaved.status == "OK") {
                const language = arrLen[this.state.volunteer.language];
                const respLangUserSaved = await D2API.setLangUsers("?user=" + this.state.volunteer.code + "&value=" + language)
                const respLangDb = await D2API.setLangDB("?user=" + this.state.volunteer.code + "&value=" + language)              
                const respGrpuoAssigned = await D2API.setOrgUnitGroups(this.state.volunteer.supervisor, uidOrgUnit);
                const respGrpuo2Assigned = await D2API.setOrgUnitGroups(this.props.subrecipient.id, uidOrgUnit);
                //assing OU to program
                const FullProgram = await D2API.getProgram(this.props.settingApp.program); //status: "OK"
                FullProgram.organisationUnits.push({id:uidOrgUnit})
                await D2API.setProgram(this.props.settingApp.program,FullProgram); //status: "OK"
                
                
                ///
                this.props.handleMessagesApp("The volunteer has been created")
                this.props.handleClose(this.props.subrecipient,true);
            }
            else {
                this.props.handleMessagesApp("The volunteer was created with errors")
                this.props.handleClose(this.props.subrecipient,true);
            }
        }
        else {
            this.setState({
                message: "Error: The volunteer has not been created",
                open: true,
                saving: false
            });
        }



    }
    async upVolunteer() {

        var userCredentials=this.props.volunterUser.userCredentials;
        if( this.state.volunteer.password!=""){
            userCredentials.password=this.state.volunteer.password
        }
        var OU = {
            id: this.state.volunteer.ouid,
            code: this.state.volunteer.code,
            contactPerson: this.state.volunteer.firstname + " " + this.state.volunteer.lastname,
            coordinates: "[" + this.state.volunteer.villagegps + "]",
            email: this.state.volunteer.email,
            featureType: "POINT",
            name: this.state.volunteer.fullname,
            openingDate: this.state.volunteer.openingDate.getFullYear() + "-" + (this.state.volunteer.openingDate.getMonth() + 1) + "-" + this.state.volunteer.openingDate.getDate(),
            parent: { id: this.state.volunteer.parent },
            shortName: this.state.volunteer.village
        }
        if(this.state.volunteer.closedDate!="" && this.state.volunteer.closedDate!=undefined){
            OU["closedDate"]=this.state.volunteer.closedDate.getFullYear() + "-" + (this.state.volunteer.closedDate.getMonth() + 1) + "-" + this.state.volunteer.closedDate.getDate()
        }
        const User = {
            attributeValues: [],
            id: this.state.volunteer.userid,
            dataViewOrganisationUnits: [{ id: this.state.volunteer.ouid }],
            firstName: this.state.volunteer.firstname,
            organisationUnits: [{ id: this.state.volunteer.ouid }],
            surname: this.state.volunteer.lastname,
            phoneNumber: this.state.volunteer.phoneNumber,
            userCredentials
        }
        const D2API = new DHIS2Api(this.props.d2);
        let arrLen = ["en", "my", "zh"];
        const respOUSaved = await D2API.upOrgUnit(OU); //status: "OK"
        if (respOUSaved.status == "OK") {
            const respUserSaved = await D2API.upUser(User);
            if (respUserSaved.status == "OK") {
                const language = arrLen[this.state.volunteer.language];
                const respLangUserSaved = await D2API.setLangUsers("?user=" + this.state.volunteer.code + "&value=" + language)
                const respLangDB = await D2API.setLangDB("?user=" + this.state.volunteer.code + "&value=" + language)
                
                this.props.handleMessagesApp("The volunteer has been updated")
                this.props.handleClose(this.props.subrecipient,true);
            }
            else {
                this.props.handleMessagesApp("The volunteer was updated with errors")
                this.props.handleClose(this.props.subrecipient,true);
            }
        }
        else {
            this.setState({
                message: "Error: The volunteer has not been updated",
                open: true,
                saving: false
            });
        }



    }
    async componentDidMount() {
        await this.getSupervisor("firstime")
        if (this.props.mode == "edit") {
            this.setValueForm();
            this.setState({ disabled: true });
        }
        else{
            if(this.state.volunteer.language==""){
                var volunteer=this.state.volunteer
                volunteer["language"]=1;
                this.setState({volunteer})
            }
        }        
        this.setState({ validation: false });
    }
    handleSetValueForm(key, value, event, index) {
        let volunteer = this.state.volunteer
        if (key == "villagegps") {//Validar que las coordenadas con correctas
            this.setState({ volunteer });
            if (/^([0-9.?,?]*)?$/.test(value)){
                volunteer[key] = value
                this.setState({ volunteer });
            }

        }
        else if(key=="phoneNumber"){//Validar telefono
            if(value.length>1)
                var numero=value.substring(4,value.length)
            else
                var numero=value
            if (/^([0-9])*$/.test(numero)){
                value="+95 "+ numero
                volunteer[key] = value
                this.setState({ volunteer });
            }
        }
        else {
            volunteer[key] = value
            this.setState({ volunteer });
        }
        this.setFullname();
        //validate email
        let validateResult = this.state.validateResult;
        validateResult["email"] = this.validateEmail();
        validateResult["repeatpassword"] = this.validatePassword();
        validateResult["password"] = this.validateStrongPassword();
        this.setState({ validateResult })
        //Validate password

        //validate mandatory fields
        if (this.state.validation == true)
            this.validateForm(true)
    }
    handleSupervisor(chosenRequest, index) {
        let volunteer = this.state.volunteer
        volunteer["supervisor"] = chosenRequest.id
        volunteer["supervisorName"] = chosenRequest.name
        this.setState({ volunteer });
        if(this.props.mode=="edit"){
            this.addSupervisor()
        }
    }
    handleParent(chosenRequest, index) {
        let volunteer = this.state.volunteer
        //get OU Level 4
        if (this.props.subrecipient.code == undefined || chosenRequest.parent.parent.code == undefined){
            this.setState({ saving: true,subCenterError:true })
            
        }
        else  {
            this.setState({ saving: false,subCenterError:false })
        }

        let code = this.generateCode(this.props.subrecipient.code, chosenRequest.parent.parent.code, chosenRequest.children)
        //
        volunteer["parent"] = chosenRequest.id;
        volunteer["email"] = chosenRequest.parent.parent.email == undefined ? "" : chosenRequest.parent.parent.email;
        volunteer["code"] = code;
        this.setState({ volunteer });
        this.setFullname();
    }
    generateCode(subrecipientCode, townCode, children) {
        if(subrecipientCode==undefined || townCode==undefined){
            return ("");
        }
        else{
            if (children.length > 0) {
                let partFinal = "000000" + children.length;
                return (subrecipientCode + "_" + townCode.substring(townCode.length - 6, townCode.length) + "_" + partFinal.substring(partFinal.length - 6, partFinal.length));
            }
            else {
                return (subrecipientCode + "_" + townCode + "_00001");
            }
        }

    }
    async clearSupervisor(){
        let { volunteer } = this.state
        const D2API = new DHIS2Api(this.props.d2);
        const respGrpuo2Deleted = await D2API.delOrgUnitGroups(volunteer.supervisor, volunteer.ouid);
        console.log(respGrpuo2Deleted)
        volunteer["supervisorName"] = ""
        volunteer["supervisor"] = ""
        this.setState({ volunteer })
        
    }
    async addSupervisor(){
        let { volunteer } = this.state
        const D2API = new DHIS2Api(this.props.d2);
        const respGrpuo2Deleted = await D2API.setOrgUnitGroups(volunteer.supervisor, volunteer.ouid);
        console.log(respGrpuo2Deleted)       
    }
    setFullname() {
        //OU Code + OU ShortName + U.First + U.Last Name
        let { code } = this.state.volunteer;
        let { village } = this.state.volunteer;
        let { firstname } = this.state.volunteer;
        let { lastname } = this.state.volunteer;
        const fullname = code + "_" + village + "_" + firstname + "_" + lastname
        let { volunteer } = this.state
        volunteer["fullname"] = fullname
        this.setState({ volunteer })
        //

    }
    setValueForm() {
        this.getLanguage();
        const ouid= this.props.volunteerOU.id;
        const userid= this.props.volunterUser.id;
        const code = this.props.volunteerOU.code;
        const fullname = this.props.volunteerOU.name;
        const firstname = this.props.volunterUser.firstName;
        const lastname = this.props.volunterUser.surname;
        const openingDate = new Date(this.props.volunteerOU.openingDate);
        const closedDate = (this.props.volunteerOU.closedDate == undefined ? "" : new Date(this.props.volunteerOU.closedDate));
        const parent = this.props.volunteerOU.parent.id;
        const parentName = this.props.volunteerOU.parent.name;
        const superV= this.props.volunteerOU.organisationUnitGroups.find((ou)=>{
            return this.state.OUGList.find(oul=>{
                return oul.id==ou.id
            })
        })
        var supervisor = "";
        var supervisorName = "";
       if(superV!=undefined){
            supervisor = superV.id;
            supervisorName = superV.name;
       }
        const village = this.props.volunteerOU.shortName;
        const villagegps = this.props.volunteerOU.coordinates.substring(1,this.props.volunteerOU.coordinates.length-1);

        const password = "";
        const repeatpassword = "";
        const { language } = this.state;
        var email = this.props.volunteerOU.email == undefined ? "" : this.props.volunteerOU.email;
        var phoneNumber = this.props.volunterUser.phoneNumber == undefined ? "" : this.props.volunterUser.phoneNumber;
        let volunteer = {
            ouid,
            userid,
            code,
            supervisor,
            parent,
            parentName,
            supervisorName,
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
    validateEmail() {
        if (this.state.volunteer.email != "") {
            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            //Se muestra un texto a modo de ejemplo, luego va a ser un icono
            if (emailRegex.test(this.state.volunteer.email))
                return true;
            else
                return false;
        }
        return true;

    }
    validateStrongPassword() {
        //tomado de http://www.valecloud.com/portal/validar-contrasena-fuerte/
        const contrasenna=this.state.volunteer.password;
        if ( contrasenna!= "") {
            if (contrasenna.length >= 8) {
                var mayuscula = false;
                var minuscula = false;
                var numero = false;
                var caracter_raro = false;

                for (var i = 0; i < contrasenna.length; i++) {
                    if (contrasenna.charCodeAt(i) >= 65 && contrasenna.charCodeAt(i) <= 90) {
                        mayuscula = true;
                    }
                    else if (contrasenna.charCodeAt(i) >= 97 && contrasenna.charCodeAt(i) <= 122) {
                        minuscula = true;
                    }
                    else if (contrasenna.charCodeAt(i) >= 48 && contrasenna.charCodeAt(i) <= 57) {
                        numero = true;
                    }
                    else {
                        caracter_raro = true;
                    }
                }
                if (mayuscula == true && minuscula == true && caracter_raro == true && numero == true) {
                    return true;
                }
            }
            return false;
        }
    }
    validateStrongPasswordAnt() {
        if (this.state.volunteer.password != "") {
            var regex = /^(?=.*\d)(?=.*[a-záéíóúüñ]).*[A-ZÁÉÍÓÚÜÑ]/;
            if (regex.test(this.state.volunteer.password))
                return true;
            else
                return false;

        }
    }
    validatePassword() {
        if (this.state.volunteer.repeatpassword != "" && this.state.volunteer.repeatpassword != this.state.volunteer.password)
            return false;
        else
            return true;

    }
    validateForm(onkeypress) {
        let validateResult = {};
        let error = false;
        //validate subsenter
        if (this.state.volunteer.parent == "") {
            validateResult["parent"] = false;
            error = true;
        }
        if (this.state.volunteer.village == "") {
            validateResult["village"] = false;
            error = true;
        }
        if (this.state.volunteer.villagegps == "") {
            validateResult["villagegps"] = false;
            error = true;
        }
        if (this.state.volunteer.villagegps != "") {

            if(this.state.volunteer.villagegps.split(",").length!=2){
                validateResult["villagegps"] = false;
                error = true;
            }
            else{
                const longitude=this.state.volunteer.villagegps.split(",")[0]*1
                const latitud=this.state.volunteer.villagegps.split(",")[1]*1
                const latmin=this.props.settingApp.latitudeRange.split(",")[0]*1
                const latmax=this.props.settingApp.latitudeRange.split(",")[1]*1
                const longmin=this.props.settingApp.longitudeRange.split(",")[0]*1
                const longmax=this.props.settingApp.longitudeRange.split(",")[1]*1
                if(latitud<latmin || latitud>latmax ||longitude<longmin||longitude>longmax){
                    validateResult["villagegps"] = false;
                    error = true;
                }
            }
        }
        if (this.state.volunteer.firstname == "") {
            validateResult["firstname"] = false;
            error = true;
        }
        if (this.state.volunteer.lastname == "") {
            validateResult["lastname"] = false;
            error = true;
        }
        if ((this.state.volunteer.password == "" && this.props.mode!="edit")||(this.state.volunteer.password != "" && this.props.mode=="edit")) {
            validateResult["password"] = false;
            error = true;
        }
        if ((this.state.volunteer.repeatpassword == ""&& this.props.mode!="edit")||(this.state.volunteer.repeatpassword != ""&& this.props.mode=="edit")) {
            validateResult["repeatpassword"] = false;
            error = true;
        }
        if (this.state.volunteer.language === "") {
            validateResult["language"] = false;
            error = true;
        }
        if (this.state.volunteer.openingDate == "") {
            validateResult["openingDate"] = false;
            error = true;
        }
        if (this.state.volunteer.closedDate != "") {
            if(this.state.volunteer.openingDate>this.state.volunteer.closedDate){
                validateResult["closedDate"] = false;
                error = true;
            }
        }
        if(this.state.volunteer.phoneNumber!=""){
            if(this.state.volunteer.phoneNumber.length<13 || this.state.volunteer.phoneNumber.length>16){
                validateResult["phoneNumber"] = false;
                error = true;
            }
        }
        validateResult["email"] = this.validateEmail();
        validateResult["repeatpassword"] = this.validatePassword();
        this.setState({ validateResult, validation: true })

        if (error == false && !onkeypress) {
            this.setState({ saving: true })
            if(this.props.mode=="edit")
                this.upVolunteer()
            else
                this.setVolunteer()
        }
        else {
            if (!onkeypress)
                this.setState({
                    message: "check the required fields",
                    open: true,
                });
        }
    }

    render() {
        const { d2 } = this.props;
        const dataSourceConfig = {
            text: 'name',
            value: 'id',
        };
        return (<div style={{position: 'relative'}}>
             {
             this.state.saving==true?
             <div style={{position: 'absolute',left: '45%', top: '45%', zIndex: 1}}>
                 <CircularProgress size={80} thickness={5} />
            </div>:""
             }
            <div className="wrapper" style={localstyle.divForm}>
                <aside className="aside aside-1"><AutoComplete
                    hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PARENT") + " *"}
                    dataSource={this.state.OUList}
                    onUpdateInput={this.searchParents.bind(this)}
                    dataSourceConfig={dataSourceConfig}
                    filter={AutoComplete.fuzzyFilter}
                    floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PARENT") + " *"}
                    onNewRequest={this.handleParent.bind(this)}
                    errorText={this.state.OUList.length > 0 || this.state.disabled ? (this.state.subCenterError==true?"Error in Code, Select a valid Sub/Center":"") : "No match"}
                    searchText={this.state.volunteer.parentName}
                    disabled={this.state.disabled}
                /></aside>
                <aside className="aside aside-2">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_CODE")}
                        value={this.state.volunteer.code}
                        disabled={true}
                        onChange={(event, value) => this.handleSetValueForm("code", value, event)}
                        errorText={"(" + d2.i18n.getTranslation("LABEL_TEXT_AUTOGENERATED") + ")"}
                        errorStyle={theme.volunteerForm.textInfo}
                        style={{ width: 560 }}
                    />   </aside>
                <aside className="aside aside-3">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_VILLAGE") + " *"}
                        value={this.state.volunteer.village}
                        className="ajustText"
                        onChange={(event, value) => this.handleSetValueForm("village", value, event)}
                        errorText={this.state.validateResult.village == false ? "This field is required" : ""}
                    /></aside>
                <aside className="aside aside-4">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_VILLAGEGPS") + " *"}
                        value={this.state.volunteer.villagegps}
                        errorText={this.state.validateResult.villagegps == false ? "Check the coordinate format" : ""}
                        onChange={(event, value) => this.handleSetValueForm("villagegps", value, event)}

                    /></aside>
                <aside className="aside aside-5">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FISTNAME") + " *"}
                        value={this.state.volunteer.firstname}
                        errorText={this.state.validateResult.firstname == false ? "This field is required" : ""}
                        onChange={(event, value) => this.handleSetValueForm("firstname", value, event)}

                    /></aside>
                <aside className="aside aside-6">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LASTNAME") + " *"}
                        value={this.state.volunteer.lastname}
                        errorText={this.state.validateResult.lastname == false ? "This field is required" : ""}

                        onChange={(event, value) => this.handleSetValueForm("lastname", value, event)}

                    />   </aside>
                <aside className="aside-7">

                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FULLNAME") + " *"}
                        value={this.state.volunteer.fullname}
                        disabled={true}
                        errorText={"(" + d2.i18n.getTranslation("LABEL_TEXT_AUTOGENERATED") + ")"}
                        errorStyle={theme.volunteerForm.textInfo}
                        style={{ width: 560 }}

                    /></aside>
                <aside className="aside aside-8">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PASSWORD") + " *"}
                        value={this.state.volunteer.password}
                        errorText={this.state.validateResult.password == false ? "Enter a strong password" : ""}
                        type="password"
                        onChange={(event, value) => this.handleSetValueForm("password", value, event)}

                    /></aside>
                <aside className="aside aside-9">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_REPEATPASSWORD") + " *"}
                        value={this.state.volunteer.repeatpassword}
                        errorText={this.state.validateResult.repeatpassword == false ? "Passwords do not match" : ""}
                        type="password"
                        onChange={(event, value) => this.handleSetValueForm("repeatpassword", value, event)}

                    /></aside>
                <aside className="aside aside-10">
                    <SelectField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LANGUAGE") + " *"}
                        value={this.state.volunteer.language}
                        errorText={this.state.validateResult.language == false ? "This field is required" : ""}
                        onChange={(event, value) => this.handleSetValueForm("language", value, event)}

                    >
                        <MenuItem value={0} primaryText="English" />
                        <MenuItem value={1} primaryText="Burmese" />
                        <MenuItem value={2} primaryText="Chinese" />
                    </SelectField></aside>
                <aside className="aside aside-11">
                    {(this.props.mode == "edit" && this.state.volunteer.supervisorName!=""?
                            <Chip
                            onRequestDelete={() => this.clearSupervisor()}
                            style={{ marginTop: 30}}
                        >
                            {d2.i18n.getTranslation("LABEL_VOLUNTEER_SUPERVISOR")+": "+this.state.volunteer.supervisorName}
                        </Chip>
                   :
                    <AutoComplete
                        hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_SUPERVISOR")}
                        dataSource={this.state.OUGList}
                        //onUpdateInput={this.getSupervisor.bind(this)}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.fuzzyFilter}
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_SUPERVISOR")}
                        onNewRequest={this.handleSupervisor.bind(this)}
                        errorText={this.state.OUGList.length > 0 ? "" : "No match"}
                        searchText={this.state.volunteer.supervisorName}
                    />
                    )}
                    </aside>
                <aside className="aside aside-12">
                    <TextField
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_EMAIL")}
                        value={this.state.volunteer.email}
                        errorText={this.state.validateResult.email == false ? "Please provide a valid email address" : ""}
                        onChange={(event, value) => this.handleSetValueForm("email", value, event)}
                    /></aside>
                <aside className="aside aside-13">         
                <TextField  floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PHONE")} 
                 value={this.state.volunteer.phoneNumber}
                 errorText={this.state.validateResult.phoneNumber == false ? "at least 9 digits and 12 digits max " : ""}
                 onChange={(event, value) => this.handleSetValueForm("phoneNumber", value, event)}
                    />
                    </aside>
                <aside className="aside aside-14">
                    <DatePicker
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE") + " *"}
                        hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE")}
                        value={this.state.volunteer.openingDate}
                        errorText={this.state.validateResult.openingDate == false ? "This field is required" : ""}
                        onChange={(event, value) => this.handleSetValueForm("openingDate", value, event)}
                    /></aside>
                <aside className="aside aside-15">
                    <DatePicker
                        floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_CLOSEDDATE")}
                        hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE")}
                        value={this.state.volunteer.closedDate}
                        errorText={this.state.validateResult.closedDate == false ? "Closed date is greater than opening date" : ""}
                        onChange={(event, value) => this.handleSetValueForm("closedDate", value, event)}
                    /> </aside>
            </div>
            <div style={localstyle.buttonsPanel}>
                <RaisedButton
                    label="Cancel"
                    primary={true}
                    keyboardFocused={true}
                    style={localstyle.buttons}
                    onClick={() => this.props.handleClose(this.props.subrecipient,true)}

                />

                <RaisedButton
                    label="Save"
                    primary={true}
                    keyboardFocused={true}
                    style={localstyle.buttons}
                    disabled={this.state.saving}
                    onClick={() => this.validateForm(false)}
                />
            </div>
            <Snackbar
                open={this.state.open}
                message={this.state.message}
                autoHideDuration={4000}
                onRequestClose={() => this.handleRequestClose()}
            />

        </div>
        )
    }
}

export default EditOu;