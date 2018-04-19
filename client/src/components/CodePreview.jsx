import React from 'react'
import { Embed } from 'semantic-ui-react'
import { BACK_ROOT } from '../api-config';

const CodePreview = ({ code, appid, folderName}) =>
    <div>
        {code.includes('index.html') &&
            <Embed
                active={true}
                url={`${BACK_ROOT}/${appid}/${folderName}`}
            />
        }
    </div>
export default CodePreview