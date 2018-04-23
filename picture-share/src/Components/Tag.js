import React, { Component } from 'react';

import {  Label  } from 'semantic-ui-react'


class Tag extends Component
{

    render()
    {
        var tag = this.props.data;
        //console.log(this.props.switchTag);

        return(
            <Label as='a' name = {tag} tag onClick = {this.props.switchTag} >{tag} </Label>
        )
    }


}

export default Tag;
