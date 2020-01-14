import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';


const app = new Clarifai.App({
  apiKey: '3c55873973f3469a97c382c71aa87167'
});


const particleOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 500
      }
    },
    size: {
      value: 3
    }
  },
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signIn',
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joinDate: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signIn',
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joinDate: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joinDate: data.joinDate
      }
    })
  }
  calculateFaceLocation = (data) => {
    // untuk perhitungan ukuran kotak
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const wadah = [];

    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const clarifaiFaces = data.outputs[0].data.regions;
    clarifaiFaces.forEach(box => {
      wadah.push({
        leftCol: box.region_info.bounding_box.left_col * width,
        topRow: box.region_info.bounding_box.top_row * height,
        rightCol: width - (box.region_info.bounding_box.right_col * width),
        bottomRow: height - (box.region_info.bounding_box.bottom_row * height)
      })
    });

    return wadah;
  }

  onRouteChange = (route) => {
    if (route === 'signIn') {
      this.setState(initialState);
    }
    this.setState({
      route: route
    })
  }

  displayFaceBox = (data) => {
    this.setState({
      boxes: data
    })
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  onPictureSubmit = () => {
    if (this.state.input !== '') {

      this.setState({
        imageUrl: this.state.input
      })

      app.models
        .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(response => {
          if (response) {
            fetch('https://blooming-earth-04778.herokuapp.com/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id,
              })
            })
              .then(response => response.json())
              .then(data => {
                this.setState({ user: data })
              })
              .catch(err => console.log(err))

          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        }).catch(err => console.log(err))

    }
  }

  render() {
    console.log(this.state.route)
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation onRouteChange={this.onRouteChange} />
        {this.state.route === 'home' ?
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition
              boxes={this.state.boxes}
              imageUrl={this.state.imageUrl}
            />
          </div>
          : (
            this.state.route === 'signIn'
              ? <SignIn
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}
              />
              : <Register
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}
              />
          )
        }
      </div>
    );
  }

}

export default App;
