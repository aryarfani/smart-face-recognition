import React, { Component } from 'react';

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      signInName: ''
    }
  }

  onNameChange = (event) => {
    this.setState({ signInName: event.target.value })
  }
  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value })
  }
  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value })
  }
  onSubmitRegister = () => {
    console.log('button clicked')
    fetch('https://blooming-earth-04778.herokuapp.com/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.state.signInName,
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => response.json())
      .then(user => {
        console.log(user[0])
        if (user) {
          this.props.loadUser(user)
          this.props.onRouteChange('home')
        }
      })
  }

  render() {
    return (
      <article className="br3 ba shadow-5 b--black-10 mv4 w-100 w-50-m w-25-l mw6 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f4 fw6 ph0 mh0">Sign Up</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input
                  onChange={this.onNameChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white"
                  type="name" name="name" id="name" />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white"
                  type="email" name="email-address" id="email-address" />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  onChange={this.onPasswordChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white"
                  type="password" name="password" id="password" />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={() => this.onSubmitRegister()}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit" value="Sign Up" />
            </div>
          </div>
        </main>
      </article>
    );
  }
};

export default Register;