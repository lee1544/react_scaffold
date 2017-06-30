import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createHashHistory'
import getRoutes from '../routes'
import thunk from 'redux-thunk'
import apiRequester from '../middleWare/apiRequester'
import assembleApiRequester from '../middleWare/assembledApiRequester.js'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import rootSage from '../saga/rootSaga'
const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
    applyMiddleware(thunk, sagaMiddleware, apiRequester, assembleApiRequester),
    reduxReactRouter({ getRoutes, createHistory })
)(createStore)

export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState)
    sagaMiddleware.run(rootSage)
    return store
}
