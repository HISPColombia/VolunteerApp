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
import {red500,grey500,green500,yellow500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

//My Components
import EditOu from './EditOu';
import SettingSr from './SettingSr';
import DHIS2Api from './DHIS2API';
import { TextField } from 'material-ui';


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
            countUser:-1,
            OUList: [],
            OUGList: [],
            OURemoteList:[],
            UsersList:[],
            openEditOu: false,
            openSetting: false,
            OUSelected: null,
            OUGSelected: { id: "" },
            disabledSetting: false,
            openmsg:false,
            message:"",
            searchByName:"",
            openMove:false
        }
    }
    async getSetting() {
        const D2API = new DHIS2Api(this.props.d2);
        const settingApp = await D2API.getSetting();
        this.setState({settingApp });  
    }
    async getCurrentUser(){
        const D2API = new DHIS2Api(this.props.d2);
        return await D2API.getCurrentUser();
        //this.setState({currentUser});
    }
    async getSubRecipient(subrecipient) {
        const D2API = new DHIS2Api(this.props.d2);
        const OUGList = await D2API.getOrgUnitGroups("&filter=id:eq:" + this.state.settingApp.subrecipient);
        const currentUser= await this.getCurrentUser()

        var nOUGListGroup=OUGList[0].organisationUnitGroups.filter(ougs=>ougs.userGroupAccesses.find(usg=>currentUser.userGroups.find(curg=>usg.id==curg.id)))
        var nOUGList=OUGList[0].organisationUnitGroups.filter(oug=>oug.userAccesses.find(usA=>usA.id==currentUser.id))
        this.setState({ OUGList:nOUGListGroup.concat(nOUGList)});
        if(subrecipient==undefined)
            this.handleSelectSubrecipient("","",this.state.OUGList[0])
        else
            this.handleSelectSubrecipient("","",subrecipient)  
    }

    async getOrgUnit(filter,filter2) {
        const D2API = new DHIS2Api(this.props.d2);
        var OUList=[] 
        if(filter2==undefined)
            filter2=this.state.searchByName  
        if(filter2.length>=2){
            OUList = await D2API.getOrgUnit("&filter=organisationUnitGroups.id:eq:" + filter+"&query="+filter2+"&pageSize=25");        
            this.setState({ OUList,countUser:(OUList==undefined?0:OUList.length)});
        }
        else{
            this.setState({ OUList,countUser:-1});
        }

    }
    
    async getOrgUnit_RemoteServer(filter,filter2) {
        const D2API = new DHIS2Api(this.props.d2);
        var OURemoteList=[] 
        if(filter2==undefined)
            filter2=this.state.searchByName  
        if(filter2.length>=2){
            OURemoteList = await D2API.getExternalOrgUnit(this.state.settingApp,"&filter=organisationUnitGroups.id:eq:" + filter+"&query="+filter2+"&pageSize=25");        
            this.setState({ OURemoteList});
        }
        else{
            this.setState({ OURemoteList});
        }

    }
    async getUsers(filter){
        const D2API = new DHIS2Api(this.props.d2);
        var UsersList=[]
        if(filter==undefined)
            filter=this.state.searchByName
        if(filter.length>=2)
            UsersList=await D2API.getUsers("&paging=false&query="+filter);
        this.setState({UsersList});
    }
    async getOUPrograms(){
        const D2API = new DHIS2Api(this.props.d2);
        var OUProgram=[]
        OUProgram=await D2API.getOUProgram(this.state.settingApp.program);
        this.setState({OUProgram});
    }
    
      //Buscar que el usuario exista en la lista  
     findUser(userCode){
        return this.state.UsersList.find(user=>{           
            if(user.userCredentials.username==userCode){
                return user;
            }                
        })
      }
      //Verificar que la OU esté asociada al programa
    findOUinProgram(ouid){
        return this.state.OUProgram.organisationUnits.find(ou=>{           
            if(ou.id==ouid){
                return ou;
            }                
        })
      }
    
    checkUser(ou,user){
        if(user==undefined)
            return red500
        else{
            if(user.userCredentials.disabled==true && ou.closedDate!="")
                return grey500
            else
                if((user.userCredentials.disabled==true && ou.closedDate==undefined)||(user.userCredentials.disabled==false && ou.closedDate!=undefined))
                    return yellow500
                else
                    return green500
        }
           
      }
      checkOrgUnit(ou){
          const value=this.state.OURemoteList.find(ouEx=>{
              return ouEx.id==ou.id
          })
        if(value==undefined)
            return red500
        else{
           
          return green500
        }
           
      }

    handleSetValueForm(key, value, event, index) {
        this.setState({searchByName:value})
        this.getOrgUnit(this.state.volunteer.orgUnitGroups[0].id, value);
        this.getUsers(value);
        if(this.state.settingApp.modeSetting=="Local_and_remote"){
            this.getOrgUnit_RemoteServer(this.state.volunteer.orgUnitGroups[0].id, value)
        }

        
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

    async handleCloseVolunteer(subrecipient) {
        this.setState({ openEditOu: false });
        await this.getOUPrograms()
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
        this.getSetting()
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
    
    renderDialogMove(){
        return(
            <Dialog
              title="Move Volunteer"
              actions={<RaisedButton
                label="Close"
                primary={true}
                keyboardFocused={true}
                onClick={()=>this.setState({openMove: false})}
              />}
              modal={false}
              open={this.state.openMove}
              onRequestClose={()=>this.setState({openMove: false})}
            >
              It is not possible to move a volunteer. You should disable the account and create another one for the new SR. This is done to preserve the historical data.
            </Dialog>
          )
    }

    async disabledVolunteer(user,ou){
        const D2API = new DHIS2Api(this.props.d2);
        if(user==undefined){
            this.setState({openmsg:true,message:"Warinig, User does't available"})
        }else{                  
            const respUser=await D2API.disabledUser(user.id,{userCredentials: {disabled: true}})
        }
        var f = new Date();
        ou["closedDate"]= f;
        const respOUSaved = await D2API.upOrgUnit(ou); //status: "OK"
        if (respOUSaved.status != "OK") {
            this.setState({openmsg:true,message:"Error disabling volunteer, check the OrgUnit"})
        }
        else{
            this.setState({openmsg:true,message:"Volunteer sucessfully disabled"})
        }

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
        if(OUList.length==0){
            return (
                <TableRow className="col-hide" key={"OU1"}>
                     <TableRowColumn className="colIni" style={{textAlign:'center', color:'red'}} colSpan={6} >{this.state.countUser==-1?"To display volunteers, enter a search criteria above":"There are no user that match ["+this.state.searchByName+"] in the subrecipient. Try a different subrecipient"}</TableRowColumn>
                </TableRow>
            )
        }
        return OUList.map(ou => {
            const user=this.findUser(ou.code);
            const ouExist=this.findOUinProgram(ou.id)
            return (
                <TableRow className="col-hide" key={ou.id}>
                    <TableRowColumn className="colIni">{ou.name}</TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus color={this.state.settingApp.modeSetting=="Local_and_remote"?this.checkOrgUnit(ou):""} /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus color={this.checkUser(ou,user)} /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus color={ouExist==undefined?red500:green500} /></TableRowColumn>
                    <TableRowColumn className="colEnd"> {user==undefined?"":(user.userCredentials.lastLogin==undefined?"Not logged yet":user.userCredentials.lastLogin)}</TableRowColumn>                  
                    <TableRowColumn className="colEdit">
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        >
                            <MenuItem primaryText="Edit" leftIcon={<PersonEdit />} onClick={() => this.handleOpenVolunteer(ou)} />
                            <MenuItem primaryText="Move" leftIcon={<PersonMove />} onClick={()=>this.setState({openMove: true})}/>
                            <MenuItem primaryText="Disabled" leftIcon={<PersonDisabled />}  onClick={()=>this.disabledVolunteer(user,ou)}/>
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
        await this.getOUPrograms()
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
                            badgeContent={this.state.countUser==-1?0:this.state.countUser}
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
                        autoFocus 
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
                    {this.renderDialogMove()}
                </div>
                <div className='tableVolunteer'>
                    <Table fixedHeader={true} style={{ tableLayout: "auto" }}>
                        <TableHeader displaySelectAll={false} className='titleTable'>
                            <TableRow>
                                <TableHeaderColumn className="colIniHeader">Volunteer</TableHeaderColumn>
                                <TableHeaderColumn className="colMiddleHeader">Remote OU</TableHeaderColumn>
                                <TableHeaderColumn className="colMiddleHeader">User account</TableHeaderColumn>
                                <TableHeaderColumn className="colMiddleHeader">Associated to program</TableHeaderColumn>
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
