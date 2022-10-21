import { useState } from 'react';
import { Form, FormGroup, Label, Input, Button} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import './../styles/CreateHeroComponent.scss';

export default function CreateHeroComponent() {
  const [ nickname, setNickname ] = useState('');
  const [ realName, setRealName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ superpowers, setSuperpowers ] = useState('');
  const [ phrase, setPhrase ] = useState('');
  const [ images, setImages ] = useState([{ [uuidv4()]: null }]);

  const navigate = useNavigate();

  const addFileField = () => {
    setImages([...images, {[uuidv4()]: null}])
  }

  const removeFileField = (id) => {
    setImages(images.filter(img => !(id in img)));
  }

  const addImage = (file, id) => {
    setImages(images.map(img => {
      if (Object.keys(img)[0] === id) {
        return ({[id]: file});
      }
      return img;
    }));
  }

  const addSuperhero = () => {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('real_name', realName);
    formData.append('origin_description', description);
    formData.append('superpowers', JSON.stringify(superpowers.split(", ")));
    formData.append('catch_phrase', phrase);
    images.forEach(img => {
      const key = Object.keys(img)[0];
      formData.append(key, img[key]);
    });

    fetch(`${process.env.REACT_APP_API_URL}superhero`, {
      method: 'POST',
      body: formData
    });
    
    navigate('/');
  }

  return (
    <div className="createHero">
      <h1 className="createHero__title">Add new superhero</h1>
      <Form>
        <FormGroup>
          <Label for="nickname">
            Nickname:
          </Label>
          <Input
            id="nickname"
            name="nickname"
            placeholder="Enter superhero nickname"
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
                <div className="createHero__button">
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
        <div className="createHero__button">
          <Button
            color="primary"
            outline
            size="sm"
            onClick={() => addFileField()}
          >
            Add image
          </Button>
        </div>
        <div className="createHero__button">
          <Button
            onClick={() => addSuperhero()}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
