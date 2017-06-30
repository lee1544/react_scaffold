import React, { Component } from 'react'
import styles from '../../../../styles/components/common/error.css'

export default class error404 extends Component {
    static displayName = 'error404'

    render() {
        return (
            <div className={styles.warp}>
                <div className={styles.header_top}></div>
                <div className={styles.header}>
                    <h2>404, Page Not Found</h2>
                    <h5>Somebody really liked this page, or maybe your mis-typed the URL.</h5>
                </div>
                <div className={styles.content}>
                    <div className={styles.text}>
                        <p>Sorry, the document you were looking for has either been moved or no longer exists. Please use the navigational links to the right to locate additional resources and information.</p>
                        <br />
                        <h3>建议...</h3>
                        <ul>
                            <li><a href='#'>&raquo; 返回首页</a></li>
                        </ul>
                    </div>
                    <img className={styles.book} src='../../../../img/img-01.png' alt='Book iCon' />
                    <div style={{ clear: 'both' }}></div>
                </div>
                <div className={styles.footer_bottom}></div>
                <div style={{ clear: 'both' }}></div>
            </div>
        )
    }
}
