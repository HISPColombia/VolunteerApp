import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const localStyle = {
    Main: {
        marginTop: 48
    }
}
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            OUList:[]
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
        const param="fields=id,level,name"
        this.getResourceSelected(resource,param).then(res =>{
            this.setState(
                {OUList:res[resource]}
            )
        })
    }
    renderOUTable(){
        const OUList=this.state.OUList
        return OUList.map(ou=>{
            return(
                <TableRow key={ou.id}>
                   <TableRowColumn>{ou.id}</TableRowColumn>
                   <TableRowColumn>{ou.level}</TableRowColumn>
                   <TableRowColumn>{ou.name}</TableRowColumn>
               </TableRow> 
           )
        })
        
    }
    render() {
        return (
            <div style={localStyle.Main}>
                <FlatButton label="Default" onClick={()=>this.getOrgUnit()} />
                <br />
                <Table>
                    <TableHeader displaySelectAll={false}>>
                         <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Level</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                             {this.renderOUTable()}                
                    </TableBody>
                </Table>

            </div>
        )
    }
}
Main.propTypes = {
    d2: React.PropTypes.object.isRequired
}
export default Main