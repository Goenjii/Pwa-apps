import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import styled from "@emotion/styled"
import { compose } from "recompose"
import { format } from "date-fns"
import { withTheme } from "emotion-theming"

import { Input, Button, P } from "../../elements"
import { SIZES } from "../../../styles/constants"
import { StyledLink as Link } from "../../elements"

import { FirebaseContext } from "../../firebase"

const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
`
const LoginLayout = styled.div`
  max-width: ${SIZES.smallWidth};
  width: 100%;
  align-self: center;
  margin-top: 20px;
`

const LoginPage = ({ history, theme }) => (
  <LoginLayout>
    <FirebaseContext.Consumer>
      {firebase => <LoginForm history={history} firebase={firebase} />}
    </FirebaseContext.Consumer>
    <P colors={theme.colors} style={{ fontStyle: "italic" }}>
      Don't have an account? <Link to={"/register"}>Sign Up</Link>
    </P>
  </LoginLayout>
)

class LoginFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = { email: "", password: "", error: null }
  }

  onSubmit = event => {
    event.preventDefault()
    const { email, password } = this.state

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ email: "", password: "", error: null })
        this.props.history.push(format(new Date(), "/"))
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { email, password, error } = this.state
    const { theme } = this.props

    const isInvalid = password === "" || email === ""

    return (
      <form onSubmit={this.onSubmit}>
        <LoginGrid>
          <Input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            colors={theme.colors}
          />
          <Input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            colors={theme.colors}
          />
          <Button colors={theme.colors} disabled={isInvalid} type="submit">
            Login
          </Button>
        </LoginGrid>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const LoginForm = compose(
  withTheme,
  withRouter
)(LoginFormBase)

export default withTheme(LoginPage)

export { LoginForm }