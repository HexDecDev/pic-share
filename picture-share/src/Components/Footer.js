import React, { Component } from 'react';
import './Footer.css';
import { Form, Input,  Button, Icon, Popup, Header, Message } from 'semantic-ui-react'
import axios from 'axios';
import {apiPrefix} from '../config.json'

const style = {
    borderRadius: 0,
    padding: '2em',
    
    
  }

//<Button icon labelPosition='left' size='mini' color='red' inverted>
class Footer extends Component
{
    
    constructor(props) {
        super(props);
        this.state = {  
            login: '',
            password: '',
            loginError: false
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value});
    }

    //Spizjeno so stackoverflow I ya ne bojus' ob etom zayavit'
    //Ну, не совсем. Я все же адаптировал. 
    delete_cookie = (name) => {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    logout = (e)  => {

        var sid = document.cookie.split('=')[1];

        if (sid && sid.length > 0) 
        {
            axios.get(apiPrefix + "/removesession/" + sid + '/').then(res => 
        {
            this.delete_cookie('sessionID');
            document.location.reload(true);
        })
        }
    };


    login = () => {

        axios.get(apiPrefix + "/login/" + this.state.login + "/" + this.state.password).then(res =>
    {
        document.cookie = "sessionID=" + res.data;
        document.location.reload(true);
    })
    .catch(error =>
        {
            this.setState({loginError : true});
        });

    };

    render()
    {
        var loginForm;
        var userLoggedIn = (this.props.username.length > 0);

        if(userLoggedIn){
            loginForm = <Button onClick = {this.logout} icon labelPosition='left' size='mini' color='violet' inverted><Icon name='sign out'  />Logout</Button>
        }
        else{
            loginForm = 
            <div>

                <Popup
                                trigger={<Button icon labelPosition='left' size='mini' color='red' inverted><Icon name='lock' />Private Zone</Button>}
                                on='click'
                                hideOnScroll
                                style={style}
                                wide
                                
                            >

                <Header as='h4'>Туда ли ты зашел?</Header>
                
                <Form error = {this.state.loginError} >
                    <Form.Field >
                        <Input icon='spy' iconPosition='left' placeholder='ID' name = 'login' value = {this.state.login} onChange = {this.handleChange}>
                        </Input>
                    </Form.Field>
    
                    <Form.Field >
                        <Input icon='key' iconPosition='left' placeholder='Key' name = 'password' value = {this.state.password} onChange = {this.handleChange}>
                        </Input> 
                    </Form.Field>
    
    
                    <Form.Button primary onClick = {this.login} disabled = {!(this.state.login.length > 0 && this.state.password.length > 0)} content='Да, я зашел туда' />
    
                    <Message
                            success
                            header='Все хорошо'
                            content="Трудно представить что могло быть и хуже"
                            />
    
                    <Message
                            error
                            header='Нет'
                            content="Все же ты зашел не туда"
                            />
    
                </Form>  

                </Popup>    
            
            </div>

            
        }

        

        return (

        <div id = 'app_footer'>
            <div id = 'footer_text'>HxDx Prod</div>
            <div id = 'login_btn'>
                {loginForm}
            </div>
        
        </div>
        );
    }
}

export default Footer;