import React, { useState } from 'react'

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RadioButton from 'material-ui/RadioButton';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left'
import IconButton from 'material-ui/IconButton';
import {grey600} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    TableFooter
} from 'material-ui/Table';
import { disable } from 'colors';

export default class AutoComplete extends React.Component{
    constructor(props){
        super(props);
        this.state={
            subCenterSelected:"",
            disabled:false
        }
    }
render(){
    return (
        <div>

            <TextField
                hintText={this.props.d2.i18n.getTranslation("LABEL_VOLUNTEER_PARENT") + " *"}
                onChange={(e,v)=>{this.setState({subCenterSelected:v,disabled:false});this.props.onUpdateInput(v)}}
                value={this.state.subCenterSelected}
            />
            {this.props.OUList.organisationUnits.length >= 1 && this.state.disabled==false ? 
            <Paper zDepth={2} style={{ position: "absolute", zIndex: 100, bottom: 0, width: "95%", height: 200, top: 40 }}>
                <Table height={"150"}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width:'60%',textAlign:"left"}}>SubCenter Name</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'30%',textAlign:"left"}}>TownShip</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'10%'}}></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} >
                        {this.props.OUList.organisationUnits.map(ob=>{
                            return(
                                <TableRow key={ob.id}>
                                
                            <TableRowColumn style={{width:'60%' ,textAlign:"left"}}>{ob.name}</TableRowColumn>
                            <TableRowColumn style={{width:'30%' ,textAlign:"left"}}>{ob.parent.parent.name}</TableRowColumn>
                            <TableRowColumn style={{width:'10%'}}>
                            <RadioButton
                                value="light"
                                label="Simple" 
                                onClick={()=>{this.setState({subCenterSelected:ob.name,disabled:true});this.props.onNewRequest(ob)}}                       
                            />
                            </TableRowColumn>
                            </TableRow>
                            )
                        })} 
                    </TableBody>
                    <TableFooter  adjustForCheckbox={true} >
                            <TableRow>
                            <TableRowColumn colSpan="3" style={{justifyContent: 'flex-end', display: 'flex',alignItems:"center"}}>
                                  <span style={{verticalAlign:"middle"}}> {((this.props.OUList.pager.page-1)*50)+1}-{this.props.OUList.pager.page*50} of {this.props.OUList.pager.total}</span>
                                   <IconButton disabled={this.props.OUList.pager.page==1?true:false} onClick={()=>this.props.onUpdateInput(this.state.subCenterSelected,this.props.OUList.pager.page-1)}><ChevronLeft color={grey600} /></IconButton>
                                   <IconButton disabled={this.props.OUList.pager.page==this.props.OUList.pager.pageCount?true:false} onClick={()=>this.props.onUpdateInput(this.state.subCenterSelected,this.props.OUList.pager.page+1)}><ChevronRight color={grey600} /></IconButton>
                               
                            </TableRowColumn>                            
                            </TableRow>
                        </TableFooter>
                </Table>
            </Paper> : ""}

        </div>
    )
}
}