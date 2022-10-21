import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import './../styles/HeroItemComponent.scss';

export default function HeroItemComponent({id, nickname, origin_description, photo}) {
  const navigate = useNavigate();
  
  const openInfo = (id) => {
    navigate('/' + id);
  }

  const editSuperhero = (id) => {
    navigate('/edit-superhero/' + id);
  }

  const deleteSuperhero = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}superhero/${id}`, {
      method: 'DELETE',
    });
    
    navigate('/');
  }

  return (
    <div className="heroItem">
      <div className="heroItem__image">
        <img src={`${process.env.REACT_APP_IMAGE_URL}${photo}`}></img>
      </div>
      <div className="heroItem__info">
        <div className="heroItem__buttons">
          <Button color="primary" onClick={() => editSuperhero(id)}>
            Edit
          </Button>
          <Button color="danger" onClick={() => deleteSuperhero(id)}>
            Delete
          </Button>
        </div>
        <div className="heroItem__name">
          <a onClick={() => openInfo(id)}>{nickname}</a>
        </div>
        <div className="heroItem__description">
          <p>{origin_description}</p>
        </div>
      </div>
    </div>
  );
}
