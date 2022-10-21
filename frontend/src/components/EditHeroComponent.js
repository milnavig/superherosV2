import { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { fetchSingleSuperhero } from './../redux/ActionCreators';

import './../styles/EditHeroComponent.scss';

export default function EditHeroComponent() {
  let { superheroId } = useParams();

  const [ nickname, setNickname ] = useState('');
  const [ realName, setRealName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ superpowers, setSuperpowers ] = useState('');
  const [ phrase, setPhrase ] = useState('');
  const [ existingImages, setExistingImages ] = useState([]);
  const [ deletedImages, setDeletedImages ] = useState([]);
  const [ images, setImages ] = useState([{ [uuidv4()]: null }]);

  const navigate = useNavigate();

  const superheroFull = useSelector((state) => state.superheroFull);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleSuperhero(superheroId));
  }, []);

  useEffect(() => {
    setNickname(superheroFull.nickname);
    setRealName(superheroFull.real_name);
    setDescription(superheroFull.origin_description);
    setSuperpowers((superheroFull.superpowers || []).map(sp => sp.name).join(', '));
    setPhrase(superheroFull.catch_phrase);
    setExistingImages((superheroFull.photos || []).map(p => p.filename));
  }, [superheroFull]);

  const addFileField = () => {
    setImages([...images, {[uuidv4()]: null}])
  }

  const removeFileField = (id) => {
    setImages(images.filter(img => !(id in img)));
  }

  const removeExistingImage = (imageName) => {
    setExistingImages([...existingImages.filter(existingImage => existingImage !== imageName)]);
    setDeletedImages([imageName, ...deletedImages]);
  }

  const addImage = (file, id) => {
    setImages(images.map(img => {
      if (Object.keys(img)[0] === id) {
        return ({[id]: file});
      }
      return img;
    }));
  }

  const editSuperhero = () => {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('real_name', realName);
    formData.append('origin_description', description);
    formData.append('superpowers', JSON.stringify(superpowers.split(", ")));
    formData.append('catch_phrase', phrase);
    formData.append('removed_images', JSON.stringify(deletedImages));
    images.forEach(img => {
      const key = Object.keys(img)[0];
      formData.append(key, img[key]);
    });

    fetch(`${process.env.REACT_APP_API_URL}superhero/${superheroId}`, {
      method: 'PUT',
      body: formData
    });
    
    navigate('/');
  }

  return (
    <div className="editHero">
      <h1 className="editHero__title">Edit superhero</h1>
      <Form>
        <FormGroup>
          <Label for="nickname">
            Nickname:
          </Label>
          <Input
            id="nickname"
            name="nickname"
            placeholder="Enter superhero nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="real_name">
            Real name:
          </Label>
          <Input
            id="real_name"
            name="real_name"
            placeholder="Enter superhero real name"
            value={realName}
            onChange={e => setRealName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="origin_description">
            Description:
          </Label>
          <Input
            id="origin_description"
            name="origin_description"
            type="textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="catch_phrase">
            Catch phrase:
          </Label>
          <Input
            id="catch_phrase"
            name="catch_phrase"
            value={phrase}
            onChange={e => setPhrase(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="superpowers">
            Superpowers (enter a comma separated list. Example: <i>enhanced senses, speed, martial artist</i>):
          </Label>
          <Input
            id="superpowers"
            name="superpowers"
            placeholder="Enter superpowers"
            value={superpowers}
            onChange={e => setSuperpowers(e.target.value)}
          />
        </FormGroup>
        {
          images.map((file, idx) => {
            const imageId = Object.keys(file)[0];
            const imageName = `image-${idx}`;
            return (
              <FormGroup key={imageName}>
                <Label for={imageName}>
                  Image {idx + 1}
                </Label>
                <Input
                  id={imageName}
                  name={imageName}
                  type="file"
                  onChange={e => addImage(e.target.files[0], imageId)}
                />
                <div className="editHero__button">
                  <Button
                    color="danger"
                    outline
                    size="sm"
                    onClick={() => removeFileField(imageId)}
                  >
                    Remove image
                  </Button>
                </div>
              </FormGroup>
            );
          }
          )
        }
        <div className="editHero__button">
          <Button
            color="primary"
            outline
            size="sm"
            onClick={() => addFileField()}
          >
            Add image
          </Button>
        </div>
        <h2 className="editHero__title">Existing photos:</h2>
        {
          existingImages.map((imageName) => {
            return (
              <FormGroup key={imageName}>
                <img className="editHero__img" src={process.env.REACT_APP_IMAGE_URL + imageName}></img>
                <div className="editHero__button">
                  <Button
                    color="danger"
                    outline
                    size="sm"
                    onClick={() => removeExistingImage(imageName)}
                  >
                    Delete image
                  </Button>
                </div>
              </FormGroup>
            );
          }
          )
        }
        <div className="editHero__button">
          <Button
            onClick={() => editSuperhero()}
          >
            Edit
          </Button>
        </div>
      </Form>
    </div>
  );
}
