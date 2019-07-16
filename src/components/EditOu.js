
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import theme from '../theme'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DHIS2Api from './DHIS2API';

const localstyle={
    divForm:{overflowY: 'auto', height:700}
}
class EditOu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            volunteer: {
                id:"",
                firstName:"",
                fastName:"",
                name:"",
                parent:{id:""},
                organisationUnitGroups:[{id:""}]                
            },
            OUList:[],
            OUGList:[]        
        }
    }
    async getParthers(){
         //get list of OU leve 6
         const D2API = new DHIS2Api(this.props.d2);
         const OUList=await D2API.getOrgUnit("&filter=level:eq:6");
         this.setState({OUList});
    }
    async getSupervisor(){
        const D2API = new DHIS2Api(this.props.d2);
        const OUGList=await D2API.getOrgUnitGroups();
        this.setState({OUGList});
   }
    componentDidMount(){
        let volunteer=this.props.volunteer
        let dateOpening=new Date(volunteer.openingDate)
        volunteer.openingDate=dateOpening;
        this.setState({
            volunteer
        })  
        this.getParthers();
        this.getSupervisor();
    }
    handleSelectLanguage(event, index, value) {
        let volunteer=this.props.volunteer
        volunteer["Language"]=value
        this.setState({volunteer});
    }
    handleSelectSupervisor(event, index, value) {
        let volunteer=this.props.volunteer
        volunteer["organisationUnitGroups"]=[{id:value}]
        this.setState({volunteer});
    }
    handleSelectParent(event, index, value) {
        let volunteer=this.props.volunteer
        volunteer["parent"]={id:value}
        this.setState({volunteer});
    }
    renderParthers(){
        return this.state.OUList.map(parther=>{
            return(
                <MenuItem value={parther.id} primaryText={parther.name} />
            )
        })
    }
    renderSupervisor(){
        return this.state.OUGList.map(group=>{
            return(
                <MenuItem value={group.id} primaryText={group.name} />
            )
        })
    }
    render(){
        const {d2}= this.props;
        const fullname=this.state.volunteer.name;
        const names=fullname.split("-")
        return(<div style={localstyle.divForm}>
               <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_ID")}
                value={this.state.volunteer.code}
                style={theme.volunteerForm.textBox}
                />
                <br/>
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FISTNAME")}
                value={names[1]}
                style={theme.volunteerForm.textBox}
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LASTNAME")}
                value={names[2]}
                style={theme.volunteerForm.textBox}
                />
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FULLNAME")}
                value={fullname}
                style={theme.volunteerForm.textBox}
                disabled={true}
                />   
                <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LANGUAGE")}
                value={this.state.volunteer.Language}
                style={theme.volunteerForm.selectField}
                onChange={this.handleSelectLanguage.bind(this)
                }
                >
                    <MenuItem value={2} primaryText="English" />
                    <MenuItem value={3} primaryText="Burmese" />
                    <MenuItem value={4} primaryText="Chinese" />
                </SelectField>
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PHONE")}
                value={this.state.volunteer.phone}
                style={theme.volunteerForm.textBox}
                />  
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PASSWORD")}
                value={this.state.volunteer.password}
                style={theme.volunteerForm.textBox}
                type="password"
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_REPEATPASSWORD")}
                value={this.state.volunteer.repeatpassword}
                style={theme.volunteerForm.textBox}
                type="password"
                /> 
                <DatePicker 
                    hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE")}
                    value={this.state.volunteer.openingDate}
                    style={theme.volunteerForm.textBox}
                
                />
                <DatePicker 
                    hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_CLOSINGDATE")}
                    value={this.state.volunteer.openingDate}
                    style={theme.volunteerForm.textBox}
                
                />
                <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_SUPERVISOR")}
                value={this.state.volunteer.organisationUnitGroups[0].id}
                style={theme.volunteerForm.textBox}
                onChange={this.handleSelectSupervisor.bind(this)}
                >
                    {this.renderSupervisor()}
                </SelectField>
                <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PATHER")}
                value={this.state.volunteer.parent.id}
                style={theme.volunteerForm.textBox}
                onChange={this.handleSelectParent.bind(this)}
                >
                    {this.renderParthers()}
                </SelectField>
              </div>)
    }
}
export default EditOu;