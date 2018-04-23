import React, { Component } from 'react';
import FileUploadForm from './FileUploadForm';
import FileList from './FileList';
import Footer from './Footer';
import AppHeader from './Header';
import MenuItem from './MenuItem';
import './Content.css';
import axios from 'axios';
import { bindActionCreators } from 'redux'
import { setPaginatorValue, tooglePictureModal, setPictureName,
    setPictureID, setPictureSource, setPictureKeyword, setPictureTotal, setPicturePath } from '../Redux/actions'
import { serverPath, imageFolder } from './config.json';
import {apiPrefix} from '../config.json'

import {  Menu,  Icon,   Pagination, Input, Modal,  Button } from 'semantic-ui-react'

import { connect } from 'react-redux'


//import { bindActionCreators } from 'redux';
//import { connect } from 'react-redux';


var tagsVals = [
    { key: '', value: 'Все подряд', count: 0},
    { key: 'meme', value: 'Мемасы', count: 0},
    { key: 'anime', value: 'Говниме', count: 0 },
    { key: 'wallpaper', value: 'Обоины', count: 0 }
  ]



class Content extends Component
{

    constructor(props) {
        super(props);
        this.state = {  
            data:[],
            response: '',
            totalPics: 0,
            currentTag: '',
            currentTagName: '',
            picsCounts:[],
            searchString: '',
            searchPages: 0,
            onSearch: false,
            modalPictureLink: '',
            username: ''
        }
    }

    getImagesFromServer = (skip, limit, tags) =>{
        if (tags) axios.get(apiPrefix + "/pics/" + skip + "/" + limit + "/" + tags, {withCredentials: true})
        .then(response => {
            this.setState({data : response.data});
        })
        .catch();

        else axios.get(apiPrefix + "/pics/" + skip + "/" + limit + "/" , {withCredentials: true})
        .then(response => {
            this.setState({data : response.data});
        })
        .catch();

    }


    getImagesForModal = (e, {content, name}) =>{

        const {modalPictureFromSearch} = this.props.modalPictureFromSearch;
        const {modalPictureKeyword} = this.props.modalPictureKeyword;
        const {modalPictureID} = this.props.modalPictureID;
        const {modalPictureTotal} = this.props.modalPictureTotal;
        

        var mpID = modalPictureID;

        console.log('first id: ' + modalPictureID);
        if (name === 'positive' && mpID < modalPictureTotal-1)
        {
            mpID++;
        }


        if (name === 'negative' && modalPictureID > 0)
        {
            mpID--;
        }

        if (modalPictureFromSearch) {

            axios.get( apiPrefix + "/search/" + modalPictureKeyword + "/" + (mpID) + '/' + 1, {withCredentials: true})
            .then(response => {
                //Крики Эпифанцева от уровня доеба стандартных варнингов, которые мне лень
                // eslint-disable-next-line
                var imgLink = serverPath + '/' + imageFolder + '/' + 'general/' + response.data[0].filename;
                
                this.props.actions.setPicturePath(imgLink);
                this.props.actions.setPictureName(response.data[0].name);
            })
            .catch();
        }


        else {

            if (modalPictureKeyword) axios.get(apiPrefix + "/pics/" + mpID + "/" + 1 + "/" + modalPictureKeyword , {withCredentials: true})
            .then(response => {
                // eslint-disable-next-line
                var imgLink = serverPath + '/' + imageFolder + '/' + 'general/' + response.data[0].filename;
                this.props.actions.setPicturePath(imgLink);
                this.props.actions.setPictureName(response.data[0].name);

            })
            .catch();
    
            else axios.get(apiPrefix + "/pics/" + mpID + "/" + 1 + "/" , {withCredentials: true})
            .then(response => {
                // eslint-disable-next-line
                var imgLink = serverPath + '/' + imageFolder + '/' + 'general/' + response.data[0].filename;
                this.props.actions.setPicturePath(imgLink);
                this.props.actions.setPictureName(response.data[0].name);
            })
            .catch();
        }



        this.props.actions.setPictureID(mpID);


    }

    postImageToServerFromDevice = (data) => {

        
        const formData = new FormData();
        formData.append('file',data.fileToUpload);
        formData.append('category',data.category);
        formData.append('name',data.name);
        formData.append('tags',data.tags);
        formData.append('privateContent',data.privateContent);

        const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

        axios.post(apiPrefix + '/uploadfromdevice/', formData,config)
          .then(response =>  {
            this.setState({response : response.data});
            setTimeout(() => {this.getImagesFromServer(0,8)}, 5000);
          })
          
          .catch(error => {
            this.setState({response : error});
          });

    }

    postImageToServer = (data) => {

        if (data.fileToUpload !== 'nofile') this.postImageToServerFromDevice(data);
        
        else 
        {
            axios.post(apiPrefix + '/uploadonlink/', data)
              .then(response =>  {
                this.setState({response : response.data});
                setTimeout(() => {this.getImagesFromServer(0,8)}, 5000);
              })
              
              .catch(error => {
                this.setState({response : error});
              });
        }
            
    }

    changePage = (e, { activePage }) =>
    {
        
        if (!this.state.onSearch)this.getImagesFromServer((activePage-1)*8,8, this.state.currentTag);
        else this.searchPics((activePage-1)*8,8, this.state.searchString);
        this.props.actions.setPaginatorValue(activePage);
    }

    componentWillMount()
    {


        var sid = document.cookie.split('=')[1];
        

        if (sid && sid.length > 0) 
        {
            axios.get(apiPrefix + "/userbyid/" + sid + '/').then(res => 
        {
            this.setState({username : res.data});
        })
        }

        tagsVals.map((data, index) => {

            if (data.key) axios.get(apiPrefix + "/count/" + data.key + '/', {withCredentials: true})
            .then(response => {
                var objIndex = tagsVals.findIndex((obj => obj.key === response.data[0]._id));
                tagsVals[objIndex].count = response.data[0].count;

            })
            .catch();
    
            else  axios.get(apiPrefix + "/count/", {withCredentials: true})
            .then(response => {
                tagsVals[0].count = response.data;
                this.props.actions.setPictureTotal(response.data);
                
            })

            .catch();
            
            return 'Реакт, иди нахуй блядь со своими варнингами'
        });



    }
    componentDidMount() {

        

        this.getImagesFromServer(0,8, this.state.currentTag);
        this.getTagName('');
        this.props.actions.setPictureTotal()
    }

    switchTag = (e, { name }) =>
    {
        this.setState({onSearch:false});
        this.setState( {currentTag: name} );
        this.getImagesFromServer(0,8, name);
        this.getTagName(name);
        this.props.actions.setPaginatorValue(1);
        this.props.actions.setPictureSource(false);
        this.props.actions.setPictureKeyword(name);
        this.props.actions.setPictureTotal(Math.ceil(tagsVals[tagsVals.findIndex((obj => obj.key === name))].count));

    }

    state = { visible: false }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    getTagName = (tag) =>
    {
        var filtered=tagsVals.filter(function(item){
            return item.key===tag;         
        });
        this.setState( {currentTagName: filtered[0].value}); 
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value});
    }

    searchPics = (skip, limit, searchString) => 
    {

        this.setState({onSearch:true});

        
        axios.get(apiPrefix + "/search/" + searchString , {withCredentials: true})
            .then(response => {
                this.setState({searchPages: Math.ceil(response.data.length / 8)});
                this.setState({currentTagName: 'Поиск: ' + searchString});
                this.props.actions.setPictureTotal(response.data.length);
            })
            .catch();

        axios.get(apiPrefix + "/search/" + searchString + "/" + skip + '/' + limit, {withCredentials: true})
            .then(response => {
                this.setState({data : response.data});
            })
            .catch();

            
    }


    togglePicWindow = () =>
    {
        this.props.actions.tooglePictureModal();

    }

    searchFormhandle = () =>
    {
        //console.log(this.state.searchString)
        if (this.state.searchString.length > 0 && this.state.searchString.charAt(0) !== ' ')
        {
            this.searchPics(0,8, this.state.searchString);
            this.props.actions.setPictureSource(true);
            this.props.actions.setPictureKeyword(this.state.searchString);
        }

        else 
        {
            this.setState( {currentTag: ''} );
            this.getImagesFromServer(0,8, '');
            this.getTagName('');
            this.props.actions.setPaginatorValue(1);
            this.props.actions.setPictureSource(false);
            this.props.actions.setPictureKeyword('');
        }
    }

    grabLinkFromSingleFile = (dataIn) =>
    {
        this.setState( {modalPictureLink: dataIn} );
    }


    render(){


        var totalPages;
        var paginatorVisible;

        //Семь бед - один ответ! Костыль и велосипед!

        if (!this.state.onSearch) 
            totalPages = Math.ceil(tagsVals[tagsVals.findIndex((obj => obj.key === this.state.currentTag))].count / 8);
        else totalPages = this.state.searchPages;

        //Когда в семантик уи не добавили проперти визибилити и ты наговнокодил его сам
        paginatorVisible = ( (this.state.searchPages > 0 && this.state.onSearch ) || 
            (!this.state.onSearch) ) ? true : false;

        const {paginatorValue} = this.props.paginatorValue;
        const {pictureModalState} = this.props.pictureModalState;
        const {modalPicturePath} = this.props.modalPicturePath;
        const {modalPictureName} = this.props.modalPictureName;


    
        return(
            <div id = 'content_wrapper'>

                <AppHeader />
                
                <FileUploadForm onSubmit={this.postImageToServer} response = {this.state.response} />
                <div id = 'main_content'>
                    <div id = 'left_column'>
                    
                    <Input
                        name = 'searchString'
                        icon={<Icon name='search' onClick={this.searchFormhandle} circular link />}
                        placeholder='Search...'
                        fluid
                        value = {this.state.searchString}
                        onChange = {this.handleChange}
                    />

                    <Menu vertical id = 'nav_menu'>

                    {tagsVals.map((data, index) => <MenuItem 
                                data={data} 
                                key={Math.random() + index}
                                countPics={tagsVals[index].count}
                                switchTag = {this.switchTag}
                                currentTag = {this.state.currentTag}
                                />)}
 
                    </Menu>

                    </div>
                    <div id = 'content_body'>

                       
                    <Modal open={pictureModalState} onClose={this.togglePicWindow} id = 'fullscreen_image_modal'>

                        <div>    
                        <Button name ='negative' color='black' floated='left' size='massive' icon disabled = {this.state.onLoad} onClick = {this.getImagesForModal}>
                        <Icon name='chevron left' />
                        </Button>
                        </div>

                        <div id = 'fullscreen_image'> 
                          <div id = 'fullscreen_image_content'>
                            <img src={modalPicturePath} alt='Иди нахуй реакт, заебал со своими варнингами'/>
                             <div id = 'fullscreen_image_content_footer'>
                             <h2>{modalPictureName}</h2>
                             <a href={modalPicturePath} target="_blank" > <Icon name='download' /> Скачать изображение</a>
                             </div>
                          </div>      
                        </div> 

                        <div> 
                        <Button floated='right' color='black' size='massive' name='positive' icon disabled = {this.state.onLoad} onClick = {this.getImagesForModal}>
                        <Icon name='chevron right' />
                        </Button></div> 
                        
                    </Modal>




                        <FileList 
                                    data = {this.state.data} 
                                    getPics = {this.getImagesFromServer} 
                                    totalPics = {this.state.totalPics} 
                                    currentTag = {this.state.currentTag}
                                    currentTagName = {this.state.currentTagName}
                                    switchTag = {this.switchTag}
                                    currentPage = {paginatorValue}
                                    grabLinkFromSingleFile =  {this.grabLinkFromSingleFile}
                                    loggedin = {(this.state.username.length > 0) ? true : false}
                                    />
                        <div id = 'pics_paginator'>

                        <Pagination  
                                        className = {(paginatorVisible) ? '' : 'invisible'}
                                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                        totalPages={totalPages}
                                        onPageChange  = {this.changePage}
                                        activePage = {paginatorValue}
                        />
                        </div>
                    </div>
                </div>
                <Footer username = {this.state.username}/>
                
            </div>
        );
        
    }
}

const mapState = ({ sidebarEnabled, paginatorValue, modalPicturePath, modalPictureName,
    pictureModalState, modalPictureID, modalPictureFromSearch, modalPictureKeyword, modalPictureTotal })  => 
({ sidebarEnabled: {sidebarEnabled}, paginatorValue:{paginatorValue }, pictureModalState: {pictureModalState}, 
    modalPictureID: {modalPictureID}, modalPictureFromSearch: {modalPictureFromSearch}, modalPictureKeyword: {modalPictureKeyword},
    modalPictureTotal: {modalPictureTotal}, modalPicturePath: {modalPicturePath}, modalPictureName: {modalPictureName}
}); 

const mapDispatch = (dispatch) => ({ actions: bindActionCreators({ 
    setPaginatorValue, tooglePictureModal, setPictureID, setPictureSource, setPictureKeyword, setPictureTotal, setPicturePath, setPictureName
 }, dispatch) }); 

export default connect(mapState, mapDispatch)(Content);
