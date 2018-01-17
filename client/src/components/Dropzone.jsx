import React from 'react'
import DropzoneComponent from 'react-dropzone-component';
import './css/dropzone.min.css';
import './css/filepicker.css';

//var myDropZone;

var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: false,
    postUrl: '/api/upload'
};
var djsConfig = {
    acceptedFiles: "image/*, video/*",
    autoProcessQueue: true,
    addRemoveLinks: false,
    paramName: "imgUploader"
};

var eventHandlers = {
    //init: (dropzone) => { myDropZone = dropzone},
    error: (file, error, xhr) => console.log("Error component",error, xhr)
    //success: (file) => console.log("Success"),
}
export default class Dropzone extends React.Component {

    componentWillMount(){
        djsConfig.params = {
            appid: this.props.appid,
            index: this.props.index,
            subindex: this.props.subindex
        }
        eventHandlers.complete = this.props.dropCallback;
    }
    
    render() {
        return (
            <DropzoneComponent config={componentConfig}
                eventHandlers={eventHandlers}
                djsConfig={djsConfig} />
        );
    }
}