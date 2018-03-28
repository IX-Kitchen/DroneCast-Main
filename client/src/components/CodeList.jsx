import React from 'react'
import { } from 'semantic-ui-react'
import ModalAppUpload from './ModalAppUpload'

const CodeList = ({ code, appid, getData, folderName, index }) =>

    <div>
        <ModalAppUpload
            appid={appid} getData={getData}
            folder={folderName}
            index={index}
            folderName={folderName} />
    </div>
export default CodeList