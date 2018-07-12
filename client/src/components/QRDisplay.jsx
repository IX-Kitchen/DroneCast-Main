import React from 'react'
import { Container } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import { API_ROOT } from '../api-config';

const QRCodeDisplay = ({ app }) =>
  <Container textAlign='center'
    children={<QRCode size={256} value={`${API_ROOT}apps/${app._id}/qr`} />} />
export default QRCodeDisplay