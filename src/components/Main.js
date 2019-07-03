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
import DHIS2Api from './DHIS2API';


const localStyle = {
    Main: {
        marginTop: 48
    },
    Dialog:{
        maxWidth:900
    }

}
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            OUList:[],
            UsersList:[],
            open: false,
            OUSelected:null
        }
    }
    async getOrgUnit(){
        const D2API = new DHIS2Api(this.props.d2);
        const OUList=await D2API.getOrgUnit("&filter=level:eq:7");
        this.setState({OUList});
    }
    async getUsers(){
        const D2API = new DHIS2Api(this.props.d2);
        const UsersList=await D2API.getUsers("&paging=false");
        this.setState({UsersList});
    }

    handleOpen(OUSelected){
       
        if(OUSelected!=undefined)
            this.setState(
                {
                    open: true,
                    OUSelected,
                    userSelected:this.findUser(OUSelected.code)
                });
        else
            this.setState(
                {
                    OUSelected:undefined,
                    open: true
                });
      };  
      //Buscar que el usuario exista en la lista  
      findUser(userCode){
        return this.state.UsersList.find(user=>{           
            if(user.userCredentials.username==userCode){
                return user;
            }                
        })
      }
    
      handleClose(){
        this.setState({open: false});
      };

    renderDialogEditOU(){
        return(
            <div>
            <Dialog
              title={this.props.d2.i18n.getTranslation("TITLE_DIALOG_EDIT")}
              modal={false}
              open={this.state.open}
              onRequestClose={()=>this.handleClose()}
              style={localStyle.Dialog}
            >
                <EditOu d2={this.props.d2} volunterUser={this.state.userSelected} volunteerOU={this.state.OUSelected} mode={this.state.OUSelected==undefined?"new":"edit"} handleClose={this.handleClose.bind(this)}/>             
            </Dialog>
          </div>
        )

    }
    renderOUTable(){
        const OUList=this.state.OUList
        let x=0;
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
    componentDidMount(){
        this.getOrgUnit();
        this.getUsers();      
    }
    componentDidUpdate(prevProps,prevState){
        ///testing
       // if(prevState.OUList.length!=this.state.OUList.length)
        //    this.handleOpen(this.state.OUList[0]);
    }
    render() {

        return (
            <div style={localStyle.Main}>
                <RaisedButton label="Create Volunteer" onClick={()=>this.handleOpen()} />
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