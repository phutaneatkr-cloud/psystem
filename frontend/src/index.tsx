import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { default as ModalComponent } from 'react-modal'

import './index.css'

import { store } from './service/store'
import App from './App'

ModalComponent.setAppElement('#root')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
)