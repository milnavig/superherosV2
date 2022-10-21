import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarText,
} from 'reactstrap';
import HeroListComponent from './HeroListComponent';
import HeroInfoComponent from './HeroInfoComponent';
import CreateHeroComponent from './CreateHeroComponent';
import EditHeroComponent from './EditHeroComponent';

import './../styles/MainComponent.scss';

export default function MainComponent() {
  return (
    <div className="main">
      <Navbar>
        <NavbarBrand href="/">Superheros</NavbarBrand>       
        <NavbarText>Website about superheros</NavbarText>
      </Navbar>
      <Router>
        <Routes>
          <Route path={'/'} element={<HeroListComponent />} exact></Route>
          <Route path={'/:superheroId'} element={<HeroInfoComponent />} exact></Route>
          <Route path={'/add-superhero'} element={<CreateHeroComponent />} exact></Route>
          <Route path={'/edit-superhero/:superheroId'} element={<EditHeroComponent />} exact></Route>
        </Routes>
      </Router>
    </div>
  );
}
