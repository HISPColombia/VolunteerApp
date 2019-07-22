import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton';
import Supervised from 'material-ui/svg-icons/action/account-circle';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
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


//My Components
import EditOu from './EditOu';
import SettingSr from './SettingSr';
import DHIS2Api from './DHIS2API';
import setting from '../setting.json'

const localStyle = {
    Main: {
        marginTop: 48
    },
    Dialog: {
        maxWidth: 900
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
            countUser: 0,
            OUList: [],
            OUGList: [],
            UsersList: [],
            openEditOu: false,
            openDialogMove: false,
            openSetting: false,
            OUSelected: null,
            OUGSelected: null,
            disabledSetting: true
        }
    }
    async getSupervisors() {
        const D2API = new DHIS2Api(this.props.d2);
        const OUGList = await D2API.getOrgUnitGroups("&filter=id:eq:" + setting.orgUnitGroupSet);
        this.setState({ OUGList: OUGList[0].organisationUnitGroups });
    }

    async getOrgUnit(filter) {
        const D2API = new DHIS2Api(this.props.d2);
        const OUList = await D2API.getOrgUnit("&filter=organisationUnitGroups.id:eq:" + filter);
        this.setState({ OUList, countUser: OUList.length });
    }
    async getUsers() {
        const D2API = new DHIS2Api(this.props.d2);
        const UsersList = await D2API.getUsers("&paging=false");
        this.setState({ UsersList });
    }
    //Buscar que el usuario exista en la lista  
    findUser(userCode) {
        return this.state.UsersList.find(user => {
            if (user.userCredentials.username == userCode) {
                return user;
            }
        })
    }
    handleOpenVolunteer(OUSelected) {
        var volunterUser = {}
        if (OUSelected != undefined)
            volunterUser = this.findUser(OUSelected.code);
        this.setState(
            {
                openEditOu: true,
                OUSelected,
                volunterUser
            });
    };

    handleCloseVolunteer() {
        this.setState({ openEditOu: false });
    };

    handleOpenDialog() {
        this.setState(
            {
                openDialogMove: true,
            });
    };

    handleCloseDialogMove() {
        this.setState({ openDialogMove: false });
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

    handleSaveSetting() {
        const D2API = new DHIS2Api(this.props.d2);
        //Create 
        if (this.state.fistSetting == true)
            D2API.setSetting(this.state.settingApp);
        else //update
            D2API.upSetting(this.state.settingApp);
        this.handleCloseSetting();
    }


    handleSelectSupervisor(event, index, value) {
        let volunteer = this.state.volunteer.orgUnitGroups
        volunteer["orgUnitGroups"] = [{ id: value }]
        this.setState({ volunteer });
        this.getOrgUnit(value);
        let disabledSetting = false;
        const OUGSelected = value;
        this.setState({ OUGSelected })
        this.setState({ disabledSetting })
    }

    async getSetting() {
        const D2API = new DHIS2Api(this.props.d2);
        //get Setting
        const settingApp = await D2API.getSetting()
        //first time
        let fistSetting = false;
        if (Object.keys(settingApp).length == 0)
            fistSetting = true;
        this.setState({ settingApp, fistSetting });
        //
    }

    renderSupervisor() {
        return this.state.OUGList.map(group => {
            return (
                <MenuItem value={group.id} primaryText={group.name} />
            )
        })
    }

    renderDialogEditOU() {
        return (
            <div>
                <Dialog
                    title={this.state.OUSelected != null ? this.props.d2.i18n.getTranslation("TITLE_DIALOG_EDIT") : this.props.d2.i18n.getTranslation("TITLE_DIALOG_CREATE")}
                    modal={false}
                    open={this.state.openEditOu}
                    onRequestClose={() => this.handleCloseVolunteer()}
                    style={localStyle.Dialog}
                >
                    <EditOu d2={this.props.d2} volunterUser={this.state.volunterUser} volunteerOU={this.state.OUSelected} handleClose={() => this.handleCloseVolunteer()} mode={this.state.OUSelected != null ? "edit" : "create"} />
                </Dialog>
            </div>
        )

    }

    renderDialogSettingsSr() {
        const D2API = new DHIS2Api(this.props.d2);
        const { d2 } = this.props;
        const actions = [
            <RaisedButton
                label={d2.i18n.getTranslation("BTN_CANCEL")}
                primary={true}
                keyboardFocused={false}
                onClick={() => this.handleCloseSetting()}
                style={{ margin: 5 }}
            />,
            <RaisedButton
                label={d2.i18n.getTranslation("BTN_SAVE")}
                primary={true}
                keyboardFocused={true}
                onClick={() => this.handleSaveSetting(D2API)}
                style={{ margin: 5 }}
            />


        ];
        return (
            <div>
                <Dialog
                    title={this.props.d2.i18n.getTranslation("TITLE_DIALOG_SETTING")}
                    actions={actions}
                    modal={false}
                    open={this.state.openSetting}
                    onRequestClose={() => this.handleCloseSetting()}
                    style={localStyle.Dialog}
                >
                    <SettingSr d2={this.props.d2} OUGSelected={this.state.OUGSelected} />
                </Dialog>
            </div>
        )

    }

    renderDialogMove() {
        const { d2 } = this.props;
        const actions = [
            <RaisedButton
                label={d2.i18n.getTranslation("BTN_CANCEL")}
                primary={true}
                keyboardFocused={true}
                onClick={() => this.handleCloseDialogMove()}
                style={{ margin: 5 }}
            />,
            <RaisedButton
                label={d2.i18n.getTranslation("BTN_DISCARD")}
                primary={true}
                keyboardFocused={true}
                onClick={() => this.handleCloseDialogMove()}
                style={{ margin: 5 }}
            />
        ];
        return (
            <div>
                <Dialog
                    title={this.props.d2.i18n.getTranslation("TITLE_DIALOG_MOVE")}
                    actions={actions}
                    modal={false}
                    open={this.state.openDialogMove}
                    onRequestClose={() => this.handleCloseDialogMove()}
                >
                    <p>{this.props.d2.i18n.getTranslation("TITLE_DIALOG_MESSAGE")}</p>
                </Dialog>
            </div>
        )
    }

    renderOUTable() {
        const OUList = this.state.OUList
        return OUList.map(ou => {
            return (
                <TableRow className="col-hide"> key={ou.id}>
                    <TableRowColumn className="colIni">{ou.name}</TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus /></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus /></TableRowColumn>
                    <TableRowColumn className="colEnd">{ou.lastUpdated}</TableRowColumn>
                    <TableRowColumn className="colEdit">
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        >
                            <MenuItem primaryText="Edit" leftIcon={<PersonEdit />} onClick={() => this.handleOpenVolunteer(ou)} />
                            <MenuItem primaryText="Move" leftIcon={<PersonMove />} onClick={() => this.handleOpenDialog()} />
                            <MenuItem primaryText="Disabled" leftIcon={<PersonDisabled />} />
                        </IconMenu>
                    </TableRowColumn>
                </TableRow>
            )
        })

    }
    componentDidMount() {
        this.getSupervisors()
        this.getUsers()
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.OUGList != nextState.OUGList) {
            this.handleSelectSupervisor("", "", nextState.OUGList[0].id)
        }
        return true;
    }

    render() {
        const { d2 } = this.props;
        return (
            <div className='contMain'>
                <div className='barApp'>
                    <div className='barAppLeft'>
                        <SelectField
                            floatingLabelText={d2.i18n.getTranslation("LABEL_SUBRECIPIENT")}
                            value={this.state.volunteer.orgUnitGroups[0].id}
                            style={theme.volunteerForm.textBox}
                            onChange={this.handleSelectSupervisor.bind(this)}
                        >
                            {this.renderSupervisor()}
                        </SelectField>
                        <Badge
                            badgeContent={this.state.countUser}
                            primary={true}
                            badgeStyle={{ top: -8, right: 0, width: 36, height: 36 }}
                        >

                        </Badge>
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
                    {this.renderDialogMove()}
                </div>
                <FloatingActionButton style={localStyle.fabButom} onClick={() => this.handleOpenVolunteer()}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }
}
Main.propTypes = {
    d2: React.PropTypes.object.isRequired
}
export default Main
