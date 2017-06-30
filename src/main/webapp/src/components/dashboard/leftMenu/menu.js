import React, { Component, PropTypes } from 'react'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const menuOptions = {
    examSetting: '/exam_setting',
    examList: '/exam_list',
    roleAdmin: '/role_admin'
}

export default class menu extends Component {
    static displayName = ''
    static propTypes = {
        path: PropTypes.string,
        userId: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            theme: 'dark',  //light
            currentKey: 'examSetting'
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.path != nextProps.path) {
            let currentMenu = ''
            for(let path in menuOptions) {
                if(menuOptions[path] == nextProps.path) {
                    currentMenu = path
                }
            }
            this.setState({ currentKey: currentMenu })
        }
    }

    componentWillMount() {
        let currentMenu = 'exam_setting'
        for(let path in menuOptions) {
            if(menuOptions[path] == this.props.path) {
                currentMenu = path
            }
        }
        this.setState({ currentKey: currentMenu })
    }

    handleClick(e) {
        this.setState({ currentKey: e.key })
        window.location.href = '#' + menuOptions[e.key]
    }

    render() {
        return (
            <div>
                <Menu mode='inline'
                      theme={this.state.theme}
                      style={{ width: 240 }}
                      defaultOpenKeys={[ 'examSetting','examAdmin', 'roleAdmin' ]}
                      selectedKeys={[ this.state.currentKey ]}
                      onClick={this.handleClick.bind(this)}>
                    <Menu.Item key='examSetting'><Icon type='copy'/>考试配置</Menu.Item>
                    <SubMenu key='examAdmin' title={<span><Icon type='setting'/>考试管理</span>}>
                        <Menu.Item key='examList'>考试列表</Menu.Item>
                    </SubMenu>
                    <Menu.Item key='roleAdmin'><Icon type='user-add'/>权限配置</Menu.Item>
                </Menu>
            </div>
        )
    }
}
