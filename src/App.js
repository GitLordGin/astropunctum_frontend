import './App.css';
import MyList from './components/MyList';
import DumyData from './DumyData';

function App() {
  return (
    <div>
      <MyList data={DumyData}/>
    </div>
  );
}

export default App;
