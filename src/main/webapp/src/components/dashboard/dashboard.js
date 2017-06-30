import styles from '../../../styles/components/dashboard/dashboard.css'
import { getCsHost } from '../../utils/configUtils.js'
import Menu from './leftMenu/menu'
import React, { Component, PropTypes } from 'react'
import { Popconfirm, Layout } from 'antd'
const { Header, Sider } = Layout

export default class dashboard extends Component {
    static displayName = 'dashboard'
    static propTypes = {
        children: PropTypes.object,
        onLogout: PropTypes.func,
        userId: PropTypes.string,
        userName: PropTypes.string,
        path: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            menuIdx: 1
        }
    }

    handleLogout() {
        if(this.props.onLogout && typeof this.props.onLogout == 'function') {
            this.props.onLogout()
        }
    }

    onhandleError(e) {
        e.currentTarget.src = '../../../img/ava.png'
    }

    render() {
        let avatarPath = `${getCsHost().avatar}/${this.props.userId}/${this.props.userId}.jpg?size=80`
        return (
            <Layout>
                <Header style={{ height: '88px' }}>
                    <a href='#/' className={styles.icon_nav_logo}>React 前端脚手架</a>
                    <Popconfirm placement='bottomRight' title='确定要退出登录吗?' onConfirm={this.handleLogout.bind(this)} okText='确定' cancelText='取消'>
                        <span className={styles.btn_exit} title='退出登录'/>
                    </Popconfirm>
                    <div className={styles.avatar_box}>
                        <img src={avatarPath} className={styles.avatar} onError={this.onhandleError} />
                        <span className={styles.name}>{this.props.userName}</span>
                    </div>
                </Header>
                <Layout>
                    <Sider width={240} style={{ background: '#333333', minHeight: 'calc(100vh - 88px)' }}>
                        <Menu path={this.props.path} userId={this.props.userId}/>
                    </Sider>
                    <Layout style={{ background: '#fff' }}>
                        {this.props.children}
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
