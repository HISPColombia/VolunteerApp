import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


//My Components
import EditOu from './EditOu';


const localStyle = {
    Main: {
        marginTop: 48
    }
}
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            OUList:[],
            open: false,
            OUSelected:null
        }
    }
    async getResourceSelected(resource,param) {
        const d2 = this.props.d2;
        const api = d2.Api.getApi();
        let result = {};
        try {
            let res = await api.get('/' + resource+"?"+param);
            if (res.hasOwnProperty(resource)) {
                return res;
            }
        }
        catch (e) {
            console.error('Could not access to API Resource');
        }
        return result;
    }
    getOrgUnit(){
        const resource="organisationUnits"
        const param="fields=id,code,level,name,openingDate,closedDate,phoneNumber,organisationUnitGroups"
        this.getResourceSelected(resource,param).then(res =>{
            this.setState(
                {OUList:res[resource]}
            )
        })
    }

    handleOpen(OUSelected){
        this.setState(
            {
                open: true,
                OUSelected
            });
      };
    
      handleClose(){
        this.setState({open: false});
      };

    renderDialogEditOU(){
        const actions = [
            <RaisedButton
              label="Ok"
              primary={true}
              keyboardFocused={true}
              onClick={()=>this.handleClose()}
            />,
          ];
        return(
            <div>
            <Dialog
              title={this.props.d2.i18n.getTranslation("TITLE_DIALOG_EDIT")}
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={()=>this.handleClose()}
            >
                <EditOu d2={this.props.d2} volunteer={this.state.OUSelected} />             
            </Dialog>
          </div>
        )

    }
    renderOUTable(){
        const OUList=this.state.OUList
        return OUList.map(ou=>{
            return(
                <TableRow key={ou.id}>
                   <TableRowColumn>{ou.id}</TableRowColumn>
                   <TableRowColumn>{ou.level}</TableRowColumn>
                   <TableRowColumn>{ou.name}</TableRowColumn>
                   <TableRowColumn>
                   <IconButton tooltip="bottom-center" tooltipPosition="bottom-center" onClick={()=>this.handleOpen(ou)}>
                        <MoreVert />
                    </IconButton>
                   </TableRowColumn>
               </TableRow> 
           )
        })
        
    }
    render() {
        return (
            <div style={localStyle.Main}>
                <RaisedButton label="Get OrgUnit" onClick={()=>this.getOrgUnit()} />
                <br />
                <Table>
                    <TableHeader displaySelectAll={false}>>
                         <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Level</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Edit</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                             {this.renderOUTable()}                
                    </TableBody>
                </Table>
                {this.renderDialogEditOU()}

            </div>
        )
    }
}
Main.propTypes = {
    d2: React.PropTypes.object.isRequired
}
export default Main