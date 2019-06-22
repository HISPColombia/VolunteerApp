
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import theme from '../theme'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DHIS2Api from './DHIS2API';
import setting from '../setting.json'

const localstyle={
    divForm:{overflowY: 'auto', height:600}
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
                pather:"",
                supervisor:""               
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
        const OUGList=await D2API.getOrgUnitGroups("&filter=id:eq:"+setting.orgUnitGroupSet);
        this.setState({OUGList:OUGList[0].organisationUnitGroups});
   }
    componentDidMount(){
       if(this.props.volunteer){
        this.setState({volunteer:this.props.volunteer})
        let volunteer=this.state.volunteer
        let dateOpening=new Date(volunteer.openingDate)
        volunteer.openingDate=dateOpening;
        this.setState({
            volunteer
        })  
    }
        this.getParthers();
        this.getSupervisor();
    
    }
    handleSetValueForm(key, value,event, index) {
        let volunteer=this.state.volunteer
        volunteer[key]=value
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
        console.log(this.state.volunteer)
        const names=fullname.split("-")
        return(<div style={localstyle.divForm}>
              <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_SUPERVISOR")}
                value={this.state.volunteer.supervisor}
                style={theme.volunteerForm.textBox}
                onChange={(event,index,value)=>this.handleSetValueForm("supervisor",value,event,index)}
                >
                {this.renderSupervisor()}
                </SelectField>
                <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PATHER")}
                value={this.state.volunteer.pather}
                style={theme.volunteerForm.textBox}
                onChange={(event,index,value)=>this.handleSetValueForm("pather",value,event,index)}
                >
                {this.renderParthers()}
                </SelectField>
               <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_ID")}
                value={this.state.volunteer.code}
                style={theme.volunteerForm.textBoxAuto}
                onChange={(event,value)=>this.handleSetValueForm("code",value,event)}
                disabled={true}
                fullWidth={true}
                />
                <br/>
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FISTNAME")}
                value={names[1]}
                style={theme.volunteerForm.textBox}
                onChange={(event,value)=>this.handleSetValueForm("fistname",value,event)}
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LASTNAME")}
                value={names[2]}
                style={theme.volunteerForm.textBox}
                onChange={(event,value)=>this.handleSetValueForm("lastname",value,event)}
                />
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FULLNAME")}
                value={fullname}
                style={theme.volunteerForm.textBoxAuto}
                disabled={true}
                fullWidth={true}
                />   
                <br/>
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_VILLAGE")}
                value={this.state.village}
                style={theme.volunteerForm.textBox}
                onChange={(event,value)=>this.handleSetValueForm("village",value,event)}
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_VILLAGEGPS")}
                value={this.state.villagegps}
                style={theme.volunteerForm.textBox}
                onChange={(event,value)=>this.handleSetValueForm("villagegps",value,event)}
                />
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PHONE")}
                value={this.state.volunteer.phone}
                style={theme.volunteerForm.textBox}
                onChange={(event,value)=>this.handleSetValueForm("phone",value,event)} 
                />
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_EMAIL")}
                value={this.state.volunteer.email}
                style={theme.volunteerForm.textBox}
                onChange={(event,value)=>this.handleSetValueForm("email",value,event)} 
                />                  
                <DatePicker 
                    hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_OPENINGDATE")}
                    value={this.state.volunteer.openingDate}
                    style={theme.volunteerForm.textBox}
                    onChange={(event,value)=>this.handleSetValueForm("openingDate",value,event)}
                
                />
                <DatePicker 
                    hintText={d2.i18n.getTranslation("LABEL_VOLUNTEER_CLOSINGDATE")}
                    value={this.state.volunteer.closingDate}
                    style={theme.volunteerForm.textBox}
                    onChange={(event,value)=>this.handleSetValueForm("closingDate",value,event)}
                
                />
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PASSWORD")}
                value={this.state.volunteer.password}
                style={theme.volunteerForm.textBox}
                type="password"
                onChange={(event,value)=>this.handleSetValueForm("password",value,event)} 
                /> 
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_REPEATPASSWORD")}
                value={this.state.volunteer.repeatpassword}
                style={theme.volunteerForm.textBox}
                type="password"
                onChange={(event,value)=>this.handleSetValueForm("repeatpassword",value,event)}                
                /> 
                 <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LANGUAGE")}
                value={this.state.volunteer.language}
                style={theme.volunteerForm.selectField}
                onChange={(event,value)=>this.handleSetValueForm("language",value,event)}
                >
                    <MenuItem value={2} primaryText="English" />
                    <MenuItem value={3} primaryText="Burmese" />
                    <MenuItem value={4} primaryText="Chinese" />
                </SelectField>
              
              </div>)
    }
}

export default EditOu;