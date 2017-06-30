import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import DevTools from '../containers/devTools'
import createHistory from 'history/lib/createHashHistory'
import getRoutes from '../routes'
import thunk from 'redux-thunk'
import apiRequester from '../middleWare/apiRequester'
import assembleApiRequester from '../middleWare/assembledApiRequester.js'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import rootSage from '../saga/rootSaga'
const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
    applyMiddleware(thunk, sagaMiddleware, apiRequester, assembleApiRequester),
    reduxReactRouter({ getRoutes, createHistory }),
    applyMiddleware(createLogger()),
    DevTools.instrument()
)(createStore)

export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState)
    sagaMiddleware.run(rootSage)
    if (module.hot) {
    // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers')
            store.replaceReducer(nextRootReducer)
        })
    }
    return store
}
