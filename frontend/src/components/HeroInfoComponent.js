import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from 'reactstrap';
import { fetchSingleSuperhero } from './../redux/ActionCreators';

import './../styles/HeroInfoComponent.scss';

export default function HeroInfoComponent() {
  let { superheroId } = useParams();

  const superheroFull = useSelector((state) => state.superheroFull);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleSuperhero(superheroId));
  }, []);

  const deleteSuperhero = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}superhero/${id}`, {
      method: 'DELETE',
    });
    
    navigate('/');
  }

  return (
    <div className="heroInfo">
      <div className="heroInfo__buttons">
        <Button color="primary" onClick={() => navigate('/edit-superhero/' + superheroId)}>
          Edit
        </Button>
        <Button color="danger" onClick={() => deleteSuperhero(superheroId)}>
          Delete
        </Button>
      </div>
      <h1 className="heroInfo__nickname">{superheroFull.nickname}</h1>
      <p className="heroInfo__realname"><b>Real name:</b> {superheroFull.real_name}</p>
      <p className="heroInfo__phrase"><b>Catch phrase:</b> {superheroFull.catch_phrase}</p>
      <p className="heroInfo__description">
        {superheroFull.origin_description}
      </p>
      <div className="heroInfo__superpowers">
        <b>Superpowers: </b>
        {superheroFull.superpowers?.map(sp => sp.name).join(', ')}
      </div>
      <h2><b>Images:</b></h2>
      <div className="heroInfo__images">
        {superheroFull.photos?.map(p => <img className="heroInfo__image" key={p.id} src={process.env.REACT_APP_IMAGE_URL + p.filename}></img>)}
      </div>
    </div>
  );
}
