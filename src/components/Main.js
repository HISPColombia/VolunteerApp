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
import theme from '../theme'


//My Components
import EditOu from './EditOu';
import SettingSr from './SettingSr';
import DHIS2Api from './DHIS2API';

const localStyle = {
    Main: {
        marginTop: 48
    },
    Dialog: {
        maxWidth: 900
    }

}

let countUser = 0;

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
                lastUpdated:""
            },
            OUList: [],
            OUGList: [],
            openEditOu: false,
            openSetting: false,
            OUSelected: null,
            OUGSelected: null,
            disabledSetting: true
        }
    }

    async getSupervisors() {
        const D2API = new DHIS2Api(this.props.d2);
        const OUGList = await D2API.getOrgUnitGroups("&filter=level:eq:6");
        this.setState({ OUGList });
    }

    async getOrgUnit(filter) {
        const D2API = new DHIS2Api(this.props.d2);
        const OUList = await D2API.getOrgUnit("&filter=organisationUnitGroups.id:eq:" + filter);
        this.setState({ OUList });
    }

    handleOpenVolunteer(OUSelected) {
        this.setState(
            {
                openEditOu: true,
                OUSelected
            });
    };

    handleCloseVolunteer() {
        this.setState({ openEditOu: false });
    };

    handleOpenSetting(OUGSelected) {
        console.log(OUGSelected)
        this.setState(
            {
                openSetting: true,
                OUGSelected
            });
    };

    handleCloseSetting() {
        this.setState({ openSetting: false });
    };

    handleSelectSupervisor(event, index, value) {
        let volunteer = this.state.volunteer.orgUnitGroups
        volunteer["orgUnitGroups"] = [{ id: value }]
        this.setState({ volunteer });
        this.getOrgUnit(value);
        let disabledSetting=false;
        this.setState({disabledSetting})
    }

    renderSupervisor() {
        return this.state.OUGList.map(group => {
            return (
                <MenuItem value={group.id} primaryText={group.name} />
            )
        })
    }

    renderDialogEditOU() {
        const actions = [
            <RaisedButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onClick={() => this.handleCloseVolunteer()}
            />,
        ];
        return (
            <div>
                <Dialog
                    title={this.props.d2.i18n.getTranslation("TITLE_DIALOG_EDIT")}
                    actions={actions}
                    modal={false}
                    open={this.state.openEditOu}
                    onRequestClose={() => this.handleCloseVolunteer()}
                    style={localStyle.Dialog}
                >
                    <EditOu d2={this.props.d2} volunteer={this.state.OUSelected} />
                </Dialog>
            </div>
        )

    }

    renderDialogSettingsSr() {
        const actions = [
            <RaisedButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onClick={() => this.handleCloseSetting()}
            />,
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
                    <SettingSr d2={this.props.d2} volunteer={this.state.OUGSelected} />
                </Dialog>
            </div>
        )

    }

    renderOUTable() {
        const OUList = this.state.OUList
        countUser = OUList.length
        return OUList.map(ou => {
            return (
                <TableRow className="col-hide"> key={ou.id}>
                    <TableRowColumn className="colIni">{ou.name}</TableRowColumn> 
                    <TableRowColumn className="colMiddle"><FlagStatus/></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus/></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus/></TableRowColumn>
                    <TableRowColumn className="colMiddle"><FlagStatus/></TableRowColumn>
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

    render() {
        const { d2 } = this.props;
        this.getSupervisors()
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
                            badgeContent={countUser}
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
                </div>
            </div>
        )
    }
}
Main.propTypes = {
    d2: React.PropTypes.object.isRequired
}
export default Main