import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { withRouter } from 'react-router-dom';
import { LANGUAGES } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions/appActions';
import { FormattedMessage } from 'react-intl';
import { handleLogin } from '../../services/adminService';
import defaultAvatar from '../../assets/defaultAvatar.jpg';
import './Login.scss';
class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    handleChangeUserName = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    handleChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    showHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleLogin();
        }
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let response = await handleLogin(this.state.username, this.state.password);
            console.log("response: ", response);
            if (response && response.errCode !== 0) {
                this.setState({
                    errMessage: response.message,
                })
            } else if (response && response.errCode === 0) {
                const user = response.user
                this.props.userLoginSuccess(user);
                if (user.roleId === 'R1') this.props.history.push('/system');
                else if (user.roleId === 'R2') this.props.history.push('/doctor');
                else this.props.history.push('/home');
            }
        } catch (e) {
            console.log(e);
            if (e.response) {
                this.setState({
                    errMessage: e.response.data.message,
                })
            }
        }
    }

    render () {
        return (
            <div className="login-wrapper" onKeyDown={ (e) => this.handleKeyPress(e) }>
                <div class="form">
                    <div class="form__box">
                        <div class="form__left">
                            <div class="form__padding">
                                <img class="form__image"
                                    src="https://i.pinimg.com/originals/8b/44/51/8b4451665d6b2139e29f29b51ffb1829.png"
                                    alt={ defaultAvatar }
                                />
                            </div>
                        </div>
                        <div class="form__right">
                            <div class="form__padding-right">
                                <div className="languages">
                                    <span className={ this.props.language === LANGUAGES.VI ? "active" : "" } onClick={ () => this.changeLanguage(LANGUAGES.VI) }>VN</span>
                                    <span className={ this.props.language === LANGUAGES.EN ? "active" : "" } onClick={ () => this.changeLanguage(LANGUAGES.EN) }>EN</span>
                                </div>
                                <h1 class="form__title"><FormattedMessage id="manage-user.login" /></h1>
                                <p className="error-message">{ this.state.errMessage }</p>
                                <input class="form__email"
                                    type="text"
                                    placeholder="Email"
                                    value={ this.state.username }
                                    onChange={ (e) => this.handleChangeUserName(e) }
                                />
                                <div className="password">
                                    <input
                                        class="form__password"
                                        placeholder="******"
                                        type={ this.state.isShowPassword ? 'text' : 'password' }
                                        value={ this.state.password }
                                        onChange={ (e) => this.handleChangePassword(e) }
                                    />
                                    <span className="hidden-btn" onClick={ () => this.showHidePassword() }>
                                        { this.state.isShowPassword ? <i class="fas fa-eye-slash"></i> : <i class="fas fa-eye"></i> }
                                    </span>
                                </div>
                                <button class="form__submit-btn" type="submit" onClick={ () => this.handleLogin() }>
                                    <FormattedMessage id="manage-user.login" />
                                </button>

                                <div class="form__link" onClick={ () => this.props.history.push('/register') }>
                                    <FormattedMessage id="manage-user.have-no-account" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        userLoginSuccess: (user) => dispatch(actions.userLoginSuccess(user))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
