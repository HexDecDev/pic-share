import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addFile } from '../Redux/actions'
import { Button, Icon } from 'semantic-ui-react'



class FileUpload  extends Component
{

    putFileInStore = (file) =>
    {
        this.props.actions.addFile(file[0]);

    }


    render()
    {
        //const { fileToUpload } = this.props.fileToUpload;
        return(

        <Dropzone multiple = {false} accept="image/jpeg, image/png" className = "ignore" onDrop={ (files) => this.putFileInStore(files)} >
            <Button icon type="button" >
                <Icon name='plus' />
            </Button>
        </Dropzone>

        )
    }
}



const mapState = ({ fileToUpload }) => ({ fileToUpload: { fileToUpload } }); 
const mapDispatch = (dispatch) => ({ actions: bindActionCreators({ addFile }, dispatch) }); 

export default connect(mapState, mapDispatch)(FileUpload);