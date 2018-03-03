import React from 'react'
import { Breadcrumb } from 'semantic-ui-react'

const Navigator = ({ id, folder, handleClick }) =>
  <Breadcrumb size='huge'>
    <Breadcrumb.Section link onClick={() => handleClick("Main")}>{id}</Breadcrumb.Section>
    <Breadcrumb.Divider icon='right angle' />
    <Breadcrumb.Section>{folder}</Breadcrumb.Section>
  </Breadcrumb>
export default Navigator