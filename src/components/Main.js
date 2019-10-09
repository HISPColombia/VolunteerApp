import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton';

import Dialog from 'material-ui/Dialog';

import Badge from 'material-ui/Badge';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import MainStyle from '../css/main.css';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import PersonEdit from 'material-ui/svg-icons/image/edit';
import PersonMove from 'material-ui/svg-icons/action/swap-vert';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import PersonDisabled from 'material-ui/svg-icons/content/block';
import HelpIconMenu from 'material-ui/svg-icons/action/help-outline';
import FlagStatus from 'material-ui/svg-icons/av/fiber-manual-record';
import SelectField from 'material-ui/SelectField';
import theme from '../theme';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';

//My Components
import EditOu from './EditOu';
import SettingSr from './SettingSr';
import DHIS2Api from './DHIS2API';
import { TextField } from 'material-ui';
import { green500 } from 'material-ui/styles/colors';

const localStyle = {
    Main: {
        marginTop: 48
    },
    Dialog: {
        maxWidth: 900
    },
    DialogEdit: {
        maxWidth: 900,
        height:600
    },
    fabButom: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }

}


class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            volunteer: {
                id: "",
                firstName: "",
                lastName: "",
                name: "",
                parent: { id: "" },
                orgUnitGroups: [{ id: "" }],
                lastUpdated: ""
            },
            countUser:0,
            OUList: [],
            OUGList: [],
            UsersList:[],
            openEditOu: false,
            openSetting: false,
            OUSelected: null,
            OUGSelected: { id: "" },
            disabledSetting: false,
            openmsg:false,
            message:"",
            searchByName:""
        }
    }
    async getSetting() {
        const D2API = new DHIS2Api(this.props.d2);
        const settingApp = await D2API.getSetting();
        this.setState({settingApp });  
    }
    async getSubRecipient(subrecipient) {
        const D2API = new DHIS2Api(this.props.d2);
        const OUGList = await D2API.getOrgUnitGroups("&filter=id:eq:" + this.state.settingApp.subrecipient);
        this.setState({ OUGList:OUGList[0].organisationUnitGroups});
        if(subrecipient==undefined)
            this.handleSelectSubrecipient("","",this.state.OUGList[0])
        else
            this.handleSelectSubrecipient("","",subrecipient)  
    }

    async getOrgUnit(filter) {
        const D2API = new DHIS2Api(this.props.d2);
        var OUList=[]   
        if(this.state.searchByName.length>=3)
            OUList = await D2API.getOrgUnit("&filter=organisationUnitGroups.id:eq:" + filter+"&filter=name:like:"+this.state.searchByName+"&pageSize=25");        
        this.setState({ OUList,countUser:OUList.length});
    }
    async getUsers(){
        const D2API = new DHIS2Api(this.props.d2);
        var UsersList=[]
        if(this.state.searchByName.length>=3)
            UsersList=await D2API.getUsers("&paging=false&filter=name:like:"+this.state.searchByName);
        this.setState({UsersList});
    }
      //Buscar que el usuario exista en la lista  
     findUser(userCode){
        return this.state.UsersList.find(user=>{           
            if(user.userCredentials.username==userCode){
                return user;
            }                
        })
      }

    handleSetValueForm(key, value, event, index) {
        this.setState({searchByName:value})
        this.getOrgUnit(this.state.volunteer.orgUnitGroups[0].id);
        this.getUsers();
        
    }
    handleOpenVolunteer(OUSelected) {
        var volunterUser={}
        if(OUSelected!=undefined)
            volunterUser=this.findUser(OUSelected.code);
        this.setState(
            {
                openEditOu: true,
                OUSelected,
                volunterUser
            });
    };

    handleCloseVolunteer(subrecipient) {
        this.setState({ openEditOu: false });
        //this.getSubRecipient(subrecipient)
        this.getOrgUnit(subrecipient.id);
        this.getUsers()

    };
    handleMessagesApp(message){
        this.setState({
            message:message,
            openmsg: true,
          });
    }
    handleRequestClose(){
        this.setState({
            openmsg: false,
        });
      };
    handleOpenSetting(OUGSelected) {
        this.setState(
            {
                openSetting: true,
                OUGSelected
            });
    };
    handleCloseSetting() {
        this.setState(
            {
                openSetting: false,

            });
    };   

    handleSelectSubrecipient(event, index, value) {
        let volunteer = this.state.volunteer; 
        volunteer["orgUnitGroups"] = [value]
        this.setState({ volunteer });
        this.getOrgUnit(value.id);
        let disabledSetting = false;
        const OUGSelected = value;
        this.getSetting() 
        this.setState({ OUGSelected })
        this.setState({ disabledSetting })
    }


    renderSubrecipient() {
        return this.state.OUGList.map(group => {
            return (
                <MenuItem key={group.id} value={group} primaryText={group.name} />
            )
        })
    }

    renderDialogEditOU() {
        return (
            <div>
                <Dialog
                    title={(this.state.OUSelected!=null?this.props.d2.i18n.getTranslation("TITLE_DIALOG_EDIT"):this.props.d2.i18n.getTranslation("TITLE_DIALOG_CREATE"))+" on subrecipient "+this.state.volunteer.orgUnitGroups[0].name}
                    modal={false}
                    open={this.state.openEditOu}
                    style={localStyle.DialogEdit}
                >
                    <EditOu settingApp={this.state.settingApp} subrecipient={this.state.volunteer.orgUnitGroups[0]} d2={this.props.d2} volunterUser={this.state.volunterUser} volunteerOU={this.state.OUSelected} handleMessagesApp={this.handleMessagesApp.bind(this)}   handleClose={this.handleCloseVolunteer.bind(this)} mode={this.state.OUSelected!=null?"edit":"create"}/>
                </Dialog>
            </div>
        )

    }                                                  

    renderDialogSettingsSr() {
        const D2API = new DHIS2Api(this.props.d2);
        const { d2 } = this.props;
        return (
            <div>
                <Dialog
                    title={this.props.d2.i18n.getTranslation("TITLE_DIALOG_SETTING")}
                    modal={false}
                    open={this.state.openSetting}
                    onRequestClose={() => this.handleCloseSetting()}
                    style={localStyle.Dialog}
                >
                <SettingSr handleClose={() => this.handleCloseSetting()} d2={this.props.d2} OUGSelected={this.state.OUGSelected} />
                </Dialog>
            </div>
        )

    }

    renderOUTable() {
        const OUList = this.state.OUList
        return OUList.map(ou => {
            return (
                <TableRow className="col-hide" key={ou.id}>
                    <TableRowColumn className="colIni">{ou.name}</TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus color={green500} /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus color={this.findUser(ou.code)==undefined?red500:green500} /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus /></TableRowColumn>
                    <TableRowColumn className="colEnd">{ou.lastUpdated}</TableRowColumn>
                    <TableRowColumn className="colEdit">
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        >
                            <MenuItem primaryText="Edit" leftIcon={<PersonEdit />} onClick={() => this.handleOpenVolunteer(ou)} />
                            <MenuItem primaryText="Move" leftIcon={<PersonMove />} />
                            <MenuItem primaryText="Disabled" leftIcon={<PersonDisabled />} />
                        </IconMenu>
                    </TableRowColumn>
                </TableRow>
            )
        })

    }
    async componentDidMount(){
        await this.getSetting() 
        this.getSubRecipient(undefined)
        this.getUsers()
    }
    
    render() {
        const { d2 } = this.props;

        return (
            <div className='contMain'>
                <div className='barApp'>
                    <div className='barAppLeft'>
                        <SelectField
                            floatingLabelText={d2.i18n.getTranslation("LABEL_SUBRECIPIENT")}
                            value={this.state.volunteer.orgUnitGroups[0]}
                            style={theme.volunteerForm.textBox}
                            onChange={this.handleSelectSubrecipient.bind(this)}
                        >
                            {this.renderSubrecipient()}
                        </SelectField>
                        <Badge
                            badgeContent={this.state.countUser}
                            primary={true}
                            badgeStyle={{ top: -8, right: 0, width: 36, height: 36 }}
                        >
                         </Badge>
                        
                    </div>
                    <div className='barAppCenter'>
                    <TextField className="textToSEarch"
                        hintText="Type the name of the volunteer here"
                        floatingLabelText="Search for a Volunteer"
                        fullWidth={true}
                        value={this.state.searchByName}
                        onChange={(event, value) => this.handleSetValueForm("searchByName", value, event)}

                        />
                    </div>
                    <div className='barAppRight'><IconMenu className='appBarIconMore'
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    >
                        <MenuItem primaryText="Settings" leftIcon={<SettingsIcon />} disabled={this.state.disabledSetting} onClick={() => this.handleOpenSetting(this.state.OUGSelected)} />
                        <MenuItem primaryText="Help" leftIcon={<HelpIconMenu />} />
                    </IconMenu>
                    </div>
                    {this.renderDialogSettingsSr()}
                </div>
                <div className='tableVolunteer'>
                    <Table fixedHeader={true} style={{ tableLayout: "auto" }}>
                        <TableHeader displaySelectAll={false} className='titleTable'>
                            <TableRow>
                                <TableHeaderColumn className="colIniHeader">Volunteer</TableHeaderColumn>
                                <TableHeaderColumn className="colMiddleHeader">Local OU</TableHeaderColumn>
                                <TableHeaderColumn className="colMiddleHeader">Remote OU</TableHeaderColumn>
                                <TableHeaderColumn className="colMiddleHeader">User account</TableHeaderColumn>
                                <TableHeaderColumn className="colMiddleHeader">User group</TableHeaderColumn>
                                <TableHeaderColumn className="colEndHeader">Last login</TableHeaderColumn>
                                <TableHeaderColumn className="colEditHeader"></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {this.renderOUTable()}
                        </TableBody>
                    </Table>
                    {this.renderDialogEditOU()}
                </div>
                <FloatingActionButton style={localStyle.fabButom} onClick={() => this.handleOpenVolunteer()}>
                    <ContentAdd />
                </FloatingActionButton>
                <Snackbar
            open={this.state.openmsg}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={()=>this.handleRequestClose()}
        />
            </div>
        )
    }
}
Main.propTypes = {
    d2: React.PropTypes.object.isRequired
}
export default Main
