import React from 'react'
import DropzoneComponent from 'react-dropzone-component';
import './css/dropzone.min.css';
import './css/filepicker.css';
import { API_ROOT } from '../api-config';

//var myDropZone;

var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: false,
    postUrl: API_ROOT + 'apps/appupload'
};
var djsConfig = {
    //acceptedFiles: "text/html,text/css,.js",
    autoProcessQueue: true,
    addRemoveLinks: false,
    renameFile: rename,
    paramName: "appUploader",
    dictDefaultMessage: "Drop your code here (Names with hyphen are not allowed)"
};

var eventHandlers = {
    //init: (dropzone) => { myDropZone = dropzone},
    error: (file, error, xhr) => console.log("Error in app dropzone", error, xhr),
    //success: (file) => console.log(file),
}
function rename(file) {
    if (file.fullPath !== undefined) {
        // It does not accept folder/file.js
        const temp = file.fullPath.replace(new RegExp('/', 'g'),"-")
        return temp
    }
}
const HTMLDrop = ({ appid, getData, folder, folderName, index }) => {

    // Folder = Drone
    // FolderName = DB bug, keep name
    djsConfig.params = {
        appid: appid,
        folder: folder,
        index: index,
        folderName: folderName
    }
    eventHandlers.complete = getData ? getData : undefined;
    return (
        <DropzoneComponent config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig} />
    );
}

export default HTMLDrop