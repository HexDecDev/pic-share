import React, { Component } from 'react';
import './Header.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toggleUploader, toggleSidebar } from '../Redux/actions'

import { Button, Icon, Header  } from 'semantic-ui-react'

class AppHeader extends Component
{

    toggleUploadWindow = () => 
    {
        this.props.actions.toggleUploader();
    }

    toggleSidebar = () => 
    {
        this.props.actions.toggleSidebar();
    }

    render()
    {

        //const { uploaderOpen } = this.props.uploaderOpen;
        //const { sidebarOpen } = this.props.sidebarOpen;

        return(

        <div id = 'app_header'>



            <div id = 'header_title'>
            
            <Header as='h2' inverted >
                <Icon name='camera retro' />
                <Header.Content>
                    Антипро*бин
                </Header.Content>
            </Header>
            </div>    
            
            <div id = 'header_controls'>
                <Button icon labelPosition='left' inverted color='green' onClick = {this.toggleUploadWindow} >
                    <Icon name='upload' />
                    Загрузить
                </Button>
            </div>

        </div>
            

        );
    }
}

const mapState = ({ uploaderOpen, sidebarOpen })  => ({ uploaderOpen: {uploaderOpen}, sidebarOpen: {sidebarOpen} }); 
const mapDispatch = (dispatch) => ({ actions: bindActionCreators({ toggleUploader, toggleSidebar }, dispatch) }); 

export default connect(mapState,mapDispatch)(AppHeader);