import React, { useState, useReducer, useEffect, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes('@') }
  } if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: null }
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_PASS') {
    return { value: action.val, isValid: action.val.length > 6 }
  } if (action.type === "USER_PASS_BLUR") {
    return { value: state.value, isValid: state.value.length > 6 }
  }
  return { value: '', isValid: null }
};


const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer,
    { value: '', isValid: null });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer,
    { value: '', isValid: null }
  );

  const authCtx = useContext(AuthContext)

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;


  // useEffect Hook implemented
  useEffect(() => {
    console.log("Checking from validity.")

    const identifier = setTimeout(() => {
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return () => {
      console.log("CLEAN_UP");
      clearTimeout(identifier);
    };

  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({ type: "USER_INPUT", val: event.target.value })

    setFormIsValid(
      event.target.value.includes('@') && passwordState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_PASS', val: event.target.value });
    // setEnteredPassword(event.target.value);

    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({
      type: "INPUT_BLUR"
    })
  };

  const validatePasswordHandler = () => {
    dispatchPassword({
      type: "USER_PASS_BLUR"
    })
    // setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.isValid, passwordState.isValid);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
