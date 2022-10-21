import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

import MainComponent from './components/MainComponent';

const store = ConfigureStore();

function App() {
  return (
    <Provider store={store}>
      <MainComponent></MainComponent>
    </Provider>
  );
}

export default App;
