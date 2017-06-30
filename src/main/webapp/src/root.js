import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'
// let DevTools = require('./containers/devTools')
let child = <div>
    <ReduxRouter/>
    {/*<DevTools />*/}
</div>

export default class Root extends Component {
    static displayName='RootComponent'
    static propTypes = {
        store: PropTypes.object.isRequired
    }

    render() {
        const { store } = this.props
        return (
            <Provider store={store}>
                { child }
            </Provider>
        )
    }
}

