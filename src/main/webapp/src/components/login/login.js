/**
 * Created by Li Jian on 2017/05/26.
 */
import styles from '../../../styles/components/login/login.css'
import React, { Component, PropTypes } from 'react'
import { Alert } from 'antd'
const orgSuffix = '@nd'

export default class login extends Component {
    static displayName = 'login'
    static propTypes = {
        isLoggedIn: PropTypes.bool,
        redirect: PropTypes.func,
        onLogin: PropTypes.func,
        loginErr: PropTypes.string,
        location: PropTypes.object,
        userId: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            userClick: false,
            errMsg: '',
            isFocusPassword: false
        }
        this._handleUsernameChange = this.handleUsernameChange.bind(this)
        this._handlePasswordChange = this.handlePasswordChange.bind(this)
        this._showPwd = this.showPwd.bind(this)
        this._handleFormSubmit = this.handleFormSubmit.bind(this)
        this._blurPassword = this.blurPassword.bind(this)
        this._focusPassword = this.focusPassword.bind(this)
    }

    componentDidMount() {
        if (this.props.isLoggedIn) {
            this.props.redirect('/exam_setting')
        }
        this.userNameBox.focus()
        let { query } = this.props.location
        if (query && query.err == 'tokenout') {
            this.setState({
                errMsg: '登录信息已过期,请重新登录'
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn && nextProps.loginErr == '') {
            this.props.redirect('/exam_setting')
        }
    }

    handleUsernameChange(e) {
        this.setState({ username: e.currentTarget.value })
    }

    handlePasswordChange(e) {
        this.setState({ password: e.currentTarget.value })
    }

    showPwd() {
        this.setState({ showPassword: !this.state.showPassword })
    }

    handleFormSubmit(e) {
        e.preventDefault()
        this.setState({
            userClick: true,
            errMsg: ''
        })
        if (!this.state.username || this.state.username === '' || this.state.password === '') {
            return
        }
        let username = this.state.username
        let password = this.state.password
        this.props.onLogin({
            username: (/@/.test(username) ? username : username + orgSuffix),
            password
        })
    }

    blurPassword() {
        this.setState({
            isFocusPassword: false
        })
    }

    focusPassword() {
        if (this.state.showPassword) {
            return
        }
        this.setState({
            isFocusPassword: true
        })
    }

    render() {
        let errForUsername, errForPassword
        if (this.state.userClick === true) {
            errForUsername = this.state.username === '' ? '请输入用户名' : ''
            errForPassword = this.state.password === '' ? '请输入密码' : ''
        }
        let errorUsername = errForUsername ? <span className={`${styles['c-form__err']}`}>{errForUsername}</span> : null
        let errorPassword = errForPassword ? <span className={`${styles['c-form__err']}`}>{errForPassword}</span> : null
        return (
            <div>
                <div className={styles.loginBody}>
                    <div className={styles.loginRoad}></div>
                </div>
                <div className={styles.loginPanel}>
                    <div
                        className={styles.loginHi + '   ' + (this.state.isFocusPassword?styles.focusPassword:'')}></div>
                    <h1 className={styles.siteTitle}>React 前端脚手架</h1>
                    <form noValidate onSubmit={this._handleFormSubmit} className={`${styles['c-form']}`}>
                        <div>
                            <div className={`${styles['c-form__input']}`}>
                                <span className={styles['c-form__label']+' '+styles['c-form-name']}></span>
                                <input
                                    className={errForUsername ? `${styles['c-form__inputBox']} ${styles['c-form__inputBox--err']}` : `${styles['c-form__inputBox']}`}
                                    placeholder={'用户名'}
                                    type='text' value={this.state.username}
                                    ref={ (input)=>{this.userNameBox = input} }
                                    onChange={this._handleUsernameChange}/>
                                {errorUsername}
                            </div>
                            <div className={`${styles['c-form__input']}`}>
                                <span className={styles['c-form__label'] +' '+styles['c-form-pwd']}></span>
                                <input type={this.state.showPassword ? 'text' : 'password'}
                                       className={errForPassword ? `${styles['c-form__inputBox']} ${styles['c-form__inputBox--err']}` : `${styles['c-form__inputBox']}`}
                                       value={this.state.password}
                                       placeholder={'密码'}
                                       onFocus={this._focusPassword}
                                       onBlur={this._blurPassword}
                                       onChange={this._handlePasswordChange}/>
                                { this.state.showPassword ? <span className={`${styles['c-form__eye']}`}><img src='../../img/open_eye.png' title={'隐藏密码'} onClick={this._showPwd} width='18' height='18'/></span> : <span className={`${styles['c-form__eye']}`}><img src='../../img/close_eye.png' width='18' height='18' title={'显示密码'} onClick={this._showPwd}/></span> }
                                { errorPassword == null ? '' : errorPassword }
                            </div>
                        </div>
                        <div className={styles.loginFormBtm}>
                            {this.state.errMsg || this.props.loginErr ? <Alert message={this.state.errMsg || this.props.loginErr} type='error' showIcon /> : ''}
                            <input type='submit' value={'登录'} className={`${styles['c-form__btn']}`}/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
