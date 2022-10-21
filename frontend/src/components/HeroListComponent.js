import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from '../redux/ActionCreators';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import './../styles/HeroListComponent.scss';

import HeroItemComponent from './HeroItemComponent';
import PagesComponent from './PagesComponent';

import { fetchSuperheroSet } from '../redux/ActionCreators';

export default function HeroListComponent() {
  const pages = useSelector((state) => state.pages);
  const currentPage = useSelector((state) => state.page);
  const navigate = useNavigate();  
  const dispatch = useDispatch();

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = () => {
    dispatch(fetchSuperheroSet(currentPage, 5));
  }

  const changePage = (idx) => {
    if (idx !== currentPage) {
      dispatch(setPage(idx));
      dispatch(fetchSuperheroSet(idx, 5));
    }
  }

  return (
    <div className="heroList">
      <div className="heroList__button">
        <Button color="primary" onClick={() => navigate('/add-superhero')}>
          Add new superhero
        </Button>
      </div>
      {(pages[currentPage] || []).map(superhero =>
        <div key={superhero.id} className="heroList__item">
          <HeroItemComponent loadPage={loadPage} {...superhero}></HeroItemComponent>
        </div> 
      )}
      <div className="heroList__pagination">
        <PagesComponent changePage={changePage} currentPage={currentPage} superheros={pages[currentPage]}></PagesComponent>
      </div>
    </div>
  );
}
