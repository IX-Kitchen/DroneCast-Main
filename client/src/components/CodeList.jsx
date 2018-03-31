import React from 'react'
import { Embed } from 'semantic-ui-react'
import { BACK_ROOT } from '../api-config';

const CodeList = ({ code, appid, getData, folderName, index }) =>

    <div>
        {code.includes('index.html') &&
            <Embed
                active={true}
                url={`${BACK_ROOT}/${appid}/${folderName}`}
            />
        }
    </div>
export default CodeList