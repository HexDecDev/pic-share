import React, { Component } from 'react';
import { serverPath, imageFolder } from './config.json';
import { Card, Button, Modal, Image, Icon } from 'semantic-ui-react'
import Tag from './Tag';
import './SingleFile.css';
import { bindActionCreators } from 'redux'
import { tooglePictureModal, setPictureID, setPicturePath, setPictureName } from '../Redux/actions'
import { connect } from 'react-redux'
import axios from 'axios';
import {apiPrefix} from '../config.json'

class SingleFile extends Component
{

    state = {

        modalOpen:false

    }

    togglePicWindow = () =>
    {

        this.props.actions.tooglePictureModal();
        this.props.actions.setPictureID(this.props.index + ( (this.props.currentPage-1) * 8));
        //this.props.grabLinkFromSingleFile(serverPath + '/' + imageFolder + '/' + this.props.data.category + '/' + this.props.data.filename)
        this.props.actions.setPicturePath(serverPath + '/' + imageFolder + '/' + this.props.data.category + '/' + this.props.data.filename);
        this.props.actions.setPictureName(this.props.data.name);
    }


    deleteThisPicture = () =>
    {
        console.log(this.props.idfile);

        axios.get(apiPrefix + "/delme/" + this.props.idfile, {withCredentials: true})
        .then(response => {
            document.location.reload(true);
        })
        .catch();

    }


    render()
    {
        var {

            filename,
            category,
            date
            
        } = this.props.data;

        var tagsThis = this.props.data.tags.split(',');  

        var deleteButton;

        if (this.props.loggedin)
        {
            deleteButton = <div>
                


                        <Modal trigger={<Button size='mini' icon><Icon name = 'delete'/></Button>} size='tiny'>
                        
                        <Modal.Header>
                            Are you sure?
                        </Modal.Header>
                        <Modal.Content image>
                        <Image wrapped size='small' src={serverPath + '/' + imageFolder + '/' + category + '/' + filename} />

                        <Modal.Description>
                            <p>Do you <b>REALLY</b> want to dele this picture from the server?</p>
                            <p>This can't be undone!</p>
                        </Modal.Description>

                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick = {this.deleteThisPicture} positive icon='checkmark' labelPosition='right' content='Yes I am!' />
                        </Modal.Actions>
                        </Modal>

                </div>
        }

        else deleteButton = <div></div>

        //const { active } = this.state <Button onClick = {this.togglePicWindow} >{name}</Button> 
        var fixedDate = new Date(date);



        var style = 
        {
            backgroundImage: 'url(' + serverPath + '/' + imageFolder + '/' + category + '/' + filename + ')'
        };
        
    
        return(


            <Card>
             

                <a onClick = {this.togglePicWindow}><div className = 'card_image' style={style}></div></a>    

            
            

            <Card.Content>

              <Card.Header>
                
              </Card.Header>
              <Card.Meta>
                <span className='date'>
                <b>{fixedDate.toLocaleDateString()}</b> {fixedDate.toLocaleTimeString()}
                </span>
                
              </Card.Meta>
              <Card.Description>
                {tagsThis.map((tag) => <Tag data={tag} key={tag} switchTag={this.props.switchTag} />)}
                <Button.Group floated='right' size='mini'>

                {deleteButton}


                </Button.Group>
                
              </Card.Description>
            </Card.Content>
            
          </Card>


        );

    }

    
}


const mapState = ({ pictureModalState, modalPictureID })  => ({ pictureModalState: {pictureModalState}, modalPictureID: {modalPictureID} }); 
const mapDispatch = (dispatch) => ({ actions: bindActionCreators({ tooglePictureModal, setPictureID, setPicturePath, setPictureName }, dispatch) }); 

export default connect(mapState, mapDispatch)(SingleFile);
