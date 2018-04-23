//Types of actions
export const ADD_FILE = 'ADD_FILE'
export const TOGGLE_UPLOADER = 'TOGGLE_UPLOADER'
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const SET_PAGINATOR_VALUE = 'SET_PAGINATOR_VALUE'
export const TOGGLE_PICTURE_MODAL = 'TOGGLE_PICTURE_MODAL'
export const SET_PICTURE_ID = 'SET_PICTURE_ID'
export const SET_PICTURE_KEYWORD = 'SET_PICTURE_KEYWORD'
export const SET_PICTURE_SOURCE = 'SET_PICTURE_SOURCE'
export const SET_PICTURE_TOTAL = 'SET_PICTURE_TOTAL'
export const SET_PICTURE_PATH = 'SET_PICTURE_PATH'
export const SET_PICTURE_NAME = 'SET_PICTURE_NAME'
//Another useful consts

export const AccessLevels = {

    PRIVATE: 'PRIVATE',
    PUBLIC: 'PUBLIC'

}

//Generators
export function addFile(file) {
    return { type: ADD_FILE, file }
}

export function toggleUploader(uploaderOpen) {
    return { type: TOGGLE_UPLOADER, uploaderOpen }
}

export function toggleSidebar(sidebarOpen) {
    return { type: TOGGLE_SIDEBAR, sidebarOpen }
}

export function setPaginatorValue(paginatorValue){
    return {type: SET_PAGINATOR_VALUE, paginatorValue}
}

export function tooglePictureModal(picureModalState){
    return {type: TOGGLE_PICTURE_MODAL, picureModalState}
}

export function setPictureID(modalPictureID){
    return {type: SET_PICTURE_ID, modalPictureID}
}

export function setPictureKeyword(modalPictureKeyword){
    return {type: SET_PICTURE_KEYWORD, modalPictureKeyword}
}

export function setPictureSource(modalPictureFromSearch){
    return {type: SET_PICTURE_SOURCE, modalPictureFromSearch}
}

export function setPictureTotal(modalPictureTotal){
    return {type: SET_PICTURE_TOTAL, modalPictureTotal}
}

export function setPicturePath(modalPicturePath){
    return {type: SET_PICTURE_PATH, modalPicturePath}
}

export function setPictureName(modalPictureName){
    return {type: SET_PICTURE_NAME, modalPictureName}
}