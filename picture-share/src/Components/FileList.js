import React, { Component } from 'react';
import SingleFile from './SingleFile';
import { Card, Label } from 'semantic-ui-react'
import './FileList.css';

class FileList extends Component
{
    constructor(props) {
        super(props);
        this.state = {  
            data:[]
        }
    }


    render()
    {        
        return(
            <div>
                <div id="pics">
                    <div id = 'pics_wrapper' >
                        <Label color='grey' basic size='big' id = 'label_wrapper'>{this.props.currentTagName}</Label>
                            <Card.Group itemsPerRow={4} stackable>
                                {this.props.data.map((pic, index) => 
                                <SingleFile 
                                data={pic}
                                idfile = {pic._id}
                                key={pic._id} 
                                switchTag={this.props.switchTag} 
                                index ={index}
                                currentPage = {this.props.currentPage}
                                grabLinkFromSingleFile =  {this.props.grabLinkFromSingleFile}
                                loggedin = {this.props.loggedin}
                                 />)}
                            </Card.Group>
                    </div>
                </div>
            </div>    
        );
    }
}



export default FileList;