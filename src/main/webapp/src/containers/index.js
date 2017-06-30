// 全局样式
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
//局域样式
import styles from '../../styles/app.css'

class index extends Component {
    static displayName = 'index'
    static propTypes = {
        children: PropTypes.object
    }

    render() {
        return <div>
                    {this.props.children}
                </div>
    }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(index)
