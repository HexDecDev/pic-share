import React, { Component } from 'react';
import { Checkbox, Form, Dropdown, Message, Button,  Modal,  Grid } from 'semantic-ui-react'
import './FileUploadForm.css';
import FileUpload from "./FileUpload";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addFile, toggleUploader } from '../Redux/actions'

const options = [
    { key: 'meme', text: 'Meme', value: 'meme' },
    { key: 'anime', text: 'Anime', value: 'anime' },
    { key: 'wallpaper', text: 'Wallpaper', value: 'wallpaper' }
  ]


class FileUploadForm extends Component
{
    constructor(props) {
        super(props);
        this.state = {  
            name : "",
            link: "",
            tags: [],
            category: "general",
            isPrivate: false,
            isAccepted: false,
            isSuccess: false,
            isError: false,
            fileToUpload: null
        }
        
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value});
    }

    handleCheckbox = (e, props) => {
        this.setState({ [props.name]: props.checked});
    }

    handleDropdown = (e, props) => {
        this.setState({ [props.name]: props.value});  
    }

    formSubmit = () => {
        console.log(this.state.tags);
    }

    сlearForm = () => {
        this.setState({name : "", link: "", tags: [], isPrivate: false, isAccepted: false});
        this.props.actions.addFile('nofile');

    }

    onMessageSubmit = () => {
        const { fileToUpload } = this.props.fileToUpload;
        if (fileToUpload.name) this.setState({fileToUpload:fileToUpload});
        this.props.onSubmit({name:this.state.name, link:this.state.link, tags:this.state.tags,
             privateContent:this.state.isPrivate, category:this.state.category, fileToUpload:fileToUpload});
        this.сlearForm();

    }

    toggleUploadWindow = () => 
    {
        this.props.actions.toggleUploader();
    }


    render()
    {

        const { fileToUpload } = this.props.fileToUpload;
        const { formEnabled } = this.props.formEnabled;

        var enableForm = (this.state.name && (this.state.link||fileToUpload.name) && this.state.tags.length > 0 && this.state.isAccepted) ? true : false;
        var fileSuccess = (this.props.response === "success") ? true : false;
        var fileError = (this.props.response === "error") ? true : false;
        var linkVal;
        linkVal =  (fileToUpload.name) ? fileToUpload.name : this.state.link;


        return(
            <div id = "upload_form">



                  <Modal open = {formEnabled} size = 'tiny' dimmer='blurring' >
                    <Modal.Header>
                        <Grid>
                            <Grid.Column floated='left' width={5}> 
                                Select picture
                            </Grid.Column>
                        
                            <Grid.Column floated='right' width={2}> 
                                <Button onClick = {this.toggleUploadWindow}  type="button" icon = 'remove' size='tiny' /> 
                            </Grid.Column>    
                        </Grid>
                    </Modal.Header>

                    <Modal.Content >
                    <Form onSubmit={this.onMessageSubmit} success = {fileSuccess} error = {fileError}>
                    
                    <Form.Field >
                        <input placeholder='Name' name = 'name' value = {this.state.name} onChange = {this.handleChange} />
                    </Form.Field>

                    <Form.Field >
                        <div id = 'link_field'>
                            <div id = 'upload_button'><FileUpload /></div>
                            <div id = 'upload_link'><input placeholder='Link'  disabled = {fileToUpload.name} name = 'link' value = {linkVal} onChange = {this.handleChange} /></div>
                        </div>
                        
                    </Form.Field>
                    
                    <Form.Field>
                        <Dropdown placeholder='Tags' fluid multiple name = 'tags' selection value = {this.state.tags} onChange = {this.handleDropdown} options={options}  />

                    </Form.Field>

                    <Form.Field>
                        <Checkbox slider name='isPrivate' label='Приватный контент '  checked = {this.state.isPrivate} onChange = {this.handleCheckbox}/>
                    </Form.Field>

                    <Form.Field>
                        <Checkbox slider name='isAccepted' label='Я отдаю отчет своим действиям' checked = {this.state.isAccepted} onChange = {this.handleCheckbox} />
                    </Form.Field>

                        
                        

                        <Button.Group>
                            <Form.Button primary disabled = {!enableForm} content='Отправить' />
                            <Button.Or text = ' ' />
                            <Form.Button onClick = {this.сlearForm}  type="button" content='Очистить' />
                        </Button.Group>

                        <Message
                        success
                        header='Все хорошо'
                        content="Трудно представить что могло быть и хуже"
                        />

                        <Message
                        error
                        header='Ошибка загрузки'
                        content="Проверьте правильность файла/ссылки и попробуйте еще раз. Да, я мог бы написать парсер ошибки, но мне лень, а сервер вам ответил НЕТ!"
                        />
                </Form>
  
                    
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
} 

const mapState = ({ fileToUpload, formEnabled })  => ({ fileToUpload: { fileToUpload }, formEnabled: {formEnabled}}); 
const mapDispatch = (dispatch) => ({ actions: bindActionCreators({ addFile, toggleUploader }, dispatch) }); 

export default connect(mapState,mapDispatch)(FileUploadForm);

//export default FileUploadForm;