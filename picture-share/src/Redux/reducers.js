/* eslint-disable */

import { 
    ADD_FILE, 
    TOGGLE_UPLOADER, 
    TOGGLE_SIDEBAR, 
    SET_PAGINATOR_VALUE, 
    TOGGLE_PICTURE_MODAL,
    SET_PICTURE_ID,
    SET_PICTURE_KEYWORD,
    SET_PICTURE_SOURCE,
    SET_PICTURE_TOTAL,
    SET_PICTURE_PATH,
    SET_PICTURE_NAME  
} from './actions'


const initialState = {
    fileToUpload: 'nofile',
    formEnabled: false,
    sidebarEnabled: false,
    paginatorValue: 1,
    pictureModalState: false,
    modalPictureID: 0,
    modalPictureKeyword: '',
    modalPictureFromSearch: false,
    modalPictureTotal: 0,
    modalPicturePath: '',
    modalPictureName: ''
}
  

function setFile(state = initialState, action)
{

  
    switch (action.type)
    {
        case ADD_FILE:
            return Object.assign({}, state, { fileToUpload: action.file })
            break;

        case TOGGLE_UPLOADER:
            return Object.assign({}, state, { formEnabled:!state.formEnabled})
            break;
            

        case TOGGLE_SIDEBAR:
            return Object.assign({}, state, { sidebarEnabled:!state.sidebarEnabled})
            break;


        case SET_PAGINATOR_VALUE:
            return Object.assign({}, state, { paginatorValue: action.paginatorValue})
            break;

        case TOGGLE_PICTURE_MODAL:
            return Object.assign({}, state, { pictureModalState: !state.pictureModalState})
            break;

        case SET_PICTURE_ID:
            return Object.assign({}, state, { modalPictureID: action.modalPictureID})
            break;

        case SET_PICTURE_KEYWORD:
            return Object.assign({}, state, { modalPictureKeyword: action.modalPictureKeyword})
            break;
        
        case SET_PICTURE_SOURCE:
            return Object.assign({}, state, { modalPictureFromSearch: action.modalPictureFromSearch})
            break;
        
        case SET_PICTURE_TOTAL:
            return Object.assign({}, state, { modalPictureTotal: action.modalPictureTotal})
            break;    

        case SET_PICTURE_PATH:
            return Object.assign({}, state, { modalPicturePath: action.modalPicturePath})
            break;    


        case SET_PICTURE_NAME:
            return Object.assign({}, state, { modalPictureName: action.modalPictureName})
            break;   

        default:
            return state;
            break;    
    }

}




export default setFile