import React, { Component } from 'react';
import { Menu, Label } from 'semantic-ui-react'


class MenuItem extends Component
{





    render()
    {
        //{this.props.countPics(this.props.data.key)}
        var name = this.props.data.value;
        var labelColor = (this.props.currentTag === this.props.data.key) ? 'pink' : 'grey';

        return(


            <Menu.Item name = {this.props.data.key} onClick = {this.props.switchTag}>
                        <Label color={labelColor}>{this.props.countPics}</Label>
                        {name}
            </Menu.Item>
        );
    }
}

export default MenuItem;