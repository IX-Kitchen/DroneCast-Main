import React from 'react'
import { Breadcrumb } from 'semantic-ui-react'

const Navigator = ({ id, folder, handleClick }) =>
  <Breadcrumb size='huge'>
    <Breadcrumb.Section link value='app' onClick={handleClick}>{id}</Breadcrumb.Section>
    <Breadcrumb.Divider icon='right angle' />
    {/* {codeFolder !== '' ? (
      <span>
        <Breadcrumb.Section link value={'folder'} onClick={handleClick}>{folder}</Breadcrumb.Section>
        <Breadcrumb.Divider icon='right angle' />
        <Breadcrumb.Section>{codeFolder}</Breadcrumb.Section>
      </span>
    ) : (
      
      )} */}
    <Breadcrumb.Section>{folder}</Breadcrumb.Section>
  </Breadcrumb>
export default Navigator