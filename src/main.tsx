import ReactDOM from 'react-dom/client'
import 'react-perfect-scrollbar/dist/css/styles.css'
import App from './App'
import './app.scss'
import './index.css'
import './tailwind.css'
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <>
     <Provider store={store}>
     <App />
     </Provider>
        
    </>
)
