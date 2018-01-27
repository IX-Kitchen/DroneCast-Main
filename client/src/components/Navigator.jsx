import React from 'react'
import { Breadcrumb } from 'semantic-ui-react'

const Navigator = (props) => (
  <Breadcrumb size='huge'>
    <Breadcrumb.Section link onClick={() => props.handleClick("Main")}>{props.id}</Breadcrumb.Section>
    <Breadcrumb.Divider icon='right angle' />
    <Breadcrumb.Section link onClick={() => props.handleClick("Folder")}>{props.folder}</Breadcrumb.Section>
    <Breadcrumb.Divider icon='right angle' />
    <Breadcrumb.Section active>{props.subfolder}</Breadcrumb.Section>
  </Breadcrumb>
)
export default Navigator