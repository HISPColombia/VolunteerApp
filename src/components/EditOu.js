
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import theme from '../theme'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
class EditOu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            volunteer: {
                id:"",
                firstName:"",
                fastName:""
            }
        }
    }
    componentDidMount(){
        let volunteer=this.props.volunteer
        let dateOpening=new Date(volunteer.openingDate)
        volunteer.openingDate=dateOpening;
        console.log(volunteer.openingDate)
        this.setState({
            volunteer
        })  
    }
    handleSelectLanguage(event, index, value) {
        let volunteer=this.props.volunteer
        volunteer["Language"]=value
        this.setState({volunteer});
    }
    handleSelectSupervisor(event, index, value) {
        let volunteer=this.props.volunteer
        volunteer["Supervisor"]=value
        this.setState({volunteer});
    }
    handleSelectPather(event, index, value) {
        let volunteer=this.props.volunteer
        volunteer["Pather"]=value
        this.setState({volunteer});
    }
    render(){
        const {d2}= this.props;
        return(<div>
               <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_ID")}
                value={this.state.volunteer.code}
                style={theme.volunteerForm.textBox}
                />
                <br/>
                <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_FISTNAME")}
                value={this.state.volunteer.name}
                style={theme.volunteerForm.textBox}
                /> 
                 <TextField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LASTNAME")}
                value={this.state.volunteer.name}
                style={theme.volunteerForm.textBox}
                />   
                 <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_LANGUAGE")}
                value={this.state.volunteer.Language}
                style={theme.volunteerForm.textBox}
                onChange={this.handleSelectLanguage.bind(this)}
                >
                    <MenuItem value={1} primaryText="Spanish" />
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
                value={this.state.volunteer.Supervidor}
                style={theme.volunteerForm.textBox}
                onChange={this.handleSelectSupervisor.bind(this)}
                >
                    <MenuItem value={1} primaryText="Supervidor1" />
                    <MenuItem value={2} primaryText="Supervidor2" />
                    <MenuItem value={3} primaryText="Supervidor3" />
                    <MenuItem value={4} primaryText="Supervidor4" />
                </SelectField>
                <SelectField
                floatingLabelText={d2.i18n.getTranslation("LABEL_VOLUNTEER_PATHER")}
                value={this.state.volunteer.Pather}
                style={theme.volunteerForm.textBox}
                onChange={this.handleSelectPather.bind(this)}
                >
                    <MenuItem value={1} primaryText="Pather1" />
                    <MenuItem value={2} primaryText="Pather2" />
                    <MenuItem value={3} primaryText="Pather3" />
                    <MenuItem value={4} primaryText="Pather4" />
                </SelectField>
              </div>)
    }
}
export default EditOu;